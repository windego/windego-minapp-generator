import { getTpl, getComponentDetail } from './getTpl'

const init = async () => {
  getTpl()
  // await getComponentDetail('视图容器', 'navigator', '/miniprogram/dev/component/navigator.html')
  // await getComponentDetail(
  //   '视图容器',
  //   'movable-view',
  //   '/miniprogram/dev/component/movable-view.html'
  // )
}

init()
