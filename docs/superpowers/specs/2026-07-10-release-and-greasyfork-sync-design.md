# Release + GreasyFork Auto-Sync Design

## Overview

Set up automated release pipeline: git tag → GitHub Actions → GitHub Release + GreasyFork webhook sync.

## Flow

```
git tag vX.Y.Z && git push --tags
  → GitHub Actions (on tag push v*)
    → npm install && npm run build
    → 校验 tag 版本 == meta.txt @version
    → 创建 GitHub Release，附带 dist/Zhihu-Enhanced.user.js
      → GitHub release webhook → GreasyFork 自动拉取 Release asset 更新脚本
```

## Changes

### 1. New file: `.github/workflows/release.yml`

GitHub Actions workflow, triggered on tag push (`v*`).

Steps:
1. Checkout code
2. Setup Node.js
3. `npm ci`
4. `npm run build`
5. Validate tag version matches `@version` in `src/meta.txt`
6. Create GitHub Release with `dist/Zhihu-Enhanced.user.js` attached

### 2. Update `src/meta.txt`

Add two lines to userscript header:

```
// @updateURL    https://greasyfork.org/zh-CN/scripts/586220-zhihu-enhancement-remake.update.js
// @downloadURL  https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js
```

- `@updateURL`: GreasyFork 的版本检查 URL（GreasyFork 自动检查更新用）
- `@downloadURL`: GitHub Release 下载地址（CDN 更快）

### 3. GreasyFork webhook 配置指引

#### Step 1: GreasyFork 侧 — 开启同步

1. 登录 GreasyFork → 进入脚本管理页面
2. 找到「自动更新」或「Syncing」设置
3. 设置 Source 为 GitHub，填入：
   - Repository: `wangkezun/zhihu-enhanced`
   - Branch: `main`
   - File: `dist/Zhihu-Enhanced.user.js`（或使用 release asset URL）
4. 保存

#### Step 2: GitHub 侧 — 添加 Webhook

1. 进入 GitHub repo `wangkezun/zhihu-enhanced` → Settings → Webhooks → Add webhook
2. 配置：
   - **Payload URL**: GreasyFork 提供的 webhook URL（从 GreasyFork webhook-info 页面获取）
   - **Content type**: `application/json`
   - **Secret**: 可选（GreasyFork 如提供 secret 则填入）
   - **Events**: 选择 "Let me select individual events" → 只勾选 **Releases**
3. 点击 Add webhook

#### Step 3: 验证

1. 创建一个 test tag 推送
2. 检查 GitHub Actions 是否成功运行并创建 Release
3. 检查 GreasyFork webhook-info 页面是否显示 "Automatic syncing"
4. 检查 GreasyFork 脚本页面版本是否更新

## Release 操作流程（日常使用）

```bash
# 1. 修改 src/meta.txt 里的 @version
vim src/meta.txt

# 2. 提交
git commit -am "chore: bump to vX.Y.Z"

# 3. 打 tag 并推送
git tag vX.Y.Z
git push && git push --tags
```

后续全自动：Actions build → Release → GreasyFork 同步。

## Notes

- `dist/` 保持 gitignored，build 产物只在 CI 和 Release 中存在
- GreasyFork webhook 仅在 release 事件时从 Release asset 拉取，不监听普通 push
- 版本号以 `src/meta.txt` 的 `@version` 为唯一 source of truth
