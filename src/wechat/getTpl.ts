import fetch from 'node-fetch'
import cheerio from 'cheerio'
import { AttrValue, Attr, TempComponentGroup, TempComponent, Component } from '../types/index'
import { log, resolvePath, writeJsonToFile } from '../utils/uitls'
import { checkDirAndCreate } from '../utils/file'
import { transfer } from '../utils/html2md'
import { URL, dirNameMap } from './config'
import prettier from 'prettier'
import fs from 'fs'

export const getComponentList = async () => {
  const res = await fetch(URL.BASE_TPL)
  const html = await res.text()
  const $ = cheerio.load(html)
  const chapters = $('.TreeNavigation li .NavigationLevel--level-1')
  const list: TempComponentGroup[] = [] // 创建一个数组，用来保存资源
  chapters.each(function (index, element) {
    // 遍历html文档
    const chapter = $(element)
    const parent = chapter.find('.NavigationLevel__parent .NavigationItem a')
    const groupTitle = parent.text().replace(/\s*/g, '')
    const groupPath = parent.attr('href') || ''
    const childrenElement = chapter.find('.NavigationLevel__children li')
    const children: TempComponent[] = []
    childrenElement.each(function (index, element) {
      const childChatper = $(element)
      const child = childChatper.find('a')
      const title = child.text().replace(/\s*/g, '')
      const path = child.attr('href') || ''
      children.push({ title, path })
    })
    const TempComponentGroup: TempComponentGroup = { groupTitle, groupPath, children }
    list.push(TempComponentGroup)
  })
  const filePath = resolvePath('gen/tpl/list.js')
  const text = `export default ${JSON.stringify(list)};`
  const formatted = prettier.format(text, { semi: false, singleQuote: true })
  await fs.writeFile(filePath, formatted, () => {})
  log.success('组件列表获取成功!')
  return list
}

export const getComponentDetail = async (groupName: string, compName: string, url: string) => {
  log.info(`获取组件:${compName}`)
  const fileName = dirNameMap.get(groupName)
  const docLink = URL.BASE_URL + url
  const res = await fetch(docLink)
  const html = await res.text()
  const $ = cheerio.load(html)
  const chapters = $('#docContent .content')
  let since: string = ''
  let desc: string[] = []
  const tableWrpIndex = chapters.children().index($('.table-wrp'))
  const pChapters = chapters.find('p')
  pChapters.each((index, element) => {
    const html = $(element).html() || ''
    const contentLen = $(element).contents().length
    if (index === 0) {
      since = /\d+.\d+.\d+/.exec(html)?.[0] || ''
    } else {
      if (index < tableWrpIndex - 1) {
        const blockquote = $(element).closest('blockquote').length
        if (!blockquote) {
          desc.push(transfer(html, URL.BASE_TPL))
        }
      }
    }
  })
  // log.info(`desc:${desc}`)
  // log.info(`获取since:${since}`)
  let attrs: Attr[] = []
  const tableChapters = chapters.find('.table-wrp')

  //获取属性及属性值
  tableChapters.each(function (index, element) {
    const table = $(element)
    const tableChapters = table.find('tr')
    if (index === 0) {
      tableChapters.each(function (index, element) {
        const tds = $(element).find('td')
        const attr: Attr = { name: '' }
        tds.each(function (i, ele) {
          const text = $(ele).text() || ''
          switch (i) {
            case 0:
              attr.name = text
              break
            case 1:
              attr.type = text
              break
            case 2:
              attr.defaultValue = text
              break
            case 3:
              attr.required = text === '是' ? true : false
              break
            case 4:
              attr.desc = [text]
              break
            default:
              attr.since = text
              break
          }
        })
        attr.name && attrs.push(attr)
      })
    } else {
      const title = table.prev().text()
      const name = attrs.filter((i: Attr) => title.includes(i.name))?.[0]?.name
      if (name) {
        const options: AttrValue[] = []
        tableChapters.each(function (index, element) {
          const tds = $(element).find('td')
          const option: AttrValue = { value: '', desc: '' }
          tds.each(function (i, ele) {
            const text = $(ele).text() || ''
            switch (i) {
              case 0:
                option.value = text
                break
              case 1:
                option.desc = text
                break
              case 2:
                text && (option.since = text)
                break
              default:
                break
            }
          })
          option.value && options.push(option)
        })
        attrs = attrs.map((i) => {
          if (i.name === name) {
            i.options = options
          }
          return i
        })
      }
    }
  })
  // log.info(`attrs:${attrs}`)
  // 处理 Bug-Tip
  const tips: string[] = []
  const bugs: string[] = []
  const bugTip = chapters.find('#Bug-Tip')
  if (bugTip.length) {
    const tipChapter = chapters.find('#Bug-Tip').next().find('ol li')
    tipChapter.each(function (index, element) {
      const html = ($(element).html() || '').replace(/<[^>]*>([^>]*)<\/[^>]*>/gi, '$1')
      if (html.includes('tip')) {
        tips.push(html.replace(/tip:/, '').replace(/\s+/gi, ''))
      } else {
        bugs.push(html.replace(/bug:/, '').replace(/\s+/gi, ''))
      }
    })
  }
  // log.info(`tips:${tips}`)
  // log.info(`bugs:${bugs}`)

  const compData: Component = {
    name: compName,
    desc,
    attrs,
    tips,
    bugs,
    docLink,
    since,
  }
  const dirName = resolvePath(`gen/tpl/${fileName}`)
  await checkDirAndCreate(dirName)

  const filePath = resolvePath(`gen/tpl/${fileName}/${compName}.json`)
  const text = JSON.stringify(compData)
  const formatted = prettier.format(text, { semi: true, singleQuote: false, parser: 'json' })
  await fs.writeFile(filePath, formatted, () => {})
  return compData
}

const getAllCom = (list: TempComponentGroup[]) => {
  const promiseList: TempComponent[] = list.reduce(
    (prev: TempComponent[], curr: TempComponentGroup) => {
      const { groupTitle, children } = curr
      const allList = children.map((item) => {
        return { ...item, groupTitle }
      })
      return [...prev, ...allList]
    },
    []
  )
  return new Promise((resolve) => {
    Promise.all(
      promiseList.map((item) => {
        const { groupTitle, title, path } = item
        return getComponentDetail(groupTitle || '', title, path)
        // eslint-disable-next-line comma-dangle
      })
    ).then(async (res) => {
      resolve(res)
    })
  })
}

export const getTpl = async () => {
  const dir = resolvePath('gen/tpl')
  await checkDirAndCreate(dir)
  const list = await getComponentList()
  const result = await getAllCom(list)

  await writeJsonToFile(result, 'gen/tpl/components.json')

  log.success('组件获取完成')
}
