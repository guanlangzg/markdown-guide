// ==================== 全局状态 ====================
const state = {
    currentSection: 'cheatsheet',
    searchIndex: {},
    modalReturnFocus: null,
};

// 高频速查表各语法功能一键复制的开箱即用标准模板
const CHEATSHEET_SNIPPETS = {
    '标题': '# 一级标题\n## 二级标题\n### 三级标题',
    '粗体': '**加粗文本**',
    '斜体': '*斜体文本*',
    '删除线': '~~删除文字~~',
    '行内代码': '`行内代码`',
    '无序列表': '- 列表项目 1\n- 列表项目 2',
    '有序列表': '1. 第一项\n2. 第二项',
    '任务清单': '- [ ] 待办事项\n- [x] 已完成事项',
    '引用块': '> 引用段落内容',
    '分割线': '---',
    '超级链接': '[链接说明文本](https://example.com)',
    '插入图片': '![图片替代文本](https://example.com/image.png)',
    '数据表格': '| 表头 1 | 表头 2 |\n| :--- | :--- |\n| 内容 1 | 内容 2 |',
    '行内公式': '$E = mc^2$',
    '代码块': '```cpp\n#include <iostream>\n\nint main() {\n    return 0;\n}\n```'
};

// ==================== 增强内容数据 (增加分类、场景标签与语法精要) ====================
const contentData = {
    // 🔥 高频语法 (16项 - 速查表置顶 + 15项基础语法)
    'cheatsheet': {
        title: '高频速查表',
        category: '🔥 高频语法',
        scenario: '极速记忆 · 终极浓缩',
        syntax: '15大核心语法一览',
        markdown: `| 语法功能 | Markdown 源码写法 | 渲染示例 |
| :--- | :--- | :--- |
| **标题** | \`# H1\` / \`## H2\` / \`### H3\` | 1-6 级标题 |
| **粗体** | \`**加粗文本**\` | **加粗文本** |
| **斜体** | \`*斜体文本*\` | *斜体文本* |
| **删除线** | \`~~删除文字~~\` | ~~删除文字~~ |
| **行内代码** | \`\` \`code\` \`\` | \`code\` |
| **无序列表** | \`- 列表项目\` | • 列表项目 |
| **有序列表** | \`1. 列表项目\` | 1. 列表项目 |
| **任务清单** | \`- [ ] 待办\` / \`- [x] 完成\` | ☑ 任务项 |
| **引用块** | \`> 引用段落\` | 边框引用 |
| **分割线** | \`---\` | 横向细线 |
| **超级链接** | \`[文本](https://...)\` | 可点击链接 |
| **插入图片** | \`![说明](路径)\` | 嵌入式图像 |
| **数据表格** | \`\\| 表头1 \\| 表头2 \\|\` | 栅格数据表 |
| **行内公式** | \`$E = mc^2$\` | 数学符号 |
| **代码块** | \`\`\`cpp ... \`\`\` | 多语言高亮代码 |`,
        tips: `<strong>💡 记忆建议：</strong>
<ul>
    <li>本表中整理的 15 个语法规则覆盖日常 90% 以上的技术记录需求</li>
    <li>支持直接点击表格每行右侧的「复制」按钮获取对应标准语法模板</li>
    <li>其余 Mermaid、折叠、混用等中频语法按需在左侧导航速查即可</li>
</ul>`
    },
    'heading': {
        title: '标题',
        category: '🔥 高频语法',
        scenario: '博客必备 · 结构划分',
        syntax: '# H1 · ## H2 · ### H3',
        markdown: `# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题`,
        tips: `<strong>💡 笔记排版建议：</strong>
<ul>
    <li>一篇技术博文或笔记通常只使用一个 <code>#</code> 作为顶级主标题</li>
    <li>主要章节使用 <code>##</code>，知识点与定理使用 <code>###</code></li>
    <li>严格避免跨级跳跃（如从 <code>##</code> 直接跳到 <code>#####</code>）</li>
</ul>`
    },
    'text-format': {
        title: '粗体/斜体/删除线',
        category: '🔥 高频语法',
        scenario: '文本强调 · 结论标记',
        syntax: '**粗体** · *斜体* · ~~删除线~~',
        markdown: `**粗体**
*斜体*
***粗斜体***
~~删除线~~`,
        tips: `<strong>💡 场景建议：</strong>
<ul>
    <li><strong>粗体</strong>：核心概念、算法定理、最终结论</li>
    <li><em>斜体</em>：专有名词英文首次出现、论文引文原词</li>
    <li><strong><em>粗斜体</em></strong>：极重要警示、关键边界条件</li>
    <li><del>删除线</del>：已废弃参数、错误尝试路径记录</li>
</ul>`
    },
    'inline-code': {
        title: '行内代码',
        category: '🔥 高频语法',
        scenario: '技术笔记 · 变量与API',
        syntax: '`printf()` · `alpha`',
        markdown: '使用 `printf()` 函数输出。\n\n变量 `alpha` 控制信息素重要程度。\n\n打开工程配置文件 `main.cpp`。',
        tips: `<strong>💡 适用对象：</strong>
<ul>
    <li>函数名、变量名、类名及命名空间</li>
    <li>文件名、文件相对路径与绝对路径</li>
    <li>Linux 终端命令与执行参数</li>
    <li>简短代码片段与状态量</li>
</ul>`
    },
    'code-block': {
        title: '代码块',
        category: '🔥 高频语法',
        scenario: '算法复现 · 多语言高亮',
        syntax: '```cpp · ```python',
        markdown: `\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello World";
    return 0;
}
\`\`\`

\`\`\`python
def hello():
    print("Hello World")
\`\`\``,
        tips: `<strong>💡 最佳实践：</strong>
<ul>
    <li>开头三个反引号后务必指定语言名称（如 cpp, python, bash, json）</li>
    <li>编辑器将自动提供对应的语法高亮与缩进</li>
    <li>常用标识：cpp, python, bash, json, yaml, sql, rust, go</li>
</ul>`
    },
    'unordered-list': {
        title: '无序列表',
        category: '🔥 高频语法',
        scenario: '知识点并列 · 资料罗列',
        syntax: '- C++ · - Python',
        markdown: `- C++
- Python
- OpenCV
- ROS2`,
        tips: `<strong>💡 排版细节：</strong>
<ul>
    <li>推荐全篇统一使用减号 <code>-</code>，视觉统一且不易与乘号混淆</li>
    <li>紧凑型列表项之间无需空行</li>
    <li><code>-</code> 与文字之间务必保留一个标准半角空格</li>
</ul>`
    },
    'ordered-list': {
        title: '有序列表',
        category: '🔥 高频语法',
        scenario: '算法流程 · 实验步骤',
        syntax: '1. 步骤一 · 2. 步骤二',
        markdown: `1. 初始化信息素矩阵
2. 蚂蚁群体构造可行解路径
3. 计算各路径适应度与长度
4. 更新全局与局部信息素
5. 满足收敛条件则输出最优解`,
        tips: `<strong>💡 技巧提示：</strong>
<ul>
    <li>Markdown 会自动重新排序编号，全部写 <code>1.</code> 渲染时依然正确</li>
    <li>极度适合算法迭代流程、推导步骤、实验复现指南</li>
</ul>`
    },
    'nested-list': {
        title: '多级列表',
        category: '🔥 高频语法',
        scenario: '知识树展开 · 结构化思维',
        syntax: '  - 二级子项 (缩进2格)',
        markdown: `- 路径规划算法
  - 图搜索算法
    - BFS (广度优先)
    - DFS (深度优先)
    - Dijkstra
    - A* 启发式算法
  - 启发式智能优化
    - ACO (蚁群算法)
    - GA (遗传算法)
    - PSO (粒子群优化)`,
        tips: `<strong>💡 缩进规范：</strong>
<ul>
    <li>子级列表推荐严格缩进 2 个半角空格（或 4 个空格，统一即可）</li>
    <li>非常适合构建知识图谱与分类大纲</li>
    <li>可灵活混用有序与无序列表</li>
</ul>`
    },
    'task-list': {
        title: '任务列表',
        category: '🔥 高频语法',
        scenario: '计划跟踪 · 实验进度',
        syntax: '- [x] 已完成 · - [ ] 待办',
        markdown: `## 本周科研进度跟踪

- [x] 阅读 ACO 基础论文 (Dorigo 1992)
- [ ] 完成算法 C++ 核心代码复现
- [ ] 在 TSPLIB 标准数据集上跑对比实验
- [ ] 撰写消融实验数据分析报告`,
        tips: `<strong>💡 适用场景：</strong>
<ul>
    <li>科研周报、论文精读待办事项</li>
    <li>Bug 修复清单与模块测试追踪</li>
    <li>方括号内为小写 <code>x</code> 表示已完成</li>
</ul>`
    },
    'quote': {
        title: '引用',
        category: '🔥 高频语法',
        scenario: '论文原文 · 核心论点',
        syntax: '> 引用内容',
        markdown: `> **核心洞察：**
> 蚁群算法的本质并不是“模拟蚂蚁”，而是正反馈机制 + 启发式导向 + 信息素自适应挥发。

> **Paper 原文：**
> The algorithm tends to suffer from premature convergence when search diversity degrades.

我的思考：此处对应的是解空间探索能力（Exploration）过早退化。`,
        tips: `<strong>💡 使用场景：</strong>
<ul>
    <li>论文原作者核心观点引证与翻译</li>
    <li>学术定理、概念精确定义</li>
    <li>技术博客中的延伸思考与注解</li>
</ul>`
    },
    'link': {
        title: '链接',
        category: '🔥 高频语法',
        scenario: '资料引用 · 开源地址',
        syntax: '[显示文本](URL)',
        markdown: `[GitHub 仓库](https://github.com)

[项目论文主页](https://example.com)

推荐查阅 [学术论文源站][paper]。

[paper]: https://example.com/paper`,
        tips: `<strong>💡 格式说明：</strong>
<ul>
    <li>行内式：<code>[显示文字](URL)</code></li>
    <li>引用式：<code>[显示文字][id]</code>，在文末统一配置 <code>[id]: URL</code></li>
    <li>同一链接在长文中多次引用时，强烈推荐引用式写法</li>
</ul>`
    },
    'image': {
        title: '图片',
        category: '🔥 高频语法',
        scenario: '图表插图 · 实验曲线',
        syntax: '![替代文本](图片路径)',
        markdown: `![算法流程拓扑图](./images/aco-flow.png)

![收敛曲线对比](./images/result.png)`,
        tips: `<strong>💡 推荐知识库目录组织：</strong>
<pre style="background: #F1F5F9; color: #0F172A; padding: 8px 12px; border-radius: 6px;"><code>notes/
├── ACO_Algorithm.md
└── images/
    ├── aco-flow.png
    └── result.png</code></pre>
<p>在笔记中一律推荐使用相对路径引入图片：<code>![描述](./images/xxx.png)</code>，同时也支持在线图源网络链接：<code>![描述](https://...)</code>。</p>`
    },
    'table': {
        title: '表格',
        category: '🔥 高频语法',
        scenario: '性能横评 · 参数汇总',
        syntax: '| 列1 | 列2 |',
        markdown: `| 算法名称 | 核心优势 | 典型劣势 | 适用规模 |
| :--- | :--- | :--- | :---: |
| A* | 寻路速度极快 | 强依赖启发函数有效性 | 中小型网格 |
| ACO | 全局搜索能力出色 | 参数多、初期收敛较慢 | 组合优化/TSP |
| GA | 通用性极强、易并行 | 容易早熟收敛 | 连续/离散通用 |`,
        tips: `<strong>💡 书写规范：</strong>
<ul>
    <li>第二行的分隔线 <code>| --- |</code> 是 Markdown 表格合法解析的必要条件</li>
    <li>支持使用冒号控制对齐（左对齐 <code>:---</code>，居中 <code>:---:</code>，右对齐 <code>---:</code>）</li>
</ul>`
    },
    'divider': {
        title: '分割线',
        category: '🔥 高频语法',
        scenario: '长篇章节 · 语义切分',
        syntax: '--- 或 ***',
        markdown: `### 第一部分：算法基本原理与数学模型

这里是推导内容。

---

### 第二部分：核心实现与工程落地

这里是代码与实现细节。`,
        tips: `<strong>💡 注意事项：</strong>
<ul>
    <li>推荐规范使用独立的 <code>---</code></li>
    <li>请在 <code>---</code> 上下各空一行，避免被某些解析器误识别为二级标题下划线</li>
</ul>`
    },
    'math': {
        title: '数学公式',
        category: '🔥 高频语法',
        scenario: '学术论文 · LaTeX公式',
        syntax: '$行内$ · $$独立块$$',
        markdown: `信息素挥发系数记为 $\\rho \\in (0, 1)$。

质能守恒方程：$E = mc^2$

---

独立公式块：

$$
P_{ij}^k = \\frac{[\\tau_{ij}]^\\alpha [\\eta_{ij}]^\\beta}{\\sum_{l \\in \\text{allowed}_k} [\\tau_{il}]^\\alpha [\\eta_{il}]^\\beta}
$$`,
        tips: `<strong>💡 适用场景：</strong>
<ul>
    <li>行内公式：<code>$LaTeX$</code>，适合嵌入正文叙述</li>
    <li>独立公式块：<code>$$LaTeX$$</code>，适合重要定理与推导展开</li>
    <li>支持 KaTeX / MathJax 标准数学语法</li>
</ul>`
    },
    'escape': {
        title: '转义字符',
        category: '🔥 高频语法',
        scenario: '语法避坑 · 特殊字符',
        syntax: '\\* · \\# · \\|',
        markdown: `\\*这段文字不会被解析为斜体\\*

\\# 这行文字不会变成标题

1\\. 这个数字不会被识别为列表序号

表格中原义管道符：\\|`,
        tips: `<strong>💡 常见转义符：</strong>
<ul>
    <li>支持转义的字符：<code>*</code>, <code>#</code>, <code>_</code>, <code>\`</code>, <code>[</code>, <code>]</code>, <code>|</code>, <code>\\</code></li>
    <li>在可能被误判为 Markdown 标记的符号前加反斜杠 <code>\\</code> 即可输出原字符</li>
</ul>`
    },

    // 📚 中频语法 (8项)
    'table-align': {
        title: '表格对齐',
        category: '📚 中频语法',
        scenario: '表格美化 · 数据格式化',
        syntax: ':--- 左 · :---: 中 · ---: 右',
        markdown: `| 算法名称 (左对齐) | 收敛代数 (居中) | 均方误差 RMSE (右对齐) |
| :--- | :---: | ---: |
| Ant Colony Optimization | 120 | 0.0024 |
| Genetic Algorithm | 185 | 0.0051 |
| Particle Swarm | 95 | 0.0038 |`,
        tips: `<strong>💡 规范习惯：</strong>
<ul>
    <li>文本类列推荐左对齐 <code>:---</code></li>
    <li>状态、标签、短代码推荐居中 <code>:---:</code></li>
    <li>纯数字、金额、百分比强烈推荐右对齐 <code>---:</code>，方便纵向对比位宽</li>
</ul>`
    },
    'table-special': {
        title: '表格特殊字符',
        category: '📚 中频语法',
        scenario: '代码表格 · 逻辑运算',
        syntax: '\\| 或 &#124;',
        markdown: `| 逻辑运算符 | 运算含义 | 示例 |
| :---: | :--- | :--- |
| \\|\\| | 逻辑或 (OR) | \`a \\|\\| b\` |
| && | 逻辑与 (AND) | \`a && b\` |
| ! | 逻辑非 (NOT) | \`!flag\` |`,
        tips: `<strong>💡 核心避坑：</strong>
<ul>
    <li>表格分割符就是管道符 <code>|</code>，因此表内单元格要表达管道符必须写为 <code>\\|</code> 或 HTML 实体 <code>&amp;#124;</code></li>
</ul>`
    },
    'mermaid-flow': {
        title: 'Mermaid 流程图',
        category: '📚 中频语法',
        scenario: '算法流程 · 架构设计',
        syntax: '```mermaid flowchart TD',
        markdown: `\`\`\`mermaid
flowchart TD
    A([开始: 输入图结构]) --> B[初始化信息素与参数]
    B --> C[蚂蚁并发构建闭环路径]
    C --> D[局部启发式搜索增强]
    D --> E[全局信息素更新与挥发]
    E --> F{达到最大迭代代数?}
    F -- 否 --> C
    F -- 是 --> G([输出全局最优路径])
\`\`\``,
        tips: `<strong>💡 适用平台：</strong>
<ul>
    <li>GitHub Markdown 原生支持实时矢量图渲染</li>
    <li>Typora、Obsidian、Notion 等知识库工具原生支持</li>
    <li>非常适合无需作图工具即可在代码中版本控制流程图</li>
</ul>`
    },
    'mermaid-advanced': {
        title: 'Mermaid 时序图/状态图',
        category: '📚 中频语法',
        scenario: '网络交互 · 状态机设计',
        syntax: '```mermaid sequenceDiagram',
        markdown: `时序图 (通信协议交互)：
\`\`\`mermaid
sequenceDiagram
    autonumber
    Client->>Gateway: POST /api/v1/inference
    Gateway->>Worker: 调度推理任务
    Worker->>Database: 加载模型权重缓存
    Database-->>Worker: 返回权重数据
    Worker-->>Gateway: 返回推理向量
    Gateway-->>Client: 200 OK (JSON 结果)
\`\`\`

状态图 (系统生命周期)：
\`\`\`mermaid
stateDiagram-v2
    [*] --> 待机 (Idle)
    待机 (Idle) --> 运行中 (Running): 触发计算
    运行中 (Running) --> 暂停 (Paused): 资源受限
    暂停 (Paused) --> 运行中 (Running): 恢复执行
    运行中 (Running) --> 结束 (Finished): 收敛完成
    结束 (Finished) --> [*]
\`\`\``,
        tips: `<strong>💡 适用场景：</strong>
<ul>
    <li>时序图：分布式调用、微服务交互、ROS2 通信节点设计</li>
    <li>状态图：状态机设计、机器人行为树、嵌入式运行周期</li>
</ul>`
    },
    'collapse': {
        title: '折叠内容',
        category: '📚 中频语法',
        scenario: '长篇代码 · 答案与日志',
        syntax: '<details><summary>展开</summary>',
        markdown: `<details>
<summary><b>点击展开查看完整复现 C++ 源码 (45行)</b></summary>

\`\`\`cpp
#include <iostream>
#include <vector>

class AntColony {
public:
    AntColony(int n) : numCities(n) {}
    void run() {
        std::cout << "Optimizing paths for " << numCities << " nodes.\\n";
    }
private:
    int numCities;
};

int main() {
    AntColony aco(50);
    aco.run();
    return 0;
}
\`\`\`

</details>`,
        tips: `<strong>💡 场景优势：</strong>
<ul>
    <li>避免长篇大论的代码或崩溃日志淹没正文的核心推导</li>
    <li>在习题集、实验报告中收拢参考答案或附加推导</li>
    <li>GitHub 与多数主流 Markdown 解析器原生支持</li>
</ul>`
    },
    'footnote': {
        title: '脚注',
        category: '📚 中频语法',
        scenario: '学术文献 · 补充说明',
        syntax: '[^1] 文献引用',
        markdown: `蚁群系统最早由 Marco Dorigo 博士在其博士论文中提出[^1]。

该算法在旅行商问题 (TSP) 上表现出卓越的渐进收敛特性[^note]。

[^1]: Dorigo, M. (1992). *Optimization, Learning and Natural Algorithms*. Ph.D. Thesis, Politecnico di Milano.
[^note]: 后续改进版本 ACS (Ant Colony System) 引入了伪随机比例状态转移规则以增强多样性。`,
        tips: `<strong>💡 适用场景：</strong>
<ul>
    <li>学术论文精读笔记、文献溯源、DOI 关联</li>
    <li>不影响正文阅读流的扩展技术解释</li>
    <li>解析器会自动在文末生成带回跳锚点的脚注列表</li>
</ul>`
    },
    'ref-link': {
        title: '引用式链接',
        category: '📚 中频语法',
        scenario: '长文链接规范 · 统一维护',
        syntax: '[名称][id] 并在文末定义',
        markdown: `本实验基于 [PyTorch 官方仓库][pt] 与 [HuggingFace Hub][hf] 搭建。

基准算法参考自 [原始论文主页][paper]，完整开源代码可移步 [我的实验仓库][myrepo]。

[pt]: https://github.com/pytorch/pytorch
[hf]: https://huggingface.co
[paper]: https://arxiv.org/abs/2301.00001
[myrepo]: https://github.com/example/aco-research`,
        tips: `<strong>💡 核心收益：</strong>
<ul>
    <li>正文行内不再夹杂冗长的 URL，阅读体验极佳</li>
    <li>当链接发生变动时，只需在文末修改一处定义，全篇引用自动生效</li>
</ul>`
    },
    'html-mix': {
        title: 'HTML 混用',
        category: '📚 中频语法',
        scenario: '高阶微调 · 样式补充',
        syntax: '<kbd> · <font> · <!-- 注释 -->',
        markdown: `快捷键提示：按 <kbd>Ctrl</kbd> + <kbd>C</kbd> 中断运行。

居中文本排版：
<div align="center">
  <h3>论文核心架构示意图</h3>
</div>

带有特殊颜色的标注：<span style="color: #0284C7; font-weight: bold;">信息素挥发量过大</span>

<!-- 这里是仅在源码中保留的个人备忘，渲染后不可见 -->`,
        tips: `<strong>💡 混用原则：</strong>
<ul>
    <li>“Markdown 能做的坚决不用 HTML，Markdown 无法实现的克制使用 HTML”</li>
    <li>极度适合使用 <code>&lt;kbd&gt;</code> 渲染键盘按键、居中图片与公式说明</li>
</ul>`
    },

    // 🔧 实用指南 (6项)
    'template-tech': {
        title: '技术笔记模板',
        category: '🔧 实用指南',
        scenario: '工程学习 · 算法精读',
        syntax: '10大标准结构模块',
        markdown: `# [算法/技术名称] 学习与实现精要

## 1. 一句话定性
> 该技术旨在解决什么核心痛点？其核心假设与输入输出是什么？

## 2. 核心数学模型 / 原理
公式推导与变量物理意义说明：
$$
y = f(Wx + b)
$$

## 3. 算法核心步骤
1. **预处理**：数据归一化
2. **核心循环**：迭代状态搜索
3. **后处理**：输出帕累托最优解

## 4. 关键实现代码 (核心逻辑)
\`\`\`cpp
// 核心逻辑简写，突出算法思想，非冗长模板
\`\`\`

## 5. 复杂度与资源开销
- **时间复杂度**：$O(N \\log N)$
- **空间复杂度**：$O(N)$

## 6. 避坑指南与个人反思
- 实际落地中的数值溢出风险
- 调参关键敏感因子分析`,
        tips: `<strong>💡 模板价值：</strong>
<ul>
    <li>建立个人标准化的技术笔记框架，避免随意记述导致的“过目即忘”</li>
    <li>最关键的章节是“一句话定性”与“个人反思”</li>
</ul>`
    },
    'template-paper': {
        title: '论文阅读模板',
        category: '🔧 实用指南',
        scenario: '学术研读 · 顶会精读',
        syntax: '论文元数据 + 贡献点萃取',
        markdown: `# [Paper Title]

## 1. 论文元数据
- **作者与机构**：
- **发表年份与会议**：NeurIPS / ICML / CVPR
- **开源代码**：[GitHub Repo URL]

## 2. 核心贡献 (Core Contributions)
1. 提出了全新的注意力掩码机制，降低了二次计算复杂度；
2. 构造了具有高挑战性的跨域基准数据集；
3. 在标准数据集上取得了 SOTA 表现。

## 3. 解决思路与方法架构
- **Baseline 缺陷**：
- **本文创新点**：

## 4. 实验结论与数据支撑
| 模型方法 | Top-1 Acc (%) | FLOPs (G) | 参数量 (M) |
| :--- | :---: | :---: | :---: |
| Baseline | 82.4 | 4.5 | 28.1 |
| **Ours** | **85.1** | **3.8** | **25.4** |

## 5. 对自身课题的可借鉴点
- 该损失函数的设计可以迁移至我们的自监督训练流程中。`,
        tips: `<strong>💡 论文笔记要点：</strong>
<ul>
    <li>重点记录该文章的 Baseline 是什么，以及它凭什么比 Baseline 好</li>
    <li>务必记录“对自身课题的可借鉴点”，让读论文直接转化为产出灵感</li>
</ul>`
    },
    'template-bug': {
        title: 'Bug 调试模板',
        category: '🔧 实用指南',
        scenario: '工程排障 · 故障复盘',
        syntax: '现象 · 堆栈 · 根因 · 修复',
        markdown: `# Bug 排查记录：[简要描述问题]

## 1. 异常现象
- **运行环境**：Ubuntu 22.04 / CUDA 12.1 / C++17
- **现象描述**：执行多线程信息素更新时偶发 Segmentation Fault。

## 2. 崩溃日志与调用堆栈
\`\`\`text
Thread 4 "main" received signal SIGSEGV, Segmentation fault.
0x0000555555559284 in AntColony::updatePheromone() at src/aco.cpp:142
142         pheromone[i][j] += delta;
\`\`\`

## 3. 根本原因定位 (Root Cause)
多线程并发访问共享矩阵 \`pheromone\` 时缺少原子互斥保护，产生数据竞争且内存越界。

## 4. 修复方案 (Solution)
引入轻量级细粒度自旋锁，或改为各线程独立累计局部更新量后归约（Reduction）。

## 5. 验证与回归
- [x] 在压力测试脚本下连续运行 1000 次无崩溃
- [x] 计算结果与单线程串行版本严格一致`,
        tips: `<strong>💡 长期价值：</strong>
<ul>
    <li>技术开发中最昂贵的学费就是重复踩同一个坑</li>
    <li>积累 Bug 调试库，是提升工程排障速度最立竿见影的手段</li>
</ul>`
    },
    'best-practice': {
        title: '重点标记体系',
        category: '🔧 实用指南',
        scenario: '阅读体验 · 视觉降噪',
        syntax: '规范化 Callout 标记',
        markdown: `> **【定义】**
> 信息素是蚂蚁在移动路径上释放的具有正反馈激励机制的挥发性生物标记。

> **【核心公式】**
> 转移概率依赖启发式能见度与信息素强度的指数权重比。

> **【避坑警示】**
> 当挥发系数 $\\rho$ 过小（例如接近 0）时，算法极易陷入局部最优停滞。

> **【实验结论】**
> 在 TSP 规模大于 100 节点时，ACS 的寻优速度显著超越传统遗传算法。`,
        tips: `<strong>💡 统一标签规范：</strong>
<ul>
    <li>拒绝通篇加粗：整页都是粗体 = 整页都没有重点</li>
    <li>推荐使用 <code>&gt; **【标记词】**</code> 建立自己的视觉锚点体系</li>
</ul>`
    },
    'dos-donts': {
        title: '推荐/不推荐写法',
        category: '🔧 实用指南',
        scenario: '格式规范 · 清洁代码',
        syntax: '对比避坑指南',
        markdown: `## ❌ 强烈不推荐的写法

- **满屏乱加粗**：
  **ACO** 是 **优秀** 的 **元启发式** 算法，利用了 **信息素**... (视觉极其疲劳)
- **跨级生硬跳级**：
  一级标题直接跳到 \`###### 六级标题\` (目录索引断层)
- **用手敲空格伪装对齐**：
  \`ACO      蚁群算法\` (不同设备与字体下必乱)

---

## ✅ 优雅推荐的写法

- **克制精准的加粗**：
  核心机制在于 **信息素正反馈** 与 **启发式先验引导** 的协同。
- **严谨的层级递进**：
  \`# 大章节\` -> \`## 子章节\` -> \`### 知识点\`
- **表格与代码对齐**：
  使用 Markdown 原生表格对齐多字段`,
        tips: `<strong>💡 终极哲学：</strong>
<ul>
    <li>Markdown 的初衷是“让纯文本具备良好的可读性”，排版应以阅读舒适为最高准则</li>
</ul>`
    }
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initMermaid();
    initImageErrorHandler();
    initNavigation();
    initModal();
    initEditor();
    initSearch();
    buildSearchIndex();
    renderAllContent();
    initGlobalShortcuts();
    window.addEventListener('hashchange', () => showContentFromHash());

    showContentFromHash();
});

