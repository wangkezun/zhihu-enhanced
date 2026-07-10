// ==UserScript==
// @name         Zhihu enhancement Remake
// @name:zh-CN   知乎增强 Remake
// @name:zh-TW   知乎增強 Remake
// @name:ru      Улучшение Zhihu Remake
// @version      4.0.5
// @author       wangkezun
// @description  A more personalized Zhihu experience~
// @description:zh-CN  移除登录弹窗、屏蔽指定类别（视频、盐选、文章、想法、关注[赞同/关注了XX]等）、屏蔽低赞/低评回答、屏蔽用户、屏蔽关键词、默认收起回答、快捷收起回答/评论（左键两侧）、快捷回到顶部（右键两侧）、区分问题文章、移除高亮链接、净化搜索热门、净化标题消息、展开问题描述、显示问题作者、默认高清原图（无水印）、置顶显示时间、完整问题时间、直达问题按钮、默认站外直链...
// @description:zh-TW  移除登錄彈窗、屏蔽指定類別（視頻、鹽選、文章、想法、關注[贊同/關注了XX]等）、屏蔽低贊/低評回答、屏蔽用戶、屏蔽關鍵詞、默認收起回答、快捷收起回答/評論、快捷回到頂部、區分問題文章、移除高亮鏈接、默認高清原圖（無水印）、默認站外直鏈...
// @description:ru  Более персонализированный опыт пользования сайтом Zhihu~
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @exclude      https://www.zhihu.com/signin*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFo0lEQVR4nJWXT4hlVxHGf9/tJyYuzJtxIziQN8RBFDEtIWB0MW+Mi4CIk4UuAtqvAxPcqAkJRNxMshDUTc8s3TjdO3c9QbIKod+o4CIuZtRFDEi3EIgEM/02jpPIPZ+LqnPv6TeB4IHLPfeeP1X11VdV54i2vewtOhaITcQDdEgdthAdINAGNkgd0IEVbwR17rAmx1TniSVil6e0V0UKgJc8pWdfG5yvwqRhs1FQIyQ3trvcpxsVGd4xf/gelO24yV0usK1VB6APOMDMKSADBShIBWNwj1WwjClAzLEL0CMc86jj9cl/LgRs8ZjCJvexH5r/xAuJa260TatG6DosIee4lHO0ZnWDXH5bgYQ8uql122Iis2Xnj4JtRH675AIHMAQKuAsdrLV3dYXTwQ7Bir1jrzJ+Wyw698yVkLmgxgVg+PGjcPw8zD6JKcgFUcD94AoNa0eXkO600lVqXOPqPrPZNT6tjylYBRZfgp0n4GgFR7dDkEieeNys6ZPCBq4MCicXdFLWdIKBHtMFfC4JY8Hf/nxEyY0jmD+IM7Cgy77gxtto+jF4+NMj8+tY84YOLd8JnZJPpiDxI7shUigimJ2Gwxf5yLb9aryvffOj5+pXKbzJDxOVoIw7REkLhedno7+6CzffgdkpmE3z+5/Nrq7JJMfejc3bNj+TnT4tTyRtmLiAlARKliK09Uis2fsTPPcqvvwNdPlxuP4mbO+P4aQObz0cG958F77+mxMJh9kDcPh0IpCcUIerqycYuc8FGX7zczB/CI6O4cofAA9GjuRjUFhN2I0hmISlNFCUzCGMSkxqfFJw3XD6cXjuOt57A1YfpM/KSSEqY9zLo4w0psLsVnknyhkVYgNPMlRQh+qE63+GSsaBoK2VJcdTKTcKDLmhA/o1BDKFKzKl3aOJcoNBu3SHAAe4ahwwKgBkFRhdMMIc6Chzf+VphruT6urwZBh1aEQXjL/2fZidHoVP74/3xS8GP1IBLQ/hxuGonCLFxpZKjtTpDpRrSjYwYa2p4GcvoPm59ZFU5L54apvP4MZhY2XJMh1u+DB0Qk7ybaIR2EGHl34LV1/HGU5CsP8MbH4Gnvw1vPJX7G48pGw/OiLgyoEKf4PAYH0f6VtdIOAmlwCwugOrO0mDOHRodjrG/vGv9HvyQEprRwQjPB3rWg5oXBNR0A+Vf2wtJwDZaP5ZPL0fVv+B4zto5yJjKK6R0CUPMI7K6jUEsgpKGYqTwXpneGiExKnR4iuZ6d6Ggx/C7FNwdBuu/C6ROBmiUU/6PDuWhh9tEssQHxFQVlmP3wKfPY23Hotfe3+Eq8tYf/kJmE2jdK8pIPWJTDmJAFmq1We57iNnDQol9HWFDbr8rfg8eg+Wb8KV19DyrQjLa08hNal4/hD4l3D+LNr/HvhncPhC49+Ev5475DHfeUjjGrPt4jHY+upgvZOAPL0XRJ2fgwdPNS7IdvADuPgF7m15UDEDOhaXXKQT6RyAzTNw8DxMPxHWn/1p6ObMjc8+DjvfhVMvwOr9EcLjnwc6V38PL78Gq7vYG8PBxAqTzUbInJwoGtlbfA3tfCeEL/8G23sZEaAMIV99HW2egdW/m9Is/Mpf0O4bsPw7tY4os+OAbuUXHZKe8W3gVDLeEjr/uTgRHb0Hy7fyf0PUQd2YH4eZesrRmMBqDhF5gRFiIxSRQoGJxS0Kc8XNRSasHlqStOZ3Nf1aKVQzIKkMzeHTGZaRoEzWmyxIyw6zW6FRQ6c2NapC5pCjuAl5+Od7Tru41vxagEpTOeN0LAq7oe0lH0DeC6uVH0Lito03kbVUnmSrp+yE/967Y8dNfqEvdwD+L09a3BrgbqA/IZS4H4osLE3mHlDzYB30iUJ7XwwklrzPhXWk4ZIXdGxROM//g0ZbQrKXVza0EQcQiWNvcIuOXXbG6/n/AAwhLDO9HaqBAAAAAElFTkSuQmCC
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_info
// @grant        window.onurlchange
// @sandbox      JavaScript
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://github.com/wangkezun/zhihu-enhanced
// @supportURL   https://github.com/wangkezun/zhihu-enhanced
// @homepageURL  https://greasyfork.org/zh-CN/scripts/586220-zhihu-enhancement-remake
// @updateURL    https://greasyfork.org/zh-CN/scripts/586220-zhihu-enhancement-remake.update.js
// @downloadURL  https://github.com/wangkezun/zhihu-enhanced/releases/latest/download/Zhihu-Enhanced.user.js
// ==/UserScript==

// HTML 转义
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 初始化菜单默认值到 GM 存储
// 支持新的对象格式: { key, default, children?: [...] }
function initMenuValues(menu_ALL) {
  for (const item of menu_ALL) {
    if (GM_getValue(item.key) == null) {
      GM_setValue(item.key, item.default);
    }
    if (item.children) {
      for (const child of item.children) {
        if (GM_getValue(child.key) == null) {
          GM_setValue(child.key, child.default);
        }
      }
    }
  }
}

// 返回菜单值（直接读取 GM 存储）
function menu_value(key) {
  return GM_getValue(key);
}

// 菜单注册器注入：入口脚本注册实现，功能模块通过 refreshMenu() 触发重新注册
let menuRegistrar = null;
function setMenuRegistrar(fn) {
  menuRegistrar = fn;
}
function refreshMenu() {
  if (menuRegistrar) menuRegistrar();
}

