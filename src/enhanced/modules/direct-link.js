export function setDirectLink(a) {
  a.href = decodeURIComponent(
    a.href.substring(a.href.indexOf("link.zhihu.com/?target=") + 23),
  );
}

export function directLink() {
  document
    .querySelectorAll(
      'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)',
    )
    .forEach(setDirectLink);
}

const LINK_SEL = 'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)';

export function processAddedLinks(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (node.matches?.(LINK_SEL)) setDirectLink(node);
  const links = node.querySelectorAll?.(LINK_SEL);
  if (links) for (const link of links) setDirectLink(link);
}

// 默认折叠邀请，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