// 初始化全局图片加载错误防御 (捕获阶段监听非冒泡 error 事件)
function initImageErrorHandler() {
    window.addEventListener('error', (e) => {
        if (e.target && e.target.tagName === 'IMG' && (e.target.closest('.preview-content') || e.target.closest('#editorPreview'))) {
            window.handleImageError(e.target);
        }
    }, true);
}

// 初始化 Mermaid 图表引擎 (现代工匠风配色与紧凑优雅排版)
function initMermaid() {
    if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: {
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                fontSize: '13px',
                primaryColor: '#F8FAFC',
                primaryBorderColor: '#64748B',
                primaryTextColor: '#0F172A',
                lineColor: '#64748B',
                secondaryColor: '#F1F5F9',
                tertiaryColor: '#FFFFFF',
                mainBkg: '#FFFFFF',
                nodeBorder: '#64748B',
                clusterBkg: '#F8FAFC',
                clusterBorder: '#CBD5E1',
                defaultLinkColor: '#64748B',
                edgeLabelBackground: '#FFFFFF',
                actorBkg: '#F8FAFC',
                actorBorder: '#64748B',
                actorTextColor: '#0F172A',
                signalColor: '#64748B',
                signalTextColor: '#334155'
            },
            flowchart: {
                htmlLabels: true,
                curve: 'basis',
                nodeSpacing: 24,
                rankSpacing: 28,
                padding: 10
            },
            securityLevel: 'loose'
        });
    }
}