// 脚本设置弹窗
// children: [{ key, label, tips?, inputType?: 'text' }]
function menu_setting(title, tips, children) {
  // 防止重复打开叠加多个弹窗/遮罩
  document
    .querySelectorAll(".zhihuE_SettingBackdrop_1, .zhihuE_SettingStyle")
    .forEach(function (el) {
      el.remove();
    });
  let _html = `<style class="zhihuE_SettingStyle">.zhihuE_SettingRoot {position: absolute;top: 50%;left: 50%;-webkit-transform: translate(-50%, -50%);-moz-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);-o-transform: translate(-50%, -50%);transform: translate(-50%, -50%);width: auto;min-width: 400px;max-width: 600px;height: auto;min-height: 150px;max-height: 400px;color: #535353;background-color: #fff;border-radius: 3px;}
.zhihuE_SettingBackdrop_1 {position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 203;display: -webkit-box;display: -ms-flexbox;display: flex;-webkit-box-orient: vertical;-webkit-box-direction: normal;-ms-flex-direction: column;flex-direction: column;-webkit-box-pack: center;-ms-flex-pack: center;justify-content: center;overflow-x: hidden;overflow-y: auto;-webkit-transition: opacity .3s ease-out;transition: opacity .3s ease-out;}
.zhihuE_SettingBackdrop_2 {position: absolute;top: 0;right: 0;bottom: 0;left: 0;z-index: 0;background-color: rgba(18,18,18,.65);-webkit-transition: background-color .3s ease-out;transition: background-color .3s ease-out;}
.zhihuE_SettingRoot .zhihuE_SettingHeader {padding: 10px 20px;color: #fff;font-weight: bold;background-color: #3994ff;border-radius: 3px 3px 0 0;}
.zhihuE_SettingRoot .zhihuE_SettingMain {padding: 10px 20px;border-radius: 0 0 3px 3px;}
.zhihuE_SettingHeader span {float: right;cursor: pointer;}
.zhihuE_SettingMain input {margin: 10px 6px 10px 0;vertical-align:middle;}
.zhihuE_SettingMain input[type=text] {margin: 5px 6px 5px 0;padding-block: 0;}
.zhihuE_SettingMain input[name=zhihuE_Setting_Checkbox] {cursor: pointer;}
.zhihuE_SettingMain label {margin-right: 20px;user-select: none;cursor: pointer;vertical-align:middle;}
.zhihuE_SettingMain hr {border: 0.5px solid #f4f4f4;}
.zhihuE_SettingMain p {white-space: pre-line;}
[data-theme="dark"] .zhihuE_SettingRoot {color: #adbac7;background-color: #343A44;}
[data-theme="dark"] .zhihuE_SettingHeader {color: #d0d0d0;background-color: #2D333B;}
[data-theme="dark"] .zhihuE_SettingMain hr {border: 0.5px solid #2d333b;}</style>
        <div class="zhihuE_SettingBackdrop_1"><div class="zhihuE_SettingBackdrop_2"></div><div class="zhihuE_SettingRoot">
            <div class="zhihuE_SettingHeader">${escapeHtml(title)}<span class="zhihuE_SettingClose" title="点击关闭"><svg class="Zi Zi--Close Modal-closeIcon" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M13.486 12l5.208-5.207a1.048 1.048 0 0 0-.006-1.483 1.046 1.046 0 0 0-1.482-.005L12 10.514 6.793 5.305a1.048 1.048 0 0 0-1.483.005 1.046 1.046 0 0 0-.005 1.483L10.514 12l-5.208 5.207a1.048 1.048 0 0 0 .006 1.483 1.046 1.046 0 0 0 1.482.005L12 13.486l5.207 5.208a1.048 1.048 0 0 0 1.483-.006 1.046 1.046 0 0 0 .005-1.482L13.486 12z" fill-rule="evenodd"></path></svg></span></div>
            <div class="zhihuE_SettingMain"><p>${escapeHtml(tips)}</p><hr>`;
  for (const child of children) {
    if (child.inputType === "text") {
      _html += `<label>${child.tips || child.label}：<input name="${child.key}" type="text" oninput="value=value.replace(/[^\\d]/g,'')" value="${escapeHtml(GM_getValue(child.key))}" style="width: 50px;"></label><br>`;
    } else if (GM_getValue(child.key)) {
      _html += `<label><input name="zhihuE_Setting_Checkbox" type="checkbox" value="${child.key}" checked="checked">${child.label}</label><br>`;
    } else {
      _html += `<label><input name="zhihuE_Setting_Checkbox" type="checkbox" value="${child.key}">${child.label}</label><br>`;
    }
  }
  _html += `</div></div></div>`;
  document.body.insertAdjacentHTML("beforeend", _html);
  // insertAdjacentHTML 是同步的，插入后立即绑定事件
  const doc = document.querySelector(".zhihuE_SettingBackdrop_1");
  doc.querySelector(".zhihuE_SettingClose").onclick = function () {
    this.parentElement.parentElement.parentElement.remove();
    document.querySelector(".zhihuE_SettingStyle").remove();
  };
  doc.querySelector(".zhihuE_SettingBackdrop_2").onclick = function (event) {
    if (event.target == this) {
      document.querySelector(".zhihuE_SettingClose").click();
    }
  };
  doc
    .querySelectorAll("input[name=zhihuE_Setting_Checkbox]")
    .forEach(function (checkBox) {
      checkBox.addEventListener("click", function () {
        GM_setValue(this.value, this.checked);
      });
    });
  doc.querySelectorAll("input[type=text]").forEach(function (textInput) {
    textInput.onchange = function () {
      GM_setValue(this.name, this.value);
    };
  });
}

// 全局统一 MutationObserver 管理器（合并所有 document 级 childList+subtree 观察器）
const GlobalObserver = (function () {
  const handlers = new Set();
  let observer = null;

  function init() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const handler of handlers) {
        try {
          handler(mutations);
        } catch (e) {
          console.warn("GlobalObserver error:", e);
        }
      }
    });
    observer.observe(document, { childList: true, subtree: true });
  }

  return {
    add(handler) {
      handlers.add(handler);
      if (!observer) init();
      return handler;
    },
    remove(handler) {
      handlers.delete(handler);
    },
  };
})();

// URL 变化事件管理器（避免重复注册 urlchange 监听器）
const UrlChangeManager = (function () {
  const handlers = new Set();
  let initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;
    window.addEventListener("urlchange", () => {
      for (const handler of handlers) {
        try {
          handler();
        } catch (e) {
          console.warn("UrlChange error:", e);
        }
      }
    });
  }

  return {
    add(handler) {
      if (!initialized) init();
      handlers.add(handler);
      return handler;
    },
    remove(handler) {
      handlers.delete(handler);
    },
  };
})();

// 自定义 urlchange 事件（用来监听 URL 变化）
let urlChangeEventPatched = false;
function addUrlChangeEvent() {
  if (urlChangeEventPatched) return;
  urlChangeEventPatched = true;

  history.pushState = ((f) =>
    function pushState() {
      var ret = f.apply(this, arguments);
      window.dispatchEvent(new Event("pushstate"));
      window.dispatchEvent(new Event("urlchange"));
      return ret;
    })(history.pushState);

  history.replaceState = ((f) =>
    function replaceState() {
      var ret = f.apply(this, arguments);
      window.dispatchEvent(new Event("replacestate"));
      window.dispatchEvent(new Event("urlchange"));
      return ret;
    })(history.replaceState);

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("urlchange"));
  });
}

