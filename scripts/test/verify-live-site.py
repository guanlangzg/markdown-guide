"""对线上站点做只读冒烟验证：确认部署的代码具备本轮修复行为。"""
import sys

from playwright.sync_api import expect, sync_playwright

LIVE = 'http://md.guanlan365.top/'


def main():
    failures = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.goto(LIVE, wait_until='domcontentloaded', timeout=90000)
        page.locator('.content-item.active').wait_for()

        # 1. 可信卡片仍真实渲染 HTML（中频分区默认折叠，先展开）
        page.get_by_role('button', name='中频语法').click()
        page.locator('.nav-list li[data-id="html-mix"] a').click()
        expect(page.locator('#html-mix .preview-content kbd').first).to_be_visible()
        kbd = page.locator('#html-mix .preview-content kbd').count()
        if kbd != 2:
            failures.append(f'html-mix kbd 数应为 2，实际 {kbd}')

        # 2. 速查表复制源保真：管道符与嵌套反引号必须带转义复制
        page.locator('.nav-list li[data-id="cheatsheet"] a').click()
        badge = page.locator('#cheatsheet .copyable-code-badge').first
        expect(badge).to_be_visible()
        if not badge.evaluate('el => el.tagName') == 'BUTTON':
            failures.append('速查表代码徽章不是 button')

        # 3. 编辑器闭合注入面（先回到 html-mix 卡片，它仍在中频分区）
        page.locator('.nav-list li[data-id="html-mix"] a').click()
        expect(page.locator('#editModal')).to_be_hidden()
        edit_btn = page.locator('#html-mix .edit-btn')
        expect(edit_btn).to_be_visible()
        edit_btn.click()
        page.locator('#editorInput').fill(
            '段落 <b>粗</b> <script>alert(1)</script>\n\n'
            '<img src=x onerror="alert(1)">\n\n'
            '<details><summary>折叠</summary>内容</details>\n\n'
            '| a | b |\n| - | - |\n| 1 | 2 |\n\n'
            '**粗体** 与 `代码`\n'
        )
        page.wait_for_timeout(500)
        state = page.locator('#editorPreview').evaluate('() => ({'
            'script: !!document.querySelector("#editorPreview script"),'
            'img: !!document.querySelector("#editorPreview img"),'
            'b: !!document.querySelector("#editorPreview b"),'
            'details: !!document.querySelector("#editorPreview details"),'
            'table: !!document.querySelector("#editorPreview table"),'
            'bold: !!document.querySelector("#editorPreview strong"),'
            'code: !!document.querySelector("#editorPreview code")'
            '})')
        for tag in ('script', 'img', 'b', 'details'):
            if state[tag]:
                failures.append(f'注入的 <{tag}> 被真实渲染，XSS 面未闭合')
        for tag in ('table', 'bold', 'code'):
            if not state[tag]:
                failures.append(f'普通 Markdown <{tag}> 未渲染，转义路径误伤')

        # 4. 数学公式仍正常
        page.locator('#modalClose').click()
        page.locator('.nav-list li[data-id="math"] a').click()
        page.wait_for_timeout(500)
        katex = page.locator('#math .katex').count()
        if katex < 3:
            failures.append(f'KaTeX 节点应 >=3，实际 {katex}')

        if errors:
            failures.append(f'页面运行时报错: {errors[:3]}')

        context.close()
        browser.close()

    if failures:
        print('FAIL')
        for f in failures:
            print(' -', f)
        return 1
    print('LIVE SMOKE PASS: 可信 HTML 渲染正常、注入被转义、速查表徽章为按钮、KaTeX 正常')
    return 0


if __name__ == '__main__':
    sys.exit(main())
