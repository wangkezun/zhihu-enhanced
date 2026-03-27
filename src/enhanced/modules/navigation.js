export function switchHome() {
  document.querySelectorAll("header.AppHeader nav").forEach((a) => {
    a.outerHTML = a.outerHTML;
  });
}
// 针对首页几个页面
export function switchHomeRecommend() {
  document
    .querySelectorAll(
      'header.AppHeader nav>a:not([target])[href="https://www.zhihu.com/"]',
    )
    .forEach((a) => {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        document.cookie =
          "tst=r; expires=Thu, 18 Dec 2099 12:00:00 GMT; domain=.zhihu.com; path=/";
        location.href = this.href;
        return false;
      });
    });
}

