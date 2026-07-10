import { menu_value } from '../shared/menu-framework.js'
import { GlobalObserver } from '../shared/global-observer.js'

export function blockHotOther() {
  if (!menu_value('menu_blockTypeLiveHot')) return
  const isQuestion = (hotItem) => {
    const link = hotItem.querySelector('.HotItem-content a')
    return link && /\/question\/\d+/.test(link.href)
  }
  const fixRank = () => {
    document.querySelectorAll('.HotList-list .HotItem:not([hidden])').forEach((item, i) => {
      const rank = item.querySelector('.HotItem-index .HotItem-rank')
      if (rank) rank.innerText = i + 1
    })
  }
  const processItem = (item) => {
    if (!isQuestion(item)) item.remove()
  }
  document.querySelectorAll('.HotList-list .HotItem').forEach(processItem)
  fixRank()

  let rankUpdatePending = false
  const scheduleRankUpdate = () => {
    if (rankUpdatePending) return
    rankUpdatePending = true
    queueMicrotask(() => {
      rankUpdatePending = false
      fixRank()
    })
  }

  GlobalObserver.add((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== Node.ELEMENT_NODE) continue
        const items = n.matches?.('.HotList-list .HotItem')
          ? [n, ...n.querySelectorAll('.HotList-list .HotItem')]
          : n.querySelectorAll?.('.HotList-list .HotItem')
        if (!items?.length) continue
        items.forEach(processItem)
        scheduleRankUpdate()
      }
    }
  })
}
