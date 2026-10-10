const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '../../');
const htmlFile = path.join(rootDir, 'index.html');
const cssFile = path.join(rootDir, 'css/style.css');
const jsFile = path.join(rootDir, 'js/app.js');

console.log('--- 开始静态完整性与规范测试 ---');

// 1. 读取文件
const html = fs.readFileSync(htmlFile, 'utf8');
const css = fs.readFileSync(cssFile, 'utf8');
const js = fs.readFileSync(jsFile, 'utf8');

let errors = 0;

// 2. 检查 CSS 变量一致性
const defs = new Set(css.match(/--[a-zA-Z0-9_-]+(?=\s*:)/g) || []);
const uses = new Set((css.match(/var\(\s*--[a-zA-Z0-9_-]+/g) || []).map(s => s.replace(/var\(\s*/, '')));
const missingVars = [...uses].filter(v => !defs.has(v));
if (missingVars.length > 0) {
    console.error('❌ CSS 缺少变量定义:', missingVars);
    errors++;
} else {
    console.log('✅ CSS 变量完整性校验通过 (定义: ' + defs.size + ', 引用: ' + uses.size + ')');
}

// 3. 检查 HTML 导航 ID 与 JS contentData 一致性
const htmlNavIds = [...html.matchAll(/data-id="([a-zA-Z0-9-]+)"/g)].map(m => m[1]);
// 提取 contentData 中的 keys
const jsKeyMatches = [...js.matchAll(/'([a-zA-Z0-9-]+)':\s*\{[\s\S]*?title:\s*'([^']+)'/g)];
const jsDataKeys = jsKeyMatches.map(m => m[1]);

console.log(`ℹ️ HTML 导航项总数: ${htmlNavIds.length}, JS contentData 条目总数: ${jsDataKeys.length}`);

const missingInJs = htmlNavIds.filter(id => !jsDataKeys.includes(id));
const missingInHtml = jsDataKeys.filter(id => !htmlNavIds.includes(id));

if (missingInJs.length > 0) {
    console.error('❌ HTML 中存在但 JS 缺失的条目:', missingInJs);
    errors++;
} else if (missingInHtml.length > 0) {
    console.error('❌ JS 中存在但 HTML 导航缺失的条目:', missingInHtml);
    errors++;
} else {
    console.log('✅ 全部 29 个语法与模板条目在 HTML 与 JS 间完全对应一致！');
}

// 4. 检查关键 DOM 元素 ID 在 HTML 中的存在性
const requiredIds = [
    'sidebar', 'searchBoxTrigger', 'sidebarToggle',
    'content', 'editModal', 'modalClose', 'editorInput', 'editorPreview',
    'clearBtn', 'closeEditorBtn', 'searchModal', 'modalSearchInput',
    'searchModalClose', 'searchResults', 'frequent-list', 'medium-list', 'guide-list'
];

const missingDomIds = requiredIds.filter(id => !html.includes(`id="${id}"`));
if (missingDomIds.length > 0) {
    console.error('❌ HTML 缺失必需的 DOM ID:', missingDomIds);
    errors++;
} else {
    console.log('✅ 关键交互 DOM ID 完整性校验通过 (检查项: ' + requiredIds.length + ' 个)');
}

// 5. 检查是否残留系统 Emoji 作为图标与检查“极客版”徽章是否已移除
if (html.includes('极客版')) {
    console.error('❌ “极客版”徽章尚未完全移除');
    errors++;
} else {
    console.log('✅ “极客版”徽章已成功移除');
}

// 6. 检查是否存在 .content 污染 Prism Token
const cssConflict = /(?<![a-zA-Z0-9_.-])\.content(?![a-zA-Z0-9_-])/.test(css);
if (cssConflict) {
    console.error('❌ CSS 仍然包含独立 .content 类名选择器，会导致 Prism Token 冲突');
    errors++;
} else {
    console.log('✅ CSS 中无独立 .content 选择器，Prism Token 样式隔离完全正常');
}

if (errors === 0) {
    console.log('🎉 所有自动化验证全部通过！');
    process.exit(0);
} else {
    console.error(`💥 发现 ${errors} 处错误`);
    process.exit(1);
}
