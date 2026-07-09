import { GlobalObserver } from '../../shared/global-observer.js'
import { UrlChangeManager } from '../../shared/url-change.js'
import { menu_value } from '../../shared/menu-framework.js'
import { isElementInViewport, isElementInViewport_ } from '../../shared/dom-utils.js'

// ========== 核心函数，不绑定事件 ==========

// 收起当前回答 + 评论
export function collapseCurrentAnswer() {
  let rightButton = document.querySelector(
    ".ContentItem-actions.Sticky.RichContent-actions.is-fixed.is-bottom"
  )
  if (rightButton) {
    let ccBtn = rightButton.querySelector(
      "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
    )
    if (ccBtn && ccBtn.textContent.includes("收起评论")) ccBtn.click()
    rightButton = rightButton.querySelector(
      ".ContentItem-rightButton[data-zop-retract-question]"
    )
    if (rightButton) rightButton.click()
  } else {
    let found = false
    for (const el of document.querySelectorAll(
      ".ContentItem-rightButton[data-zop-retract-question]"
    )) {
      if (isElementInViewport(el)) {
        let ccBtn = el.parentNode.querySelector(
          "button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
        )
        if (ccBtn && ccBtn.textContent.includes("收起评论")) {
          ccBtn.click()
          if (!isElementInViewport(ccBtn)) scrollTo(0, el.offsetTop + 50)
        }
        el.click()
        found = true
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
          )
          if (ccBtn && ccBtn.textContent.includes("收起评论")) ccBtn.click()
          let acBtn = el.querySelector(
            ".ContentItem-rightButton[data-zop-retract-question]"
          )
          if (acBtn) acBtn.click()
          break
        }
      }
    }
  }
  // Comments section
  let cc = document.evaluate(
    '//button[text()="收起评论"]', document.querySelector(".Comments-container"),
    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue
  if (cc) { cc.click(); return }
  collapseComments()
}

function collapseComments() {
  const allCommentBtns = document.querySelectorAll(
    ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type, .ContentItem-action > button.Button.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
  )
  for (const el of allCommentBtns) {
    if (el.textContent.includes("收起评论") && isElementInViewport(el)) {
      el.click()
      return
    }
  }
  for (const el of document.querySelectorAll(".Comments-container")) {
    if (isElementInViewport(el)) {
      const parent = el.closest(".List-item") || el.closest(".Card")
      if (!parent) continue
      const btn = parent.querySelector(
        ".ContentItem-actions > button.Button.ContentItem-action.Button--plain.Button--withIcon.Button--withLabel:first-of-type"
      )
      if (btn && btn.textContent.includes("收起评论")) {
        btn.click()
        if (!isElementInViewport(btn)) scrollTo(0, parent.offsetTop + parent.offsetHeight - 50)
        return
      }
    }
  }
}

// ========== 一键收起全部回答 ==========

export function addCollapseAllButton() {
  if (!menu_value('menu_collapsedAnswer')) return
  const container = document.querySelector('.CornerAnimayedFlex')
  if (!container || document.getElementById('collapsed-button')) return
  const templateBtn = container.querySelector('button')
  if (!templateBtn) return
  container.insertAdjacentHTML('afterBegin',
    '<button id="collapsed-button" data-tooltip="收起全部回答/评论" data-tooltip-position="left" aria-label="收起全部回答/评论" type="button" class="' +
    templateBtn.className +
    '"><svg class="ContentItem-arrowIcon is-active" aria-label="收起全部回答/评论" fill="currentColor" viewBox="0 0 24 24" width="24" height="24"><path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.005z"></path></svg></button>'
  )
  document.getElementById('collapsed-button').onclick = function () {
    document.querySelectorAll('.Comments-container').forEach(el => {
      const btn = document.evaluate('//button[text()="收起评论"]', el, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
      if (btn) btn.click()
    })
    document.querySelectorAll('.RichContent >.ContentItem-actions>button:first-of-type').forEach(el => {
      if (el.textContent.includes('收起评论')) el.click()
    })
    document.querySelectorAll('.ContentItem-rightButton[data-zop-retract-question]').forEach(el => el.click())
  }
}

// ========== 默认收起回答 ==========

let collapsedObserver = null
function collapsedAnswerHandler(mutations) {
  for (const mutation of mutations) {
    if (mutation.target.nodeType !== Node.ELEMENT_NODE) continue
    if (mutation.target.hasAttribute('script-collapsed')) continue
    if (mutation.target.classList.contains('RichContent')) {
      for (const n of mutation.addedNodes) {
        if (n.nodeType !== Node.ELEMENT_NODE) continue
        if (n.className !== 'RichContent-inner') continue
        if (n.offsetHeight < 400) break
        const btn = mutation.target.querySelector(
          '.ContentItem-actions.Sticky [data-zop-retract-question]'
        )
        if (btn) {
          mutation.target.setAttribute('script-collapsed', '')
          btn.click()
          break
        }
      }
    } else if (
      mutation.target.tagName === 'DIV' && !mutation.target.style.cssText && !mutation.target.className
    ) {
      const parent = mutation.target.parentElement
      if (!parent || parent.hasAttribute('script-collapsed')) continue
      const btn = mutation.target.querySelector(
        '.ContentItem-actions.Sticky [data-zop-retract-question]'
      )
      if (btn) {
        parent.setAttribute('script-collapsed', '')
        btn.click()
      }
    }
  }
}

export function enableDefaultCollapse() {
  if (!menu_value('menu_defaultCollapsedAnswer')) return
  if (location.href.includes('/answer/')) return
  if (!collapsedObserver) {
    collapsedObserver = new MutationObserver(collapsedAnswerHandler)
    UrlChangeManager.add(() => {
      if (menu_value('menu_defaultCollapsedAnswer') && !location.href.includes('/answer/')) {
        collapsedObserver.observe(document.body, { childList: true, subtree: true })
      } else {
        collapsedObserver.disconnect()
      }
    })
  }
  collapsedObserver.observe(document.body, { childList: true, subtree: true })
}
