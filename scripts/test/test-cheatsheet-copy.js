// 速查表一键复制的权威源码回归测试。
// 根因：复制内容曾取自 DOM textContent，浏览器已把 \| 反转义成 |、
// 嵌套反引号被吞掉，粘回编辑器即表格错列。这里锁定「复制内容必须等于原始
// Markdown 源码」这一不变量。
const fs = require('fs');
const path = require('path');

const jsFile = fs.readFileSync(path.join(__dirname, '../../js/app.js'), 'utf8');

let errors = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`✅ ${message}`);
    } else {
        console.error(`❌ ${message}`);
        errors++;
    }
}

// 从 app.js 中取出被测函数定义，在隔离作用域内求值以便直接断言
function loadFunctions(source) {
    const names = [
        'splitMarkdownTableRow',
        'extractInlineCodes',
        'stripMarkdownEmphasis',
        'parseCheatsheetTableRows',
        'resolveCheatsheetSnippet',
        'decodeHtmlEntities',
        'escapeHtml'
    ];
    const grabbed = [];
    names.forEach(name => {
        const re = new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}`, 'm');
        const match = source.match(re);
        if (!match) throw new Error(`未找到函数 ${name}`);
        grabbed.push(match[0]);
    });
    const cheatsheet = source.match(/const CHEATSHEET_SNIPPETS = \{[\s\S]*?\n\};/);
    if (!cheatsheet) throw new Error('未找到 CHEATSHEET_SNIPPETS 定义');
    grabbed.unshift(cheatsheet[0]);
    return new Function(`${grabbed.join('\n')}\nreturn { ${names.join(', ')} };`)();
}

const fns = loadFunctions(jsFile);
const {
    splitMarkdownTableRow, extractInlineCodes, parseCheatsheetTableRows,
    resolveCheatsheetSnippet, decodeHtmlEntities, escapeHtml
} = fns;

console.log('--- 速查表复制源码保真测试 ---\n');

// 用例 1：管道符转义必须在切分单元格时保留
console.log('--- 用例 1: 管道符转义的表格行切分 ---');
const pipeRow = '| **数据表格** | `\\| 表头1 \\| 表头2 \\|` | 栅格数据表 |';
const pipeCells = splitMarkdownTableRow(pipeRow);
assert(pipeCells.length === 3, `管道符行应切分为 3 个单元格，实际 ${pipeCells.length}`);
assert(
    pipeCells[1] === '`\\| 表头1 \\| 表头2 \\|`',
    `第二列必须保留 \\| 转义，实际: ${JSON.stringify(pipeCells[1])}`
);

// 用例 2：嵌套反引号不得被行内代码提取吞掉
console.log('\n--- 用例 2: 嵌套反引号行内代码提取 ---');
const nestedCodes = extractInlineCodes('`` `code` ``');
assert(nestedCodes.length === 1, `应提取 1 段行内代码，实际 ${nestedCodes.length}`);
assert(
    nestedCodes[0] === '`code`',
    `嵌套反引号必须原样保留，实际: ${JSON.stringify(nestedCodes[0])}`
);

const fenceCodes = extractInlineCodes('```cpp ... ```');
assert(
    fenceCodes.length === 1 && fenceCodes[0] === 'cpp ...',
    `三反引号 code span 应正确剥离定界符，实际: ${JSON.stringify(fenceCodes)}`
);

// 用例 3：整表解析后，数据表格行复制内容必须等于原始 Markdown 源码
console.log('\n--- 用例 3: 整表解析保真性 ---');
// 真实速查表结构：表头行 + 对齐分隔行 + 15 个数据行
const markdown = [
    '| 语法功能 | Markdown 源码写法 | 渲染示例 |',
    '| :--- | :--- | :--- |',
    '| **标题** | `# H1` / `## H2` | 1-6 级标题 |',
    '| **行内代码** | `` `code` `` | `code` |',
    '| **数据表格** | `\\| 表头1 \\| 表头2 \\|` | 栅格数据表 |',
    '| **代码块** | ```cpp ... ``` | 多语言高亮代码 |'
].join('\n');

const rows = parseCheatsheetTableRows(markdown);
assert(rows instanceof Map, '应返回以语法名为键的 Map，便于按名取值');
assert(rows.size === 5, `应解析出 5 条（表头 + 4 数据行），实际 ${rows.size}`);
assert(rows.has('语法功能'), '表头行应被收入索引');

const tableRow = rows.get('数据表格');
assert(!!tableRow, '应定位到「数据表格」行');
if (tableRow) {
    assert(
        tableRow.source === '`\\| 表头1 \\| 表头2 \\|`',
        `数据表格源码列必须保留管道符转义，实际: ${JSON.stringify(tableRow.source)}`
    );
}

const codeRow = rows.get('代码块');
assert(!!codeRow, '应定位到「代码块」行');
if (codeRow) {
    assert(
        codeRow.source === '```cpp ... ```',
        `代码块源码列必须保留三反引号，实际: ${JSON.stringify(codeRow.source)}`
    );
}

// 用例 4：resolveCheatsheetSnippet 的取值优先级
console.log('\n--- 用例 4: 复制内容取值优先级 ---');
const fromSnippet = resolveCheatsheetSnippet('数据表格', tableRow);
assert(fromSnippet.key === '数据表格', `应命中内置模板键，实际: ${fromSnippet.key}`);
assert(
    typeof fromSnippet.value === 'string' && fromSnippet.value.includes('|'),
    '命中内置模板时应返回可粘贴的模板字符串'
);

// 未命中内置模板时必须退回原文第二列，保证转义符不丢
const fallback = resolveCheatsheetSnippet('自定义语法', {
    name: '自定义语法',
    source: '`\\| a \\| b \\|`',
    inlineCodes: []
});
assert(
    fallback.value === '`\\| a \\| b \\|`',
    `未命中模板时应原样退回原文，实际: ${JSON.stringify(fallback.value)}`
);

// 用例 5：HTML 实体解码不得解释标签
console.log('\n--- 用例 5: Mermaid 源码解码不含标签解释 ---');
const decoded = decodeHtmlEntities('flowchart TD\nA --&gt; B{&quot;x&quot;}');
assert(decoded.includes('-->'), '应还原 --> 连接符');
assert(decoded.includes('"x"'), '应还原引号实体');
const injected = decodeHtmlEntities('&lt;script&gt;alert(1)&lt;/script&gt;');
assert(
    injected === '<script>alert(1)</script>',
    '解码结果应仅为 Mermaid 源码文本，由 Mermaid 自身渲染，不进入 innerHTML'
);

// 用例 6：escapeHtml 覆盖全部危险字符
console.log('\n--- 用例 6: HTML 转义完备性 ---');
assert(
    escapeHtml('<img src=x onerror=alert(1)>') ===
        '&lt;img src=x onerror=alert(1)&gt;',
    '必须转义尖括号以阻断标签注入'
);

// 用例 7：调用点必须按可信度选择 allowRawHtml
console.log('\n--- 用例 7: 调用点可信度标注 ---');
assert(
    /parseMarkdown\(data\.markdown,\s*true\)/.test(jsFile),
    '仓库内固定卡片数据应显式 allowRawHtml=true（HTML 混用卡片需要真实渲染）'
);
assert(
    /parseMarkdown\(markdown,\s*false\)/.test(jsFile),
    '实时演练编辑器输入应显式 allowRawHtml=false'
);
assert(
    /parseMarkdown\(initialText,\s*false\)/.test(jsFile),
    '打开编辑器时的初始草稿应显式 allowRawHtml=false'
);
assert(
    /securityLevel:\s*'strict'/.test(jsFile),
    "Mermaid 安全级别应为 'strict'"
);

// 用例 8：marked 实例化方式必须正确
// marked 11 的 parse(src, { renderer }) 不接受 partial renderer（会抛
// "xxx is not a function"），marked.use() 又是全局持久生效、会污染卡片路径，
// 因此必须用一次性 new marked.Marked({ renderer })。
console.log('\n--- 用例 8: marked 转义实例化方式 ---');
// 去掉注释行后再断言，避免注释里的说明文字触发误判
const codeOnly = jsFile
    .split('\n')
    .filter(line => !/^\s*\/\//.test(line))
    .join('\n');

assert(
    /new marked\.Marked\(\{/.test(jsFile),
    '应使用一次性 new marked.Marked({...}) 而非 parse 的 renderer 参数'
);
assert(
    !/marked\.parse\([^)]*renderer/.test(codeOnly),
    '不得把 partial renderer 传给 marked.parse（marked 11 会抛出方法缺失错误）'
);
assert(
    !/marked\.use\(/.test(codeOnly),
    '不得使用 marked.use（全局持久生效，会连带转义卡片数据的原始 HTML）'
);
assert(
    /allowRawHtml\s*\?\s*marked\.parse\(/.test(codeOnly),
    'allowRawHtml 分支应直接走未改动的 marked.parse'
);

if (errors === 0) {
    console.log('\n🎉 速查表复制保真与渲染安全测试全部通过！');
    process.exit(0);
}
console.error(`\n💥 发现 ${errors} 处错误`);
process.exit(1);