// 获取元素是否在可视区域（完全可见）
function isElementInViewport(el) {
  let rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 获取元素是否在可视区域（部分可见）
function isElementInViewport_(el) {
  let rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}

// ========== 核心函数，不绑定事件 ==========

// 收起当前回答 + 评论
function collapseCurrentAnswer() {
  let rightButton = document.querySelector(
    ".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom"
  );
  if (rightButton) {
    let ccBtn = rightButton.querySelector(
      "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
    );
    if (ccBtn && ccBtn.textContent.includes("收起评论")) ccBtn.click();
    rightButton = rightButton.querySelector(
      ".ContentItem-rightButton[data-zop-retract-question]"
    );
    if (rightButton) rightButton.click();
  } else {
    let found = false;
    for (const el of document.querySelectorAll(
      ".ContentItem-rightButton[data-zop-retract-question]"
    )) {
      if (isElementInViewport(el)) {
        let ccBtn = el.parentNode.querySelector(
          "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
        );
        if (ccBtn && ccBtn.textContent.includes("收起评论")) {
          ccBtn.click();
          if (!isElementInViewport(ccBtn)) scrollTo(0, el.offsetTop + 50);
        }
        el.click();
        found = true;
        break
      }
    }
    if (!found) {
      for (const el of document.querySelectorAll(
        ".List-item, .Card.AnswerCard, .Card.TopstoryItem"
      )) {
        if (isElementInViewport_(el)) {
          let ccBtn = el.querySelector(
            "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
          );
          if (ccBtn && ccBtn.textContent.includes("收起评论")) ccBtn.click();
          let acBtn = el.querySelector(
            ".ContentItem-rightButton[data-zop-retract-question]"
          );
          if (acBtn) acBtn.click();
          break
        }
      }
    }
  }
  // Comments section
  let cc = document.evaluate(
    '//button[text()="收起评论"]', document.querySelector(".Comments-container"),
    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue;
  if (cc) { cc.click(); return }
  collapseComments();
}

function collapseComments() {
  const allCommentBtns = document.querySelectorAll(
    ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type, .ContentItem-action > button.Button.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
  );
  for (const el of allCommentBtns) {
    if (el.textContent.includes("收起评论") && isElementInViewport(el)) {
      el.click();
      return
    }
  }
  for (const el of document.querySelectorAll(".Comments-container")) {
    if (isElementInViewport(el)) {
      const parent = el.closest(".List-item") || el.closest(".Card");
      if (!parent) continue
      const btn = parent.querySelector(
        ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
      );
      if (btn && btn.textContent.includes("收起评论")) {
        btn.click();
        if (!isElementInViewport(btn)) scrollTo(0, parent.offsetTop + parent.offsetHeight - 50);
        return
      }
    }
  }
}

// ========== 一键收起全部回答 ==========

function addCollapseAllButton() {
  if (!menu_value('menu_collapsedAnswer')) return
  const container = document.querySelector('.CornerAnimayedFlex');
  if (!container || document.getElementById('collapsed-button')) return
  const templateBtn = container.querySelector('button');
  if (!templateBtn) return
  container.insertAdjacentHTML('afterBegin',
    '<button id="collapsed-button" data-tooltip="收起全部回答/评论" data-tooltip-position="left" aria-label="收起全部回答/评论" type="button" class="' +
    templateBtn.className +
    '"><svg class="ContentItem-arrowIcon is-active" aria-label="收起全部回答/评论" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg></button>'
  );
  document.getElementById('collapsed-button').onclick = function () {
    document.querySelectorAll('.Comments-container').forEach(el => {
      const btn = document.evaluate('//button[text()="收起评论"]', el, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (btn) btn.click();
    });
    document.querySelectorAll('.RichContent >.ContentItem-actions>button:first-of-type').forEach(el => {
      if (el.textContent.includes('收起评论')) el.click();
    });
    document.querySelectorAll('.ContentItem-rightButton[data-zop-retract-question]').forEach(el => el.click());
  };
}

// ========== 默认收起回答 ==========

let collapsedObserver = null;
function collapseRichContent(rc) {
  if (rc.hasAttribute('script-collapsed')) return
  const inner = rc.querySelector('.RichContent-inner');
  if (!inner || inner.offsetHeight < 400) return
  const btn = rc.querySelector(
    '.ContentItem-actions.Sticky [data-zop-retract-question]'
  );
  if (!btn) return
  rc.setAttribute('script-collapsed', '');
  btn.click();
}

function collapsedAnswerHandler(mutations) {
  for (const mutation of mutations) {
    if (mutation.target.nodeType !== Node.ELEMENT_NODE) continue
    if (mutation.target.classList.contains('RichContent')) {
      for (const n of mutation.addedNodes) {
        if (n.nodeType !== Node.ELEMENT_NODE) continue
        if (n.className !== 'RichContent-inner') continue
        if (n.offsetHeight < 400) break
        collapseRichContent(mutation.target);
        break
      }
    } else if (
      mutation.target.tagName === 'DIV' && !mutation.target.style.cssText && !mutation.target.className
    ) {
      if (mutation.target.hasAttribute('script-collapsed')) continue
      const parent = mutation.target.parentElement;
      if (!parent || parent.hasAttribute('script-collapsed')) continue
      const btn = mutation.target.querySelector(
        '.ContentItem-actions.Sticky [data-zop-retract-question]'
      );
      if (btn) {
        parent.setAttribute('script-collapsed', '');
        btn.click();
      }
    }
    // 处理整体插入的回答卡片（mutation.target 是父容器）
    for (const node of mutation.addedNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue
      const targets = node.classList.contains('RichContent')
        ? [node]
        : node.querySelectorAll('.RichContent');
      for (const rc of targets) collapseRichContent(rc);
    }
  }
}

function enableDefaultCollapse() {
  if (!menu_value('menu_defaultCollapsedAnswer')) return
  if (location.href.includes('/answer/')) return
  if (!collapsedObserver) {
    collapsedObserver = new MutationObserver(collapsedAnswerHandler);
    UrlChangeManager.add(() => {
      if (menu_value('menu_defaultCollapsedAnswer') && !location.href.includes('/answer/')) {
        collapsedObserver.observe(document.body, { childList: true, subtree: true });
      } else {
        collapsedObserver.disconnect();
      }
    });
  }
  collapsedObserver.observe(document.body, { childList: true, subtree: true });
}

function getUpvoteMin(type) {
  const key = type === 'index' ? 'menu_blockLowUpvoteCount'
    : type === 'follow' ? 'menu_blockLowUpvoteCountFollow'
    : 'menu_blockLowUpvoteCountQuestion';
  return GM_getValue(key)
}
function getCommentMin(type) {
  const key = type === 'index' ? 'menu_blockLowCommentCount'
    : type === 'follow' ? 'menu_blockLowCommentCountFollow'
    : 'menu_blockLowCommentCountQuestion';
  return GM_getValue(key)
}

function shouldBlock(item, upvoteMin, commentMin) {
  const ci = item.querySelector('.ContentItem');
  if (!ci?.dataset.zaExtraModule) return false
  try {
    const card = JSON.parse(ci.dataset.zaExtraModule)?.card?.content;
    if (!card) return false
    if (upvoteMin && Number(card.upvote_num) < Number(upvoteMin)) return true
    if (commentMin && Number(card.comment_num) < Number(commentMin)) return true
  } catch (e) {}
  return false
}

function makeProcessor(type) {
  const upvoteMin = getUpvoteMin(type);
  const commentMin = getCommentMin(type);
  const sel = type === 'question' ? '.List-item' : '.Card.TopstoryItem';
  document.querySelectorAll(sel).forEach(item => {
    if (shouldBlock(item, upvoteMin, commentMin)) {
      item.hidden = true; item.style.display = 'none';
    }
  });
  return function processLowCount(item) {
    if (shouldBlock(item, upvoteMin, commentMin)) {
      item.hidden = true; item.style.display = 'none';
    }
  }
}

// Backward-compat wrapper for intermediate index.js
function blockLowCount(type) {
  makeProcessor(type); // initial scan only
}

function getUsers() {
  return menu_value('menu_customBlockUsers') || []
}

function isBlockedAuthor(contentItem) {
  const zop = contentItem.dataset.zop;
  if (!zop) return false
  try {
    return getUsers().includes(JSON.parse(zop).authorName)
  } catch (e) { return false }
}

const SELECTOR$5 = '.ContentItem.AnswerItem, .ContentItem.ArticleItem';

function process$5(item) {
  if (isBlockedAuthor(item)) {
    const card = item.closest('.Card, .List-item, .TopicFeedItem');
    if (card) card.hidden = true;
  }
}

const SELECTOR_COMMENT$1 = 'a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]';

function processComment$1(img) {
  const users = getUsers();
  if (!users.length) return
  if (users.includes(img.alt)) {
    const el = img.closest('a')?.parentElement?.parentElement?.parentElement?.parentElement;
    if (el) el.style.display = 'none';
  }
}

function init$4() {
  document.querySelectorAll(SELECTOR$5).forEach(process$5);
}

function customBlockUsers() {
  let now = '';
  getUsers().forEach(item => { now += '|' + item; });
  const input = prompt(
    '编辑 [自定义屏蔽用户]\\n（不同用户名之间使用 "|" 分隔，例如：用户A|用户B|用户C ）',
    now.slice(1)
  );
  if (input === '') {
    GM_setValue('menu_customBlockUsers', []);
    refreshMenu();
  } else if (input != null) {
    GM_setValue('menu_customBlockUsers', input.split('|'));
    refreshMenu();
  }
}

// ========== 向下兼容包装 ==========

function blockUsers(type) {
  if (!menu_value('menu_blockUsers')) return
  init$4();
  document.querySelectorAll(SELECTOR_COMMENT$1).forEach(processComment$1);
}

var selectedTextForBlockKeywords = "";

function normalizeBlockKeywordText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

function getSelectedBlockKeywordText() {
  let text = "";
  const activeElement = document.activeElement;
  if (
    activeElement &&
    (activeElement.tagName === "TEXTAREA" ||
      (activeElement.tagName === "INPUT" &&
        /^(?:text|search|url|tel|password)$/i.test(activeElement.type))) &&
    typeof activeElement.selectionStart === "number"
  ) {
    text = activeElement.value.slice(
      activeElement.selectionStart,
      activeElement.selectionEnd,
    );
  }
  if (!text && window.getSelection) {
    text = window.getSelection().toString();
  }
  return normalizeBlockKeywordText(text);
}

function rememberSelectedBlockKeyword() {
  const updateSelectedBlockKeyword = function () {
    selectedTextForBlockKeywords = getSelectedBlockKeywordText();
  };
  document.addEventListener("selectionchange", updateSelectedBlockKeyword);
  document.addEventListener("contextmenu", updateSelectedBlockKeyword, true);
}

function addSelectedKeywordToBlocklist() {
  if (!menu_value("menu_blockKeywords")) {
    GM_notification({ text: "请先开启 [屏蔽指定关键词] 功能~", timeout: 3000 });
    return;
  }

  const keyword = getSelectedBlockKeywordText() || selectedTextForBlockKeywords;
  if (!keyword) {
    GM_notification({
      text: "未检测到选中的文字，请先选中内容后再使用该菜单~",
      timeout: 3000,
    });
    return;
  }

  let keywords = (GM_getValue("menu_customBlockKeywords") || [])
    .map(function (item) {
      return normalizeBlockKeywordText(item);
    })
    .filter(function (item) {
      return item !== "";
    });
  if (
    keywords.some(function (item) {
      return item.toLowerCase() === keyword.toLowerCase();
    })
  ) {
    GM_notification({
      text: `屏蔽词 [${keyword}] 已存在，无需重复添加~`,
      timeout: 3000,
    });
    return;
  }

  keywords.push(keyword);
  GM_setValue("menu_customBlockKeywords", keywords);
  refreshMenu();
  GM_notification({
    text: `已添加屏蔽词 [${keyword}]\n后续加载的标题/评论会按该关键词过滤~`,
    timeout: 4000,
  });
}

function customBlockKeywords() {
  let nowBlockKeywords = "";
  menu_value("menu_customBlockKeywords").forEach(function (item) {
    nowBlockKeywords += "|" + item;
  });
  let newBlockKeywords = prompt(
    '编辑 [自定义屏蔽关键词]\n（不同关键词之间使用 "|" 分隔，例如：关键词A|关键词B|关键词C \n（关键词不区分大小写，支持表情如：[捂脸]|[飙泪笑]',
    nowBlockKeywords.slice(1),
  );
  if (newBlockKeywords === "") {
    GM_setValue("menu_customBlockKeywords", []);
    refreshMenu();
  } else if (newBlockKeywords != null) {
    GM_setValue("menu_customBlockKeywords", newBlockKeywords.split("|"));
    refreshMenu();
  }
}

const SELECTOR_TITLE = 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"], a[data-za-detail-view-id]';

function processTitle(item) {
  const keywords = getKeywords();
  if (!keywords.length) return
  const text = (item.content || item.textContent).toLowerCase();
  for (const kw of keywords) {
    if (text.includes(kw)) {
      const card = item.closest('.Card, .List-item, .HotItem');
      if (card) { card.hidden = true; card.style.display = 'none'; }
      return
    }
  }
}

const SELECTOR_COMMENT = '.CommentContent';

function processComment(content) {
  const keywords = getKeywords();
  if (!keywords.length) return
  let text = content.textContent.toLowerCase();
  content.querySelectorAll('img.sticker[alt]').forEach(img => { text += img.alt.toLowerCase(); });
  for (const kw of keywords) {
    if (text.includes(kw)) {
      const originalNodes = Array.from(content.childNodes).map(n => n.cloneNode(true));
      content.onclick = (e) => {
        if (e.target === content && content.textContent === '[该评论已屏蔽，可点击显示]') {
          content.textContent = '';
          originalNodes.forEach(n => content.appendChild(n));
          content.onclick = null;
        }
      };
      content.textContent = '[该评论已屏蔽，可点击显示]';
      return
    }
  }
}

function getKeywords() {
  const keywords = menu_value('menu_customBlockKeywords');
  if (!keywords?.length) return []
  return keywords.filter(k => k).map(k => k.toLowerCase())
}

function blockKeywords(type) {
  if (!menu_value('menu_blockKeywords')) return
  if (type === 'comment') {
    if (!menu_value('menu_blockKeywordsComment')) return
    document.querySelectorAll(SELECTOR_COMMENT).forEach(processComment);
  } else {
    document.querySelectorAll(SELECTOR_TITLE).forEach(processTitle);
  }
}

function blockHotOther() {
  if (!menu_value('menu_blockTypeLiveHot')) return
  const isQuestion = (hotItem) => {
    const link = hotItem.querySelector('.HotItem-content a');
    return link && /\/question\/\d+/.test(link.href)
  };
  const fixRank = () => {
    document.querySelectorAll('.HotList-list .HotItem:not([hidden])').forEach((item, i) => {
      const rank = item.querySelector('.HotItem-index .HotItem-rank');
      if (rank) rank.innerText = i + 1;
    });
  };
  const block = () => {
    document.querySelectorAll('.HotList-list .HotItem').forEach(item => {
      if (!isQuestion(item)) item.remove();
    });
    fixRank();
  };
  block();
  GlobalObserver.add((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (n.nodeType === 1 && n.classList?.contains('HotItem')) block();
      }
    }
  });
}

// ========== 核心过滤函数（供 DomDispatcher process 使用） ==========

function process$4(item) {
  if (!item) return
  if (location.pathname === '/search') {
    if (location.search.includes('type=content') === false) return
    if (item.href?.includes('/zvideo/') || item.href?.includes('video.zhihu.com')) {
      if (menu_value('menu_blockTypeVideo')) item.closest('.Card')?.remove();
    } else if (item.href?.includes('zhuanlan.zhihu.com')) {
      if (menu_value('menu_blockTypeArticle')) item.closest('.Card.SearchResult-Card').hidden = true;
    } else if (item.href?.includes('/topic/')) {
      if (menu_value('menu_blockTypeTopic')) item.closest('.Card.SearchResult-Card').hidden = true;
    } else if (item.href?.includes('/market/')) {
      if (menu_value('menu_blockTypeSearch')) item.closest('.Card.SearchResult-Card').hidden = true;
    }
  } else if (location.pathname.includes('/question/')) {
    if (menu_value('menu_blockTypeVideo')) item.closest('.List-item').hidden = true;
  } else {
    if (item.className === 'ContentItem PinItem') {
      if (menu_value('menu_blockTypePin')) item.closest('.Card.TopstoryItem').hidden = true;
    } else if (item.href?.includes('/zvideo/') || item.href?.includes('video.zhihu.com')) {
      if (menu_value('menu_blockTypeVideo')) item.closest('.Card.TopstoryItem').hidden = true;
    } else if (item.href?.includes('zhuanlan.zhihu.com')) {
      if (menu_value('menu_blockTypeArticle')) item.closest('.Card.TopstoryItem').hidden = true;
    }
  }
}

// ========== 向下兼容的 blockType(type) 包装（仅做初始扫描，无 GlobalObserver） ==========

function getSelector(type) {
  if (type === 'search') return 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a'
  if (type === 'question') return '.VideoAnswerPlayer'
  if (type === 'follow') {
    const parts = [];
    if (menu_value('menu_blockTypeFollowAgree')) parts.push('.TopstoryItem-isFollow .FeedSource-byline');
    if (menu_value('menu_blockTypeFollowQuestion')) parts.push('.ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)');
    return parts.join(',') || null
  }
  // index
  let sel = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion)';
  if (menu_value('menu_blockTypePin')) sel += ', .ContentItem.PinItem';
  return sel
}

