import { menu_value } from '../../shared/menu-framework.js';

// ========== 核心过滤函数（供 DomDispatcher process 使用） ==========

export function process(item) {
  if (!item) return
  if (location.pathname === '/search') {
    if (location.search.includes('type=content') === false) return
    if (item.href?.includes('/zvideo/') || item.href?.includes('video.zhihu.com')) {
      if (menu_value('menu_blockTypeVideo')) item.closest('.Card')?.remove()
    } else if (item.href?.includes('zhuanlan.zhihu.com')) {
      if (menu_value('menu_blockTypeArticle')) item.closest('.Card.SearchResult-Card').hidden = true
    } else if (item.href?.includes('/topic/')) {
      if (menu_value('menu_blockTypeTopic')) item.closest('.Card.SearchResult-Card').hidden = true
    } else if (item.href?.includes('/market/')) {
      if (menu_value('menu_blockTypeSearch')) item.closest('.Card.SearchResult-Card').hidden = true
    }
  } else if (location.pathname.includes('/question/')) {
    if (menu_value('menu_blockTypeVideo')) item.closest('.List-item').hidden = true
  } else {
    if (item.className === 'ContentItem PinItem') {
      if (menu_value('menu_blockTypePin')) item.closest('.Card.TopstoryItem').hidden = true
    } else if (item.href?.includes('/zvideo/') || item.href?.includes('video.zhihu.com')) {
      if (menu_value('menu_blockTypeVideo')) item.closest('.Card.TopstoryItem').hidden = true
    } else if (item.href?.includes('zhuanlan.zhihu.com')) {
      if (menu_value('menu_blockTypeArticle')) item.closest('.Card.TopstoryItem').hidden = true
    }
  }
}

// ========== 向下兼容的 blockType(type) 包装（仅做初始扫描，无 GlobalObserver） ==========

function getSelector(type) {
  if (type === 'search') return 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a'
  if (type === 'question') return '.VideoAnswerPlayer'
  if (type === 'follow') {
    const parts = []
    if (menu_value('menu_blockTypeFollowAgree')) parts.push('.TopstoryItem-isFollow .FeedSource-byline')
    if (menu_value('menu_blockTypeFollowQuestion')) parts.push('.ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)')
    return parts.join(',') || null
  }
  // index
  let sel = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion)'
  if (menu_value('menu_blockTypePin')) sel += ', .ContentItem.PinItem'
  return sel
}

export function blockType(type) {
  const sel = getSelector(type)
  if (!sel) return
  document.querySelectorAll(sel).forEach(process)
}

// ========== 屏蔽盐选内容 ==========

export const SELECTOR = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a, .VideoAnswerPlayer, .ContentItem.PinItem'

export const SELECTOR_YANXUAN = '.List-item, .Card.AnswerCard'

export function processYanXuan(item) {
  if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
    item.hidden = true
  }
}

export function initYanXuan() {
  document.querySelectorAll(SELECTOR_YANXUAN).forEach(processYanXuan)
}

