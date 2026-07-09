import { menu_value } from '../shared/menu-framework.js'

export function injectCSS() {
  const parts = []

  // 类型标签
  const style = 'font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: 4px 4px 0 0;'
  parts.push(`
.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
.PinItem .ContentItem-title a::before {content:'想法';color: #4CAF50;background-color: #4CAF5033;${style}}
.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}
.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}
.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #ff5a4e;background-color: #ff5a4e33;${style}}
.HotLanding-contentItem .ContentItem[data-za-detail-view-path-module=Content] .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'问题';color: #f68b83;background-color: #f68b8333;${style}}
`)

  // 视频隐藏
  parts.push(`
.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}
.VideoAnswerPlayer, .VideoAnswerPlayer video, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {display: none !important;}
`)

  // 搜索净化
  parts.push(`
.AutoComplete-group > .SearchBar-label:not(.SearchBar-label--history), .AutoComplete-group > [id^="AutoComplete2-topSearch-"], .AutoComplete-group > [id^="AutoComplete3-topSearch-"] {display: none !important;}
`)

  // 登录弹窗
  if (location.hostname !== 'zhuanlan.zhihu.com') {
    parts.push(`
.Question-mainColumnLogin, button.AppHeader-login {display: none !important;}
`)
  }

  // 收起按钮位置调整
  parts.push(`
.CornerButton{margin-bottom:8px !important;}.CornerButtons{bottom:45px !important;}
`)

  // 直达问题按钮样式
  parts.push(`
a.zhihu_e_toQuestion {font-size: 13px !important;font-weight: normal !important;padding: 1px 6px 0 !important;border-radius: 2px !important;display: inline-block !important;vertical-align: top !important;margin-top: 4px !important;height: 20.67px !important;line-height: 20.67px !important;}
`)

  // 首页最小高度 + 视频 tab 隐藏
  if (location.pathname === '/') {
    parts.push(`
.Topstory-container {min-height: 1500px;}
`)
  }
  if (menu_value('menu_blockTypeVideo') && ['/', '/hot', '/follow'].includes(location.pathname)) {
    parts.push(`
.Card .ZVideoItem-video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"] {display: none !important;}
`)
  }

  const el = document.createElement('style')
  el.textContent = parts.join('')
  ;(document.head || document.documentElement).appendChild(el)
}
