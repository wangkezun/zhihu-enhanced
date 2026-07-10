import { injectCSS } from './css.js'
import { DomDispatcher } from './dispatcher.js'

import { SELECTOR as ds_SELECTOR, process as ds_process, init as ds_init } from './modules/direct-link.js'
import { SELECTOR as op_SELECTOR, process as op_process, init as op_init } from './modules/original-pic.js'
import { SELECTOR as td_SELECTOR, process as td_process, init as td_init } from './modules/time-display.js'
import { SELECTOR as bt_SELECTOR, process as bt_process } from './modules/block-type.js'
import { makeProcessor as bk_makeProcessor } from './modules/block-low-count.js'
import { SELECTOR_TITLE as bk_SELECTOR_TITLE, processTitle as bk_processTitle, SELECTOR_COMMENT as bk_SELECTOR_COMMENT, processComment as bk_processComment } from './modules/block-keywords.js'
import { SELECTOR as bu_SELECTOR, process as bu_process, SELECTOR_COMMENT as bu_SELECTOR_COMMENT, processComment as bu_processComment, init as bu_init } from './modules/block-users.js'
import { SELECTOR_YANXUAN as byx_SELECTOR, processYanXuan as byx_process, initYanXuan as byx_init } from './modules/block-type.js'

export function init() {
  injectCSS()

  DomDispatcher.register(ds_SELECTOR, ds_process)
  DomDispatcher.register(op_SELECTOR, op_process)
  DomDispatcher.register(td_SELECTOR, td_process)
  DomDispatcher.register(bt_SELECTOR, bt_process)
  DomDispatcher.register(bk_SELECTOR_TITLE, bk_processTitle)
  DomDispatcher.register(bk_SELECTOR_COMMENT, bk_processComment)
  DomDispatcher.register(bu_SELECTOR, bu_process)
  DomDispatcher.register(bu_SELECTOR_COMMENT, bu_processComment)
  DomDispatcher.register(byx_SELECTOR, byx_process)

  DomDispatcher.start()

  ds_init()
  op_init()
  td_init()
  bu_init()
  byx_init()

  bk_makeProcessor('Answer')()
  bk_makeProcessor('Article')()
  bk_makeProcessor('Pin')()
}
