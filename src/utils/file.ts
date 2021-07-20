import { existsSync, mkdir } from 'fs'

export const checkDirAndCreate = (dirName: string) => {
  return new Promise(function (resolve, reject) {
    if (!existsSync(dirName)) {
      mkdir(dirName, { recursive: true }, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      })
    } else {
      resolve(true)
    }
  })
}
