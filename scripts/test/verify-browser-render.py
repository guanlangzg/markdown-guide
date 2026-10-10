import os
import sys
import time
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright

PORT = 9988
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, '../../'))
screenshots_dir = os.path.join(script_dir, 'screenshots')
os.makedirs(screenshots_dir, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root_dir, **kwargs)

def run_tests():
    httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
    server_thread = threading.Thread(target=httpd.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    time.sleep(0.5)

    print("--- 启动 Playwright 端到端无头浏览器测试 ---")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        
        page.on("console", lambda msg: print(f"[Browser Console] {msg.type}: {msg.text}"))
        page.on("pageerror", lambda err: print(f"[Browser Error] {err}"))

        # 1. 访问首页
        page.goto(f"http://127.0.0.1:{PORT}/index.html")
        page.wait_for_load_state("networkidle")
        print("✅ 页面加载成功")

        # 2. 测试数学公式卡片
        print("\n[测试 1] 切换到数学公式卡片...")
        math_nav = page.locator('.nav-list li[data-id="math"]')
        math_nav.click()
        page.wait_for_timeout(300)

        math_info = page.evaluate("""() => {
            const el = document.querySelector('#math .preview-content');
            return {
                hasKatex: typeof window.katex !== 'undefined',
                hasRenderMath: typeof window.renderMathInElement !== 'undefined',
                previewHtml: el ? el.innerHTML : 'NULL'
            };
        }""")
        print(f"ℹ️ 诊断信息: hasKatex={math_info['hasKatex']}, hasRenderMath={math_info['hasRenderMath']}")
        print(f"ℹ️ previewHtml 前300字:\n{math_info['previewHtml'][:300]}")

        # 验证预览区内的 KaTeX 元素
        math_item = page.locator('#math')
        katex_elements = math_item.locator('.katex')
        katex_count = katex_elements.count()
        print(f"ℹ️ 检测到 KaTeX 渲染节点数量: {katex_count}")
        assert katex_count >= 3, f"KaTeX 节点数量不足，预期至少 3 个，实际 {katex_count}"

        # 检查独立公式块容器
        display_containers = math_item.locator('.katex-display-container')
        assert display_containers.count() >= 1, "未找到独立公式块专属美化容器"
        print("✅ 独立公式块成功渲染至 .katex-display-container 容器！")

        # 截图保存数学公式卡片
        math_screenshot = os.path.join(screenshots_dir, 'math_render.png')
        math_item.screenshot(path=math_screenshot)
        print(f"📸 数学公式渲染截图已保存至: {math_screenshot}")

        # 3. 测试图片卡片
        print("\n[测试 2] 切换到图片卡片...")
        image_nav = page.locator('.nav-list li[data-id="image"]')
        image_nav.click()
        page.wait_for_timeout(300)

        image_item = page.locator('#image')
        preview_imgs = image_item.locator('.demo-preview img')
        img_count = preview_imgs.count()
        print(f"ℹ️ 预览区图片数量: {img_count}")
        assert img_count == 2, f"图片数量预期为 2，实际为 {img_count}"

        # 验证两张图片均正常加载且无图裂 (naturalWidth > 0)
        for i in range(img_count):
            img = preview_imgs.nth(i)
            src = img.get_attribute('src')
            natural_width = img.evaluate("el => el.naturalWidth")
            print(f"  - 图片 {i+1} src: {src}, naturalWidth: {natural_width}")
            assert natural_width > 0, f"图片 {src} 加载失败，naturalWidth 为 0！"
        print("✅ 预览区内全部两张示例图片均成功加载且无任何图裂！")

        # 截图保存图片卡片
        image_screenshot = os.path.join(screenshots_dir, 'image_render.png')
        image_item.screenshot(path=image_screenshot)
        print(f"📸 图片语法卡片渲染截图已保存至: {image_screenshot}")

        # 4. 测试实时演练与图片优雅降级 (Fallback)
        print("\n[测试 3] 测试实时演练弹窗与图片破损优雅降级...")
        edit_btn = image_item.locator('.edit-btn')
        edit_btn.click()
        page.wait_for_timeout(300)

        editor_input = page.locator('#editorInput')
        # 输入故意失效的图片 URL 和数学公式混合测试
        test_content = f"""# 演练测试

![不存在的算法图](http://127.0.0.1:{PORT}/images/not-exist-broken.png)

公式测试：
$$
P_{{ij}}^k = \\frac{{[\\tau_{{ij}}]^\\alpha}}{{\\sum [\\tau_{{il}}]^\\beta}}
$$
"""
        editor_input.fill(test_content)
        # 等待本地 404 返回并触发图片优雅降级卡片
        editor_preview = page.locator('#editorPreview')
        page.wait_for_selector('#editorPreview .image-fallback-placeholder', timeout=5000)

        fallback_cards = editor_preview.locator('.image-fallback-placeholder')
        assert fallback_cards.count() == 1, "未生成图片优雅降级卡片！"
        alt_text = fallback_cards.locator('.fallback-alt').inner_text()
        print(f"✅ 图片错误捕获成功，生成优雅降级卡片，alt: '{alt_text}'")

        # 验证演练器中的公式渲染
        editor_katex = editor_preview.locator('.katex')
        assert editor_katex.count() >= 1, "实时演练器中公式未渲染"
        print("✅ 实时演练器中带有下划线的独立公式成功渲染！")

        modal_screenshot = os.path.join(screenshots_dir, 'editor_modal_render.png')
        page.locator('#editModal .modal-content').screenshot(path=modal_screenshot)
        print(f"📸 编辑器演练弹窗截图已保存至: {modal_screenshot}")

        # 关闭弹窗
        page.locator('#modalClose').click()
        page.wait_for_timeout(200)

        browser.close()
        print("\n🎉 端到端视觉与逻辑自动化验证全部 100% 通过！")

    httpd.shutdown()

if __name__ == '__main__':
    run_tests()
