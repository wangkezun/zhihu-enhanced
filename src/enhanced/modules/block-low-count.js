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
    createContentFilter({
      selector,
      className,
      processItem: function (item) {
        blockLowCount_1(item, menuUpvote, "upvote_num");
        blockLowCount_1(item, menuComment, "comment_num");
      },
    });
  }

  function blockLowCount_1(item, menu, type) {
    if (GM_getValue(menu)) {
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
          Number(item2.card.content[type]) < Number(GM_getValue(menu))
        ) {
          item.hidden = true;
          item.style.display = "none";
        }
      }
    }
  }
}
