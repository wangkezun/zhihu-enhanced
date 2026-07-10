export const SELECTOR = 'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)'

export function process(a) {
  a.href = decodeURIComponent(a.href.substring(a.href.indexOf('link.zhihu.com/?target=') + 23))
}

export function init() {
  document.querySelectorAll(SELECTOR).forEach(process)
}
