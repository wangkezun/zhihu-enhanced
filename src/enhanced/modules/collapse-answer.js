import { GlobalObserver } from '../../shared/global-observer.js';
import { UrlChangeManager } from '../../shared/url-change.js';
import { menu_value } from '../../shared/menu-framework.js';
import { isElementInViewport, isElementInViewport_, getXpath } from '../../shared/dom-utils.js';

// 已知会出现 "外层 wrapper 覆盖两侧空白" 的页面，容器 selector 用于坐标兜底判断。
// 知乎首页改版后两侧空白被新的 .Topstory wrapper 接管，event.target != bound element，
// 仅靠 event.target == this 命中不到。
// 用包含右侧 sidebar 的整体容器做矩形判断，避免点击 sidebar 被误判为空白。
const SIDE_BLANK_CONTAINER = ".Topstory-container";

function isClickOnSideBlank(event, boundEl) {
  if (event.target === boundEl) return true;
  // 点到链接/按钮等具体内容时一定不是空白
  if (
    event.target.closest(
      "a, button, input, textarea, img, video, [role='button']",
    )
  )
    return false;
  const container = document.querySelector(SIDE_BLANK_CONTAINER);
  if (!container) return false;
  const rect = container.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right;
}

// 默认收起回答的 handler（复用 GlobalObserver，避免创建第二个全局 subtree observer）
function collapsedAnswerHandler(mutations) {
  // 注意只能跳过当前 mutation（continue），不能 return：
  // 同一批 mutations 里还有其他待收起的回答
  for (const mutation of mutations) {
    if (mutation.target.nodeType !== Node.ELEMENT_NODE) continue;
    if (mutation.target.hasAttribute("script-collapsed")) continue;
    // 短的回答
    if (mutation.target.classList.contains("RichContent")) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.nodeType != Node.ELEMENT_NODE) continue;
        if (addedNode.className != "RichContent-inner") continue;
        if (addedNode.offsetHeight < 400) break;
        const button = mutation.target.querySelector(
          ".ContentItem-actions.Sticky [data-zop-retract-question]",
        );
        if (button) {
          mutation.target.setAttribute("script-collapsed", "");
          button.click();
          break;
        }
      }
      // 长的回答
    } else if (
      mutation.target.tagName === "DIV" &&
      !mutation.target.style.cssText &&
      !mutation.target.className
    ) {
      const parent = mutation.target.parentElement;
      if (!parent || parent.hasAttribute("script-collapsed")) continue;
      const button = mutation.target.querySelector(
        ".ContentItem-actions.Sticky [data-zop-retract-question]",
      );
      if (button) {
        parent.setAttribute("script-collapsed", "");
        button.click();
      }
    }
  }
}

let collapsedObserver = null;

export function getCollapsedAnswerObserver() {
  if (!collapsedObserver) {
    collapsedObserver = {
      _active: false,
      _handler: collapsedAnswerHandler,
      start() {
        if (!this._active) {
          GlobalObserver.add(this._handler);
          this._active = true;
        }
      },
      end() {
        if (this._active) {
          GlobalObserver.remove(this._handler);
          this._active = false;
        }
      },
    };

    UrlChangeManager.add(function () {
      if (!menu_value("menu_defaultCollapsedAnswer")) {
        // [默认收起回答] 关闭时，手动开启的 observer 只对当前页生效
        collapsedObserver.end();
      } else {
        collapsedObserver[
          location.href.includes("/answer/") ? "end" : "start"
        ]();
      }
    });
  }
  return collapsedObserver;
}

// 默认收起回答
export function defaultCollapsedAnswer() {
  if (!menu_value("menu_defaultCollapsedAnswer")) return;
  const observer = getCollapsedAnswerObserver();
  if (location.href.includes("/answer/") === false) {
    observer.start();
  }
}

