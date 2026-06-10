import { createContentFilter } from '../../shared/content-filter.js';

export function blockLowCount(type) {
  switch (type) {
    case "index":
      blockLowCount_(
        ".Card.TopstoryItem.TopstoryItem-isRecommend",
        "Card TopstoryItem TopstoryItem-isRecommend",
        "menu_blockLowUpvoteCount",
        "menu_blockLowCommentCount",
      );
      break;
    case "follow":
      blockLowCount_(
        ".Card.TopstoryItem.TopstoryItem-isFollow",
        "Card TopstoryItem TopstoryItem-isFollow",
        "menu_blockLowUpvoteCountFollow",
        "menu_blockLowCommentCountFollow",
      );
      break;
    case "question":
      blockLowCount_(
        ".List-item",
        "List-item",
        "menu_blockLowUpvoteCountQuestion",
        "menu_blockLowCommentCountQuestion",
      );
      break;
  }

  function blockLowCount_(selector, className, menuUpvote, menuComment) {
    // 阈值读一次，避免 observer 热路径里每个 item 重复读 GM 存储
    const upvoteMin = GM_getValue(menuUpvote),
      commentMin = GM_getValue(menuComment);
    createContentFilter({
      selector,
      className,
      processItem: function (item) {
        blockLowCount_1(item, upvoteMin, "upvote_num");
        blockLowCount_1(item, commentMin, "comment_num");
      },
    });
  }

  function blockLowCount_1(item, min, type) {
    if (min) {
      let item_ContentItem = item.querySelector(".ContentItem");
      if (item_ContentItem && item_ContentItem.dataset.zaExtraModule) {
        let item2;
        try {
          item2 = JSON.parse(item_ContentItem.dataset.zaExtraModule);
        } catch (e) {
          return;
        }
        if (
          item2 &&
          item2.card.content &&
          Number(item2.card.content[type]) < Number(min)
        ) {
          item.hidden = true;
          item.style.display = "none";
        }
      }
    }
  }
}
