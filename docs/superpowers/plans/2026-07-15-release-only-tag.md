# Release-Only Tag Publishing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 提供 `npm run release -- vX.Y.Z`，用不属于 `main` 的发布专用提交保存根目录 userscript，使 GitHub Release Asset 与 Greasy Fork Release webhook 同时可靠工作。

**Architecture:** 本地 Node.js 发布命令在临时 detached worktree 中注入版本、测试并构建，再通过独立 Git index 创建相对 `main` 只新增根目录 userscript 的发布提交。annotated tag 指向该提交并单独推送；tag 工作流重建产物、与 tag 文件逐字节比较后创建 GitHub Release。

**Tech Stack:** Node.js 22、Node test runner、Rollup、Git plumbing、GitHub Actions、GitHub CLI

## Global Constraints

- `main` 不跟踪 `dist/` 或根目录 `Zhihu-Enhanced.user.js`。
- `src/meta.txt` 在 `main` 与发布提交中保持 `0.0.0`，只有构建产物使用发布版本。
- Greasy Fork 同步 URL 固定为 `https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js`。
- 发布 tag 严格使用 `vX.Y.Z`，不得删除、移动或强制更新。
- 发布命令只推送新 tag，不修改 `main` 或创建长期发布分支。
- GitHub Actions 不执行 `git commit`、`git push`、`git tag` 或强制操作。
- 保留所有已有 tag 和 Release。

## File Map

- `scripts/set-release-version.js`：解析 tag，并只替换唯一的 `@version` 行。
- `scripts/release-helpers.js`：实现语义版本、父提交和发布树约束。
- `scripts/create-release.js`：执行前置检查、隔离构建、发布提交/tag 构造和推送。
- `test/set-release-version.test.js`：版本注入单元测试。
- `test/release-helpers.test.js`：发布规则单元测试。
- `test/create-release.test.js`：临时 Git 仓库端到端测试。
- `test/release-workflow.test.js`：Actions 工作流静态约束测试。
- `.github/workflows/release.yml`：只验证 tag 并创建 Release。
- `package.json`、`package-lock.json`：注册 `test` 和 `release` 命令。
- `.gitignore`：忽略根目录发布产物。
- `src/meta.txt`：将主分支版本改为 `0.0.0`。
- `docs/releasing.md`：发布与失败处理说明。

---

### Task 1: Tag 版本注入器

**Files:**
- Create: `scripts/set-release-version.js`
- Create: `test/set-release-version.test.js`

**Interfaces:**
- Produces: `versionFromTag(tag): string`、`replaceMetadataVersion(metadata, version): string`；CLI `node scripts/set-release-version.js <tag> <meta-path>`。

- [ ] **Step 1: 写失败测试**

测试覆盖：`v4.0.19 -> 4.0.19`；拒绝 `4.0.19`、`v4.0`、预发布 tag；只替换唯一 `@version`；缺失或重复时抛出包含 `exactly one @version` 的错误。

```js
import assert from 'node:assert/strict'
import test from 'node:test'
import { replaceMetadataVersion, versionFromTag } from '../scripts/set-release-version.js'

test('从发布 tag 提取严格语义版本', () => {
  assert.equal(versionFromTag('v4.0.19'), '4.0.19')
  for (const tag of ['4.0.19', 'v4.0', 'v4.0.19-beta', 'latest']) {
    assert.throws(() => versionFromTag(tag), /Invalid release tag/)
  }
})

test('只替换唯一的 userscript version 元数据', () => {
  const metadata = '// ==UserScript==\n// @version      0.0.0\n// ==/UserScript==\n'
  assert.equal(replaceMetadataVersion(metadata, '4.0.19'), metadata.replace('0.0.0', '4.0.19'))
  assert.throws(() => replaceMetadataVersion('// @name test\n', '4.0.19'), /exactly one @version/)
  assert.throws(() => replaceMetadataVersion('// @version 0.0.0\n// @version 0.0.0\n', '4.0.19'), /exactly one @version/)
})
```

- [ ] **Step 2: 验证测试因模块缺失而失败**

Run: `node --test test/set-release-version.test.js`  
Expected: FAIL，包含 `ERR_MODULE_NOT_FOUND`。

- [ ] **Step 3: 实现版本注入器**

实现严格正则 `/^v(\d+\.\d+\.\d+)$/`、唯一版本行检查，以及异步读写 CLI；CLI 输出提取后的版本，失败时设置非零退出码。

- [ ] **Step 4: 运行定向测试**

Run: `node --test test/set-release-version.test.js`  
Expected: 2 tests pass，0 fail。

### Task 2: 发布规则辅助函数

**Files:**
- Create: `scripts/release-helpers.js`
- Create: `test/release-helpers.test.js`