// 一键收起回答+评论（全部）
export function collapsedAnswer() {
  if (!menu_value("menu_collapsedAnswer")) return;
  if (
    document.querySelector(".CornerAnimayedFlex") &&
    !document.getElementById("collapsed-button")
  ) {
    // 向网页中插入收起全部回答按钮+样式+绑定点击事件
    document.head.appendChild(document.createElement("style")).textContent =
      ".CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:45px !important;}";
    document
      .querySelector(".CornerAnimayedFlex")
      .insertAdjacentHTML(
        "afterBegin",
        '<button id="collapsed-button" data-tooltip="收起全部回答/评论" data-tooltip-position="left" data-tooltip-will-hide-on-click="false" aria-label="收起全部回答/评论" type="button" class="' +
          document.querySelector(".CornerAnimayedFlex>button").className +
          '"><svg class="ContentItem-arrowIcon is-active" aria-label="收起全部回答/评论" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg></button>',
      );
    document.getElementById("collapsed-button").onclick = function () {
      // 收起所有评论（悬浮的 [收起评论]）
      document.querySelectorAll(".Comments-container").forEach(function (el) {
        let commentCollapseButton = getXpath('//button[text()="收起评论"]', el);
        if (commentCollapseButton) commentCollapseButton.click();
      });
      // 收起所有评论（固定的 [收起评论]）
      document
        .querySelectorAll(
          ".RichContent >.ContentItem-actions>button:first-of-type",
        )
        .forEach(function (el) {
          if (el.textContent.includes("收起评论")) el.click();
        });

      if (
        location.pathname === "/" ||
        location.pathname === "/hot" ||
        location.pathname === "/follow"
      ) {
        // 对于首页的关注、推荐、热榜
        document
          .querySelectorAll(".ContentItem-rightButton")
          .forEach(function (el) {
            if (el.hasAttribute("data-zop-retract-question")) {
              el.click();
            }
          });
      } else {
        // 被 getCollapsedAnswerObserver 函数收起过的，固定 [收起] 按钮
        document
          .querySelectorAll("[script-collapsed]")
          .forEach(function (scriptCollapsed) {
            scriptCollapsed
              .querySelectorAll(
                ".ContentItem-actions [data-zop-retract-question], .ContentItem-actions.Sticky [data-zop-retract-question]",
              )
              .forEach(function (button) {
                button.click();
              });
          });
        // 被 getCollapsedAnswerObserver 函数收起过的，悬浮 [收起] 按钮（悬浮底部的横栏）
        document
          .querySelectorAll(
            ".RichContent:not([script-collapsed]) .ContentItem-actions.Sticky [data-zop-retract-question]",
          )
          .forEach(function (button) {
            let el = button.parentElement;
            while (!el.classList.contains("RichContent")) {
              el = el.parentElement;
            }
            if (el) el.setAttribute("script-collapsed", "");
            button.click();
          });

        // [默认收起回答] 关闭时，getCollapsedAnswerObserver 内注册的
        // URL handler 会在下次导航时自动 end()
        getCollapsedAnswerObserver().start();
      }
    };
  }
}

