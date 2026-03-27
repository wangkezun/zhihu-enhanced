export function directLink() {
  document
    .querySelectorAll(
      'a.external[href*="link.zhihu.com/?target="], a.LinkCard[href*="link.zhihu.com/?target="]:not(.MCNLinkCard):not(.ZVideoLinkCard):not(.ADLinkCardContainer)',
    )
    .forEach(function (_this) {
      _this.href = decodeURIComponent(
        _this.href.substring(
          _this.href.indexOf("link.zhihu.com/?target=") + 23,
        ),
      );
    });
}

// 默认折叠邀请，修改自：https://greasyfork.org/scripts/402808（从 JQuery 改为原生 JavaScript，且精简、优化了代码）
