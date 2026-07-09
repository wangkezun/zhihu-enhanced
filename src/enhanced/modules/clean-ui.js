import { menu_value } from '../../shared/menu-framework.js'


// 移除高亮链接
export const SELECTOR = 'a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]'

export function process(a) {
  const span = a.parentElement
  if (span) span.replaceWith(a.textContent)
}

export function initHighlight() {
  document.querySelectorAll(SELECTOR).forEach(process)
}

// 移除登录弹窗
let _loginObserver = null

export function startLoginMonitor() {
  if (location.hostname === 'zhuanlan.zhihu.com') {
    if (document.querySelector('.ColumnPageHeader-profile>.AppHeader-menu')) return
  } else {
    if (document.querySelector('.AppHeader-profile>.AppHeader-menu')) return
  }
  if (_loginObserver) return
  _loginObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType !== 1 || n.tagName !== 'DIV') continue
        if (n.querySelector('.signFlowModal')) {
          const btn = n.querySelector('.Button.Modal-closeButton.Button--plain')
          if (btn) btn.click()
        } else if (document.evaluate(
          '//button[text()="立即登录/注册"]', n, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue) {
          n.remove()
        }
      }
    }
  })
  _loginObserver.observe(document.body, { childList: true, subtree: true })
}

// 净化标题消息

export function cleanTitles() {
  if (!menu_value("menu_cleanTitles")) return;

  // 方案一
  const elTitle = document.head.querySelector("title");
  const original = elTitle.textContent;
  const observer = new MutationObserver(function () {
    if (elTitle.textContent != original) {
      // 避免重复执行
      elTitle.textContent = original;
    }
  });
  observer.observe(elTitle, { childList: true });

}

// 净化搜索热门

export function cleanSearch() {
  if (!menu_value("menu_cleanSearch")) return;

  const el = document.querySelector(".SearchBar-input > input");
  const observer = new MutationObserver((mutationsList) => {
    if (
      mutationsList[0].attributeName === "placeholder" &&
      mutationsList[0].target.placeholder != ""
    )
      mutationsList[0].target.placeholder = "";
  });
  el.placeholder = "";
  observer.observe(el, { attributes: true });
  document.head.appendChild(
    document.createElement("style"),
  ).textContent =
    '.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"], .AutoComplete-group > [id^="AutoComplete3-topSearch-"] {display: none !important;}';
}
