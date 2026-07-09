import { menu_value, refreshMenu } from '../../shared/menu-framework.js';

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

export function rememberSelectedBlockKeyword() {
  const updateSelectedBlockKeyword = function () {
    selectedTextForBlockKeywords = getSelectedBlockKeywordText();
  };
  document.addEventListener("selectionchange", updateSelectedBlockKeyword);
  document.addEventListener("contextmenu", updateSelectedBlockKeyword, true);
}

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
  refreshMenu();
  GM_notification({
    text: `已添加屏蔽词 [${keyword}]\n后续加载的标题/评论会按该关键词过滤~`,
    timeout: 4000,
  });
}

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
    refreshMenu();
  } else if (newBlockKeywords != null) {
    GM_setValue("menu_customBlockKeywords", newBlockKeywords.split("|"));
    refreshMenu();
  }
}

export const SELECTOR_TITLE = 'h2.ContentItem-title meta[itemprop="name"], meta[itemprop="headline"], a[data-za-detail-view-id]'

export function processTitle(item) {
  const keywords = getKeywords()
  if (!keywords.length) return
  const text = (item.content || item.textContent).toLowerCase()
  for (const kw of keywords) {
    if (text.includes(kw)) {
      const card = item.closest('.Card, .List-item, .HotItem')
      if (card) { card.hidden = true; card.style.display = 'none' }
      return
    }
  }
}

export const SELECTOR_COMMENT = '.CommentContent'

export function processComment(content) {
  const keywords = getKeywords()
  if (!keywords.length) return
  let text = content.textContent.toLowerCase()
  content.querySelectorAll('img.sticker[alt]').forEach(img => { text += img.alt.toLowerCase() })
  for (const kw of keywords) {
    if (text.includes(kw)) {
      const originalNodes = Array.from(content.childNodes).map(n => n.cloneNode(true))
      content.onclick = (e) => {
        if (e.target === content && content.textContent === '[该评论已屏蔽，可点击显示]') {
          content.textContent = ''
          originalNodes.forEach(n => content.appendChild(n))
          content.onclick = null
        }
      }
      content.textContent = '[该评论已屏蔽，可点击显示]'
      return
    }
  }
}

function getKeywords() {
  const keywords = menu_value('menu_customBlockKeywords')
  if (!keywords?.length) return []
  return keywords.filter(k => k).map(k => k.toLowerCase())
}

export function blockKeywords(type) {
  if (!menu_value('menu_blockKeywords')) return
  if (type === 'comment') {
    if (!menu_value('menu_blockKeywordsComment')) return
    document.querySelectorAll(SELECTOR_COMMENT).forEach(processComment)
  } else {
    document.querySelectorAll(SELECTOR_TITLE).forEach(processTitle)
  }
}
