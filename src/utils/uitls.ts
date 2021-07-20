import dayjs from 'dayjs'
import fs from 'fs'
import path from 'path'
import prettier from 'prettier'
const chalk = require('chalk')
const appDirectory = fs.realpathSync(process.cwd())

const getNow = () => dayjs().format('HH:mm:ss')

export const log = {
  success: (str: string) => {
    console.log(`🔥 ${chalk.green(`${str}  ${getNow()}`)}`)
  },
  error: (str: string) => {
    console.log(`⚠️ ${chalk.red(`${str}  ${getNow()}`)}`)
  },
  info: (str: string) => {
    console.log(`⚓ ${chalk.blue(`${str}  ${getNow()}`)}`)
  },
}

export const resolvePath = (relativePath: string) => path.resolve(appDirectory, relativePath)

export const writeJsonToFile = async (data: any, fileName: string) => {
  const filePath = resolvePath(fileName)
  const text = JSON.stringify(data)
  const formatted = prettier.format(text, { semi: true, singleQuote: false, parser: 'json' })
  await fs.writeFile(filePath, formatted, () => {})
}
