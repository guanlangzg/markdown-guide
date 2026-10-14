const fs = require('fs');
const path = require('path');
const { CPP_TEMPLATES } = require('../templates/templates-data.js');

const TEMPLATE_SLUGS = [
    { id: 'leetcode-roadmap', filename: 'template-leetcode-roadmap.html' },
    { id: 'modern-feature', filename: 'template-cpp-feature.html' },
    { id: 'algorithm-mastery', filename: 'template-cpp-algorithm.html' },
    { id: 'memory-systems', filename: 'template-cpp-memory.html' },
    { id: 'engineering-arch', filename: 'template-cpp-architecture.html' }
];

function buildHtml(tmpl, prevTmpl, nextTmpl) {
    const rawMarkdownEscaped = JSON.stringify(tmpl.markdown);
    
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tmpl.title} | C++ 编程学习标准模板</title>
    
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css">

    <style>
        :root {
            --bg-page: #F8FAFC;
            --color-text: #0F172A;
            --color-muted: #64748B;
            --color-border: #E2E8F0;
            --color-primary: ${tmpl.color};
            --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            --font-mono: 'JetBrains Mono', monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: var(--font-sans);
            background-color: var(--bg-page);
            color: var(--color-text);
            line-height: 1.75;
            padding: 30px 20px;
        }

        .container {
            max-width: 960px;
            margin: 0 auto;
            background: #FFFFFF;
            border: 1px solid var(--color-border);
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
            overflow: hidden;
        }

        /* 顶部导航控制条 */
        .page-bar {
            background: #FFFFFF;
            border-bottom: 1px solid var(--color-border);
            padding: 16px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }

        .badge {
            background: ${tmpl.color}18;
            color: ${tmpl.color};
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .bar-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 14px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.15s ease;
            border: 1px solid var(--color-border);
            background: #FFFFFF;
            color: var(--color-text);
        }

        .btn:hover { background: #F1F5F9; }
        .btn-primary { background: ${tmpl.color}; color: #FFFFFF; border-color: ${tmpl.color}; }
        .btn-primary:hover { opacity: 0.9; }

        /* 模板信息卡 */
        .info-card {
            background: #F8FAFC;
            border-bottom: 1px solid var(--color-border);
            padding: 20px 28px;
        }

        .info-title {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 6px;
            color: #1E293B;
        }

        .info-list {
            list-style: none;
            font-size: 13px;
            color: var(--color-muted);
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        /* 内容正文 */
        .article-body {
            padding: 36px 40px;
        }

        h1 { font-size: 24px; font-weight: 700; border-bottom: 1px solid var(--color-border); padding-bottom: 14px; margin-bottom: 20px; }
        h2 { font-size: 18px; font-weight: 600; margin-top: 32px; margin-bottom: 14px; color: #1E293B; }
        h3 { font-size: 15px; font-weight: 600; margin-top: 20px; margin-bottom: 10px; color: #334155; }
        p { margin-bottom: 14px; }
        
        table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: 13.5px; }
        th, td { border: 1px solid var(--color-border); padding: 10px 14px; text-align: left; }
        th { background: #F8FAFC; font-weight: 600; color: #334155; }

        pre {
            background: #0F172A !important;
            border-radius: 8px;
            padding: 16px 20px;
            margin: 16px 0;
            overflow-x: auto;
            border: 1px solid #1E293B;
        }

        code { font-family: var(--font-mono); font-size: 13px; }
        p code, li code, td code {
            background: #F1F5F9;
            color: #BE185D;
            padding: 2px 5px;
            border-radius: 4px;
            border: 1px solid #E2E8F0;
        }

        blockquote {
            border-left: 3px solid ${tmpl.color};
            background: ${tmpl.color}10;
            padding: 12px 18px;
            border-radius: 0 6px 6px 0;
            margin: 16px 0;
            color: #1E293B;
        }

        ul, ol { padding-left: 22px; margin-bottom: 16px; }
        li { margin-bottom: 6px; }
        hr { border: none; border-top: 1px solid var(--color-border); margin: 28px 0; }

        /* 底部导航翻页 */
        .footer-nav {
            background: #F8FAFC;
            border-top: 1px solid var(--color-border);
            padding: 18px 28px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    </style>
</head>
<body>

    <div class="container">
        <header class="page-bar">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="badge">${tmpl.badge}</span>
                <strong style="font-size: 15px;">${tmpl.title}</strong>
            </div>
            <div class="bar-actions">
                <a href="./cpp-templates-showcase.html" class="btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>对比所有 4 个模板</span>
                </a>
                <button class="btn btn-primary" id="copyBtn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span>复制该模板 Markdown</span>
                </button>
            </div>
        </header>

        <section class="info-card">
            <div class="info-title">🎯 模板设计意图与适用场景</div>
            <ul class="info-list">
                <li><strong>适用场景：</strong>${tmpl.bestFor}</li>
                <li><strong>目标受众：</strong>${tmpl.targetAudience}</li>
                <li><strong>特色模块：</strong>${tmpl.highlights.join('；')}</li>
            </ul>
        </section>

        <main class="article-body" id="articleBody">
            <!-- 动态渲染内容 -->
        </main>

        <footer class="footer-nav">
            <div>
                ${prevTmpl ? `<a href="./${prevTmpl.filename}" class="btn">← 上一个：${prevTmpl.title.split('：')[0]}</a>` : ''}
            </div>
            <div>
                ${nextTmpl ? `<a href="./${nextTmpl.filename}" class="btn">下一个：${nextTmpl.title.split('：')[0]} →</a>` : ''}
            </div>
        </footer>
    </div>

    <!-- 依赖脚本 -->
    <script src="https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-markdown.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-c.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-cpp.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-bash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/prism-cmake.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>

    <script>
        const rawMarkdown = ${rawMarkdownEscaped};

        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                primaryColor: '#F1F5F9',
                primaryTextColor: '#0F172A',
                primaryBorderColor: '#64748B',
                lineColor: '#64748B',
                fontFamily: 'Inter, JetBrains Mono, sans-serif'
            }
        });

        function renderContent() {
            // 公式保护
            const mathBlocks = [];
            let safeMd = rawMarkdown.replace(/\\$\\$([\\s\\S]+?)\\$\\$/g, (m, formula) => {
                const idx = mathBlocks.length;
                mathBlocks.push({ type: 'block', formula });
                return '%%KATEXBLOCK' + idx + '%%';
            });
            safeMd = safeMd.replace(/\\$([^\\$\\n]+?)\\$/g, (m, formula) => {
                const idx = mathBlocks.length;
                mathBlocks.push({ type: 'inline', formula });
                return '%%KATEXINLINE' + idx + '%%';
            });

            let html = marked.parse(safeMd);

            mathBlocks.forEach((item, idx) => {
                const rendered = katex.renderToString(item.formula, {
                    displayMode: item.type === 'block',
                    throwOnError: false
                });
                const placeholder = item.type === 'block' ? '%%KATEXBLOCK' + idx + '%%' : '%%KATEXINLINE' + idx + '%%';
                html = html.split(placeholder).join(rendered);
            });

            const bodyEl = document.getElementById('articleBody');
            bodyEl.innerHTML = html;

            // Prism 代码高亮
            bodyEl.querySelectorAll('pre code').forEach(block => {
                const lang = block.className.replace('language-', '') || 'cpp';
                if (Prism.languages[lang]) {
                    block.innerHTML = Prism.highlight(block.textContent, Prism.languages[lang], lang);
                }
            });

            // Mermaid 流程图
            const mermaidBlocks = bodyEl.querySelectorAll('pre code.language-mermaid');
            mermaidBlocks.forEach(codeEl => {
                const pre = codeEl.parentElement;
                const container = document.createElement('div');
                container.className = 'mermaid';
                container.textContent = codeEl.textContent;
                pre.parentNode.replaceChild(container, pre);
            });
            mermaid.run({ nodes: bodyEl.querySelectorAll('.mermaid') });
        }

        document.getElementById('copyBtn').addEventListener('click', async () => {
            const btn = document.getElementById('copyBtn');
            try {
                await navigator.clipboard.writeText(rawMarkdown);
                const oldText = btn.innerHTML;
                btn.style.background = '#10B981';
                btn.style.borderColor = '#10B981';
                btn.innerHTML = '已成功复制 Markdown！';
                setTimeout(() => {
                    btn.style.background = '';
                    btn.style.borderColor = '';
                    btn.innerHTML = oldText;
                }, 2000);
            } catch (e) {
                alert('复制失败，请手动选取');
            }
        });

        renderContent();
    </script>
</body>
</html>`;
}

// 遍历生成
TEMPLATE_SLUGS.forEach((item, idx) => {
    const tmpl = CPP_TEMPLATES[idx];
    const prevTmpl = idx > 0 ? { ...CPP_TEMPLATES[idx - 1], filename: TEMPLATE_SLUGS[idx - 1].filename } : null;
    const nextTmpl = idx < TEMPLATE_SLUGS.length - 1 ? { ...CPP_TEMPLATES[idx + 1], filename: TEMPLATE_SLUGS[idx + 1].filename } : null;
    
    const html = buildHtml(tmpl, prevTmpl, nextTmpl);
    const outputPath = path.join(__dirname, '..', 'templates', item.filename);
    fs.writeFileSync(outputPath, html, 'utf-8');
    console.log(`Generated: ${item.filename}`);
});
