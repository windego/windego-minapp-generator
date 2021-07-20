import { getTpl } from './wechat/getTpl'
export { getTpl }

const init = async () => {
  await getTpl()
}

init()
