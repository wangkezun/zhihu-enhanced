import { GlobalObserver } from '../../shared/global-observer.js';
import { UrlChangeManager } from '../../shared/url-change.js';
import { menu_value } from '../../shared/menu-framework.js';
import { escapeHtml } from '../../shared/escape-html.js';

export function addTypeTips() {
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
export function addToQuestion() {
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
  GlobalObserver.addScoped((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        addTypeTips_(
          target.querySelector("h2.ContentItem-title a:not(.zhihu_e_tips)"),
        );
      }
    }
  });

  UrlChangeManager.addScoped(function () {
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

  function addSetInterval_(A) {
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
        aTag.forEach(function (item) {
          addTypeTips_(item);
        });
      }
    };
    GlobalObserver.addScoped(_handler);
  }
}

// 展开问题描述
