import { GlobalObserver } from '../../shared/global-observer.js';
import { UrlChangeManager } from '../../shared/url-change.js';
import { createContentFilter } from '../../shared/content-filter.js';
import { menu_value, refreshMenu } from '../../shared/menu-framework.js';
import { escapeHtml } from '../../shared/escape-html.js';

export function customBlockUsers() {
  let nowBlockUsers = "";
  menu_value("menu_customBlockUsers").forEach(function (item) {
    nowBlockUsers += "|" + item;
  });
  let newBlockUsers = prompt(
    '编辑 [自定义屏蔽用户]\n（不同用户名之间使用 "|" 分隔，例如：用户A|用户B|用户C ）',
    nowBlockUsers.slice(1),
  );
  if (newBlockUsers === "") {
    GM_setValue("menu_customBlockUsers", []);
    refreshMenu(); // 重新注册脚本菜单
  } else if (newBlockUsers != null) {
    GM_setValue("menu_customBlockUsers", newBlockUsers.split("|"));
    refreshMenu(); // 重新注册脚本菜单
  }
}

// 屏蔽指定用户
export function blockUsers(type) {
  if (!menu_value("menu_blockUsers")) return;
  if (
    !menu_value("menu_customBlockUsers") ||
    menu_value("menu_customBlockUsers").length < 1
  )
    return;
  // 屏蔽列表读一次，避免 observer 热路径里每个 item 重复读 GM 存储
  // （修改列表后本来就需要刷新页面生效，缓存不会过期）
  const users = menu_value("menu_customBlockUsers");

  // dataset.zop 是 JSON，直接解析取 authorName，
  // 避免字符串拼接匹配对键序/转义的脆弱假设
  function isBlockedAuthor(contentItem) {
    const zop = contentItem.dataset.zop;
    if (!zop) return false;
    try {
      return users.includes(JSON.parse(zop).authorName);
    } catch (e) {
      return false;
    }
  }

  switch (type) {
    case "index":
      blockUsers_(
        ".Card.TopstoryItem.TopstoryItem-isRecommend",
        "Card TopstoryItem TopstoryItem-isRecommend",
      );
      break;
    case "follow":
      blockUsers_(
        ".Card.TopstoryItem.TopstoryItem-isFollow",
        "Card TopstoryItem TopstoryItem-isFollow",
      );
      break;
    case "question":
      blockUsers_question();
      break;
    case "search":
      blockUsers_search();
      break;
    case "topic":
      blockUsers_(".List-item.TopicFeedItem", "List-item TopicFeedItem");
      break;
    case "people":
      blockUsers_button_people(); // 添加屏蔽用户按钮（用户主页）
      break;
  }
  blockUsers_comment(); //       评论区
  blockUsers_button(); //        加入黑名单按钮（用户信息悬浮框中）

  function blockUsers_(selector, className) {
    createContentFilter({
      selector,
      className,
      processItem: function (container) {
        let item = container.querySelector(
          ".ContentItem.AnswerItem, .ContentItem.ArticleItem",
        );
        if (item && isBlockedAuthor(item)) {
          container.hidden = true;
        }
      },
    });
  }

  function blockUsers_question() {
    const blockUsers_question_ = (mutationsList) => {
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          if (
            target.className === "List-item" ||
            target.className === "Card AnswerCard"
          ) {
            let item1 = target.querySelector(".ContentItem.AnswerItem");
            if (item1 && isBlockedAuthor(item1)) {
              target.hidden = true;
            }
          }
        }
      }
    };

    const blockUsers_question_answer_ = (mutationsList) => {
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          target
            .querySelectorAll(".List-item, .Card.AnswerCard")
            .forEach(function (item) {
              let item1 = item.querySelector(".ContentItem.AnswerItem");
              if (item1 && isBlockedAuthor(item1)) {
                item.hidden = true;
              }
            });
        }
      }
    };

    if (location.pathname.includes("/answer/")) {
      // 回答页（就是只有三个回答的页面）
      GlobalObserver.add(blockUsers_question_answer_);
    } else {
      // 问题页（可以显示所有回答的页面）
      GlobalObserver.add(blockUsers_question_);
    }

    // 针对的是打开网页后直接加载的前面几个回答（上面哪些是针对动态加载的回答）
    document
      .querySelectorAll(".List-item, .Card.AnswerCard")
      .forEach(function (item) {
        let item1 = item.querySelector(".ContentItem.AnswerItem");
        if (item1 && isBlockedAuthor(item1)) {
          item.hidden = true;
        }
      });
  }

  function blockUsers_search() {
    function blockUsers_now() {
      if (location.search.includes("type=content") === false) return; // 目前只支持搜索页的 [综合]
      document
        .querySelectorAll(
          '.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"], .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"]',
        )
        .forEach(function (item1) {
          let item = item1.querySelector(
            ".RichText.ztext.CopyrightRichText-richText b",
          ); // 用户名所在元素
          if (item && item.textContent !== "" && users.includes(item.textContent)) {
            // 找到就删除该信息流
            item1.hidden = true;
          }
        });
    }

    setTimeout(blockUsers_now, 2000);
    UrlChangeManager.add(function () {
      setTimeout(blockUsers_now, 1000); // 网页 URL 变化后再次执行
    });

    const callback = (mutationsList) => {
      if (location.search.includes("type=content") === false) return; // 目前只支持搜索页的 [综合]
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          let item = target.querySelector(
            '.Card.SearchResult-Card[data-za-detail-view-path-module="AnswerItem"] .RichText.ztext.CopyrightRichText-richText b, .Card.SearchResult-Card[data-za-detail-view-path-module="PostItem"] .RichText.ztext.CopyrightRichText-richText b',
          );
          if (item && item.textContent !== "" && users.includes(item.textContent)) {
            // 找到就删除该信息流
            target.hidden = true;
          }
        }
      }
    };
    GlobalObserver.add(callback);
  }

  function blockUsers_comment() {
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
            if (item && users.includes(item.alt)) {
              // 找到就删除该评论
              item.parentElement.parentElement.parentElement.parentElement.style.display =
                "none";
            }
          }
        }
      }
    };
    GlobalObserver.add(callback);
  }

  // 添加屏蔽用户按钮（用户信息悬浮框中）
  function blockUsers_button() {
    const callback = (mutationsList) => {
      for (const mutation of mutationsList) {
        for (const target of mutation.addedNodes) {
          if (target.nodeType != 1) continue;
          if (
            target.tagName == "DIV" &&
            target.className &&
            (target.className.indexOf("css-") == 0 ||
              target.style.cssText === "opacity: 1;")
          ) {
            const item = target.querySelector(
                ".MemberButtonGroup.ProfileButtonGroup.HoverCard-buttons",
              ),
              item1 = target.querySelector(
                "img.Avatar+div span.UserLink>a.UserLink-link[data-za-detail-view-element_name=User]",
              );
            if (item1) {
              const name = item1.textContent,
                userid = item1.href.split("/")[4];
              for (let num = 0; num < users.length; num++) {
                // 判断是否已存在
                if (users[num] === name) {
                  // 已存在
                  target
                    .querySelectorAll(".Button.Button--primary.Button--red")
                    .forEach(function (item) {
                      item.style.display = "none";
                    }); // 隐藏知乎自带的已屏蔽按钮
                  item.insertAdjacentHTML(
                    "afterbegin",
                    `<button type="button" data-name="${escapeHtml(name)}" data-userid="${escapeHtml(userid)}" class="Button FollowButton Button--primary Button--red"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Ban" fill="currentColor"><path fill-rule="evenodd" d="M16.346 18.113a7.5 7.5 0 0 1-10.46-10.46l10.46 10.46Zm1.767-1.767L7.654 5.886a7.5 7.5 0 0 1 10.46 10.46ZM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" clip-rule="evenodd"></path></svg></span> 已屏蔽</button>`,
                  );
                  item.firstElementChild.onclick = function () {
                    this.disabled = true;
                    blockUsers_button_del(
                      this.dataset.name,
                      this.dataset.userid,
                      false,
                    );
                  };
                  return;
                }
              }
              if (
                item &&
                !target.querySelector("button[data-name][data-userid]")
              ) {
                item.insertAdjacentHTML(
                  "beforeend",
                  `<button type="button" data-name="${escapeHtml(name)}" data-userid="${escapeHtml(userid)}" class="Button FollowButton Button--primary Button--red" style="width: 100%;margin: 7px 0 0 0;"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Ban" fill="currentColor"><path fill-rule="evenodd" d="M16.346 18.113a7.5 7.5 0 0 1-10.46-10.46l10.46 10.46Zm1.767-1.767L7.654 5.886a7.5 7.5 0 0 1 10.46 10.46ZM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" clip-rule="evenodd"></path></svg></span> 屏蔽用户</button>`,
                );
                item.lastElementChild.onclick = function () {
                  this.disabled = true;
                  blockUsers_button_add(
                    this.dataset.name,
                    this.dataset.userid,
                    false,
                  );
                };
              }
            }
          }
        }
      }
    };
    GlobalObserver.add(callback);
  }

  // 添加屏蔽用户按钮（用户主页）
  function blockUsers_button_people() {
    let item = document.querySelector(
        ".MemberButtonGroup.ProfileButtonGroup.ProfileHeader-buttons",
      ), // 获取按钮元素位置
      name = document.querySelector(".ProfileHeader-name").firstChild
        .textContent, // 获取用户名
      users = menu_value("menu_customBlockUsers"), // 读取屏蔽列表
      userid = location.href.split("/")[4];
    for (let num = 0; num < users.length; num++) {
      // 判断是否已存在
      if (users[num] === name) {
        // 已存在
        document
          .querySelectorAll(".Button.Button--primary.Button--red")
          .forEach(function (item) {
            item.style.display = "none";
          }); // 隐藏知乎自带的已屏蔽按钮
        item.insertAdjacentHTML(
          "afterbegin",
          `<button type="button" data-name="${escapeHtml(name)}" data-userid="${escapeHtml(userid)}" class="Button FollowButton Button--primary Button--red" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Ban" fill="currentColor"><path fill-rule="evenodd" d="M16.346 18.113a7.5 7.5 0 0 1-10.46-10.46l10.46 10.46Zm1.767-1.767L7.654 5.886a7.5 7.5 0 0 1 10.46 10.46ZM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" clip-rule="evenodd"></path></svg></span> 已屏蔽</button>`,
        );
        item.firstElementChild.onclick = function () {
          this.disabled = true;
          blockUsers_button_del(this.dataset.name, this.dataset.userid, true);
        };
        return;
      }
    }
    if (item) {
      item.insertAdjacentHTML(
        "beforeend",
        `<button type="button" data-name="${escapeHtml(name)}" data-userid="${escapeHtml(userid)}" class="Button FollowButton Button--primary Button--red" style="margin: 0 0 0 12px;"><span style="display: inline-flex; align-items: center;">​<svg width="1.2em" height="1.2em" viewBox="0 0 24 24" class="Zi Zi--Ban" fill="currentColor"><path fill-rule="evenodd" d="M16.346 18.113a7.5 7.5 0 0 1-10.46-10.46l10.46 10.46Zm1.767-1.767L7.654 5.886a7.5 7.5 0 0 1 10.46 10.46ZM22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z" clip-rule="evenodd"></path></svg></span> 屏蔽用户</button>`,
      );
      item.lastElementChild.onclick = function () {
        this.disabled = true;
        blockUsers_button_add(this.dataset.name, this.dataset.userid, true);
      };
    }
  }

  // 屏蔽用户按钮绑定事件（添加）
  function blockUsers_button_add(name, userid, reload) {
    if (!name || !userid) return;
    if (!/^[\w-]+$/.test(userid)) return;
    let users = menu_value("menu_customBlockUsers"), // 读取屏蔽列表
      index = users.indexOf(name);
    if (index === -1) {
      users.push(name); // 追加用户名
      GM_setValue("menu_customBlockUsers", users); // 写入屏蔽列表
      // 加入知乎自带的黑名单（和本脚本互补~
      GM_xmlhttpRequest({
        url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,
        method: "POST",
        timeout: 2000,
      });
      // 是否刷新本页
      if (reload) {
        setTimeout(function () {
          location.reload();
        }, 200); // 刷新网页，延迟 200 毫秒，避免知乎反应慢~
      } else {
        GM_notification({
          text: `该用户已被屏蔽~\n刷新网页后生效~`,
          timeout: 3000,
        });
      }
    } else {
      GM_notification({
        text: `该用户已经被屏蔽啦，无需重复屏蔽~`,
        timeout: 3000,
      });
    }
  }

  // 屏蔽用户按钮绑定事件（删除）
  function blockUsers_button_del(name, userid, reload) {
    if (!name || !userid) return;
    if (!/^[\w-]+$/.test(userid)) return;
    let users = menu_value("menu_customBlockUsers"), // 读取屏蔽列表
      index = users.indexOf(name);
    if (index > -1) {
      users.splice(index, 1); // 移除用户名
      GM_setValue("menu_customBlockUsers", users); // 写入屏蔽列表
      // 移除知乎自带的黑名单
      GM_xmlhttpRequest({
        url: `https://www.zhihu.com/api/v4/members/${userid}/actions/block`,
        method: "DELETE",
        timeout: 2000,
      });
      // 是否刷新本页
      if (reload) {
        setTimeout(function () {
          location.reload();
        }, 200); // 刷新网页，延迟 200 毫秒，避免知乎反应慢~
      } else {
        GM_notification({
          text: `该用户已取消屏蔽啦~\n刷新网页后生效~`,
          timeout: 3000,
        });
      }
    } else {
      GM_notification({ text: `没有在屏蔽列表中找到该用户...`, timeout: 3000 });
    }
  }
}

// 缓存最近一次选中的文字，避免从右键脚本菜单回调中取不到当前选区
