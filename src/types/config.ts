import { Attr, Component } from './component'

export interface CustomAttr extends Attr {
  addBrace?: boolean // 是否加上 {{}}
  boolean?: boolean // 属性是个 boolean 值，不需要加 =
}

export interface LanguageConfig {
  id: string
  /** 基本属性 */
  baseAttrs: CustomAttr[]
  /** 事件相关配置 */
  event: {
    prefixes: string[]
    modifiers: string[]
    attrs: CustomAttr[]
  }
  /** 语言相关的 trigger */
  custom: {
    [prefix: string]: {
      attrs: CustomAttr[]
      modifiers: string[]
    }
  }
  /** 自定义的组件 */
  components: Component[]

  /** 在自动补全时，不需要 baseAttrs 和 event 的组件名称 */
  noBasicAttrsComponents?: string[]
}