function blockType(type) {
  const sel = getSelector(type);
  if (!sel) return
  document.querySelectorAll(sel).forEach(process$4);
}

// ========== 屏蔽盐选内容 ==========

const SELECTOR$4 = 'h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a, .VideoAnswerPlayer, .ContentItem.PinItem';

const SELECTOR_YANXUAN = '.List-item, .Card.AnswerCard';

function processYanXuan(item) {
  if (item.querySelector('.KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn')) {
    item.hidden = true;
  }
}

function initYanXuan() {
  document.querySelectorAll(SELECTOR_YANXUAN).forEach(processYanXuan);
}

// 移除高亮链接
const SELECTOR$3 = 'a[data-za-not-track-link][href^="https://zhida.zhihu.com/search?"]';

function process$3(a) {
  const span = a.parentElement;
  if (span) span.replaceWith(a.textContent);
}

function initHighlight() {
  document.querySelectorAll(SELECTOR$3).forEach(process$3);
}

// 移除登录弹窗
let _loginObserver = null;

function startLoginMonitor() {
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
          const btn = n.querySelector('.Button.Modal-closeButton.Button--plain');
          if (btn) btn.click();
        } else if (document.evaluate(
          '//button[text()="立即登录/注册"]', n, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue) {
          n.remove();
        }
      }
    }
  });
  _loginObserver.observe(document.body, { childList: true, subtree: true });
}

