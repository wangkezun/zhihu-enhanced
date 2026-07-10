# Release + GreasyFork Auto-Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up automated release pipeline: git tag → GitHub Actions build → GitHub Release + GreasyFork webhook sync.

**Architecture:** GitHub Actions workflow triggered on tag push (`v*`) builds the userscript with Rollup, creates a GitHub Release with the built `.user.js` attached. GreasyFork webhook listens for release events and pulls the script from the Release asset.

**Tech Stack:** GitHub Actions, Rollup, GreasyFork webhook

## Global Constraints

- `dist/` must remain gitignored — build artifacts only exist in CI and Releases
- Version source of truth: `src/meta.txt` `@version` field
- Tag format: `vX.Y.Z` (must match `@version` in meta.txt)
- Node.js version: 20 (LTS)

---

## File Structure

| File | Action | Purpose |
|------|--------|---------|
| `.github/workflows/release.yml` | Create | GitHub Actions release workflow |
| `src/meta.txt` | Modify | Add `@updateURL` and `@downloadURL` |

---

### Task 1: Create GitHub Actions Release Workflow

**Files:**
- Create: `.github/workflows/release.yml`

**Interfaces:**
- Consumes: `src/meta.txt` (reads `@version` for validation)
- Consumes: `package.json` (npm install/build)
- Produces: GitHub Release with `Zhihu-Enhanced.user.js` attached

- [ ] **Step 1: Create workflow directory**

```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Validate version
        run: |
          TAG_VERSION="${GITHUB_REF#refs/tags/v}"
          META_VERSION=$(grep -oP '(?<=@version\s)\S+' src/meta.txt)
          if [ "$TAG_VERSION" != "$META_VERSION" ]; then
            echo "ERROR: Tag version ($TAG_VERSION) != meta.txt version ($META_VERSION)"
            exit 1
          fi
          echo "Version validated: $TAG_VERSION"

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          files: dist/Zhihu-Enhanced.user.js
          generate_release_notes: true
```

- [ ] **Step 3: Verify workflow syntax**

Run: `cat .github/workflows/release.yml`
Expected: valid YAML, no syntax errors

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/release.yml
git commit -m "ci: add release workflow triggered on tag push"
```

---

### Task 2: Update Userscript Metadata

**Files:**
- Modify: `src/meta.txt:28-30` (add lines before `// ==/UserScript==`)

**Interfaces:**
- Consumes: nothing
- Produces: updated `@updateURL` and `@downloadURL` for userscript managers

- [ ] **Step 1: Add `@updateURL` and `@downloadURL` to `src/meta.txt`**

Insert two lines before the closing `// ==/UserScript==` line. The file currently ends at line 31. After the edit, lines 28-31 should look like:

```
// @namespace    https://github.com/wangkezun/zhihu-enhanced
// @supportURL   https://github.com/wangkezun/zhihu-enhanced
// @homepageURL  https://greasyfork.org/zh-CN/scripts/586220-zhihu-enhancement-remake
// @updateURL    https://greasyfork.org/zh-CN/scripts/586220-zhihu-enhancement-remake.update.js
// @downloadURL  https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js
// ==/UserScript==
```

- [ ] **Step 2: Verify the file**

Run: `grep -E '@(update|download)URL' src/meta.txt`
Expected: two lines matching `@updateURL` and `@downloadURL`

- [ ] **Step 3: Commit**

```bash
git add src/meta.txt
git commit -m "chore: add @updateURL and @downloadURL for GreasyFork sync"
```

---

### Task 3: GreasyFork Webhook Configuration (Manual)

This task is a manual configuration step — no code changes.

**Steps:**

1. 登录 GreasyFork → 进入脚本管理页面（`https://greasyfork.org/zh-CN/scripts/586220`）
2. 找到「自动更新」/「Syncing」设置，开启同步
3. 设置同步源：
   - Repository: `wangkezun/zhihu-enhanced`
   - Branch: `main`
   - File: `dist/Zhihu-Enhanced.user.js`（或使用 Release asset URL: `https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js`）
4. 保存后，GreasyFork 会提供一个 webhook URL
5. 进入 GitHub repo `wangkezun/zhihu-enhanced` → Settings → Webhooks → Add webhook
6. 配置：
   - **Payload URL**: GreasyFork 提供的 webhook URL
   - **Content type**: `application/json`
   - **Secret**: 如 GreasyFork 提供则填入
   - **Events**: 选择 "Let me select individual events" → 只勾选 **Releases**
7. 点击 Add webhook

**验证：** 推送一个 test tag，检查 GreasyFork webhook-info 页面是否显示 "Automatic syncing"，脚本版本是否更新。

---

## Verification Checklist

After all tasks complete:

- [ ] `.github/workflows/release.yml` exists and is valid YAML
- [ ] `src/meta.txt` has `@updateURL` and `@downloadURL`
- [ ] Workflow tag pattern matches `v*`
- [ ] Version validation step compares tag vs meta.txt
- [ ] Release step attaches `dist/Zhihu-Enhanced.user.js`
- [ ] GreasyFork webhook configured (manual)
- [ ] End-to-end test: push `v4.0.2` tag → Actions passes → Release created → GreasyFork updated
