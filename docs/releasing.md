# 发布

## 前置条件

- 当前分支是 `main`，工作区和索引干净。
- 本地 `main` 已推送并与 `origin/main` 一致。
- 已安装 Node.js 22、npm、Git，并拥有向仓库推送 tag 的权限。
- 新版本使用严格的 `vX.Y.Z`，且高于所有现有发布 tag。

## 创建发布

```bash
npm run release -- vX.Y.Z
```

该命令在临时 worktree 中安装依赖、注入版本、运行测试并构建。随后，它创建一个相对 `main` 只新增根目录 `Zhihu-Enhanced.user.js` 的发布专用提交，创建 annotated tag，并且只推送该 tag。命令不会提交或推送 `main`。

tag push 会触发 `.github/workflows/release.yml`。工作流重新测试和构建，比较 tag 中的根目录脚本与 CI 构建产物，然后创建 GitHub Release 和固定名称 Asset。

## 验证

1. GitHub Actions 的 `Release` workflow 必须成功。
2. Release 必须包含 `Zhihu-Enhanced.user.js`。
3. 以下 URL 的 `@version` 必须等于新 tag：

   ```text
   https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js
   ```

4. GitHub webhook 的 `published` delivery 响应必须满足：

   ```json
   {
     "updated_failed": []
   }
   ```

   `updated_scripts` 必须包含目标 Greasy Fork 脚本。HTTP 200 本身不能证明同步成功。

## 失败处理

- 命令在推送前失败：修复问题后重新运行；不得手工创建不完整 tag。
- tag 已在本地创建但推送失败：按命令输出重试同一个精确 tag ref，不删除或重建 tag。
- tag 已推送但 CI 或 Greasy Fork 失败：保留且不移动 tag，修复后使用更高的新补丁版本。
- Release 已存在：不要覆盖资产，也不要移动 tag。