// 净化标题消息

function cleanTitles() {
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

function cleanSearch() {
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

function topTime_processItem(_this, classs) {
  let t = _this.querySelector(".ContentItem-time");
  if (!t) return;
  if (
    !t.classList.contains("full") &&
    t.querySelector("a") &&
    t.querySelector("a").textContent != null
  ) {
    topTime_allTime(t);
    topTime_publishTop(t, _this, classs);
  }
}

function topTime_(css, classs) {
  document.querySelectorAll(css).forEach(function (_this) {
    topTime_processItem(_this, classs);
  });
}

// 完整显示时间 + 置顶显示时间 - 文章
function topTime_post() {
  let t = document.querySelector(".ContentItem-time:not(.xiu-time)");
  if (!t) return;
  // 完整显示时间
  if (
    t.textContent.includes("编辑于") &&
    !t.classList.contains("xiu-time")
  ) {
    let tt = t.textContent;
    t.click();
    t.textContent = t.textContent + " ，" + tt;
    t.classList.add("xiu-time");
  }

  // 置顶显示时间
  if (
    menu_value("menu_publishTop") &&
    !document.querySelector(".Post-Header > .ContentItem-time") &&
    !document.querySelector(".ContentItem-meta > .ContentItem-time")
  ) {
    let temp_time = t.cloneNode(true);
    temp_time.style.padding = "0px";
    document
      .querySelector(".Post-Header")
      .insertAdjacentElement("beforeEnd", temp_time);
  }
}

// 完整显示时间
function topTime_allTime(t) {
  if (
    t.textContent.includes("发布于") &&
    t.textContent.includes("编辑于") === false
  ) {
    t.querySelector("a").textContent = t.querySelector("a").dataset.tooltip;
    t.classList.add("full");
  } else if (
    t.textContent.includes("发布于") === false &&
    t.textContent.includes("编辑于")
  ) {
    t.querySelector("a").textContent =
      t.querySelector("a").dataset.tooltip +
      " ，" +
      t.querySelector("a").textContent;
    t.classList.add("full");
  }
}

// 置顶显示时间
function topTime_publishTop(t, _this, _class) {
  if (!menu_value("menu_publishTop")) return;
  if (!t.parentNode.classList.contains(_class)) {
    let temp_time = t.cloneNode(true);
    temp_time.style.padding = "0px";
    // 对于较短的回答，隐藏回答底部的时间
    if (_this.offsetHeight < 600) t.style.display = "none";
    _this
      .querySelector("." + _class)
      .insertAdjacentElement("beforeEnd", temp_time);
  }
}

// 问题创建时间
function question_time() {
  if (
    !document.querySelector(
      ".QuestionPage .QuestionHeader-side .QuestionTime-xiu",
    )
  ) {
    document
      .querySelector(".QuestionPage .QuestionHeader-side")
      .insertAdjacentHTML(
        "beforeEnd",
        '<div class="QuestionTime-xiu" style="color: #9098ac; margin-top: 5px; font-size: 13px; font-style: italic;"><p>创建时间：' +
          getUTC8(
            new Date(
              document.querySelector(
                ".QuestionPage > meta[itemprop=dateCreated]",
              ).content,
            ),
          ) +
          "</p><p>最后编辑：" +
          getUTC8(
            new Date(
              document.querySelector(
                ".QuestionPage > meta[itemprop=dateModified]",
              ).content,
            ),
          ) +
          "</p></div>",
      );
  }
}

// UTC+8 北京时间格式化
var _utc8Formatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit",
  hour12: false,
});
function getUTC8(t) {
  return _utc8Formatter.format(t).replace(/\//g, "-");
}

function createIncrementalTopTimeHandler(css, classs) {
  return function (mutations) {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;
        if (node.matches?.(css)) topTime_processItem(node, classs);
        const items = node.querySelectorAll?.(css);
        if (items) for (const item of items) topTime_processItem(item, classs);
      }
    }
  };
}

const SELECTOR$2 = '.ContentItem.AnswerItem, .ContentItem.ArticleItem, .TopstoryItem, .PinItem';

function process$2(item) {
  topTime_processItem(item, 'ContentItem-meta');
}

function init$3() {
  topTime_(SELECTOR$2, 'ContentItem-meta');
}

function injectCSS() {
  const parts = [];

  // 类型标签
  const style = 'font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: 4px 4px 0 0;';
  parts.push(`
.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
.PinItem .ContentItem-title a::before {content:'想法';color: #4CAF50;background-color: #4CAF5033;${style}}
.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}
.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
.HotLanding-contentItem .ContentItem[data-za-detail-view-path-module=Content] .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
`);

  // 视频隐藏
  parts.push(`
.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}
.VideoAnswerPlayer, .VideoAnswerPlayer video, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {display: none !important;}
`);

  // 搜索净化
  parts.push(`
.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"], .AutoComplete-group > [id^="AutoComplete3-topSearch-"] {display: none !important;}
`);

  // 登录弹窗
  if (location.hostname !== 'zhuanlan.zhihu.com') {
    parts.push(`
.Question-mainColumnLogin, button.AppHeader-login {display: none !important;}
`);
  }

  // 收起按钮位置调整
  parts.push(`
.CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:45px !important;}
`);

  // 直达问题按钮样式
  parts.push(`
a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;margin-top: 4px !important;height: 20.67px !important;line-height: 20.67px !important;}
`);

  // 首页最小高度 + 视频 tab 隐藏
  if (location.pathname === '/') {
    parts.push(`
.Topstory-container {min-height: 1500px;}
`);
  }
  if (menu_value('menu_blockTypeVideo') && ['/', '/hot', '/follow'].includes(location.pathname)) {
    parts.push(`
.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}
`);
  }

  const el = document.createElement('style');
  el.textContent = parts.join('')
  ;(document.head || document.documentElement).appendChild(el);
}

class DomDispatcher {
  constructor() {
    this._processors = new Map();
    this._observer = null;
    this._combined = '';
  }

  register(selector, processor) {
    if (!this._processors.has(selector)) {
      this._processors.set(selector, []);
    }
    this._processors.get(selector).push(processor);
    this._rebuildCombined();
  }

  unregister(selector, processor) {
    const list = this._processors.get(selector);
    if (!list) return
    const idx = list.indexOf(processor);
    if (idx !== -1) list.splice(idx, 1);
    if (list.length === 0) this._processors.delete(selector);
    this._rebuildCombined();
  }

  _rebuildCombined() {
    this._combined = Array.from(this._processors.keys()).join(',');
  }

