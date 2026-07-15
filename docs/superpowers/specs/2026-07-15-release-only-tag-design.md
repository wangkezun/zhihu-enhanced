# 发布专用 Tag 与 Greasy Fork Webhook 兼容设计

**日期：** 2026-07-15  
**状态：** 已确认，待实施计划

## 背景

当前发布工作流在 `v*` tag 推送后检出 `main`，构建 `dist/Zhihu-Enhanced.user.js`，将构建产物提交回 `main`，再创建 GitHub Release。该方式让 CI 改写主分支，并要求 `src/meta.txt` 在主分支长期保存真实发布版本。

Greasy Fork 在处理 `release: published` webhook 时不会直接下载 GitHub Release Asset。它会根据同步 URL 推导文件路径，再从发布 tag 的 Git 文件树读取对应文件。当前同步 URL 对应的 tag 内路径为：

```text
Zhihu-Enhanced.user.js
```

因此，新 tag 的文件树必须在仓库根目录真实包含该 userscript。

## 目标

- 与 `zhihu-beautification` 的发布模型保持一致。
- `main` 只保存源码、测试、构建配置和发布工具，不跟踪构建产物。
- `src/meta.txt` 在 `main` 上使用 `0.0.0` 开发占位版本。
- 通过 `npm run release -- vX.Y.Z` 完成安全、可验证的发布。
- 发布 tag 创建后不删除、不移动、不强制更新。
- 发布 tag 的根目录包含 `Zhihu-Enhanced.user.js`，供 Greasy Fork webhook 读取。
- GitHub Actions 只验证 tag 并创建 Release，不提交或推送 Git refs。
- Release Asset 继续使用固定文件名和稳定的 Latest Release URL。

## 非目标

- 不修改已有 tag 或补写其文件树。
- 不在 `main` 或长期发布分支上保存构建产物。
- 不让 GitHub Actions 创建、移动或强制更新 tag。
- 不改变 userscript 的功能或 UI。
- 不自动操作 Greasy Fork 或 GitHub 的 webhook 设置；仓库侧只保证发布结构兼容。

## 方案选择

采用本地发布命令创建发布专用提交的方案。发布命令从干净且同步的 `main` 构建 userscript，创建一个不属于任何分支的提交；该提交的文件树等于 `main`，但额外包含根目录 `Zhihu-Enhanced.user.js`。annotated tag 指向该提交，并且只推送 tag。

不采用以下方案：

- GitHub Actions 创建提交和 tag：需要扩大 CI 对 Git refs 的写权限。
- 长期 `release` 分支：增加分支同步和构建产物维护成本。

## 仓库结构

### `main`

`main` 保存：

- 源码以及使用 `0.0.0` 的 `src/meta.txt`；
- 测试、Rollup 配置和 GitHub Actions 工作流；
- 发布版本注入器、发布辅助函数和本地发布命令。

`main` 不跟踪 `dist/` 或根目录 userscript。

### 本地发布入口

`package.json` 增加：

```json
{
  "scripts": {
    "release": "node scripts/create-release.js",
    "test": "node --test"
  }
}
```

使用方式：

```bash
npm run release -- vX.Y.Z
```

### 发布专用提交

发布提交的第一父提交是发布开始时的 `main` HEAD。其文件树相对第一父提交只新增：

```text
/Zhihu-Enhanced.user.js
```

如果上一发布 tag 不是当前 `main` 的祖先，则把上一发布 tag 的提交作为第二父提交，使相邻发布 tag 保持祖先关系，同时保留当前 `main` 作为第一父提交。

发布提交不属于本地或远端分支。推送 tag 时，Git 自动上传 tag 引用的提交及对象。

## 发布命令行为

### 前置检查

在产生 tag 前验证：

- 参数严格匹配 `vX.Y.Z`；
- 当前分支为 `main`；
- 工作区和索引干净；
- 本地 `HEAD` 与 `origin/main` 一致；
- 本地和远端均不存在目标 tag；
- 目标版本高于已有最高语义版本 tag。

