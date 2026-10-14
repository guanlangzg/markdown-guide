const fs = require('fs');
const path = require('path');
const { CPP_TEMPLATES } = require('../../templates/templates-data.js');

console.log('--- 开始 C++ 编程学习模板规范与完整性测试 ---');

let errors = 0;

// 1. 验证模板数量
if (CPP_TEMPLATES.length !== 5) {
    console.error(`❌ 期望 5 套 C++ 模板，实际获得: ${CPP_TEMPLATES.length}`);
    errors++;
} else {
    console.log(`✅ 成功加载全部 5 套 C++ 专业学习与刷题模板`);
}

// 2. 验证字段完整性与关键词特征
const expectedKeywords = [
    { id: 'leetcode-roadmap', keywords: ['LeetCode', '艾宾浩斯', '破局信号词', 'string_view', 'Corner Cases', 'Do\'s & Don\'ts'] },
    { id: 'modern-feature', keywords: ['C++20', 'concept', 'requires', 'SFINAE', 'Do\'s & Don\'ts'] },
    { id: 'algorithm-mastery', keywords: ['LeetCode', 'std::list', 'splice', 'Corner Cases', '时间复杂度'] },
    { id: 'memory-systems', keywords: ['vptr', 'vtable', 'Offset', 'AddressSanitizer', 'Padding'] },
    { id: 'engineering-arch', keywords: ['Pimpl', 'Rule of 5', 'CMakeLists.txt', 'GoogleTest', 'unique_ptr'] }
];

expectedKeywords.forEach((rule, idx) => {
    const tmpl = CPP_TEMPLATES[idx];
    if (tmpl.id !== rule.id) {
        console.error(`❌ 模板 ID 不匹配: 期望 ${rule.id}, 实际 ${tmpl.id}`);
        errors++;
    }

    const missingKeywords = rule.keywords.filter(kw => !tmpl.markdown.includes(kw));
    if (missingKeywords.length > 0) {
        console.error(`❌ 模板 [${tmpl.id}] 缺少关键知识点:`, missingKeywords);
        errors++;
    } else {
        console.log(`✅ 模板 [${tmpl.id}] 知识点完整度校验通过 (包含 ${rule.keywords.join(', ')})`);
    }

    // 检查代码块反引号闭合
    const codeBlockCount = (tmpl.markdown.match(/```/g) || []).length;
    if (codeBlockCount % 2 !== 0) {
        console.error(`❌ 模板 [${tmpl.id}] 代码块反引号未成对闭合: ${codeBlockCount}`);
        errors++;
    } else {
        console.log(`✅ 模板 [${tmpl.id}] 代码块闭合性校验通过 (${codeBlockCount / 2} 个代码块)`);
    }
});

// 3. 检查生成的独立 HTML 文件
const expectedFiles = [
    'cpp-templates-showcase.html',
    'template-leetcode-roadmap.html',
    'template-cpp-feature.html',
    'template-cpp-algorithm.html',
    'template-cpp-memory.html',
    'template-cpp-architecture.html',
    'templates-data.js'
];

expectedFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', '..', 'templates', file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 缺失生成文件: ${file}`);
        errors++;
    } else {
        const stats = fs.statSync(filePath);
        if (stats.size < 1000) {
            console.error(`❌ 生成文件过小 (${stats.size} 字节): ${file}`);
            errors++;
        } else {
            console.log(`✅ 生成文件校验通过: ${file} (${stats.size} 字节)`);
        }
    }
});

if (errors > 0) {
    console.error(`\n❌ 测试失败，发现 ${errors} 处错误`);
    process.exit(1);
} else {
    console.log('\n🎉 所有 C++ 模板规范与完整性测试全部通过！');
}
