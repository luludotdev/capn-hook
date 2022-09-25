import { env } from 'node:process'
import {
  createConsoleSink,
  createField,
  createFileSink,
  createLogger,
  field,
  type Field,
} from '@lolpants/jogger'

const IS_PROD = env.NODE_ENV?.toLowerCase() === 'production'
const IS_DEV = !IS_PROD

const consoleSink = createConsoleSink({ debug: IS_DEV })
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
export const errorField: <T extends Error>(error: T) => Field = error => {
  const fields: [Field, ...Field[]] = [
    field('type', error.name),
    field('message', error.message),
  ]

  if (error.stack) fields.push(field('stack', error.stack))
  return field('error', ...fields)
}

export const flush = async () => fileSink.flush()
