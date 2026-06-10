import { GlobalObserver } from '../../shared/global-observer.js';
import { UrlChangeManager } from '../../shared/url-change.js';
import { createContentFilter } from '../../shared/content-filter.js';
import { menu_value, refreshMenu } from '../../shared/menu-framework.js';

var selectedTextForBlockKeywords = "";
// 规范化屏蔽词文本：压缩多余空白并去掉首尾空格
function normalizeBlockKeywordText(text) {
  return (text || "").replace(/\s+/g, " ").trim();
}

// 读取当前选中的文字，兼容输入框和普通页面选区
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

// 记录最近一次选中的文字，供右键脚本菜单 [添加选中文字到屏蔽词] 使用
export function rememberSelectedBlockKeyword() {
  const updateSelectedBlockKeyword = function () {
    selectedTextForBlockKeywords = getSelectedBlockKeywordText();
  };
  document.addEventListener("selectionchange", updateSelectedBlockKeyword);
  document.addEventListener("contextmenu", updateSelectedBlockKeyword, true);
  UrlChangeManager.add(function () {
    selectedTextForBlockKeywords = "";
  });
}

// 将当前选中的文字直接加入 [自定义屏蔽关键词] 列表
export function addSelectedKeywordToBlocklist() {
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
  refreshMenu(); // 同步刷新缓存的菜单值
  GM_notification({
    text: `已添加屏蔽词 [${keyword}]\n后续加载的标题/评论会按该关键词过滤~`,
    timeout: 4000,
  });
}

// 自定义屏蔽关键词（标题）
export function customBlockKeywords() {
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
    refreshMenu(); // 重新注册脚本菜单
  } else if (newBlockKeywords != null) {
    GM_setValue("menu_customBlockKeywords", newBlockKeywords.split("|"));
    refreshMenu(); // 重新注册脚本菜单
  }
}

// 屏蔽指定关键词
export function blockKeywords(type) {
  if (!menu_value("menu_blockKeywords")) return;
  if (
    !menu_value("menu_customBlockKeywords") ||
    menu_value("menu_customBlockKeywords").length < 1
  )
    return;
  // 关键词读一次并预小写，避免 observer 热路径里每个 item 重复读 GM 存储
  // （修改关键词后本来就需要刷新页面生效，缓存不会过期）
  const keywordsLower = menu_value("menu_customBlockKeywords")
    .filter(function (k) {
      return k !== "";
    })
    .map(function (k) {
      return k.toLowerCase();
    });
  switch (type) {
    case "index":
      blockKeywords_(
        ".Card.TopstoryItem.TopstoryItem-isRecommend",
        "Card TopstoryItem TopstoryItem-isRecommend",
      );
      break;
    case "follow":
      blockKeywords_(
        ".Card.TopstoryItem.TopstoryItem-isFollow",
        "Card TopstoryItem TopstoryItem-isFollow",
      );
      break;
    case "topic":
      blockKeywords_(".List-item.TopicFeedItem", "List-item TopicFeedItem");
      break;
    case "people":
      blockKeywords_(".List-item", "List-item");
      break;
    case "collection":
      blockKeywords_(
        ".Card.CollectionDetailPageItem",
        "Card CollectionDetailPageItem",
      );
      break;
    case "search":
      blockKeywords_search();
      break;
    case "comment":
      if (!menu_value("menu_blockKeywordsComment")) return; // 如果 [屏蔽关键词 - 评论区] 未启用则跳过
      blockKeywords_comment();
      break;
  }

  function blockKeywords_(selector, className) {
    var titleCSS = 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"]';
    createContentFilter({
      selector,
      className,
      processItem: function (item) {
        blockKeywords_1(item, titleCSS);
      },
      initialScan: function () {
        if (location.pathname === "/hot") {
          document.querySelectorAll(".HotItem").forEach(function (item1) {
            blockKeywords_1(item1, "h2.HotItem-title");
          });
        } else {
          document.querySelectorAll(selector).forEach(function (item1) {
            blockKeywords_1(item1, titleCSS);
          });
        }
      },
    });
  }

  function blockKeywords_search() {
    function blockKeywords_now() {
      if (location.search.includes("type=content") === false) return; // 目前只支持搜索页的 [综合]
      document
        .querySelectorAll(
          '.HotLanding-contentItem, .Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]',
        )
        .forEach(function (item1) {
          blockKeywords_1(item1, "a[data-za-detail-view-id]");
        });
    }

    setTimeout(blockKeywords_now, 2000);
    UrlChangeManager.add(function () {
      setTimeout(blockKeywords_now, 1000); // 网页 URL 变化后再次执行
    });

    const callback = (mutationsList) => {
      if (location.search.includes("type=content") === false) return; // 目前只支持搜索页的 [综合]
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          if (target.tagName === "DIV" && target.className === "") {
            let tt = target.querySelector(
              'div[class="Card SearchResult-Card"][data-za-detail-view-path-module="AnswerItem"], div[class="Card SearchResult-Card"][data-za-detail-view-path-module="PostItem"]',
            );
            if (tt) {
              blockKeywords_1(tt, "a[data-za-detail-view-id]");
            }
          }
        }
      }
    };
    GlobalObserver.add(callback);
  }

  function blockKeywords_comment() {
    function filterComment(comment) {
      let content = comment.querySelector(".CommentContent"); // 寻找评论文字所在元素
      if (!content) return;
      let text = content.textContent.toLowerCase(); // 全部转为小写（用来不区分大小写）
      content.querySelectorAll("img.sticker[alt]").forEach((img) => {
        text += img.alt.toLowerCase();
      }); // 将评论中的表情添加到待遍历的评论文字中

      for (const keyword of keywordsLower) {
        // 遍历关键词黑名单
        if (text.indexOf(keyword) > -1) {
          // 找到就删除该评论
          let originalNodes = Array.from(content.childNodes).map((n) =>
            n.cloneNode(true),
          );
          content.onclick = (e) => {
            if (
              e.target === content &&
              content.textContent === "[该评论已屏蔽，可点击显示]"
            ) {
              content.textContent = "";
              originalNodes.forEach((n) => content.appendChild(n));
            }
          };
          content.textContent = "[该评论已屏蔽，可点击显示]";
          // 必须停止匹配：此时 childNodes 已是占位符，
          // 再命中会把占位符当原文 clone，原评论无法恢复
          break;
        }
      }
    }

    const callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          if (
            target.tagName == "DIV" &&
            target.className.indexOf("css-") == 0 &&
            target.dataset.id == undefined
          ) {
            let item = target.querySelector(
              'a[href^="https://www.zhihu.com/people/"]>img.Avatar[alt][loading]',
            );
            if (item) {
              filterComment(
                item.parentElement.parentElement.parentElement.parentElement,
              );
            }
          }

          /*if (target.tagName == 'DIV' && target.dataset.id !== undefined) {
                        for (const node of target.querySelectorAll('*')) {
                            if (node.className === 'CommentItemV2-metaSibling') filterComment(node);
                        }
                    }*/
        }
      }
    };
    GlobalObserver.add(callback);
  }

  function blockKeywords_1(item1, css) {
    let item = item1.querySelector(css); // 标题所在元素
    if (item) {
      let text = (item.content || item.textContent).toLowerCase();
      for (const keyword of keywordsLower) {
        // 遍历关键词黑名单
        if (text.indexOf(keyword) > -1) {
          // 找到就删除该信息流
          item1.hidden = true;
          item1.style.display = "none";
          break;
        }
      }
    }
  }
}

// 屏蔽指定类别（视频/文章等）
