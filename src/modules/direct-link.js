export const SELECTOR = 'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)'

export function process(a) {
  try {
    const redirect = new URL(a.href)
    if (redirect.hostname !== 'link.zhihu.com') return

    const targetValue = redirect.searchParams.get('target')
    if (!targetValue) return

    const target = new URL(targetValue)
    if (target.protocol !== 'http:' && target.protocol !== 'https:') return
    a.href = target.href
  } catch (e) {
    // 链接格式或编码异常时保留知乎原始跳转链接。
  }
}

export function init() {
  document.querySelectorAll(SELECTOR).forEach(process)
}
