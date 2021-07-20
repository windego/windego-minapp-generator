// 相关 URL
export const URL = {
  BASE_URL: 'https://developers.weixin.qq.com',
  BASE_API: 'https://developers.weixin.qq.com/miniprogram/dev/api/',
  BASE_TPL: 'https://developers.weixin.qq.com/miniprogram/dev/component/',
}

const dirItem: [string, string][] = [
  ['视图容器', 'view'],
  ['基础内容', 'base'],
  ['表单组件', 'from'],
  ['导航', 'navigator'],
  ['媒体组件', 'media'],
  ['地图', 'map'],
  ['画布', 'canvas'],
  ['开放能力', 'open-data'],
  ['原生组件说明', 'native'],
  ['无障碍访问', 'aria'],
  ['导航栏', 'navigation'],
  ['页面属性配置节点', 'page-meta'],
]

export const dirNameMap = new Map<string, string>(dirItem)
