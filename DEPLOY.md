# GitHub Pages 部署指南

## 方法一：通过 GitHub 网页操作

### 1. 创建 GitHub 仓库

1. 登录 GitHub，点击右上角 `+` → `New repository`
2. 填写仓库信息：
   - **Repository name**: `markdown-guide`（或自定义名称）
   - **Description**: Markdown 语法速查手册
   - **Public** 选项（必须是公开仓库才能使用 GitHub Pages 免费版）
   - 不勾选 `Add a README file`（我们已经有了）

### 2. 上传文件到 GitHub

#### 使用 Git 命令行：

```bash
# 在项目目录下执行
cd "D:\PROJECT_ZZZZZZZZZ\markdown格式html"

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: Markdown 语法速查手册"

# 关联远程仓库（替换 yourusername 为你的 GitHub 用户名）
git remote add origin https://github.com/yourusername/markdown-guide.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

#### 或使用 GitHub Desktop（图形界面）：

1. 下载安装 [GitHub Desktop](https://desktop.github.com/)
2. 打开 GitHub Desktop，选择 `File` → `Add Local Repository`
3. 选择项目文件夹
4. 点击 `Publish repository` 发布到 GitHub

### 3. 启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 `Settings`（设置）
3. 左侧菜单找到 `Pages`
4. 在 `Source` 下拉菜单中选择：
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. 点击 `Save`

### 4. 等待部署完成

- 部署通常需要 1-3 分钟
- 刷新页面，会显示你的网站地址：
  ```
  Your site is live at https://yourusername.github.io/markdown-guide/
  ```

---

## 方法二：使用 GitHub CLI（命令行快速部署）

```bash
# 安装 GitHub CLI
# Windows: winget install GitHub.cli
# Mac: brew install gh

# 登录
gh auth login

# 创建仓库并推送
cd "D:\PROJECT_ZZZZZZZZZ\markdown格式html"
git init
git add .
git commit -m "Initial commit"
gh repo create markdown-guide --public --source=. --push

# 启用 GitHub Pages
gh api repos/:owner/markdown-guide/pages -X POST -f source[branch]=main -f source[path]=/
```

---

## 方法三：使用 Git + GitHub 网页操作（推荐新手）

### 步骤 1：初始化本地 Git

```bash
cd "D:\PROJECT_ZZZZZZZZZ\markdown格式html"
git init
git add .
git commit -m "Initial commit: Markdown 语法速查手册"
```

### 步骤 2：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库名 `markdown-guide`
3. 选择 `Public`
4. **不要** 勾选任何初始化选项
5. 点击 `Create repository`

### 步骤 3：关联并推送

复制 GitHub 显示的命令（类似下面）：

```bash
git remote add origin https://github.com/yourusername/markdown-guide.git
git branch -M main
git push -u origin main
```

### 步骤 4：启用 GitHub Pages

按照"方法一"的步骤 3 操作。

---

## 验证部署

访问 `https://yourusername.github.io/markdown-guide/` 查看效果。

如果遇到 404：
- 确认 `index.html` 在根目录
- 等待 2-3 分钟让 GitHub 完成构建
- 检查仓库是否为 Public

---

## 自定义域名（可选）

如果有自己的域名：

1. 在域名服务商添加 DNS 记录：
   ```
   CNAME    www    yourusername.github.io
   ```

2. 在 GitHub Pages 设置中填写 `Custom domain`

3. 勾选 `Enforce HTTPS`

---

## 更新网站内容

修改本地文件后：

```bash
cd "D:\PROJECT_ZZZZZZZZZ\markdown格式html"
git add .
git commit -m "更新内容描述"
git push
```

GitHub Pages 会自动重新部署（1-2 分钟）。

---

## 常见问题

### Q: 推送时要求输入用户名密码？

GitHub 已不支持密码认证，需要使用 Personal Access Token：

1. GitHub 头像 → `Settings` → `Developer settings` → `Personal access tokens` → `Tokens (classic)`
2. `Generate new token` → 勾选 `repo` 权限
3. 复制生成的 token
4. 推送时用户名输入 GitHub 用户名，密码输入 token

### Q: 样式/JS 文件加载 404？

检查路径是否正确：
- ✅ `./css/style.css`（相对路径）
- ❌ `/css/style.css`（绝对路径，可能导致问题）

### Q: 如何在 README 中添加预览链接？

在 `README.md` 中添加：
```markdown
## 在线预览

🔗 [https://yourusername.github.io/markdown-guide/](https://yourusername.github.io/markdown-guide/)
```

---

**祝您部署顺利！** 🚀
