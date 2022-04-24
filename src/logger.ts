import {
  createConsoleSink,
  createField,
  createFileSink,
  createLogger,
  field,
  type Field,
} from '@lolpants/jogger'
import { env } from 'node:process'

const IS_PROD = env.NODE_ENV?.toLowerCase() === 'production'
const IS_DEV = !IS_PROD

const consoleSink = createConsoleSink(IS_DEV)
const fileSink = createFileSink({
  name: 'capn-hook',
  directory: 'logs',
  debug: IS_DEV,
})

export const logger = createLogger({
  name: 'capn-hook',
  sink: [consoleSink, fileSink],
})

export const ctxField = createField('context')
export const errorField: <T extends Error>(
  error: T
) => Readonly<Field> = error => {
  const array: Array<Readonly<Field>> = [
    field('type', error.name),
    field('message', error.message),
  ]

  if (error.stack) array.push(field('stack', error.stack))
  return field('error', array[0], ...array.slice(1))
}

export const flush = async () => fileSink.flush()
