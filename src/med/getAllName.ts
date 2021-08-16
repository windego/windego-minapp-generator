import fetch, { HeadersInit } from 'node-fetch'
import { log, resolvePath, writeJsonToFile } from '../utils/uitls'
import prettier from 'prettier'
import fs from 'fs'
import { writeFile, appendFile } from 'fs/promises'
const filePath = resolvePath('gen/med/medName.js')

export const getNameFromKm = async (letter: string) => {
  const myHeaders: HeadersInit = { 'Content-Type': 'application/x-www-form-urlencoded' }

  const urlencoded = new URLSearchParams()
  urlencoded.append('yybw', letter)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
  }
  console.log(1111111111)

  const response = await fetch(
    'https://www.kmzyw.com.cn/yaocai/data/get_herb_pzname.jsp',
    requestOptions
  )
  const res = await response.json()
  console.log('res => ', res)

  const text = `const ${letter}= ${JSON.stringify(res?.rows)};`
  const formatted = prettier.format(text, { semi: false, singleQuote: true })
  if (letter === 'a') {
    await writeFile(filePath, formatted)
  } else {
    await appendFile(filePath, formatted)
  }
  return
}

const getAllLetter = () => {
  var count1 = 0

  var arr1 = []
  for (var i = 65; i < 91; i++) {
    arr1[count1] = String.fromCharCode(i)
    count1++
  }
  return arr1
}
export const getAllnames = async () => {
  const array = getAllLetter()

  let str = `export default [`
  for (let index = 0; index < array.length; index++) {
    const letter = array[index]
    await getNameFromKm(letter)
    str += `...${letter},`
  }
  str += ']'
  const formatted = prettier.format(str, { semi: false, singleQuote: true })
  appendFile(filePath, formatted)
}
