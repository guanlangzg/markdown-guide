import os
import sys
import time
import http.server
import socketserver
import threading
from playwright.sync_api import sync_playwright

PORT = 9995
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, '../../'))
screenshots_dir = os.path.join(script_dir, 'screenshots')
os.makedirs(screenshots_dir, exist_ok=True)

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root_dir, **kwargs)

httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
server_thread = threading.Thread(target=httpd.serve_forever, daemon=True)
server_thread.start()
time.sleep(0.5)

print("--- 开始端到端功能验证 ---")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1440, "height": 900}, permissions=['clipboard-read', 'clipboard-write'])
    page = context.new_page()
    
    page.on("console", lambda msg: print(f"[Browser Console] {msg.type}: {msg.text}"))
    page.on("pageerror", lambda err: print(f"[Browser Error] {err}"))

    # 1. 打开首页
    page.goto(f"http://127.0.0.1:{PORT}/index.html")
    page.wait_for_load_state("networkidle")
    print("✅ 页面成功加载")

    # 验证点 1.1：高频速查表是否为列表最第一项
    first_nav_item = page.locator('#frequent-list li').first
    first_nav_id = first_nav_item.get_attribute('data-id')
    first_nav_text = first_nav_item.inner_text().strip()
    print(f"ℹ️ 左侧高频语法第一项: data-id={first_nav_id}, text={first_nav_text}")
    assert first_nav_id == 'cheatsheet', f"预期第一项为 cheatsheet，实际为 {first_nav_id}"
    assert 'active' in first_nav_item.get_attribute('class'), "cheatsheet 导航项未处于 active 激活状态"
    print("✅ 验证通过：高频速查表成功置顶于列表第一位且默认高亮！")

    # 验证点 1.2：默认展示的主卡片是否为 cheatsheet
    active_card = page.locator('.content-item.active')
    active_card_id = active_card.get_attribute('id')
    print(f"ℹ️ 默认展示的主卡片 ID: {active_card_id}")
    assert active_card_id == 'cheatsheet', f"预期默认展示 cheatsheet，实际为 {active_card_id}"
    print("✅ 验证通过：默认首屏卡片为高频速查表！")

    # 验证点 1.3：速查表每行是否包含快捷复制按钮并测试点击复制
    copy_btns = active_card.locator('.table-copy-btn')
    btn_count = copy_btns.count()
    print(f"ℹ️ 速查表中快捷复制按钮总数: {btn_count}")
    assert btn_count == 15, f"预期 15 个语法功能各有一个复制按钮，实际发现 {btn_count} 个"

    # 点击第一个复制按钮（标题）
    first_copy_btn = copy_btns.first
    first_copy_btn.click()
    page.wait_for_timeout(200)
    btn_text_after_click = first_copy_btn.inner_text()
    print(f"ℹ️ 点击后按钮文本状态: {btn_text_after_click}")
    assert "已复制" in btn_text_after_click, "复制后按钮文字未变成已复制状态"
    
    # 验证剪贴板内容
    clipboard_text = page.evaluate("() => navigator.clipboard.readText()")
    print(f"📋 剪贴板内容:\n{clipboard_text}")
    assert "# 一级标题" in clipboard_text, "剪贴板未包含标准标题语法"
    print("✅ 验证通过：标题行点击一键复制成功写入剪贴板！")

    # 截图保存速查表页面
    cheatsheet_screenshot = os.path.join(screenshots_dir, 'cheatsheet_verified.png')
    active_card.screenshot(path=cheatsheet_screenshot)
    print(f"📸 高频速查表截图已保存至: {cheatsheet_screenshot}")

    # 验证点 2：流程图协调性与尺寸优化验证
    print("\n--- 切换到 Mermaid 流程图验证 ---")
    page.locator('.nav-section-header[data-section="medium"]').click()
    page.wait_for_timeout(300)
    mermaid_nav = page.locator('.nav-list li[data-id="mermaid-flow"]')
    mermaid_nav.click()
    page.wait_for_timeout(800)

    flow_info = page.evaluate("""() => {
        const svg = document.querySelector('#mermaid-flow .mermaid svg');
        if (!svg) return null;
        const rect = svg.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            viewBox: svg.getAttribute('viewBox')
        };
    }""")
    print(f"ℹ️ 优化后 Mermaid 流程图尺寸: {flow_info}")
    assert flow_info is not None, "未找到 Mermaid SVG"
    assert flow_info['width'] <= 350, f"流程图宽度过大 ({flow_info['width']}px)，应 <= 350px"
    assert flow_info['height'] < 1000, f"流程图高度过大 ({flow_info['height']}px)，应 < 1000px"
    print("✅ 验证通过：流程图尺寸比例已完全恢复自然协调状态，不再撑满爆屏！")

    # 截图保存流程图
    flow_screenshot = os.path.join(screenshots_dir, 'mermaid_flow_verified.png')
    page.locator('#mermaid-flow').screenshot(path=flow_screenshot)
    print(f"📸 优化后流程图截图已保存至: {flow_screenshot}")

    browser.close()
    print("\n🎉 端到端全部验证顺利通过！")
