export function setOriginalPic(img) {
  if (img.dataset.originalXiu) return;
  img.src =
    "https://" +
    img.dataset.original.split("/")[2] +
    "/" +
    img.dataset.originalToken +
    ".webp";
  img.dataset.originalXiu = "true";
}

export function originalPic() {
  document
    .querySelectorAll(
      "img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)",
    )
    .forEach(setOriginalPic);
}

const PIC_SEL = "img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)";

export function processAddedPics(node) {
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  if (node.matches?.(PIC_SEL)) setOriginalPic(node);
  const imgs = node.querySelectorAll?.(PIC_SEL);
  if (imgs) for (const img of imgs) setOriginalPic(img);
}

// 默认站外直链，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
