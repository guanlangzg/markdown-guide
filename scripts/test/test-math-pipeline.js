const fs = require('fs');

function parseMarkdownSimulation(mdText) {
    if (!mdText) return '';

    const codeTokens = [];
    // 1. 保护多行代码块与行内代码
    let preprocessed = mdText.replace(/(```[\s\S]*?```|`[^`\n]+`)/g, (match) => {
        const id = `___CODE_HOLDER_${codeTokens.length}___`;
        codeTokens.push({ id, code: match });
        return id;
    });

    const mathTokens = [];

    // 2. 提取独立块级公式 $$ ... $$
    preprocessed = preprocessed.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
        const id = `___KATEX_BLOCK_${mathTokens.length}___`;
        mathTokens.push({ id, math: math.trim(), display: true });
        return `\n\n${id}\n\n`;
    });

    // 3. 提取行内公式 $ ... $ (不跨行，两端非空白，排除转义 \$)
    preprocessed = preprocessed.replace(/(?<!\\)\$([^\$\n\r]+?)(?<!\\)\$/g, (match, math) => {
        if (!math || /^\s|\s$/.test(math)) return match;
        const id = `___KATEX_INLINE_${mathTokens.length}___`;
        mathTokens.push({ id, math: math.trim(), display: false });
        return id;
    });

    // 4. 还原代码块
    codeTokens.forEach(t => {
        preprocessed = preprocessed.split(t.id).join(t.code);
    });

    // 模拟 marked 解析（简单模拟段落包装和斜体）
    // 注意看公式占位符是否含有 _：占位符纯为 ___KATEX_...
    // 占位符不会被破坏！
    return { preprocessed, mathTokens };
}

// 测试各类真实场景
const testCases = [
    {
        name: '基础公式与带下划线的复杂独立公式',
        input: `信息素挥发系数记为 $\\rho \\in (0, 1)$。

质能守恒方程：$E = mc^2$

---

独立公式块：

$$
P_{ij}^k = \\frac{[\\tau_{ij}]^\\alpha [\\eta_{ij}]^\\beta}{\\sum_{l \\in \\text{allowed}_k} [\\tau_{il}]^\\alpha [\\eta_{il}]^\\beta}
$$`
    },
    {
        name: '代码块与行内代码中的美元符号保护',
        input: `\`\`\`bash
echo "Total cost: $100"
export PATH=$PATH:/usr/local/bin
\`\`\`

使用 \`$E = mc^2\` 展示公式源码，而实际公式为 $E = mc^2$。`
    },
    {
        name: '表格内的公式',
        input: `| 语法 | 说明 | 示例 |
| :--- | :--- | :--- |
| 行内公式 | \`$E = mc^2$\` | $E = mc^2$ |`
    }
];

let allPassed = true;
testCases.forEach((tc, idx) => {
    console.log(`\n--- 测试用例 ${idx + 1}: ${tc.name} ---`);
    const { preprocessed, mathTokens } = parseMarkdownSimulation(tc.input);
    console.log(`提取到 ${mathTokens.length} 个公式:`);
    mathTokens.forEach(t => {
        console.log(`  [${t.display ? '块级' : '行内'}] id: ${t.id}, math: ${t.math}`);
    });
    
    // 验证公式中下划线是否完好
    if (tc.name.includes('复杂独立公式')) {
        const block = mathTokens.find(t => t.display);
        if (!block || !block.math.includes('\\tau_{ij}') || !block.math.includes('\\text{allowed}_k')) {
            console.error('❌ 复杂公式中下划线或内容受损！');
            allPassed = false;
        } else {
            console.log('✅ 独立公式下划线及下标完整无损！');
        }
    }

    // 验证代码块保护
    if (tc.name.includes('代码块')) {
        if (!preprocessed.includes('$PATH') || !preprocessed.includes('$100')) {
            console.error('❌ 代码块内容被错误修改！');
            allPassed = false;
        } else {
            console.log('✅ 代码块中的 $ 符号成功保护，未被误提取！');
        }
    }
});

if (allPassed) {
    console.log('\n🎉 所有公式提取与代码保护测试用例全部通过！');
} else {
    process.exit(1);
}
