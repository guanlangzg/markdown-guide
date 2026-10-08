import http.server
import threading
import unittest
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


ROOT = Path(__file__).resolve().parents[2]


class GuideExperienceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        class Handler(http.server.SimpleHTTPRequestHandler):
            def __init__(self, *args, **kwargs):
                super().__init__(*args, directory=str(ROOT), **kwargs)

            def log_message(self, *args):
                pass

        cls.server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), Handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f'http://127.0.0.1:{cls.server.server_port}/'
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls):
        cls.browser.close()
        cls.playwright.stop()
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join()

    def open_page(self, path='', viewport=None):
        context = self.browser.new_context(
            viewport=viewport or {'width': 1440, 'height': 900},
            permissions=['clipboard-read', 'clipboard-write'],
        )
        self.addCleanup(context.close)
        page = context.new_page()
        page.goto(self.base_url + path, wait_until='domcontentloaded')
        page.locator('.content-item.active').wait_for()
        return page

    def test_mobile_cheatsheet_shows_usable_rows_before_source(self):
        page = self.open_page(viewport={'width': 390, 'height': 844})
        sidebar = page.locator('#sidebar')
        toggle = page.get_by_role('button', name='切换侧边栏导航')
        self.assertTrue(sidebar.evaluate('el => el.inert'))
        toggle.click()
        self.assertFalse(sidebar.evaluate('el => el.inert'))
        page.get_by_role('link', name='标题', exact=True).click()
        self.assertTrue(sidebar.evaluate('el => el.inert'))
        self.assertEqual(page.evaluate('document.activeElement.id'), 'sidebarToggle')

        page = self.open_page(viewport={'width': 390, 'height': 844})
        page.screenshot(path=str(ROOT / 'scripts' / 'test' / 'screenshots' / 'mobile-cheatsheet.png'))
        logo = page.locator('.logo-text')
        self.assertEqual(logo.evaluate('el => getComputedStyle(el).whiteSpace'), 'nowrap')
        logo_box = logo.bounding_box()
        search_box = page.locator('#searchBoxTrigger').bounding_box()
        header_box = page.locator('.header').bounding_box()
        self.assertLessEqual(logo_box['x'] + logo_box['width'], search_box['x'])
        self.assertLessEqual(search_box['x'] + search_box['width'], header_box['x'] + header_box['width'])
        table = page.locator('#cheatsheet .cheatsheet-table')
        self.assertLess(table.bounding_box()['y'], 844)
        first_row = table.locator('tbody tr').first
        self.assertTrue(first_row.get_by_role('button', name='复制', exact=True).is_visible())
        self.assertFalse(page.locator('#cheatsheet .cheatsheet-source').evaluate('el => el.open'))
        self.assertLessEqual(page.evaluate('document.documentElement.scrollWidth'), 390)
        self.assertEqual(first_row.evaluate('el => getComputedStyle(el).display'), 'grid')
        self.assertEqual(first_row.locator('td:nth-child(2)').locator('.mobile-cell-label').inner_text(), '写法')
        self.assertEqual(first_row.locator('td:nth-child(3)').locator('.mobile-cell-label').inner_text(), '效果')
        summary = page.locator('.cheatsheet-source > summary')
        self.assertTrue(summary.is_visible())
        summary.click()
        self.assertTrue(page.locator('.cheatsheet-source').evaluate('el => el.open'))

    def test_cheatsheet_labels_only_show_on_mobile(self):
        page = self.open_page()
        table = page.locator('#cheatsheet .cheatsheet-table')
        self.assertEqual(table.locator('thead th').nth(1).inner_text(), 'Markdown 源码写法')
        self.assertFalse(table.locator('.mobile-cell-label').first.is_visible())

        page.set_viewport_size({'width': 390, 'height': 844})
        labels = table.locator('.mobile-cell-label')
        self.assertTrue(labels.first.is_visible())
        self.assertEqual(labels.nth(0).inner_text(), '写法')
        self.assertEqual(labels.nth(1).inner_text(), '效果')

    def test_deep_link_and_browser_history_restore_selection(self):
        page = self.open_page('#math')
        self.assertEqual(page.locator('.content-item.active').get_attribute('id'), 'math')
        self.assertEqual(page.locator('.nav-list li.active').get_attribute('data-id'), 'math')
        page.get_by_role('link', name='标题', exact=True).click()
        self.assertEqual(page.url.split('#')[-1], 'heading')
        self.assertEqual(page.locator('.content-item.active').get_attribute('id'), 'heading')
        page.go_back()
        self.assertEqual(page.locator('.content-item.active').get_attribute('id'), 'math')

    def test_keyboard_navigation_and_copyable_badges(self):
        page = self.open_page()
        page.get_by_role('link', name='标题', exact=True).focus()
        page.keyboard.press('Enter')
        self.assertEqual(
            page.locator('.content-item.active').get_attribute('id'),
            'heading',
            f"url={page.url}, focused={page.evaluate('document.activeElement.outerHTML')}",
        )
        page.get_by_role('button', name='中频语法').focus()
        page.keyboard.press('Space')
        self.assertEqual(page.get_by_role('button', name='中频语法').get_attribute('aria-expanded'), 'true')
        page.get_by_role('link', name='高频速查表', exact=True).click()
        badge = page.locator('#cheatsheet .copyable-code-badge').first
        self.assertEqual(badge.evaluate('el => el.tagName'), 'BUTTON')
        badge.focus()
        page.keyboard.press('Enter')
        expect(badge).to_contain_text('已复制', timeout=5000)

    def test_dialogs_trap_and_restore_focus(self):
        page = self.open_page()
        search_trigger = page.locator('#searchBoxTrigger')
        search_trigger.focus()
        page.keyboard.press('Enter')
        search = page.get_by_role('dialog', name='搜索语法')
        self.assertTrue(search.is_visible())
        self.assertEqual(page.evaluate('document.activeElement.id'), 'modalSearchInput')
        page.keyboard.press('Shift+Tab')
        self.assertEqual(page.evaluate('document.activeElement.id'), 'searchModalClose')
        page.keyboard.press('Escape')
        self.assertEqual(page.evaluate('document.activeElement.id'), 'searchBoxTrigger')

        edit = page.locator('#cheatsheet .edit-btn')
        edit.click()
        self.assertTrue(page.get_by_role('dialog', name='实时演练编辑器').is_visible())
        self.assertEqual(page.evaluate('document.activeElement.id'), 'editorInput')
        page.keyboard.press('Escape')
        self.assertEqual(page.evaluate('document.activeElement.className'), 'action-btn edit-btn')

    def test_short_source_does_not_stretch_to_preview_height(self):
        page = self.open_page('#heading')
        source = page.locator('#heading .demo-source').bounding_box()
        preview = page.locator('#heading .demo-preview').bounding_box()
        self.assertLess(source['height'] + 70, preview['height'])


if __name__ == '__main__':
    unittest.main()
