import { getProperty } from 'dot-prop'

export const replace: <T extends Record<string, unknown>>(
  input: string,
  data: Readonly<T>
) => string = (input, data) =>
  input.replace(/{{ (.+) }}/g, (_, path: string) => {
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
  })

export const createReplace: <T extends Record<string, unknown>>(
  data: Readonly<T>
) => (input: string) => string = data => input => replace(input, data)
