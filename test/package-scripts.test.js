import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const packageJson = JSON.parse(await readFile('package.json', 'utf8'))

test('注册测试和本地发布命令', () => {
  assert.equal(packageJson.scripts.test, 'node --test')
  assert.equal(packageJson.scripts.release, 'node scripts/create-release.js')
})
