# LearnEnglish

儿童英语拼读学习应用。前端为 Vue 3 + Vite，账户与学习数据由同源 Node 服务保护，SQLite 数据库默认保存在项目的私有目录中。

## 环境要求

- Node.js 22.12 或更新的 22.x 版本
- npm

## 首次初始化

```powershell
npm install
npm run auth:setup
```

按提示创建家庭唯一的家长账号，密码不会显示在终端，至少 12 位。再次运行 `npm run auth:setup` 可修改账号密码并使现有登录会话失效。

数据库默认位置：项目根目录下 `.private-data/learnenglish.sqlite`。该目录已加入 Git 忽略规则，Vite 开发服务器拒绝静态访问；生产服务器只公开 `dist`。若旧版默认数据库 `%LOCALAPPDATA%\LearnEnglish\learnenglish.sqlite` 存在，首次启动会复制到新位置并保留旧文件作备份。`DATABASE_PATH` 可以指向项目外部；若放在项目内，只允许 `.private-data` 目录。不要把该目录加入静态资源或提交 SQLite 文件。

## 本地开发

```powershell
npm run dev
```

前端使用 `http://127.0.0.1:5173`，API 使用 `127.0.0.1:3001`，Vite 将 `/api` 代理到 API。登录、学习进度和偏好设置存入项目 `.private-data` 内的 SQLite；首次登录时，旧浏览器学习记录会迁移到服务器并从 `localStorage` 删除。如果服务器与浏览器都有记录，会先询问保留哪一份。

## 无域名 IP 演示部署

仅用于快速预览，不启用真实鉴权或后端。演示数据保存在访问者自己的浏览器 `localStorage`，任何使用该浏览器的人都能查看和修改；不要存真实个人信息。刷新后需再次点击“游客体验”。

```bash
npm ci --include=dev
npm run build:demo
```

把 `dist` 目录中的文件上传到宝塔 IP 站点的网站根目录。Nginx 需要将 Vue Router 路由回退到 `index.html`：

```nginx
location / {
	try_files $uri $uri/ /index.html;
}
```

仅 IP + HTTP 可预览大部分页面；浏览器语音识别等能力通常需要 HTTPS 安全上下文。

## 宝塔正式部署

1. 在宝塔软件商店安装 Node.js 22.12 或更新的 22.x，并在面板添加网站域名及 HTTPS 证书。
2. 将项目上传到固定目录，例如 `/www/wwwroot/learnenglish`。通过 SSH 进入该目录，用 Node 项目服务实际运行用户执行：

```bash
cd /www/wwwroot/learnenglish
npm ci --include=dev
npm run auth:setup
npm run build
```

`auth:setup` 需要交互式终端，建议通过 SSH 执行；密码不会显示，至少 12 位。初始化命令和 Node 项目必须使用同一个 Linux 用户，否则该用户可能无法读写权限为 `0700` 的 `.private-data` 目录。

3. 在宝塔“Node 项目”中添加项目，项目目录设为 `/www/wwwroot/learnenglish`，启动命令设为 `npm start`，端口设为 `3001`。配置以下环境变量：

```text
NODE_ENV=production
PUBLIC_ORIGIN=https://你的域名
PORT=3001
```

`PUBLIC_ORIGIN` 必须与浏览器地址完全一致，不能带末尾斜杠。不要将 3001 端口开放给公网。

4. 在宝塔网站设置中添加反向代理，目标地址为 `http://127.0.0.1:3001`，让整个域名都代理到 Node 项目。确认 Nginx 保留 `Host`，并传递 `X-Forwarded-Proto: https`；如果宝塔模板没有设置，可在代理配置中添加：

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

项目由 Express 提供 `dist` 静态文件和 API，不要把网站运行目录直接设置成 `dist`，也不要使用 Vite 的 `preview` 命令作为生产服务。

如果要保留本机已有学习数据，将本机 `.private-data/learnenglish.sqlite` 用 SSH/SFTP 单独上传到服务器项目的 `.private-data/learnenglish.sqlite`，不要提交到 Git；上传前先停止 Node 项目，并确保文件及目录属于 Node 项目运行用户。

生产登录 cookie 为 `HttpOnly`、`Secure`、`SameSite=Strict`；登录失败有 IP 限流。API 不开放注册，数据读写必须有有效登录会话。其他反向代理也必须使用 HTTPS，并转发正确的 `Host` 与 `X-Forwarded-Proto`。

SQLite 数据文件是明文数据库，不是加密备份。依靠 `.private-data` 的 Vite 访问拒绝、Git 忽略和操作系统目录权限隔离；主机管理员仍可读取数据库。服务通过原子替换保存单文件数据库；仍建议定期停服后备份，并对备份文件另行加密和限制访问。
