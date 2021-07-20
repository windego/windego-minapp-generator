import { getTpl, getComponentDetail } from './wechat/getTpl'
export { getTpl }

const init = async () => {
  getTpl()
  // await getComponentDetail(
  //   '视图容器',
  //   'movable-view',
  //   '/miniprogram/dev/component/movable-view.html'
  // )
}

init()