**Interfaces:**
- Consumes: `versionFromTag(tag)`。
- Produces: `compareReleaseTags(left, right)`、`latestReleaseTag(tags)`、`selectReleaseParents(head, previousCommit, previousIsAncestor)`、`metadataVersion(userscript)`、`assertReleaseDiff(diff, artifactPath)`。

- [ ] **Step 1: 写失败测试**

```js
test('按数字比较发布 tag 并选择最高有效版本', () => {
  assert.equal(compareReleaseTags('v4.0.19', 'v4.0.9'), 1)
  assert.equal(latestReleaseTag(['latest', 'v4.0.9', 'v4.0.19']), 'v4.0.19')
})

test('只在必要时加入上一发布提交', () => {
  assert.deepEqual(selectReleaseParents('main', 'previous', true), ['main'])
  assert.deepEqual(selectReleaseParents('main', 'previous', false), ['main', 'previous'])
  assert.deepEqual(selectReleaseParents('main', null, false), ['main'])
})

test('要求唯一版本且发布树只新增指定脚本', () => {
  assert.equal(metadataVersion('// @version 4.0.19\n'), '4.0.19')
  assert.throws(() => metadataVersion('// @name test\n'), /exactly one @version/)
  assert.doesNotThrow(() => assertReleaseDiff('A\tZhihu-Enhanced.user.js\n', 'Zhihu-Enhanced.user.js'))
  assert.throws(() => assertReleaseDiff('M\tsrc/meta.txt\nA\tZhihu-Enhanced.user.js\n', 'Zhihu-Enhanced.user.js'), /must only add/)
})
```

- [ ] **Step 2: 验证测试失败**

Run: `node --test test/release-helpers.test.js`  
Expected: FAIL，包含 `ERR_MODULE_NOT_FOUND`。

- [ ] **Step 3: 实现辅助函数**

版本段用 `BigInt` 比较；无有效 tag 时返回 `null`；上一发布不是 `main` 祖先时返回两个父提交；`metadataVersion` 必须匹配唯一 `// @version`；diff 必须精确等于 `A\t<artifact>\n`。

- [ ] **Step 4: 运行定向测试**

Run: `node --test test/release-helpers.test.js`  
Expected: 3 tests pass，0 fail。

### Task 3: 本地发布命令

**Files:**
- Create: `scripts/create-release.js`
- Create: `test/create-release.test.js`
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: Tasks 1–2 的所有接口。
- Produces: `npm run release -- vX.Y.Z`；只向 `origin` 推送 `refs/tags/vX.Y.Z`。

- [ ] **Step 1: 写临时 Git 仓库集成测试**

fixture 使用裸仓库作为 `origin`，源码 metadata 为 `0.0.0`，构建脚本生成 `dist/Zhihu-Enhanced.user.js`。测试必须断言：

```js
assert.equal(git(repo, 'rev-parse', 'HEAD'), mainBefore)
assert.equal(git(repo, 'status', '--porcelain'), '')
assert.equal(git(repo, 'cat-file', '-t', 'v1.0.0'), 'tag')
assert.equal(git(repo, 'rev-parse', 'v1.0.0^1'), mainBefore)
assert.equal(git(repo, 'diff', '--name-status', 'v1.0.0^1', 'v1.0.0^{}'), 'A\tZhihu-Enhanced.user.js')
assert.match(git(repo, 'show', 'v1.0.0:Zhihu-Enhanced.user.js'), /@version\s+1\.0\.0/)
```

另覆盖：第二次发布将旧发布提交作为必要第二父提交；远程旧 tag 与本地同名异物冲突时保留两端旧 ref；脏工作区、重复/倒退版本和构建失败均不创建远程 tag；push 失败保留本地 annotated tag 并提示精确重试命令。

- [ ] **Step 2: 验证测试因 CLI 缺失而失败**

Run: `node --test test/create-release.test.js`  
Expected: FAIL，子进程报告 `scripts/create-release.js` 不存在。

- [ ] **Step 3: 实现发布 CLI**

实现顺序固定为：

1. 解析严格 tag。
2. `git fetch --no-tags origin +refs/heads/main:refs/remotes/origin/main`。
3. 检查分支、工作区、HEAD 与远端 main。
4. 分别读取本地与远程 tag，不覆盖任一旧 ref。
5. 创建临时 detached worktree，执行 `npm ci`、版本注入、`npm test`、`npm run build`。
6. 用临时 `GIT_INDEX_FILE` 从 `main` 树开始，只加入 `Zhihu-Enhanced.user.js`。
7. 必要时从远端 fetch 上一发布 tag 的提交，选择父提交并用 `git commit-tree` 创建发布提交。
8. 校验 diff、第一父提交、产物内容和版本。
9. 创建 annotated tag，执行 `git push origin refs/tags/vX.Y.Z`。
10. finally 清理临时 worktree；push 失败保留本地 tag并打印重试命令。

