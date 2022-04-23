import Router from '@koa/router'
import Koa from 'koa'
import { type Config } from './schema.js'

export const createServer = async (config: Config) => {
  const app = new Koa()
  const router = new Router()

  for (const hook of config.hooks) {
    const url = `/${hook.id}`
    router.post(hook.id, url, async ctx => {
      // TODO

      ctx.status = 200
      ctx.body = 'OK'
    })
  }

  app.use(router.routes()).use(router.allowedMethods())
  return app
}
