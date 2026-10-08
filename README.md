# Markdown 语法速查手册

一个简洁的 Markdown 语法速查工具，专为技术笔记、论文阅读和博客写作设计。

## ✨ 特性

- 📝 **左右分栏展示**：原始格式 + 实时渲染效果对比
- 🔥 **按使用频率组织**：高频/中频/实用指南三层分类
- ✏️ **实时编辑器**：点击编辑按钮，即刻测试 Markdown 语法
- 🔍 **全局搜索**：快速定位所需语法
- 📋 **一键复制**：悬停显示复制按钮
- 📱 **响应式设计**：移动端友好的抽屉式导航
- 🎨 **简洁设计**：浅色冷色调，专注内容

## 🚀 快速开始

### 在线访问

🌐 **GitHub Pages 在线访问地址**：[https://guanlangzg.github.io/markdown-guide/](https://guanlangzg.github.io/markdown-guide/)

### 本地使用

1. 克隆仓库：
```bash
git clone https://github.com/guanlangzg/markdown-guide.git
cd markdown-guide
```

2. 打开 `index.html`：
   - 直接双击打开
   - 或使用本地服务器：
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js
     npx serve
     ```

3. 浏览器访问 `http://localhost:8000`

## 📂 项目结构

```
markdown-guide/
├── index.html          # 主页面
├── css/
│   └── style.css      # 样式文件
├── js/
│   └── app.js         # 交互逻辑
└── README.md          # 项目说明
```

## 🎯 内容组织

### 🔥 高频语法 (15项)
日常使用频率 90% 的核心语法：
- 标题、粗体/斜体、代码块
- 列表、链接、图片、表格
- 引用、分割线、数学公式等

### 📚 中频语法 (8项)
进阶场景使用的扩展语法：
- 表格高级用法
- Mermaid 流程图/时序图
- 折叠内容、脚注等

### 🔧 实用指南 (6项)
实战模板和最佳实践：
- 技术笔记模板
- 论文阅读模板
- Bug 调试模板
- 推荐/不推荐写法

## 🛠️ 技术栈

- **Marked.js** - Markdown 渲染
- **Prism.js** - 代码高亮
- **KaTeX** - 数学公式渲染
- **Mermaid** - 图表生成
- 纯 HTML/CSS/JavaScript - 无构建依赖

## 📖 使用场景

✅ **技术笔记**：学习算法、编程语言、框架时快速查询语法  
✅ **论文阅读**：记录论文时需要表格、公式、引用格式  
✅ **博客写作**：写技术博客时忘记某个 Markdown 语法  
✅ **项目文档**：编写 README、CONTRIBUTING 等文档

## 🌟 特色功能

### 实时编辑器
点击任意语法示例右上角的"✏️ 编辑"按钮，弹出实时编辑器：
- 左侧输入 Markdown
- 右侧实时预览渲染效果
- 支持代码高亮、数学公式、图表

### 智能搜索
顶部搜索框支持：
- 搜索语法标题（如"表格"）
- 搜索内容关键词（如"粗体"）
- 高亮匹配结果

### 响应式适配
- **桌面端**：左侧导航 + 右侧内容双栏布局
- **移动端**：抽屉式侧边栏 + 全宽内容区

## 🎨 设计理念

**简洁优先**：去除干扰，专注内容  
**效率至上**：按使用频率组织，快速定位  
**实用为王**：提供可复用的实战模板

配色方案采用浅色冷色调：
- 背景：#FAFBFC → #F6F8FA
- 主色：#0969DA (GitHub 蓝)
- 代码背景：#F6F8FA

## 📝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 添加新语法
在 `js/app.js` 的 `contentData` 对象中添加：

```javascript
'new-syntax': {
    title: '新语法',
    markdown: `# 示例代码`,
    tips: `<strong>💡 提示：</strong><ul><li>提示内容</li></ul>`
}
```

同时在 `index.html` 的导航菜单中添加对应链接。

## 📄 许可证

MIT License

## 🙏 鸣谢

灵感来源：
- [微信 Markdown 编辑器](https://md.doocs.org)
- [GitHub Markdown 文档](https://docs.github.com/en/get-started/writing-on-github)
- [Typora](https://typora.io)

---

**⭐ 如果这个项目对你有帮助，欢迎 Star！**