- [ ] **Step 4: 注册命令**

在 `package.json` scripts 中加入：

```json
"release": "node scripts/create-release.js",
"test": "node --test"
```

同步更新 `package-lock.json` 根 package 的 scripts 无需记录，仅保持 npm 生成的结构不变。

- [ ] **Step 5: 运行集成测试**

Run: `node --test test/create-release.test.js`  
Expected: 7 tests pass，0 fail。

### Task 4: 主分支状态与 Actions 工作流

**Files:**
- Modify: `src/meta.txt`
- Modify: `.gitignore`
- Delete from Git index: `dist/Zhihu-Enhanced.user.js`
- Modify: `.github/workflows/release.yml`
- Create: `test/release-workflow.test.js`

**Interfaces:**
- Consumes: tag 根目录 `Zhihu-Enhanced.user.js` 和版本注入 CLI。
- Produces: 不写 Git refs、只校验并发布固定资产的 CI。

- [ ] **Step 1: 写工作流失败测试**

```js
const workflow = await readFile('.github/workflows/release.yml', 'utf8')

test('检出 tag 并注入 tag 版本', () => {
  assert.doesNotMatch(workflow, /\bref:\s*main\b/)
  assert.match(workflow, /node scripts\/set-release-version\.js "\$GITHUB_REF_NAME" src\/meta\.txt/)
})

test('测试、构建、校验并上传固定资产', () => {
  assert.match(workflow, /run:\s*npm test/)
  assert.match(workflow, /run:\s*npm run build/)
  assert.match(workflow, /cmp -s Zhihu-Enhanced\.user\.js dist\/Zhihu-Enhanced\.user\.js/)
  assert.match(workflow, /gh release view "\$GITHUB_REF_NAME"/)
  assert.match(workflow, /dist\/Zhihu-Enhanced\.user\.js/)
})

test('不写 Git refs', () => {
  assert.doesNotMatch(workflow, /git commit|git push|git tag(?:\s|$)|--force/)
})
```

- [ ] **Step 2: 验证旧工作流不满足约束**

Run: `node --test test/release-workflow.test.js`  
Expected: FAIL，旧工作流包含 `ref: main` 和 `git push origin main`。

- [ ] **Step 3: 改造主分支状态**

将 `src/meta.txt` 的 `@version` 改为 `0.0.0`；在 `.gitignore` 加入 `/Zhihu-Enhanced.user.js`；从 Git 索引删除 `dist/Zhihu-Enhanced.user.js`，但保留本地构建文件可由构建覆盖。

- [ ] **Step 4: 改造 Release workflow**

步骤依次为 checkout tag、Node 22、`npm ci`、版本注入、`npm test`、构建、校验产物版本、`cmp` tag 根目录文件、`gh release view` 防止覆盖、`softprops/action-gh-release@v2` 上传 `dist/Zhihu-Enhanced.user.js`。删除所有提交与 push main 的步骤。

- [ ] **Step 5: 运行工作流和全量测试**

Run: `node --test test/release-workflow.test.js && npm test`  
Expected: 所有测试通过，0 fail。

### Task 5: 发布文档与最终验证

**Files:**
- Create: `docs/releasing.md`

- [ ] **Step 1: 写发布文档**

文档必须给出 `npm run release -- vX.Y.Z`，说明 Node 22/Git/npm/推送权限前置条件，解释命令不修改 `main`，列出 Actions、Release Asset、Latest URL 和 webhook `updated_failed: []` 验证步骤，并明确 tag 推送后的失败只能用更高补丁版本修复。

- [ ] **Step 2: 运行最终验证**

Run:

```bash
npm test
npm run build
git diff --check
test "$(awk '/@version/{print $3; exit}' src/meta.txt)" = "0.0.0"
test -z "$(git ls-files dist Zhihu-Enhanced.user.js)"
rg -n "npm run release|Zhihu-Enhanced.user.js|updated_failed|不删除|不.*移动" docs/releasing.md
```

Expected: 测试与构建成功；diff 检查无输出；metadata 为 `0.0.0`；Git 不跟踪两个产物路径；文档命中发布命令、资产、webhook 和不可变性说明。

- [ ] **Step 3: 检查最终差异**

Run: `git status --short && git diff --stat && git diff -- . ':!docs/superpowers/specs/*' ':!docs/superpowers/plans/*'`  
Expected: 仅包含计划内文件，未修改 userscript 功能源码。