function setSidebarOpen(open) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active', open);
    sidebar.inert = !open && window.innerWidth <= 768;
    document.getElementById('sidebarToggle').setAttribute('aria-expanded', String(open));
}

function setSectionOpen(header, open) {
    document.getElementById(header.getAttribute('aria-controls')).classList.toggle('active', open);
    header.classList.toggle('active', open);
    header.setAttribute('aria-expanded', String(open));
}

function showContentFromHash() {
    const id = window.location.hash.slice(1);
    showContent(Object.prototype.hasOwnProperty.call(contentData, id) ? id : 'cheatsheet');
}

// ==================== 导航系统 ====================
function initNavigation() {
    document.querySelectorAll('.nav-section-header').forEach(header => {
        header.addEventListener('click', () => {
            setSectionOpen(header, header.getAttribute('aria-expanded') !== 'true');
        });
    });

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const id = link.closest('li').dataset.id;
            if (window.location.hash === `#${id}`) {
                showContent(id);
            } else {
                window.location.hash = id;
            }
            if (window.innerWidth <= 768) {
                setSidebarOpen(false);
                document.getElementById('sidebarToggle').focus();
            }
        });
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
        setSidebarOpen(!document.getElementById('sidebar').classList.contains('active'));
    });

    setSidebarOpen(document.getElementById('sidebar').classList.contains('active'));
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) setSidebarOpen(false);
        else setSidebarOpen(document.getElementById('sidebar').classList.contains('active'));
    });
}

