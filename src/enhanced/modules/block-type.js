import { GlobalObserver } from '../../shared/global-observer.js';
import { UrlChangeManager } from '../../shared/url-change.js';
import { menu_value } from '../../shared/menu-framework.js';

export function blockType(type) {
  let name;
  // 一开始加载的信息流 + 添加标签样式
  if (type === "search") {
    // 搜索页
    if (
      !menu_value("menu_blockTypeVideo") &&
      !menu_value("menu_blockTypeArticle") &&
      !menu_value("menu_blockTypePin") &&
      !menu_value("menu_blockTypeTopic") &&
      !menu_value("menu_blockTypeSearch")
    )
      return;
    if (menu_value("menu_blockTypeSearch") && location.pathname === "/search")
      setTimeout(function () {
        document.querySelectorAll(".RelevantQuery").forEach((r) => {
          r.parentElement.parentElement.hidden = true;
        });
      }, 2000);
    name =
      "h2.ContentItem-title a:not(.zhihu_e_toQuestion), a.KfeCollection-PcCollegeCard-link, h2.SearchTopicHeader-Title a";
    addSetInterval_(name);
  } else if (type === "question") {
    // 问题页
    if (!menu_value("menu_blockTypeVideo")) return;
    document.head.appendChild(
      document.createElement("style"),
    ).textContent =
      `.VideoAnswerPlayer, .VideoAnswerPlayer video, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {display: none !important;}`;
    name = ".VideoAnswerPlayer";
    document.querySelectorAll(name).forEach(function (item) {
      blockType_(item);
    });
  } else if (type === "follow") {
    // 首页 - 关注
    if (
      !menu_value("menu_blockTypeFollowAgree") &&
      !menu_value("menu_blockTypeFollowQuestion")
    )
      return;
    if (menu_value("menu_blockTypeFollowAgree"))
      name = ".TopstoryItem-isFollow .FeedSource-byline"; // 赞同了XX
    if (menu_value("menu_blockTypeFollowQuestion")) {
      if (name) {
        name +=
          ",.ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)";
      } else {
        name =
          ".ContentItem[data-za-detail-view-path-module=QuestionItem]:not(.AnswerItem):not(.PinItem)";
      }
    } // 关注了XX
    if (!name) return;
    document.querySelectorAll(name).forEach(function (item) {
      blockType_(item);
    });
  } else {
    // 首页
    if (
      !menu_value("menu_blockTypeVideo") &&
      !menu_value("menu_blockTypeArticle") &&
      !menu_value("menu_blockTypePin")
    )
      return;
    if (menu_value("menu_blockTypeVideo"))
      document.head.appendChild(
        document.createElement("style"),
      ).textContent =
        `.Card .ZVideoItem-video, .VideoAnswerPlayer video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}`;
    name = "h2.ContentItem-title a:not(.zhihu_e_toQuestion)";
    if (menu_value("menu_blockTypePin"))
      name =
        "h2.ContentItem-title a:not(.zhihu_e_toQuestion), .ContentItem.PinItem";
    document.querySelectorAll(name).forEach(function (item) {
      blockType_(item);
    });
  }

  // 后续加载的信息流
  GlobalObserver.add((mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        if (
          target.className === "Card SearchResult-Card" &&
          target.dataset.zaDetailViewPathModule === undefined
        ) {
          // 移除相关搜索
          if (
            menu_value("menu_blockTypeSearch") &&
            location.pathname === "/search" &&
            location.search.includes("type=content")
          )
            target.hidden = true;
        } else {
          blockType_(target.querySelector(name));
        }
      }
    }
  });

  UrlChangeManager.add(function () {
    addSetInterval_(name);
    // 移除相关搜索
    if (
      menu_value("menu_blockTypeSearch") &&
      location.pathname === "/search" &&
      location.search.includes("type=content")
    )
      setTimeout(function () {
        document.querySelectorAll(".RelevantQuery").forEach((r) => {
          r.parentElement.parentElement.hidden = true;
        });
      }, 1500);
  });

  function blockType_(titleA) {
    if (!titleA) return; // 判断是否为真
    if (location.pathname === "/search") {
      // 搜索页
      if (location.search.includes("type=content") === false) return; //   仅限搜索页的 [综合]
      if (
        titleA.href.includes("/zvideo/") ||
        titleA.href.includes("video.zhihu.com")
      ) {
        // 如果是视频
        if (menu_value("menu_blockTypeVideo"))
          titleA.closest(".Card").remove();
      } else if (titleA.href.includes("zhuanlan.zhihu.com")) {
        // 如果是文章
        if (menu_value("menu_blockTypeArticle"))
          titleA.closest(".Card.SearchResult-Card").hidden = true;
      } else if (titleA.href.includes("/topic/")) {
        //            如果是话题
        if (menu_value("menu_blockTypeTopic"))
          titleA.closest(".Card.SearchResult-Card").hidden = true;
      } else if (titleA.href.includes("/market/")) {
        //           如果是杂志文章等乱七八糟的
        if (menu_value("menu_blockTypeSearch"))
          titleA.closest(".Card.SearchResult-Card").hidden = true;
      }
    } else if (location.pathname.includes("/question/")) {
      // 问题页
      if (menu_value("menu_blockTypeVideo"))
        titleA.closest(".List-item").hidden = true;
    } else if (location.pathname.includes("/follow")) {
      // 首页 - 关注
      if (type === "follow") {
        if (
          (menu_value("menu_blockTypeFollowAgree") &&
            titleA.className.includes("FeedSource-byline")) ||
          (menu_value("menu_blockTypeFollowQuestion") &&
            titleA.dataset.zaDetailViewPathModule == "QuestionItem")
        )
          titleA.closest(".Card.TopstoryItem.TopstoryItem-isFollow").hidden = true; // 赞同了XX + 关注了XX
      }
      if (
        titleA.className == "ContentItem PinItem" &&
        menu_value("menu_blockTypePin")
      )
        titleA.closest(".Card.TopstoryItem.TopstoryItem-isFollow").hidden = true; // 如果是想法
    } else {
      // 首页
      if (titleA.className == "ContentItem PinItem") {
        // 如果是想法（针对无标题）
        if (menu_value("menu_blockTypePin"))
          titleA.closest(".Card.TopstoryItem.TopstoryItem-isRecommend").hidden = true;
      } else if (
        titleA.href.includes("/zvideo/") ||
        titleA.href.includes("video.zhihu.com")
      ) {
        // 如果是视频
        if (menu_value("menu_blockTypeVideo")) {
          titleA.closest(".Card.TopstoryItem.TopstoryItem-isRecommend").hidden = true;
        }
      } else if (titleA.href.includes("/answer/")) {
        //           如果是问题（视频回答）
        if (
          titleA.closest(".ContentItem.AnswerItem").querySelector(
            ".VideoAnswerPlayer",
          )
        ) {
          if (menu_value("menu_blockTypeVideo")) {
            titleA.closest(".Card.TopstoryItem.TopstoryItem-isRecommend").hidden = true;
            titleA.closest(".ContentItem.AnswerItem").remove();
          }
        }
      } else if (titleA.href.includes("/education/video-course/")) {
        // 如果是视频课程
        if (menu_value("menu_blockTypeVideo")) {
          titleA.closest(".Card.TopstoryItem.TopstoryItem-isRecommend").hidden = true;
        }
      } else if (titleA.href.includes("zhuanlan.zhihu.com")) {
        // 如果是文章
        if (menu_value("menu_blockTypeArticle"))
          titleA.closest(".Card.TopstoryItem.TopstoryItem-isRecommend").hidden = true;
      }
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
        blockType_(item);
      });
      return;
    }
    var _handler = function () {
      let aTag = document.querySelectorAll(A);
      if (aTag.length > 0) {
        GlobalObserver.remove(_handler);
        if (pendingHandler === _handler) pendingHandler = null;
        aTag.forEach(function (item) {
          blockType_(item);
        });
      }
    };
    pendingHandler = _handler;
    GlobalObserver.add(_handler);
  }
}

