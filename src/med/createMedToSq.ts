import fetch, { HeadersInit } from 'node-fetch'
const { nameList } = require('../../gen/med/medName.js')
const { imgList } = require('../../gen/med/medImgUrl.js')

export const createOneMed = async (data: object) => {
  const myHeaders: HeadersInit = { 'Content-Type': 'application/json' }

  var raw: string = JSON.stringify(data)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
  }
  const response = await fetch('https://api.xiaomiaoshidai.com/med/list', requestOptions)

  const res = await response.json()
  console.log('res => ', res)
}

//在数据库创建med
export const createMed = async () => {
  const array = nameList
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    const { name, pinyin, cxyf, yybw, zycq } = element
    const img = imgList[name] ? 1 : 0
    const data = { name, img, pinyin, growingPeriod: cxyf, growthAreas: zycq, type: yybw }
    await createOneMed(data)
  }
}
