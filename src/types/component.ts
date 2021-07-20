export interface ComponentAttrValue {
  value: string
  desc?: string
  since?: string
}
export interface ComponentAttr {
  name: string
  type?: any
  desc?: string ///string[]
  required?: boolean
  since?: string
  defaultValue?: string
  options?: ComponentAttrValue[]
  enum?: any[]
  extras?: any[]
  subAttrs?: { equal: string; attrs: ComponentAttr[] }[]
}
export interface Component {
  name: string
  docLink?: string
  since?: string
  desc: string[]
  attrs?: ComponentAttr[]
  authorize?: any
  relateApis?: any[]
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
