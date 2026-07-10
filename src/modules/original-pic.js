export const SELECTOR = "img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)"

export function process(img) {
  if (img.dataset.originalXiu) return
  img.src = "https://" + img.dataset.original.split("/")[2] + "/" + img.dataset.originalToken + ".webp"
  img.dataset.originalXiu = "true"
}

export function init() {
  document.querySelectorAll(SELECTOR).forEach(process)
}
