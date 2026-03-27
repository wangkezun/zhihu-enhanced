export function originalPic() {
  document
    .querySelectorAll(
      "img[data-original][data-original-token][data-lazy-status]:not([data-original-xiu]):not(.comment_sticker):not(.Avatar)",
    )
    .forEach(function (one) {
      one.src =
        "https://" +
        one.dataset.original.split("/")[2] +
        "/" +
        one.dataset.originalToken +
        ".webp";
      one.dataset.originalXiu = "true";
    });
}

// 默认站外直链，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