// ==================== 内容卡片动态生成与渲染 ====================
function renderAllContent() {
    const contentContainer = document.getElementById('content');
    contentContainer.innerHTML = '';
    
    // 遍历 contentData 生成全部 29 个卡片
    Object.keys(contentData).forEach(id => {
        const data = contentData[id];
        const contentItem = createContentItem(id, data);
        contentContainer.appendChild(contentItem);
    });
}

function createContentItem(id, data) {
    const div = document.createElement('div');
    div.className = 'content-item';
    div.id = id;
    if (id === 'cheatsheet') div.classList.add('cheatsheet-item');
    
    // 自定义 marked 渲染器，对 mermaid 代码块进行特别包装
    const rawHtml = parseMarkdown(data.markdown);
    
    div.innerHTML = `
        <div class="content-header">
            <div class="content-breadcrumb">
                <span class="breadcrumb-cat">${data.category || 'Markdown 语法'}</span>
                <span>/</span>
                <span class="scenario-badge">${data.scenario || '通用写作'}</span>
            </div>
            <div class="content-title-row">
                <h2 class="content-title">${data.title}</h2>
                <span class="syntax-pill">${escapeHtml(data.syntax || '')}</span>
            </div>
        </div>
        
        <div class="demo-container">
            <!-- 左侧：深板岩暗夜黑源码区 (Dark Slate) -->
            <div class="demo-source">
                <div class="demo-header">
                    <div class="terminal-dots">
                        <span class="terminal-dot dot-red"></span>
                        <span class="terminal-dot dot-yellow"></span>
                        <span class="terminal-dot dot-green"></span>
                    </div>
                    <div class="source-label">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="16 18 22 12 16 6"></polyline>
                            <polyline points="8 6 2 12 8 18"></polyline>
                        </svg>
                        <span>MARKDOWN 源码</span>
                    </div>
                    <button class="action-btn copy-btn" data-copy="${id}" title="复制 Markdown 源码">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span>复制代码</span>
                    </button>
                </div>
                <pre><code class="language-markdown">${escapeHtml(data.markdown)}</code></pre>
            </div>
            
            <!-- 右侧：纯白仿纸渲染区 (Paper White) -->
            <div class="demo-preview">
                <div class="demo-header">
                    <div class="preview-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        <span>实时排版渲染</span>
                    </div>
                    <button class="action-btn edit-btn" data-id="${id}" title="在编辑器中实时修改演练">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        <span>实时演练</span>
                    </button>
                </div>
                <div class="preview-content">${rawHtml}</div>
            </div>
        </div>
        
        <div class="tips">
            <strong>
                <span class="tips-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="9" y1="18" x2="15" y2="18"></line>
                        <line x1="10" y1="22" x2="14" y2="22"></line>
                        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
                    </svg>
                </span>
                实践建议与避坑提示
            </strong>
            ${data.tips}
        </div>
    `;
    
    // 执行 Prism 代码语法高亮
    div.querySelectorAll('pre code').forEach(block => {
        Prism.highlightElement(block);
    });
    
    // 针对高频速查表增强：为每个语法功能注入独立一键复制能力与说明横幅
    if (id === 'cheatsheet') {
        const source = div.querySelector('.demo-source');
        const sourceDetails = document.createElement('details');
        sourceDetails.className = 'cheatsheet-source';
        sourceDetails.innerHTML = '<summary>查看完整 Markdown 表格源码</summary>';
        source.replaceWith(sourceDetails);
        sourceDetails.appendChild(source);

        const previewContent = div.querySelector('.preview-content');
        const table = previewContent ? previewContent.querySelector('table') : null;
        if (table) {
            table.classList.add('cheatsheet-table');
            
            // 插入速查横幅提示
            const banner = document.createElement('div');
            banner.className = 'cheatsheet-banner';
            banner.innerHTML = `
                <div class="banner-icon-wrap">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                </div>
                <span><strong>快捷操作</strong>：点击每行右侧「复制」按钮或点击代码标签，即可直接复制开箱即用的 Markdown 语法代码。</span>
            `;
            table.parentNode.insertBefore(banner, table);
            
            const columnLabels = [...table.querySelectorAll('thead th')].map(th => th.textContent.trim());
            table.querySelectorAll('tbody tr').forEach(row => {
                row.querySelectorAll('td').forEach((cell, index) => {
                    cell.dataset.label = columnLabels[index];
                    if (index === 1 || index === 2) {
                        const label = document.createElement('span');
                        label.className = 'mobile-cell-label';
                        label.textContent = columnLabels[index];
                        cell.prepend(label);
                    }
                });
            });

            // 增强表头
            const theadTr = table.querySelector('thead tr');
            if (theadTr) {
                const th = document.createElement('th');
                th.className = 'th-quick-copy';
                th.textContent = '快捷操作';
                theadTr.appendChild(th);
            }
            
            // 增强每一行
            table.querySelectorAll('tbody tr').forEach(tr => {
                const cells = tr.querySelectorAll('td');
                if (cells.length >= 2) {
                    const rawName = cells[0].textContent.trim();
                    const snippetKey = Object.keys(CHEATSHEET_SNIPPETS).find(k => rawName.includes(k)) || rawName;
                    const snippet = CHEATSHEET_SNIPPETS[snippetKey] || cells[1].textContent.trim();
                    
                    // 使第二列中的代码可点击复制
                    cells[1].querySelectorAll('code').forEach(codeEl => {
                        const copyBadge = document.createElement('button');
                        copyBadge.type = 'button';
                        copyBadge.className = 'copyable-code-badge';
                        copyBadge.title = `点击复制: ${codeEl.textContent.trim()}`;
                        copyBadge.setAttribute('aria-label', `复制 ${codeEl.textContent.trim()}`);
                        copyBadge.innerHTML = codeEl.outerHTML;
                        codeEl.replaceWith(copyBadge);
                        copyBadge.addEventListener('click', () => {
                            copyToClipboard(copyBadge.querySelector('code').textContent.trim(), copyBadge);
                        });
                    });
                    
                    const td = document.createElement('td');
                    td.className = 'td-quick-copy';
                    td.dataset.label = '快捷操作';
                    
                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'table-copy-btn';
                    copyBtn.title = `一键复制「${snippetKey}」语法模板`;
                    copyBtn.innerHTML = `
                        <svg class="copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        <span class="btn-text">复制</span>
                    `;
                    
                    copyBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(snippet, copyBtn);
                    });
                    
                    td.appendChild(copyBtn);
                    tr.appendChild(td);
                }
            });
        }
    }
    
    // 绑定一键复制功能
    div.querySelector('.copy-btn').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        copyToClipboard(data.markdown, btn);
    });
    
    // 绑定实时演练编辑弹窗
    div.querySelector('.edit-btn').addEventListener('click', () => {
        openEditor(data.markdown);
    });
    
    return div;
}