// 寻找父元素

export function blockYanXuan() {
  if (!menu_value("menu_blockYanXuan")) return;
  const blockYanXuan_question = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        if (
          target.className === "List-item" ||
          target.className === "Card AnswerCard"
        ) {
          if (
            target.querySelector(
              ".KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn",
            )
          ) {
            target.hidden = true;
          }
        }
      }
    }
  };

  const blockYanXuan_question_answer = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.nodeType != 1) continue;
        target
          .querySelectorAll(".List-item, .Card.AnswerCard")
          .forEach(function (item) {
            if (
              item.querySelector(
                ".KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn",
              )
            ) {
              item.hidden = true;
            }
          });
      }
    }
  };

  if (location.pathname.includes("/answer/")) {
    // 回答页（就是只有三个回答的页面）
    GlobalObserver.add(blockYanXuan_question_answer);
  } else {
    // 问题页（可以显示所有回答的页面）
    GlobalObserver.add(blockYanXuan_question);
  }

  // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
  document
    .querySelectorAll(".List-item, .Card.AnswerCard")
    .forEach(function (item) {
      if (
        item.querySelector(
          ".KfeCollection-AnswerTopCard-Container, .KfeCollection-PurchaseBtn",
        )
      ) {
        item.hidden = true;
      }
    });
}

// 区分问题文章

export function blockHotOther() {
  if (!menu_value("menu_blockTypeLiveHot")) return;

  const isQuestionItem = (hotItem) => {
    const linkItem = hotItem.querySelector(".HotItem-content a");
    if (linkItem === null) return false;
    return /\/question\/\d+/.test(linkItem.href);
  };

  const block = () => {
    removeLiveItems();
    fixItemRank();
  };

  // 移除非问题的内容
  const removeLiveItems = () => {
    const hotItems = document.querySelectorAll(".HotList-list .HotItem");
    for (const item of hotItems) {
      if (!isQuestionItem(item)) item.remove();
    }
  };

  // 修复排行榜序号
  const fixItemRank = () => {
    const hotItems = document.querySelectorAll(
      ".HotList-list .HotItem:not([hidden])",
    );
    hotItems.forEach((item, index) => {
      const rank = item.querySelector(".HotItem-index .HotItem-rank");
      if (rank !== null) rank.innerText = index + 1;
    });
  };

  const blockLive_content = (mutationsList) => {
    for (const mutation of mutationsList) {
      for (const target of mutation.addedNodes) {
        if (target.classList.contains("HotItem")) {
          block();
        }
      }
    }
  };

  GlobalObserver.add(blockLive_content);

  // 初始移除
  block();
}

// 将关注/推荐/热榜/专栏的选项去掉默认的点击事件改成静态链接（针对首页互相切换（知乎这里切换是动态加载的），为了避免功能交叉混乱
// 针对所有页面
