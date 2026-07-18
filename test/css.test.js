import assert from 'node:assert/strict'
import test from 'node:test'

import { injectCSS } from '../src/css.js'

test('操作栏透明背景规则匹配知乎当前的 ContentItem-actions 类名', () => {
  let injectedStyle

  globalThis.GM_getValue = () => false
  globalThis.location = {
    hostname: 'www.zhihu.com',
    pathname: '/',
  }
  globalThis.document = {
    createElement: () => ({}),
    head: {
      appendChild: (element) => {
        injectedStyle = element
      },
    },
  }

  injectCSS()

  assert.match(
    injectedStyle.textContent,
    /\.ContentItem-actions:not\(\.is-fixed\) \{background-color: transparent !important;\}/,
  )
  assert.doesNotMatch(injectedStyle.textContent, /\.RichContent-actions:not/)
})
