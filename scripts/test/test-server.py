import http.server
import socketserver
import threading
import urllib.request
import time
import os

PORT = 9876
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, '../../'))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=root_dir, **kwargs)

httpd = socketserver.TCPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=httpd.serve_forever)
t.daemon = True
t.start()

time.sleep(0.3)

try:
    with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/index.html') as resp:
        print('HTTP status index.html:', resp.status)
        content = resp.read().decode('utf-8')
        assert 'Markdown 语法速查手册' in content
        print('✅ index.html 内容正确交付')
    with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/css/style.css') as resp:
        print('HTTP status css/style.css:', resp.status)
        print('✅ css/style.css 内容正确交付')
    with urllib.request.urlopen(f'http://127.0.0.1:{PORT}/js/app.js') as resp:
        print('HTTP status js/app.js:', resp.status)
        print('✅ js/app.js 内容正确交付')
    print('🎉 本地 HTTP 静态服务验证全部成功！')
finally:
    httpd.shutdown()
