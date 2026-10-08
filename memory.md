# 项目经验与规范沉淀 (memory.md)

## 架构与视觉设计约定 (路线一：现代工匠风)

1. **图底关系设计规范**：
   - 源码展示区统一采用 **深板岩暗夜黑 (`#0F172A`)**，模拟 VS Code / Stripe Docs 编辑器质感，文字基色 `#F8FAFC`，配合 Prism 现代暗色高亮；
   - 渲染预览区统一采用 **纯白仿真纸张 (`#FFFFFF`)**，模拟现代技术博文与学术排版，正文行高 `1.75`，字阶严格收敛；
   - 两极色块并列（44:56 分栏）提供极高辨识度，降低认知负担。

2. **边框与阴影系统**：
   - 杜绝使用粗暴的 `2px` 实线边框；全站边框收敛为精致的 `1px solid var(--color-border)` (`#E2E8F0` / `rgba(0,0,0,0.08)`)；
   - 移除拟物化内凹阴影，采用多层柔光轻量阴影（Ambient Shadow）。

3. **图标规范**：
   - 全站杜绝使用系统 Emoji 作为 UI 操作图标，统一采用内联标准 **Lucide 线性矢量 SVG**（24x24 viewBox，stroke-width 2）；
   - 复制按钮点击后提供无侵入的 Checkmark 及文字状态反馈，2秒后自动恢复。

4. **排版与字体**：
   - UI 字体采用 `Inter` + 优化版中文字体回退链；
   - 代码字体通过 CDN 引入 `JetBrains Mono`（400/500/600），确保中西文、等宽代码字符严格对齐。

5. **验证方法与复用脚本**：
   - 静态一致性自动化测试：`node scripts/test/verify-integrity.js`（验证 29 项导航与数据键值一致性、CSS 变量完整性、DOM ID 存在性、Prism 类名冲突检测）；
   - 静态 HTTP 服务自动化测试：`python scripts/test/test-server.py`。

6. **Prism Markdown 与 CSS 类名避坑经验**：
   - Prism.js 渲染 Markdown 时会将加粗、斜体等内联文字包裹在 `<span class="token content">` 中；
   - 严禁将页面主容器类名命名为 `.content`，否则将污染代码高亮中的所有文本内容，产生巨大的块状背景覆盖与排版错位（表现为文字被大白块遮盖或所谓‘乱码’）；
   - 主内容容器统一使用 `.main-content-area`，并在 CSS 中对 `.demo-source .token.content` 做严格重置（`background: transparent !important; display: inline !important;`）。
