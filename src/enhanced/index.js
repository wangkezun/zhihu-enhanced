import { escapeHtml } from '../shared/escape-html.js';
import { initMenuValues, menu_value, menu_setting } from '../shared/menu-framework.js';
import { debounce } from '../shared/debounce.js';
import { GlobalObserver } from '../shared/global-observer.js';
import { UrlChangeManager, addUrlChangeEvent } from '../shared/url-change.js';

// 功能模块
import { collapsedNowAnswer, collapsedAnswer, defaultCollapsedAnswer, backToTop } from './modules/collapse-answer.js';
import { blockLowCount } from './modules/block-low-count.js';
import { customBlockUsers, blockUsers } from './modules/block-users.js';
import { rememberSelectedBlockKeyword, addSelectedKeywordToBlocklist, customBlockKeywords, blockKeywords } from './modules/block-keywords.js';
import { blockType, blockYanXuan, blockHotOther } from './modules/block-type.js';
import { cleanHighlightLink, removeLogin, cleanTitles, cleanSearch, closeFloatingComments } from './modules/clean-ui.js';
import { topTime_, topTime_post, question_time } from './modules/time-display.js';
import { originalPic } from './modules/original-pic.js';
import { directLink } from './modules/direct-link.js';
import { question_author, questionRichTextMore, questionInvitation } from './modules/question-author.js';
import { addTypeTips, addToQuestion } from './modules/type-tips.js';
import { switchHome, switchHomeRecommend } from './modules/navigation.js';

"use strict";

var menu_ALL = [
    { key: "menu_defaultCollapsedAnswer", label: "默认收起回答", tips: "默认收起回答", default: true, type: "toggle" },
    { key: "menu_collapsedAnswer", label: "一键收起回答/评论", tips: "一键收起回答/评论", default: true, type: "toggle" },
    { key: "menu_collapsedNowAnswer", label: "快捷收起回答/评论 (点击两侧空白处)", tips: "快捷收起回答/评论", default: true, type: "toggle" },
    { key: "menu_backToTop", label: "快捷回到顶部 (右键两侧空白处)", tips: "快捷回到顶部", default: true, type: "toggle" },
    {
      key: "menu_blockLowCount", label: "屏蔽低赞低评",
      tips: "设置要屏蔽 低于多少赞同/评价 的回答/文章（默认不需要留空即可）<br/>（例如设置 0 则无人赞同/评价的回答/文章会被屏蔽<br/>（例如设置 20 则赞同/评价数量低于 20 的回答/文章会被屏蔽<br/>（修改后，后续加载的回答/文章会立即生效，但不影响当前网页已有内容",
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

  removeLogin();
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
    cleanHighlightLink();
    originalPic();
    directLink();
    var _debouncedPicAndLink = debounce(function () {
      originalPic();
      directLink();
    }, 500);
    GlobalObserver.add(_debouncedPicAndLink);
    if (location.hostname != "zhuanlan.zhihu.com") {
      if (location.pathname.includes("/column/") === false) cleanSearch();
      collapsedAnswer();
    }
    closeFloatingComments();
    blockKeywords("comment");

    if (
      location.pathname.includes("question") &&
      location.href.includes("/log") === false
    ) {
      //       回答页 //
      if (location.pathname.includes("waiting") === false) {
        collapsedNowAnswer(".QuestionPage");
        collapsedNowAnswer(".Question-main");
        questionRichTextMore();
        if (location.pathname.includes("answer") === false) {
          blockLowCount("question");
        } else {
          document.querySelectorAll("div.Card.ViewAll>a").forEach((a) => {
            a.outerHTML = a.outerHTML;
          });
        }
        blockUsers("question");
        blockYanXuan();
        blockType("question");
        defaultCollapsedAnswer();
      }
      GlobalObserver.add(
        debounce(function () {
          topTime_(".ContentItem.AnswerItem", "ContentItem-meta");
        }, 300),
      );
      setTimeout(function () {
        question_time();
        question_author();
      }, 100);
      questionInvitation();
    } else if (location.pathname === "/search") {
      //          搜索结果页 //
      collapsedNowAnswer("main div");
      collapsedNowAnswer(".Search-container");
      GlobalObserver.add(
        debounce(function () {
          topTime_(
            ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
            "SearchItem-meta",
          );
        }, 300),
      );
      addTypeTips();
      addToQuestion();
      blockUsers("search");
      blockKeywords("search");
      blockType("search");
    } else if (location.pathname.includes("/topic/")) {
      //   话题页 //
      if (
        location.pathname.includes("/hot") ||
        location.href.includes("/top-answers")
      ) {
        collapsedNowAnswer("main.App-main");
        GlobalObserver.add(
          debounce(function () {
            topTime_(
              ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
              "ContentItem-meta",
            );
          }, 300),
        );
        addTypeTips();
        addToQuestion();
        blockUsers("topic");
        blockKeywords("topic");
      }
    } else if (location.hostname === "zhuanlan.zhihu.com") {
      //    文章 //
      backToTop(".Post-content");
      backToTop(".Post-Row-Content");
      setTimeout(topTime_post, 300);
      blockUsers();
    } else if (location.pathname.includes("/column/")) {
      //    专栏 //
      setTimeout(function () {
        collapsedAnswer();
        collapsedNowAnswer("main div");
        GlobalObserver.add(
          debounce(function () {
            topTime_(
              ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
              "ContentItem-meta",
            );
          }, 300),
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
      collapsedNowAnswer("main div");
      collapsedNowAnswer(".Profile-main");
      GlobalObserver.add(
        debounce(function () {
          topTime_(
            ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
            "ContentItem-meta",
          );
        }, 300),
      );
      blockUsers("people");
      blockKeywords("people");
    } else if (location.pathname.includes("/collection/")) {
      // 收藏夹 //
      addTypeTips();
      addToQuestion();
      collapsedNowAnswer("main");
      collapsedNowAnswer(".CollectionsDetailPage");
      GlobalObserver.add(
        debounce(function () {
          topTime_(
            ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
            "ContentItem-meta",
          );
        }, 300),
      );
      blockKeywords("collection");
    } else if (location.pathname.includes("/pin/")) {
      // 想法 //
      backToTop("main[role=main]");
      GlobalObserver.add(
        debounce(function () {
          topTime_(".ContentItem.PinItem", "ContentItem-meta");
        }, 300),
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
        document.lastElementChild.appendChild(
          document.createElement("style"),
        ).textContent = style;
      }

      collapsedNowAnswer("main div");
      collapsedNowAnswer(".Topstory-container");
      if (location.pathname !== "/column-square") {
        GlobalObserver.add(
          debounce(function () {
            topTime_(".TopstoryItem", "ContentItem-meta");
          }, 300),
        );
        addTypeTips();
        addToQuestion();
        if (location.pathname == "/") {
          blockLowCount("index");
          blockUsers("index");
          blockKeywords("index");
          blockType();
        } else if (location.pathname == "/hot") {
          blockKeywords("index");
          blockHotOther();
        } else if (location.pathname == "/follow") {
          blockLowCount("follow");
          blockUsers("follow");
          blockKeywords("follow");
          blockType();
          blockType("follow");
        }
      }
    }
  }
})();
