import { getProperty, hasProperty } from 'dot-prop'
import striptags from 'striptags'

export interface ReplaceOptions {
  stripHtml: boolean
}

// prettier-ignore
// eslint-disable-next-line unicorn/no-unsafe-regex
const RX = /{{ (?<lazy>\?)?(?<path>.+?)(?::"(?<value>.+)"(?<lazyValue>\?)?)? }}/g

export const replace: <T extends Record<string, unknown>>(
  data: Readonly<T>,
  input: string,
  options?: Partial<ReplaceOptions>,
) => string = (data, input, options) =>
  input.replace(
    RX,
    (
      _,
      lazyString: string | undefined,
      path: string,
      value: string | undefined,
      lazyValueString: string | undefined,
      // eslint-disable-next-line max-params
    ) => {
      const exists = hasProperty(data, path)
      const lazy = lazyString === '?'
      const lazyValue = lazyValueString === '?'

      if (!exists) {
        if (lazy) return value ?? ''
        if (lazyValue) return ''

        throw new Error(`Path '${path}' does not exist on object!`)
      }

      if (value && !lazy) return value

      const resolveProp = () => {
        const prop: unknown = getProperty(data, path)
        switch (typeof prop) {
          case 'string':
            return prop
          case 'number':
          case 'bigint':
            return prop.toString()
          case 'boolean':
            return `${prop}`
          default:
            throw new TypeError('unsupported type')
        }
      }

      let prop = resolveProp()
      if (options?.stripHtml === true) {
        prop = prop.replaceAll('<br>', '\n')
        prop = prop.replaceAll('<br />', '\n')
        prop = prop.replaceAll('<br/>', '\n')

        prop = striptags(prop)
      }

      return prop
    },
  )

export const createReplace: <T extends Record<string, unknown>>(
  data: Readonly<T>,
) => (input: string, options?: Partial<ReplaceOptions>) => string =
  data => (input, options) =>
    replace(data, input, options)
