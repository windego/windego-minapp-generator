export interface AttrValue {
  value: string
  desc?: string
  since?: string
}
export interface Attr {
  name: string
  type?: any
  desc?: string[]
  required?: boolean
  since?: string
  defaultValue?: string
  options?: AttrValue[]
  enum?: any[]
  extras?: any[]
}
export interface Component {
  name: string
  docLink?: string
  since?: string
  desc: string[]
  attrs?: Attr[]
  notices?: string[]
  tips?: string[]
  bugs?: string[]
}

export interface TempComponentGroup {
  groupTitle: string
  groupPath: string
  children: TempComponent[]
}

export interface TempComponent {
  title: string
  path: string
  groupTitle?: string
}