// 全局图片加载失败防御性优雅降级
window.handleImageError = function(img) {
    if (!img || img.dataset.failed) return;
    img.dataset.failed = 'true';
    
    const alt = img.getAttribute('alt') || '图片资源未就绪';
    const src = img.getAttribute('src') || '';
    
    const placeholder = document.createElement('div');
    placeholder.className = 'image-fallback-placeholder';
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', alt);
    
    placeholder.innerHTML = `
        <div class="fallback-icon-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="2" y1="2" x2="22" y2="22"></line>
                <path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"></path>
                <line x1="13.5" y1="13.5" x2="6" y2="21"></line>
                <line x1="18" y1="12" x2="21" y2="15"></line>
                <path d="M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.05-.22 1.41-.59"></path>
                <path d="M21 15V5a2 2 0 0 0-2-2H9"></path>
            </svg>
        </div>
        <div class="fallback-info">
            <span class="fallback-alt">${escapeHtml(alt)}</span>
            <span class="fallback-src">无法加载资源：<code>${escapeHtml(src)}</code></span>
        </div>
    `;
    
    img.replaceWith(placeholder);
};

// 解析 Markdown 并转译 Mermaid 图表、KaTeX 数学公式与防破损图片
function parseMarkdown(mdText) {
    if (typeof marked === 'undefined') return mdText;
    if (!mdText) return '';

    const codeTokens = [];
    // 1. 保护代码块与行内代码，防止其中的 $ 符号或反斜杠被误提取为公式
    let preprocessed = mdText.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
        const id = `%%CODEHOLDER${codeTokens.length}%%`;
        codeTokens.push({ id, code: match });
        return id;
    });

    const mathTokens = [];

    // 2. 提取独立块级公式 $$ ... $$ (支持跨行和单行，使用非 Markdown 标记 %%)
    preprocessed = preprocessed.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
        const id = `%%KATEXBLOCK${mathTokens.length}%%`;
        mathTokens.push({ id, math: math.trim(), display: true });
        return `\n\n${id}\n\n`;
    });

    // 3. 提取行内公式 $ ... $ (两端非空白，排除转义 \$，不跨行)
    preprocessed = preprocessed.replace(/(?<!\\)\$([^\$\n\r]+?)(?<!\\)\$/g, (match, math) => {
        if (!math || /^\s|\s$/.test(math)) return match;
        const id = `%%KATEXINLINE${mathTokens.length}%%`;
        mathTokens.push({ id, math: math.trim(), display: false });
        return id;
    });

    // 4. 还原代码块（使用 split/join 彻底避免 $ 在 replace 中的参数误替换）
    codeTokens.forEach(t => {
        preprocessed = preprocessed.split(t.id).join(t.code);
    });

    // 5. 调用 marked 转译核心 Markdown 结构
    let html = marked.parse(preprocessed);

    // 6. 回填并原生渲染 KaTeX 数学公式
    mathTokens.forEach(t => {
        let mathHtml = '';
        if (typeof katex !== 'undefined') {
            try {
                mathHtml = katex.renderToString(t.math, {
                    displayMode: t.display,
                    throwOnError: false
                });
            } catch (err) {
                console.warn('KaTeX render error:', err);
                mathHtml = `<span class="katex-error">${escapeHtml(t.math)}</span>`;
            }
        } else {
            mathHtml = t.display 
                ? `<div class="katex-fallback">$$${escapeHtml(t.math)}$$</div>`
                : `<span class="katex-fallback">$${escapeHtml(t.math)}$</span>`;
        }

        if (t.display) {
            // 如果 marked 将占位符包裹在 <p> 标签中，将其平滑替换为块级容器
            const pWrappedRegex = new RegExp('<p>\\s*' + t.id + '\\s*<\\/p>', 'g');
            const blockContainer = `<div class="katex-display-container">${mathHtml}</div>`;
            if (pWrappedRegex.test(html)) {
                html = html.replace(pWrappedRegex, blockContainer);
            } else {
                html = html.split(t.id).join(blockContainer);
            }
        } else {
            html = html.split(t.id).join(`<span class="katex-inline-container">${mathHtml}</span>`);
        }
    });

    // 7. 处理 Mermaid 图表代码块
    html = html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g, (match, code) => {
        const decodedCode = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        return `<div class="mermaid">${decodedCode}</div>`;
    });

    // 8. 增强图片标签，注入防图裂错误监听
    html = html.replace(/<img\s+([^>]*?)src=["']([^"']*)["']([^>]*?)>/gi, (match, before, src, after) => {
        return `<img ${before}src="${src}" onerror="window.handleImageError(this)"${after}>`;
    });

    return html;
}