  start(target) {
    if (this._observer) return
    this._observer = new MutationObserver((mutations) => {
      const combined = this._combined;
      if (!combined) return
      for (const m of mutations) {
        for (const n of m.addedNodes) {
          if (n.nodeType !== Node.ELEMENT_NODE) continue
          // Layer 1: 快速放行
          if (!n.matches?.(combined) && !n.querySelector(combined)) continue
          // Layer 2: 一次 QSA + 分发
          const matches = n.matches(combined)
            ? [n, ...n.querySelectorAll(combined)]
            : n.querySelectorAll(combined);
          for (const el of matches) {
            for (const [sel, fns] of this._processors) {
              if (el.matches(sel)) {
                for (const fn of fns) fn(el);
              }
            }
          }
        }
      }
    });
    this._observer.observe(target || document.body, {
      childList: true,
      subtree: true,
    });
  }

  stop() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
}

const SELECTOR$1 = 'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)';

function process$1(a) {
  a.href = decodeURIComponent(a.href.substring(a.href.indexOf('link.zhihu.com/?target=') + 23));
}

function init$2() {
  document.querySelectorAll(SELECTOR$1).forEach(process$1);
}

const SELECTOR = "img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)";

function process(img) {
  if (img.dataset.originalXiu) return
  img.src = "https://" + img.dataset.original.split("/")[2] + "/" + img.dataset.originalToken + ".webp";
  img.dataset.originalXiu = "true";
}

function init$1() {
  document.querySelectorAll(SELECTOR).forEach(process);
}

function init() {
  injectCSS();

  DomDispatcher.register(SELECTOR$1, process$1);
  DomDispatcher.register(SELECTOR, process);
  DomDispatcher.register(SELECTOR$2, process$2);
  DomDispatcher.register(SELECTOR$4, process$4);
  DomDispatcher.register(SELECTOR_TITLE, processTitle);
  DomDispatcher.register(SELECTOR_COMMENT, processComment);
  DomDispatcher.register(SELECTOR$5, process$5);
  DomDispatcher.register(SELECTOR_COMMENT$1, processComment$1);
  DomDispatcher.register(SELECTOR_YANXUAN, processYanXuan);

  DomDispatcher.start();

  init$2();
  init$1();
  init$3();
  init$4();
  initYanXuan();

  makeProcessor('Answer')();
  makeProcessor('Article')();
  makeProcessor('Pin')();
}

function question_author() {
  try {
    if (
      document.querySelector(
        ".BrandQuestionSymbol, .QuestionAuthor, .SpecialQuestionAuthor",
      )
    )
      return;
    let qJson = JSON.parse(
        document.querySelector("#js-initialData").textContent,
      ).initialState.entities.questions[/\d+/.exec(location.pathname)[0]]
        .author,
      html = `<div class="BrandQuestionSymbol"><a class="BrandQuestionSymbol-brandLink" href="/people/${escapeHtml(qJson.urlToken)}"><img role="presentation" src="${escapeHtml(qJson.avatarUrl)}" class="BrandQuestionSymbol-logo" alt=""><span class="BrandQuestionSymbol-name">${escapeHtml(qJson.name)}</span></a><div class="BrandQuestionSymbol-divider" style="margin-left: 5px;margin-right: 10px;"></div></div>`;
    //html = `<div class="QuestionAuthor"><div class="AuthorInfo AuthorInfo--plain" itemprop="author" itemscope="" itemtype="http://schema.org/Person"><div class="AuthorInfo"><span class="UserLink AuthorInfo-avatarWrapper"><div class="Popover"><div id="Popover18-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover18-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="${qJson.urlToken}"><img class="Avatar AuthorInfo-avatar" width="24" height="24" src="${qJson.avatarUrl}"></a></div></div></span><div class="AuthorInfo-content"><div class="AuthorInfo-head"><span class="UserLink AuthorInfo-name"><div class="Popover"><div id="Popover19-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover19-content"><a class="UserLink-link" data-za-detail-view-element_name="User" target="_blank" href="${qJson.urlToken}">${qJson.name}</a></div></div></span></div></div></div></div></div>`
    document
      .querySelector(".QuestionHeader-topics")
      .insertAdjacentHTML("beforebegin", html);
    //document.querySelector('.QuestionPage h1.QuestionHeader-title').insertAdjacentHTML('afterend', html);
  } catch (e) {
    console.warn("question_author error:", e);
  }
}

// [完整显示时间 + 置顶显示时间] 功能修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
// 完整显示时间 + 置顶显示时间

function questionRichTextMore() {
  if (!menu_value("menu_questionRichTextMore")) return;
  let button = document.querySelector("button.QuestionRichText-more");
  if (button) button.click();
}

// 移除登录弹窗

function questionInvitation() {
  var _qiHandler = function () {
    let q = document.querySelector(".QuestionInvitation-content");
    if (!q) return;
    GlobalObserver.remove(_qiHandler);
    q.style.display = "none";
    const titleEl = document.querySelector(".QuestionInvitation-title");
    titleEl.textContent = titleEl.textContent;
    const toggleSpan = document.createElement("span");
    toggleSpan.style.cssText = "cursor: pointer; font-size: 14px; color: #919aae;";
    toggleSpan.textContent = " 展开/折叠";
    titleEl.appendChild(toggleSpan);
    document.querySelector(".Topbar").onclick = function () {
      let q = document.querySelector(".QuestionInvitation-content");
      if (q.style.display == "none") {
        q.style.display = "";
      } else {
        q.style.display = "none";
      }
    };
  };
  GlobalObserver.add(_qiHandler);
}

// 屏蔽热榜杂项

function addTypeTips() {
  if (!menu_value("menu_typeTips")) return;
  let style = `font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: ${location.pathname === "/search" ? "2" : "4"}px 4px 0 0;`;
  document.body.appendChild(document.createElement("style")).textContent =
    `/* 区分问题文章 */
.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
/* 针对的是部分搜索词下搜索页开头的 "最新讨论" 之类的非常规元素 */
.HotLanding-contentItem .ContentItem[data-za-detail-view-path-module=Content] .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
.PinItem .ContentItem-title a::before {content:'想法';color: #4CAF50;background-color: #4CAF5033;${style}}
.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}`;
}

// 直达问题按钮
function addToQuestion() {
  if (!menu_value("menu_toQuestion")) return;

  // 一开始加载的信息流 + 添加按钮样式
  if (location.pathname === "/search") {
    document.head.appendChild(
      document.createElement("style"),
    ).textContent =
      `a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;height: 20.67px !important;line-height: 20.67px !important;margin-top: 2px !important;}`;
    addSetInterval_("h2.ContentItem-title a:not(.zhihu_e_tips)");
  } else {
    document.head.appendChild(
      document.createElement("style"),
    ).textContent =
      `a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;margin-top: 4px !important;}`;
    document
      .querySelectorAll("h2.ContentItem-title a:not(.zhihu_e_tips)")
      .forEach(function (item) {
        addTypeTips_(item);
      });
  }

  // 后续加载的信息流
  GlobalObserver.add((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        addTypeTips_(
          target.querySelector("h2.ContentItem-title a:not(.zhihu_e_tips)"),
        );
      }
    }
  });

  UrlChangeManager.add(function () {
    addSetInterval_("h2.ContentItem-title a:not(.zhihu_e_tips)");
  });

  function addTypeTips_(titleA) {
    if (!titleA) return; // 判断是否为真
    if (titleA.parentElement.querySelector("a.zhihu_e_toQuestion")) return; // 判断是否已添加
    if (titleA.textContent.includes("?")) {
      // 把问题末尾英文问好 [?] 的替换为中文问好 [？]，这样按钮与标题之间的间距就刚刚好~
      titleA.innerHTML = titleA.innerHTML.replace("?", "？");
    }
    if (/answer\/\d+/.test(titleA.href)) {
      //  如果是指向回答的问题（而非指向纯问题的链接）
      const titleA_meta = titleA.parentElement.parentElement.querySelector(
        'meta[itemprop="url"]',
      ); // 获取该问题页地址
      if (!titleA_meta) return; // 判断元素是否存在（针对的是部分搜索词下搜索页开头的 "最新讨论" 之类的非常规元素）
      titleA.insertAdjacentHTML(
        "afterend",
        `<a class="zhihu_e_toQuestion VoteButton" href="${escapeHtml(titleA_meta.content)}" target="_blank">直达问题</a>`,
      );
    }
  }

  let pendingHandler = null;
  function addSetInterval_(A) {
    // URL 变化会重新进入，先移除上一个未命中的 handler，避免累积
    if (pendingHandler) {
      GlobalObserver.remove(pendingHandler);
      pendingHandler = null;
    }
    let aTag = document.querySelectorAll(A);
    if (aTag.length > 0) {
      aTag.forEach(function (item) {
        addTypeTips_(item);
      });
      return;
    }
    var _handler = function () {
      let aTag = document.querySelectorAll(A);
      if (aTag.length > 0) {
        GlobalObserver.remove(_handler);
        if (pendingHandler === _handler) pendingHandler = null;
        aTag.forEach(function (item) {
          addTypeTips_(item);
        });
      }
    };
    pendingHandler = _handler;
    GlobalObserver.add(_handler);
  }
}

