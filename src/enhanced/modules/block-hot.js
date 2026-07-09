import { menu_value } from '../../shared/menu-framework.js'
import { GlobalObserver } from '../../shared/global-observer.js'

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
  const block = () => {
    document.querySelectorAll('.HotList-list .HotItem').forEach(item => {
      if (!isQuestion(item)) item.remove()
    })
    fixRank()
  }
  block()
  GlobalObserver.add((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1 && n.classList?.contains('HotItem')) block()
      }
    }
  })
}
