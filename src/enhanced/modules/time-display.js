import { menu_value } from '../../shared/menu-framework.js';

export function topTime_processItem(_this, classs) {
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

export function topTime_(css, classs) {
  document.querySelectorAll(css).forEach(function (_this) {
    topTime_processItem(_this, classs);
  });
}

// 完整显示时间 + 置顶显示时间 - 文章
export function topTime_post() {
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
export function question_time() {
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

export function createIncrementalTopTimeHandler(css, classs) {
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

