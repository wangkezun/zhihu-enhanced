

function getUpvoteMin(type) {
  const key = type === 'index' ? 'menu_blockLowUpvoteCount'
    : type === 'follow' ? 'menu_blockLowUpvoteCountFollow'
    : 'menu_blockLowUpvoteCountQuestion'
  return GM_getValue(key)
}
function getCommentMin(type) {
  const key = type === 'index' ? 'menu_blockLowCommentCount'
    : type === 'follow' ? 'menu_blockLowCommentCountFollow'
    : 'menu_blockLowCommentCountQuestion'
  return GM_getValue(key)
}

function shouldBlock(item, upvoteMin, commentMin) {
  const ci = item.querySelector('.ContentItem')
  if (!ci?.dataset.zaExtraModule) return false
  try {
    const card = JSON.parse(ci.dataset.zaExtraModule)?.card?.content
    if (!card) return false
    if (upvoteMin && Number(card.upvote_num) < Number(upvoteMin)) return true
    if (commentMin && Number(card.comment_num) < Number(commentMin)) return true
  } catch (e) {}
  return false
}

export function makeProcessor(type) {
  const upvoteMin = getUpvoteMin(type)
  const commentMin = getCommentMin(type)
  const sel = type === 'question' ? '.List-item' : '.Card.TopstoryItem'
  document.querySelectorAll(sel).forEach(item => {
    if (shouldBlock(item, upvoteMin, commentMin)) {
      item.hidden = true; item.style.display = 'none'
    }
  })
  return function processLowCount(item) {
    if (shouldBlock(item, upvoteMin, commentMin)) {
      item.hidden = true; item.style.display = 'none'
    }
  }
}

// Backward-compat wrapper for intermediate index.js
export function blockLowCount(type) {
  makeProcessor(type) // initial scan only
}
