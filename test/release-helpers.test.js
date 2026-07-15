import assert from 'node:assert/strict'
import test from 'node:test'

import {
  assertReleaseDiff,
  compareReleaseTags,
  latestReleaseTag,
  metadataVersion,
  selectReleaseParents,
} from '../scripts/release-helpers.js'

test('按数字而不是字符串比较发布 tag', () => {
  assert.equal(compareReleaseTags('v4.0.19', 'v4.0.9'), 1)
  assert.equal(compareReleaseTags('v4.0.9', 'v4.0.19'), -1)
  assert.equal(compareReleaseTags('v4.0.19', 'v4.0.19'), 0)
})

test('只从有效发布 tag 中选择最高版本', () => {
  assert.equal(latestReleaseTag(['latest', 'v4.0.9', 'v4.0.19', 'v3.9.99']), 'v4.0.19')
  assert.equal(latestReleaseTag(['latest', 'release']), null)
})

test('上一发布已是 main 祖先时只保留 main 父提交', () => {
  assert.deepEqual(selectReleaseParents('main-sha', 'previous-sha', true), ['main-sha'])
})

test('上一发布不是 main 祖先时把它加入第二父提交', () => {
  assert.deepEqual(selectReleaseParents('main-sha', 'previous-sha', false), [
    'main-sha',
    'previous-sha',
  ])
  assert.deepEqual(selectReleaseParents('main-sha', null, false), ['main-sha'])
})

test('读取唯一的 userscript version', () => {
  assert.equal(metadataVersion('// @name test\n// @version      4.0.19\n'), '4.0.19')
  assert.throws(() => metadataVersion('// @name test\n'), /exactly one @version/)
  assert.throws(
    () => metadataVersion('// @version 4.0.19\n// @version 4.0.20\n'),
    /exactly one @version/,
  )
})

test('发布提交相对 main 只能新增根目录 userscript', () => {
  assert.doesNotThrow(() =>
    assertReleaseDiff('A\tZhihu-Enhanced.user.js\n', 'Zhihu-Enhanced.user.js'),
  )
  assert.throws(
    () =>
      assertReleaseDiff(
        'M\tsrc/meta.txt\nA\tZhihu-Enhanced.user.js\n',
        'Zhihu-Enhanced.user.js',
      ),
    /must only add/,
  )
})
