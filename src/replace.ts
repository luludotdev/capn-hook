import { getProperty, hasProperty } from 'dot-prop'

export const replace: <T extends Record<string, unknown>>(
  input: string,
  data: Readonly<T>
) => string = (input, data) =>
  input.replace(
    /{{ (\?)?(.+?)(?::"(.+)")? }}/g,
    (
      _,
      lazyString: string | undefined,
      path: string,
      value: string | undefined
    ) => {
      const exists = hasProperty(data, path)
      const lazy = lazyString === '?'

      if (!exists) {
        if (lazy) return value ?? ''
        throw new Error(`Path '${path}' does not exist on object!`)
      }

      if (value && !lazy) return value

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
  )

export const createReplace: <T extends Record<string, unknown>>(
  data: Readonly<T>
) => (input: string) => string = data => input => replace(input, data)
