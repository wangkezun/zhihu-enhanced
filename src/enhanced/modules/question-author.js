import { GlobalObserver } from '../../shared/global-observer.js';
import { escapeHtml } from '../../shared/escape-html.js';
import { menu_value } from '../../shared/menu-framework.js';

export function question_author() {
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

export function questionRichTextMore() {
  if (!menu_value("menu_questionRichTextMore")) return;
  let button = document.querySelector("button.QuestionRichText-more");
  if (button) button.click();
}

// 移除登录弹窗

export function questionInvitation() {
  var _qiHandler = function () {
    let q = document.querySelector(".QuestionInvitation-content");
    if (!q) return;
    GlobalObserver.remove(_qiHandler);
    q.style.display = "none";
    document.querySelector(".QuestionInvitation-title").innerHTML =
      document.querySelector(".QuestionInvitation-title").innerText +
      '<span style="cursor: pointer; font-size: 14px; color: #919aae;"> 展开/折叠</span>';
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