// 展示指定的语法卡片
function showContent(id) {
    document.querySelectorAll('.content-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const targetItem = document.getElementById(id);
    if (targetItem) {
        targetItem.classList.add('active');
        state.currentSection = id;

        document.querySelectorAll('.nav-list li').forEach(item => {
            const active = item.dataset.id === id;
            item.classList.toggle('active', active);
            if (active) {
                item.querySelector('a').setAttribute('aria-current', 'page');
                const list = item.closest('.nav-list');
                setSectionOpen(document.querySelector(`[aria-controls="${list.id}"]`), true);
            } else {
                item.querySelector('a').removeAttribute('aria-current');
            }
        });
        
        // 渲染图表
        if (typeof mermaid !== 'undefined' && targetItem.querySelector('.mermaid')) {
            try {
                mermaid.run({ nodes: targetItem.querySelectorAll('.mermaid') });
            } catch (err) {
                console.warn('Mermaid render error:', err);
            }
        }
        
        // 平滑回滚到顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==================== 编辑器演练功能 ====================
function initEditor() {
    const editorInput = document.getElementById('editorInput');
    const editorPreview = document.getElementById('editorPreview');
    
    editorInput.addEventListener('input', () => {
        const markdown = editorInput.value;
        const html = parseMarkdown(markdown);
        editorPreview.innerHTML = html;
        
        editorPreview.querySelectorAll('pre code').forEach(block => {
            Prism.highlightElement(block);
        });
        
        if (typeof mermaid !== 'undefined' && editorPreview.querySelector('.mermaid')) {
            try {
                mermaid.run({ nodes: editorPreview.querySelectorAll('.mermaid') });
            } catch (e) {}
        }

        // 检查已加载完成但资源无效的图片
        editorPreview.querySelectorAll('img').forEach(img => {
            if (img.complete && img.naturalWidth === 0) {
                window.handleImageError(img);
            }
        });
    });
    
    document.getElementById('clearBtn')?.addEventListener('click', () => {
        editorInput.value = '';
        editorPreview.innerHTML = '<p style="color: #94A3B8; text-align: center; margin-top: 40px;">在左侧输入 Markdown 源码即可在此实时查看效果</p>';
    });
}

function openEditor(initialText = '') {
    if (document.getElementById('searchModal').classList.contains('active')) closeSearchModal();
    const modal = document.getElementById('editModal');
    const editorInput = document.getElementById('editorInput');
    const editorPreview = document.getElementById('editorPreview');
    
    editorInput.value = initialText;
    editorPreview.innerHTML = parseMarkdown(initialText);
    
    editorPreview.querySelectorAll('pre code').forEach(block => {
        Prism.highlightElement(block);
    });
    
    if (typeof mermaid !== 'undefined' && editorPreview.querySelector('.mermaid')) {
        try {
            mermaid.run({ nodes: editorPreview.querySelectorAll('.mermaid') });
        } catch (e) {}
    }

    editorPreview.querySelectorAll('img').forEach(img => {
        if (img.complete && img.naturalWidth === 0) {
            window.handleImageError(img);
        }
    });
    
    state.modalReturnFocus = document.activeElement;
    modal.classList.add('active');
    editorInput.focus();
}

// ==================== 模态弹窗系统 ====================
function initModal() {
    // 编辑弹窗关闭
    document.getElementById('modalClose')?.addEventListener('click', closeEditModal);
    document.getElementById('closeEditorBtn')?.addEventListener('click', closeEditModal);
    document.getElementById('editModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'editModal') closeEditModal();
    });
    
    // 搜索弹窗关闭
    document.getElementById('searchModalClose')?.addEventListener('click', closeSearchModal);
    document.getElementById('searchModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'searchModal') closeSearchModal();
    });
    
    document.getElementById('searchBoxTrigger')?.addEventListener('click', openSearchModal);
    document.addEventListener('keydown', trapModalFocus);
}

function focusableModalElements(modal) {
    return [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter(element => element.getClientRects().length > 0);
}

function trapModalFocus(event) {
    if (event.key !== 'Tab') return;
    const modal = document.querySelector('.modal.active');
    if (!modal) return;
    const elements = focusableModalElements(modal);
    if (!elements.length) return;
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
    }
}

function restoreModalFocus() {
    if (state.modalReturnFocus?.isConnected) state.modalReturnFocus.focus();
    state.modalReturnFocus = null;
}

function closeEditModal() {
    document.getElementById('editModal')?.classList.remove('active');
    restoreModalFocus();
}

function openSearchModal() {
    if (document.getElementById('editModal').classList.contains('active')) return;
    const modal = document.getElementById('searchModal');
    const input = document.getElementById('modalSearchInput');
    state.modalReturnFocus = document.activeElement;
    modal?.classList.add('active');
    input?.focus();
    input?.select();
}

function closeSearchModal() {
    document.getElementById('searchModal')?.classList.remove('active');
    restoreModalFocus();
}

// ==================== 全局搜索功能 ====================
function initSearch() {
    const modalInput = document.getElementById('modalSearchInput');
    modalInput?.addEventListener('input', () => {
        performSearch(modalInput.value);
    });
}

function buildSearchIndex() {
    Object.keys(contentData).forEach(id => {
        const data = contentData[id];
        state.searchIndex[id] = {
            title: data.title.toLowerCase(),
            scenario: (data.scenario || '').toLowerCase(),
            category: (data.category || '').toLowerCase(),
            syntax: (data.syntax || '').toLowerCase(),
            content: (data.markdown + ' ' + data.tips).toLowerCase()
        };
    });
}

function performSearch(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    if (!resultsContainer) return;
    
    if (!query) {
        resultsContainer.innerHTML = '<p style="color: #94A3B8; text-align: center; padding: 30px;">输入关键词（如标题、表格、公式、代码等）开始检索</p>';
        return;
    }
    
    const results = [];
    Object.keys(state.searchIndex).forEach(id => {
        const idx = state.searchIndex[id];
        const data = contentData[id];
        
        let matchScore = 0;
        if (idx.title.includes(query)) matchScore += 10;
        if (idx.scenario.includes(query)) matchScore += 5;
        if (idx.syntax.includes(query)) matchScore += 4;
        if (idx.content.includes(query)) matchScore += 1;
        
        if (matchScore > 0) {
            const snippet = generateSnippet(data.markdown + ' ' + data.tips, query);
            results.push({ id, title: data.title, scenario: data.scenario, snippet, score: matchScore });
        }
    });
    
    // 按相关度降序排列
    results.sort((a, b) => b.score - a.score);
    displaySearchResults(results, query);
}

function generateSnippet(text, query) {
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query);
    
    if (index === -1) return escapeHtml(text.substring(0, 80)) + '...';
    
    const start = Math.max(0, index - 25);
    const end = Math.min(text.length, index + query.length + 35);
    let snippet = text.substring(start, end);
    
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escapeHtml(snippet).replace(regex, '<span class="search-result-highlight">$1</span>');
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<p style="color: #94A3B8; text-align: center; padding: 30px;">未检索到与 "' + escapeHtml(query) + '" 相关的语法条目</p>';
        return;
    }
    
    searchResults.innerHTML = results.map(result => `
        <button class="search-result-item" type="button" data-id="${result.id}">
            <span class="search-result-heading">
                <span class="search-result-title">${escapeHtml(result.title)}</span>
                <span class="search-result-scenario">${escapeHtml(result.scenario || '')}</span>
            </span>
            <span class="search-result-snippet">${result.snippet}</span>
        </button>
    `).join('');
    
    searchResults.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.dataset.id;
            closeSearchModal();
            if (window.location.hash === `#${id}`) {
                showContent(id);
            } else {
                window.location.hash = id;
            }
        });
    });
}

