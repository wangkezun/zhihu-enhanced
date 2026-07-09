import { menu_value } from '../shared/menu-framework.js'
import { collapseCurrentAnswer } from './modules/collapse-answer.js'

const BLANK_CONTAINERS = [
  '.Topstory-container',
  '.Question-main',
  '.Search-container',
  '.CollectionsDetailPage',
  '.Post-Row-Content',
  '.Profile-main',
]
const INVITE_TOGGLE_CLS = 'script-invite-toggle'

function isSideBlank(event) {
  const el = event.target
  if (el.closest('a, button, input, textarea, img, video, [role="button"]')) return false
  const container = BLANK_CONTAINERS.reduce((found, sel) => found || document.querySelector(sel), null)
  if (!container) return false
  const rect = container.getBoundingClientRect()
  return event.clientX < rect.left || event.clientX > rect.right
}

function onCollapseClick(e) {
  if (!menu_value('menu_collapsedNowAnswer')) return
  if (!isSideBlank(e)) return
  collapseCurrentAnswer()
}

function onBackToTop(e) {
  if (!menu_value('menu_backToTop')) return
  if (!isSideBlank(e)) return
  e.preventDefault()
  window.scrollTo(0, 0)
}

function onCloseFloatingComment(e) {
  const button = document.querySelector('button[aria-label="关闭"]')
  if (!button) return
  const overlay = button.parentElement?.parentElement
  if (overlay && (e.target === overlay || e.target.parentElement === overlay)) {
    button.click()
  }
}

function onInviteToggle(e) {
  if (!e.target.closest('.' + INVITE_TOGGLE_CLS)) return
  const q = document.querySelector('.QuestionInvitation-content')
  if (q) q.style.display = q.style.display === 'none' ? '' : 'none'
}

export function initEvents() {
  document.addEventListener('click', onCollapseClick, true)
  document.addEventListener('contextmenu', onBackToTop, true)
  document.addEventListener('click', onCloseFloatingComment, true)
  document.addEventListener('click', onInviteToggle, false)
}