// 收起当前回答、评论（监听点击事件，点击网页两侧空白处）
export function collapsedNowAnswer(selectors) {
  backToTop(selectors); // 快捷回到顶部
  if (!menu_value("menu_collapsedNowAnswer")) return;
  const el = document.querySelector(selectors);
  if (!el) return;
  el.onclick = function (event) {
    if (isClickOnSideBlank(event, this)) {
      // 下面这段主要是 [收起回答]，顺便 [收起评论]（如果展开了的话）
      let rightButton = document.querySelector(
        ".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom",
      );
      if (rightButton) {
        // 悬浮在底部的 [收起回答]（此时正在浏览回答内容 [中间区域]）
        // 固定的 [收起评论]（先看看是否展开评论）
        let commentCollapseButton = rightButton.querySelector(
          "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
        );
        if (
          commentCollapseButton &&
          commentCollapseButton.textContent.includes("收起评论")
        )
          commentCollapseButton.click();
        // 再去收起回答
        rightButton = rightButton.querySelector(
          ".ContentItem-rightButton[data-zop-retract-question]",
        );
        if (rightButton) rightButton.click();
      } else {
        // 固定在回答底部的 [收起回答]（此时正在浏览回答内容 [尾部区域]）

        let answerCollapseButton_ = false;
        for (let el of document.querySelectorAll(
          ".ContentItem-rightButton[data-zop-retract-question]",
        )) {
          // 遍历所有回答底部的 [收起] 按钮
          if (isElementInViewport(el)) {
            // 判断该 [收起] 按钮是否在可视区域内
            // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
            let commentCollapseButton = el.parentNode.querySelector(
              "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
            );
            // 如果展开了评论，就收起评论
            //if (commentCollapseButton && commentCollapseButton.textContent.includes('收起评论')) commentCollapseButton.click();
            if (
              commentCollapseButton &&
              commentCollapseButton.textContent.includes("收起评论")
            ) {
              commentCollapseButton.click();
              if (!isElementInViewport(commentCollapseButton))
                scrollTo(0, el.offsetTop + 50);
            }
            el.click(); // 再去收起回答
            answerCollapseButton_ = true; // 如果找到并点击收起了，就没必要执行下面的代码了（可视区域中没有 [收起回答] 时）
            break;
          }
        }
        // 针对完全看不到 [收起回答] 按钮时（如 [头部区域]，以及部分明明很长却不显示悬浮横条的回答）
        if (!answerCollapseButton_) {
          for (let el of document.querySelectorAll(
            ".List-item, .Card.AnswerCard, .Card.TopstoryItem",
          )) {
            // 遍历所有回答主体元素
            if (isElementInViewport_(el)) {
              // 判断该回答是否在可视区域内
              // 固定的 [收起评论]（先看看是否展开评论，即存在 [收起评论] 按钮）
              let commentCollapseButton = el.querySelector(
                "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
              );
              // 如果展开了评论，就收起评论
              if (
                commentCollapseButton &&
                commentCollapseButton.textContent.includes("收起评论")
              ) {
                commentCollapseButton.click();
                if (!isElementInViewport(commentCollapseButton))
                  scrollTo(0, el.offsetTop + 50);
              }
              let answerCollapseButton__ = el.querySelector(
                ".ContentItem-rightButton[data-zop-retract-question]",
              );
              if (answerCollapseButton__) answerCollapseButton__.click(); // 再去收起回答
              break;
            }
          }
        }
      }

      // 下面这段只针对 [收起评论]（如果展开了的话）
      let commentCollapseButton_ = false,
        commentCollapseButton__ = false;
      // 悬浮的 [收起评论]（此时正在浏览评论内容 [中间区域]）
      let commentCollapseButton = getXpath(
        '//button[text()="收起评论"]',
        document.querySelector(".Comments-container"),
      );
      if (commentCollapseButton) {
        commentCollapseButton.click();
      } else {
        // 固定的 [收起评论]（此时正在浏览评论内容 [头部区域]）
        let commentCollapseButton_1 = document.querySelectorAll(
          ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type, .ContentItem-action > button.Button.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
        );
        if (commentCollapseButton_1.length > 0) {
          for (let el of commentCollapseButton_1) {
            if (el.textContent.includes("收起评论")) {
              if (isElementInViewport(el)) {
                el.click();
                commentCollapseButton_ = true; // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 [收起评论] 时）
                break;
              }
            }
          }
        }
        if (commentCollapseButton_ == false) {
          // 可视区域中没有 [收起评论] 时（此时正在浏览评论内容 [头部区域] + [尾部区域](不上不下的，既看不到固定的 [收起评论] 又看不到悬浮的 [收起评论])），需要判断可视区域中是否存在评论元素
          let commentCollapseButton_1 = document.querySelectorAll(
            ".Comments-container",
          );
          if (commentCollapseButton_1.length > 0) {
            for (let el of commentCollapseButton_1) {
              if (isElementInViewport(el)) {
                let parentElement =
                  el.closest(".List-item") ||
                  el.closest(".Card");
                if (!parentElement) continue;
                let commentCollapseButton = parentElement.querySelector(
                  ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
                );
                if (
                  commentCollapseButton &&
                  commentCollapseButton.textContent.includes("收起评论")
                ) {
                  commentCollapseButton.click();
                  if (!isElementInViewport(commentCollapseButton)) {
                    scrollTo(
                      0,
                      parentElement.offsetTop + parentElement.offsetHeight - 50,
                    );
                  }
                  commentCollapseButton__ = true; // 如果找到并点击了，就没必要执行下面的代码了（可视区域中没有 评论元素 时）
                  break;
                }
              }
            }
          }
          if (commentCollapseButton__ == false) {
            // 如果上面的都没找到，那么就尝试寻找评论末尾的 [评论回复框]
            let commentCollapseButton_2 =
              document.querySelectorAll(".Editable-content");
            if (commentCollapseButton_2.length > 0) {
              for (let el of commentCollapseButton_2) {
                if (isElementInViewport(el)) {
                  let parentElement =
                    el.closest(".List-item") ||
                    el.closest(".Card");
                  if (!parentElement) continue;
                  let commentCollapseButton = parentElement.querySelector(
                    ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type",
                  );
                  if (
                    commentCollapseButton &&
                    commentCollapseButton.textContent.includes("收起评论")
                  ) {
                    commentCollapseButton.click();
                    if (!isElementInViewport(commentCollapseButton)) {
                      scrollTo(
                        0,
                        parentElement.offsetTop +
                          parentElement.offsetHeight -
                          50,
                      );
                    }
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
  };
}

// 回到顶部（监听点击事件，鼠标右键点击网页两侧空白处）
export function backToTop(selectors) {
  if (!menu_value("menu_backToTop")) return;
  const el = document.querySelector(selectors);
  if (!el) return;
  el.oncontextmenu = function (event) {
    if (isClickOnSideBlank(event, this)) {
      event.preventDefault();
      window.scrollTo(0, 0);
    }
  };
}