// ==================== 全局快捷键支持 (Ctrl+K / Cmd+K / Esc) ====================
function initGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
        // Ctrl+K 或 Cmd+K 唤起搜索
        if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
            e.preventDefault();
            openSearchModal();
        }
        
        // 单独按下 / 且当前焦点不在输入控件内时唤起搜索
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            openSearchModal();
        }
        
        // Escape 关闭当前活动的弹窗
        if (e.key === 'Escape') {
            closeSearchModal();
            closeEditModal();
        }
    });
}

// ==================== 一键复制到剪贴板 ====================
function copyToClipboard(text, button) {
    const doCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        } else {
            return new Promise((resolve, reject) => {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    document.body.removeChild(textarea);
                    resolve();
                } catch (e) {
                    document.body.removeChild(textarea);
                    reject(e);
                }
            });
        }
    };

    doCopy().then(() => {
        if (!button) return;
        
        // 如果是点击行内 code 徽章触发复制
        if (button.tagName === 'CODE') {
            const originalText = button.textContent;
            button.classList.add('code-copied');
            button.textContent = '✓ 已复制';
            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('code-copied');
            }, 1800);
            return;
        }

        // 普通按钮或表格专属复制按钮
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span class="btn-text">已复制!</span>
        `;
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// ==================== 工具函数 ====================
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
