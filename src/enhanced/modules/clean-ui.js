import { GlobalObserver } from '../../shared/global-observer.js';
import { menu_value } from '../../shared/menu-framework.js';
import { getXpath } from '../../shared/dom-utils.js';

export function cleanHighlightLink() {
  if (!menu_value("menu_cleanHighlightLink")) return;
  const callback = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1 || target.tagName != "A") continue;
        if (
          target.dataset.zaNotTrackLink &&
          target.href.includes("https://zhida.zhihu.com/search?")
        ) {
          target.parentElement.replaceWith(target.textContent);
        }
      }
    }
  };
  GlobalObserver.add(callback);

  // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
  document
    .querySelectorAll(
      'span > a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]',
    )
    .forEach((e) => e.parentElement.replaceWith(e.textContent));
}

// 屏蔽盐选内容

export function removeLogin() {
  const removeLoginModal = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        if (target.querySelector(".signFlowModal")) {
          let button = target.querySelector(
            ".Button.Modal-closeButton.Button--plain",
          );
          if (button) button.click();
        } else if (getXpath('//button[text()="立即登录/注册"]', target)) {
          target.remove();
        }
      }
    }
  };

  // 检查是否登录
  function isLoggedIn() {
    if (location.hostname === "zhuanlan.zhihu.com") {
      return !!document.querySelector(".ColumnPageHeader-profile>.AppHeader-menu");
    }
    return !!document.querySelector(".AppHeader-profile>.AppHeader-menu");
  }

  // 未登录时才会监听并移除登录弹窗
  if (!isLoggedIn()) {
    GlobalObserver.add(removeLoginModal);
    const loginButton = getXpath('//button[text()="登录/注册"]');
    if (loginButton) {
      loginButton.outerHTML =
        '<a class="Button AppHeader-login Button--blue" href="https://www.zhihu.com/signin" target="_blank">登录/注册</a>';
    }
    if (location.hostname !== "zhuanlan.zhihu.com") {
      // 屏蔽问题页中间的登录提示
      document.head.appendChild(
        document.createElement("style"),
      ).textContent =
        ".Question-mainColumnLogin, button.AppHeader-login {display: none !important;}";
    }
  }
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

// 快捷关闭悬浮评论（监听点击事件，点击网页两侧空白处）

export function closeFloatingComments() {
  const closeFloatingCommentsModal = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        let button = document.querySelector('button[aria-label="关闭"]');
        if (button) {
          button.parentElement.parentElement.onclick = function (event) {
            if (event.target.parentElement == this) {
              button.click();
            }
          };
        }
      }
    }
  };
  GlobalObserver.add(closeFloatingCommentsModal);
}

// 自定义 urlchange 事件（用来监听 URL 变化）