// 展开问题描述

function switchHome() {
  document.querySelectorAll("header.AppHeader nav").forEach((a) => {
    a.outerHTML = a.outerHTML;
  });
}
// 针对首页几个页面
function switchHomeRecommend() {
  document
    .querySelectorAll(
      'header.AppHeader nav>a:not([target])[href="https://www.zhihu.com/"]',
    )
    .forEach((a) => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.cookie =
          "tst=r; expires=Thu, 18 Dec 2099 12:00:00 GMT; domain=.zhihu.com; path=/";
        location.href = this.href;
        return false;
      });
    });
}

const BLANK_CONTAINERS = [
  '.Topstory-container',
  '.Question-main',
  '.Question-mainColumn',
  '.QuestionPage',
  '.Search-container',
  '.CollectionsDetailPage',
  '.Post-Row-Content',
  '.Profile-main',
];
const INVITE_TOGGLE_CLS = 'script-invite-toggle';

function isSideBlank(event) {
  const el = event.target;
  if (el.closest('a, button, input, textarea, img, video, [role="button"]')) return false

  const container = BLANK_CONTAINERS.reduce((found, sel) => found || document.querySelector(sel), null);
  if (container) {
    const rect = container.getBoundingClientRect();
    const sideSpace = (window.innerWidth - rect.width) / 2;
    // 容器两侧有明显留白时 (≥3% 视口宽)，用容器边界判断
    if (sideSpace >= window.innerWidth * 0.03) {
      return event.clientX < rect.left || event.clientX > rect.right
    }
  }

  // 兜底：点击在视口外侧 20% 区域
  const threshold = window.innerWidth * 0.2;
  return event.clientX < threshold || event.clientX > window.innerWidth - threshold
}

function onCollapseClick(e) {
  if (!menu_value('menu_collapsedNowAnswer')) return
  if (!isSideBlank(e)) return
  collapseCurrentAnswer();
}

function onBackToTop(e) {
  if (!menu_value('menu_backToTop')) return
  if (!isSideBlank(e)) return
  e.preventDefault();
  window.scrollTo(0, 0);
}

function onCloseFloatingComment(e) {
  const button = document.querySelector('button[aria-label="关闭"]');
  if (!button) return
  const overlay = button.parentElement?.parentElement;
  if (overlay && (e.target === overlay || e.target.parentElement === overlay)) {
    button.click();
  }
}

function onInviteToggle(e) {
  if (!e.target.closest('.' + INVITE_TOGGLE_CLS)) return
  const q = document.querySelector('.QuestionInvitation-content');
  if (q) q.style.display = q.style.display === 'none' ? '' : 'none';
}

function initEvents() {
  document.addEventListener('click', onCollapseClick, true);
  document.addEventListener('contextmenu', onBackToTop, true);
  document.addEventListener('click', onCloseFloatingComment, true);
  document.addEventListener('click', onInviteToggle, false);
}

var menu_ALL = [
    { key: "menu_defaultCollapsedAnswer", label: "默认收起回答", tips: "默认收起回答", default: true, type: "toggle" },
    { key: "menu_collapsedAnswer", label: "一键收起回答/评论", tips: "一键收起回答/评论", default: true, type: "toggle" },
    { key: "menu_collapsedNowAnswer", label: "快捷收起回答/评论 (点击两侧空白处)", tips: "快捷收起回答/评论", default: true, type: "toggle" },
    { key: "menu_backToTop", label: "快捷回到顶部 (右键两侧空白处)", tips: "快捷回到顶部", default: true, type: "toggle" },
    {
      key: "menu_blockLowCount", label: "屏蔽低赞低评",
      tips: "设置要屏蔽 低于多少赞同/评价 的回答/文章（默认不需要留空即可）\n（例如设置 0 则无人赞同/评价的回答/文章会被屏蔽\n（例如设置 20 则赞同/评价数量低于 20 的回答/文章会被屏蔽\n（修改后，后续加载的回答/文章会立即生效，但不影响当前网页已有内容",
      type: "group",
      children: [
        { key: "menu_blockLowUpvoteCount", label: "最低赞同数 [首页]", default: "", inputType: "text" },
        { key: "menu_blockLowCommentCount", label: "最低评价数 [首页]", default: "", inputType: "text" },
        { key: "menu_blockLowUpvoteCountQuestion", label: "最低赞同数 [问题页]", default: "", inputType: "text" },
        { key: "menu_blockLowCommentCountQuestion", label: "最低评价数 [问题页]", default: "", inputType: "text" },
        { key: "menu_blockLowUpvoteCountFollow", label: "最低赞同数 [关注页]", default: "", inputType: "text" },
        { key: "menu_blockLowCommentCountFollow", label: "最低评价数 [关注页]", default: "", inputType: "text" },
      ],
    },
    { key: "menu_blockUsers", label: "屏蔽指定用户", tips: "屏蔽指定用户", default: true, type: "toggle" },
    {
      key: "menu_customBlockUsers", label: "自定义屏蔽用户", tips: "自定义屏蔽用户",
      default: ["故事档案局","盐选推荐","盐选科普","盐选成长计划","知乎盐选会员","知乎盐选创作者","盐选心理","盐选健康必修课","盐选奇妙物语","盐选生活馆","盐选职场","盐选文学甄选","盐选作者小管家","盐选博物馆","盐选点金","盐选测评室","盐选科技前沿","盐选会员精品"],
      type: "action", action: function () { customBlockUsers(); },
      visibleWhen: "menu_blockUsers",
    },
    { key: "menu_blockKeywords", label: "屏蔽指定关键词", tips: "屏蔽指定关键词", default: true, type: "toggle" },
    {
      key: "menu_blockKeywordsComment", label: "屏蔽关键词 - 评论区", tips: "屏蔽关键词 - 评论区", default: true,
      type: "toggle", visibleWhen: "menu_blockKeywords",
    },
    {
      key: "menu_customBlockKeywords", label: "自定义屏蔽关键词", tips: "自定义屏蔽关键词", default: [],
      type: "action", action: function () { customBlockKeywords(); },
      visibleWhen: "menu_blockKeywords",
    },
    {
      key: "menu_addSelectedBlockKeywords", label: "添加选中文字到屏蔽词 ↑", tips: "添加选中文字到屏蔽词", default: [],
      type: "action", action: function () { addSelectedKeywordToBlocklist(); },
      visibleWhen: "menu_blockKeywords",
    },
    {
      key: "menu_blockType", label: "屏蔽指定类别 (视频/文章等)",
      tips: "勾选 = 屏蔽该类别的信息流",
      type: "group",
      children: [
        { key: "menu_blockTypeVideo", label: "视频 [首页、搜索页、问题页、关注页]", default: true },
        { key: "menu_blockTypeArticle", label: "文章 [首页、搜索页、关注页]", default: false },
        { key: "menu_blockTypePin", label: "想法 [首页、关注页]", default: false },
        { key: "menu_blockTypeFollowAgree", label: "赞同了XX [关注页]", default: false },
        { key: "menu_blockTypeFollowQuestion", label: "关注了XX [关注页]", default: false },
        { key: "menu_blockTypeTopic", label: "话题 [搜索页]", default: false },
        { key: "menu_blockTypeSearch", label: "杂志文章、盐选专栏、相关搜索等 [搜索页]", default: false },
        { key: "menu_blockYanXuan", label: "盐选内容 [问题页]", default: false },
        { key: "menu_blockTypeLiveHot", label: "热榜文章、直播、广告等 [热榜]", default: true },
      ],
    },
    { key: "menu_cleanHighlightLink", label: "移除高亮链接 (高亮的文字链接)", tips: "移除高亮链接", default: true, type: "toggle" },
    { key: "menu_cleanSearch", label: "净化搜索热门 (默认搜索词及热门搜索)", tips: "净化搜索热门", default: false, type: "toggle" },
    { key: "menu_cleanTitles", label: "净化标题消息 (标题中的私信/消息)", tips: "净化标题提醒", default: false, type: "toggle" },
    { key: "menu_questionRichTextMore", label: "展开问题描述", tips: "展开问题描述", default: false, type: "toggle" },
    { key: "menu_publishTop", label: "置顶显示时间", tips: "置顶显示时间", default: true, type: "toggle" },
    { key: "menu_typeTips", label: "区分问题文章", tips: "区分问题文章", default: true, type: "toggle" },
    { key: "menu_toQuestion", label: "直达问题按钮", tips: "直达问题按钮", default: true, type: "toggle" },
  ],
  menu_ID = [];
