var request = require('request')
import fetch, { HeadersInit } from 'node-fetch'
import { log, resolvePath, writeJsonToFile } from '../utils/uitls'
import prettier from 'prettier'

import { writeFile, appendFile } from 'fs/promises'

const filePath = resolvePath('gen/med/medImgUrl.js')
const imgUrlObj = resolvePath('gen/med/medImgUrlObj.js')
const downloadFilePath = './gen/images'

const { nameList } = require('../../gen/med/medName.js')
const { imgList } = require('../../gen/med/imgs.js')

interface imgMap {
  [key: string]: string
}

var fs = require('fs')

export const getAllFirst = () => {
  let map = new Map()
  // console.log(nameList)
  nameList.forEach((ele: any) => {
    const name = ele.name
    const first = name.slice(0, 1)
    // console.log('first => ', first)
    map.set(first, first)
  })
  const res = [...map.keys()]
  console.log('res => ', res)
  return res
}

export const getImagesUrl = async (med: string) => {
  const myHeaders: HeadersInit = { 'Content-Type': 'application/x-www-form-urlencoded' }
  const urlencoded = new URLSearchParams()
  const name = encodeURI(encodeURIComponent(med))
  urlencoded.append('name', name)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  }

  const response = await fetch(
    'https://www.kmzyw.com.cn/bzjsp/app_remote/app_search_get_spell.jsp',
    requestOptions
  )
  const res = await response.json()
  // console.log('res => ', res.returnObject)
  console.log('med', med)
  return res.returnObject
}

export const download = (uri: string, filename: string) => {
  console.log('filename => ', filename)
  console.log('uri => ', uri)
  request.head(uri, function () {
    request(uri).pipe(fs.createWriteStream(downloadFilePath + '/' + filename))
  })
}

export const getAllImgUrl = async () => {
  let allImgUrl: imgMap = {}
  const array = getAllFirst()
  // const array = ['白', '大']
  for (let index = 0; index < array.length; index++) {
    const element = array[index]
    const res = await getImagesUrl(element)

    res.forEach((item: any) => {
      const { name, imgUrl } = item
      if (name && imgUrl) {
        allImgUrl[name] = imgUrl
      }
    })
  }
  const text = `const list= ${JSON.stringify(allImgUrl)};`
  const formatted = prettier.format(text, { semi: false, singleQuote: true })
  await writeFile(filePath, formatted)
  console.log(allImgUrl)
}

export const downloadAll = async () => {
  const obj = {
    阿胶: 'http://shop.kmzyw.com.cn/upload/herb_db/524AEB3E175115209911F3E3F9A2C3C8/0007-阿胶-001.jpg',
    荜茇: 'http://shop.kmzyw.com.cn/upload/herb_db/67444A9AE15FBCC77D7DAA948EAB3235/0045-荜茇-001.jpg',
    无花果:
      'http://shop.kmzyw.com.cn/upload/herb_db/B2FE547D3CA835D7D02662EF3ED0B82A/0592-无花果-001.jpg',
  }
  const list = Object.entries(obj)
  for (let index = 0; index < list.length; index++) {
    const [filename, url] = list[index]
    await download(url, filename + '.jpg')
  }
}

export const changeObjToList = async () => {
  const list = Object.entries(imgList)
  const newList: any[] = []
  list.forEach((item) => {
    const [name, url] = item
    newList.push({ name, url })
  })
  const text = `const imgList= ${JSON.stringify(newList)};`
  const formatted = prettier.format(text, { semi: false, singleQuote: true })
  await writeFile(imgUrlObj, formatted)
}