### 隔离构建

命令在临时 detached worktree 中：

1. 使用锁文件安装依赖；
2. 从 tag 名向临时 `src/meta.txt` 注入版本；
3. 运行全部测试；
4. 运行 Rollup 构建；
5. 校验构建产物的 `@version`。

调用者的工作区、索引和 `main` 不被修改。

### 构造与验证发布提交

命令通过临时 Git index 从 `main` HEAD 的树构造发布树，仅加入根目录 userscript。临时修改后的 `src/meta.txt` 不进入发布树，因此 tag 内源码 metadata 仍为 `0.0.0`，只有根目录构建产物使用真实版本。

创建 tag 前验证：

- 第一父提交等于发布开始时的 `main` HEAD；
- 相对第一父提交只新增根目录 userscript；
- userscript 的 `@version` 等于 tag 版本；
- tag 内 userscript 内容等于隔离构建产物。

提交信息为 `release: vX.Y.Z`，annotated tag 名称和消息均为 `vX.Y.Z`。验证通过后仅推送：

```bash
git push origin refs/tags/vX.Y.Z
```

## GitHub Actions

`v*` tag push 触发发布工作流，步骤为：

1. 检出触发工作流的 tag，而不是 `main`；
2. 安装依赖；
3. 从 tag 名向 CI 工作区的 `src/meta.txt` 注入版本；
4. 运行测试和构建；
5. 校验构建产物版本与 tag 一致；
6. 比较根目录 `Zhihu-Enhanced.user.js` 与 `dist/Zhihu-Enhanced.user.js`，要求完全一致；
7. 确认同名 GitHub Release 不存在；
8. 创建 Release 并上传固定名称的 Asset。

工作流不得执行 `git commit`、`git push`、`git tag` 或强制更新操作。

## Greasy Fork 同步

Greasy Fork 继续使用：

```text
https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js
```

GitHub 仓库 webhook 只订阅 Release 事件。Greasy Fork 收到 `release: published` 后，根据同步 URL 从发布 tag 根目录读取 `Zhihu-Enhanced.user.js`。

## 错误处理与不可变性

- 前置检查、测试、构建或内容校验失败：不创建或推送 tag。
- 目标 tag 已存在：立即失败，不覆盖或移动。
- 本地 tag 创建后推送失败：保留本地 tag，并输出明确的重试命令。
- tag 推送成功但 CI 失败：保留 tag，修复后使用新的补丁版本发布。
- 同名 Release 已存在：工作流失败，不覆盖已有资产。
- 临时 worktree 尽可能在成功或失败时清理；清理失败时报告保留路径。

## 测试与验收

### 单元测试

- tag 格式、版本替换和版本递增校验；
- 发布父提交选择规则；
- userscript `@version` 读取校验；
- 发布提交仅新增指定产物的约束。

### 集成测试

在临时 Git 仓库验证：

- 发布提交相对 `main` 只新增根目录 userscript；
- `main`、当前工作区和索引保持不变；
- tag 是 annotated tag 且指向发布专用提交；
- 后续发布保持上一发布 tag 为祖先；
- 已存在 tag、脏工作区、版本倒退和构建失败不会推送 tag。

### 工作流约束测试

- 工作流检出 tag 并从 tag 注入版本；
- 工作流运行测试、构建、版本校验和内容比较；
- 工作流不写 Git refs；
- Release Asset 文件名保持 `Zhihu-Enhanced.user.js`。

### 最终验收

- `npm test` 通过；
- `npm run build` 通过；
- `src/meta.txt` 在 `main` 为 `0.0.0`；
- `dist/` 和根目录发布产物不被 `main` 跟踪；
- 使用后续新版本执行一次真实发布后，tag 根目录、Release Asset 及 Greasy Fork 版本一致。