initMenuValues(menu_ALL);
setMenuRegistrar(registerMenuCommand);
registerMenuCommand();

// 注册脚本菜单
function registerMenuCommand() {
  for (let i = 0; i < menu_ID.length; i++) {
    GM_unregisterMenuCommand(menu_ID[i]);
  }
  menu_ID = [];

  for (const item of menu_ALL) {
    // 条件显示：visibleWhen 指定的菜单项必须为 true
    if (item.visibleWhen && !GM_getValue(item.visibleWhen)) continue;

    if (item.type === "group") {
      menu_ID.push(GM_registerMenuCommand(`#️⃣ ${item.label}`, function () {
        menu_setting(item.label, item.tips, item.children);
      }));
    } else if (item.type === "action") {
      menu_ID.push(GM_registerMenuCommand(`#️⃣ ${item.label}`, item.action));
    } else if (item.type === "toggle") {
      let val = GM_getValue(item.key);
      menu_ID.push(GM_registerMenuCommand(
        `${val ? "✅" : "❌"} ${item.label}`,
        function () { menu_switch(`${GM_getValue(item.key)}`, item.key, item.tips); },
      ));
    }
  }

  menu_ID.push(GM_registerMenuCommand("💬 反馈 & 建议", function () {
    window.GM_openInTab("https://github.com/XIU2/UserScript#xiu2userscript", { active: true, insert: true, setParent: true });
    window.GM_openInTab("https://greasyfork.org/zh-CN/scripts/419081/feedback", { active: true, insert: true, setParent: true });
  }));
}

// 菜单开关
function menu_switch(menu_status, Name, Tips) {
  if (menu_status == "true") {
    GM_setValue(`${Name}`, false);
    GM_notification({
      text: `已关闭 [${Tips}] 功能\n（点击刷新网页后生效）`,
      timeout: 3500,
      onclick: function () {
        location.reload();
      },
    });
  } else {
    GM_setValue(`${Name}`, true);
    GM_notification({
      text: `已开启 [${Tips}] 功能\n（点击刷新网页后生效）`,
      timeout: 3500,
      onclick: function () {
        location.reload();
      },
    });
  }
  registerMenuCommand(); // 重新注册脚本菜单
}

// ========== 主入口 ==========

(function () {
  if (window.onurlchange === undefined) {
    addUrlChangeEvent();
  }
  rememberSelectedBlockKeyword();

  startLoginMonitor();
  cleanTitles();

  if (
    GM_info.scriptHandler === "Violentmonkey" ||
    (GM_info.scriptHandler === "Tampermonkey" &&
      parseFloat(GM_info.version.slice(0, 4)) >= 4.18)
  ) {
    setTimeout(start, 200);
  } else {
    start();
  }

  function start() {
    switchHome();
    initEvents();
    init();
    initHighlight();
    if (location.hostname != "zhuanlan.zhihu.com") {
      if (location.pathname.includes("/column/") === false) cleanSearch();
      addCollapseAllButton();
    }
    blockKeywords("comment");

    if (
      location.pathname.includes("question") &&
      location.href.includes("/log") === false
    ) {
      //       回答页 //
      if (location.pathname.includes("waiting") === false) {
        questionRichTextMore();
        if (location.pathname.includes("answer") === false) {
          blockLowCount("question");
        } else {
          document.querySelectorAll("div.Card.ViewAll>a").forEach((a) => {
            a.outerHTML = a.outerHTML;
          });
        }
        blockUsers();
        initYanXuan();
        blockType("question");
        enableDefaultCollapse();
      }
      GlobalObserver.add(
        createIncrementalTopTimeHandler(".ContentItem.AnswerItem", "ContentItem-meta"),
      );
      setTimeout(function () {
        question_time();
        question_author();
      }, 100);
      questionInvitation();
    } else if (location.pathname === "/search") {
      //          搜索结果页 //
      GlobalObserver.add(
        createIncrementalTopTimeHandler(
          ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
          "SearchItem-meta",
        ),
      );
      addTypeTips();
      addToQuestion();
      blockUsers();
      blockKeywords("search");
      blockType("search");
    } else if (location.pathname.includes("/topic/")) {
      //   话题页 //
      if (
        location.pathname.includes("/hot") ||
        location.href.includes("/top-answers")
      ) {
        GlobalObserver.add(
          createIncrementalTopTimeHandler(
            ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
            "ContentItem-meta",
          ),
        );
        addTypeTips();
        addToQuestion();
        blockUsers();
        blockKeywords("topic");
      }
    } else if (location.hostname === "zhuanlan.zhihu.com") {
      //    文章 //
      setTimeout(topTime_post, 300);
      blockUsers();
    } else if (location.pathname.includes("/column/")) {
      //    专栏 //
      setTimeout(function () {
        addCollapseAllButton();
        GlobalObserver.add(
          createIncrementalTopTimeHandler(
            ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
            "ContentItem-meta",
          ),
        );
        blockUsers();
      }, 300);
    } else if (
      location.pathname.includes("/people/") ||
      location.href.includes("org")
    ) {
      // 用户主页 //
      if (location.pathname.split("/").length === 3) {
        addTypeTips();
        addToQuestion();
      }
      GlobalObserver.add(
        createIncrementalTopTimeHandler(
          ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
          "ContentItem-meta",
        ),
      );
      blockUsers();
      blockKeywords("people");
    } else if (location.pathname.includes("/collection/")) {
      // 收藏夹 //
      addTypeTips();
      addToQuestion();
      GlobalObserver.add(
        createIncrementalTopTimeHandler(
          ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
          "ContentItem-meta",
        ),
      );
      blockKeywords("collection");
    } else if (location.pathname.includes("/pin/")) {
      // 想法 //
      GlobalObserver.add(
        createIncrementalTopTimeHandler(".ContentItem.PinItem", "ContentItem-meta"),
      );
    } else if (
      ["/", "/hot", "/follow", "/column-square", "/ring-feeds"].includes(
        location.pathname,
      )
    ) {
      //    首页 //
      switchHomeRecommend();
      let style = "";
      if (location.pathname !== "/column-square") {
        style += ".Topstory-container {min-height: 1500px;}";
      }
      if (menu_value("menu_blockTypeVideo")) {
        style += `.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`;
      }
      if (style) {
        document.head.appendChild(
          document.createElement("style"),
        ).textContent = style;
      }

      if (location.pathname !== "/column-square") {
        GlobalObserver.add(
          createIncrementalTopTimeHandler(".TopstoryItem", "ContentItem-meta"),
        );
        addTypeTips();
        addToQuestion();
        if (location.pathname == "/") {
          blockLowCount("index");
          blockUsers();
          blockKeywords("index");
          blockType();
        } else if (location.pathname == "/hot") {
          blockKeywords("index");
          blockHotOther();
        } else if (location.pathname == "/follow") {
          blockLowCount("follow");
          blockUsers();
          blockKeywords("follow");
          blockType();
          blockType("follow");
        }
      }
    }
  }
})();
