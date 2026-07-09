import { menu_value, refreshMenu } from '../../shared/menu-framework.js'
import { escapeHtml } from '../../shared/escape-html.js'

function getUsers() {
  return menu_value('menu_customBlockUsers') || []
}

function isBlockedAuthor(contentItem) {
  const zop = contentItem.dataset.zop
  if (!zop) return false
  try {
    return getUsers().includes(JSON.parse(zop).authorName)
  } catch (e) { return false }
}

export const SELECTOR = '.ContentItem.AnswerItem, .ContentItem.ArticleItem'

export function process(item) {
  if (isBlockedAuthor(item)) {
    const card = item.closest('.Card, .List-item, .TopicFeedItem')
    if (card) card.hidden = true
  }
}

export const SELECTOR_COMMENT = 'a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]'

export function processComment(img) {
  const users = getUsers()
  if (!users.length) return
  if (users.includes(img.alt)) {
    const el = img.closest('a')?.parentElement?.parentElement?.parentElement?.parentElement
    if (el) el.style.display = 'none'
  }
}

export function init() {
  document.querySelectorAll(SELECTOR).forEach(process)
}

// ========== 屏蔽按钮添加/删除（供 events.js 调用） ==========

export function isUserBlocked(name) {
  return getUsers().includes(name)
}

export function blockUsers_button_add(name, userid, reload) {
  if (!name || !userid) return
  if (!/^[\w-]+$/.test(userid)) return
  const users = getUsers()
  const idx = users.indexOf(name)
  if (idx === -1) {
    users.push(name)
    GM_setValue('menu_customBlockUsers', users)
    GM_xmlhttpRequest({
      url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,
      method: 'POST', timeout: 2000,
    })
    if (reload) setTimeout(() => location.reload(), 200)
    else GM_notification({ text: '该用户已被屏蔽~\\n刷新网页后生效~', timeout: 3000 })
  } else {
    GM_notification({ text: '该用户已经被屏蔽啦，无需重复屏蔽~', timeout: 3000 })
  }
}

export function blockUsers_button_del(name, userid, reload) {
  if (!name || !userid) return
  if (!/^[\w-]+$/.test(userid)) return
  const users = getUsers()
  const idx = users.indexOf(name)
  if (idx > -1) {
    users.splice(idx, 1)
    GM_setValue('menu_customBlockUsers', users)
    GM_xmlhttpRequest({
      url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,
      method: 'DELETE', timeout: 2000,
    })
    if (reload) setTimeout(() => location.reload(), 200)
    else GM_notification({ text: '该用户已取消屏蔽啦~\\n刷新网页后生效~', timeout: 3000 })
  } else {
    GM_notification({ text: '没有在屏蔽列表中找到该用户...', timeout: 3000 })
  }
}

export function customBlockUsers() {
  let now = ''
  getUsers().forEach(item => { now += '|' + item })
  const input = prompt(
    '编辑 [自定义屏蔽用户]\\n（不同用户名之间使用 "|" 分隔，例如：用户A|用户B|用户C ）',
    now.slice(1)
  )
  if (input === '') {
    GM_setValue('menu_customBlockUsers', [])
    refreshMenu()
  } else if (input != null) {
    GM_setValue('menu_customBlockUsers', input.split('|'))
    refreshMenu()
  }
}

// ========== 向下兼容包装 ==========

export function blockUsers(type) {
  if (!menu_value('menu_blockUsers')) return
  init()
  document.querySelectorAll(SELECTOR_COMMENT).forEach(processComment)
}
