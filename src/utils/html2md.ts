export const transfer = (str: string, baseUrl: string) => {
  const pattern = /<a[^>]*href="([^>"]*)">([^>]*)<\/a>/gi
  const res = str.replace(pattern, function (a: string, b: string, c: string, d: string): any {
    return `[${c}](${baseUrl}${b})`
  })
  return res
}
