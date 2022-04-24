import Router from '@koa/router'
import { MessageEmbed, WebhookClient } from 'discord.js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import { replace } from './replace.js'
import { type Config } from './schema.js'

export const createServer = async (config: Config) => {
  const app = new Koa()

  const router = new Router()
  router.use(koaBody({ json: true, urlencoded: false, text: false }))

  for (const hook of config.hooks) {
    const webhook = new WebhookClient({ url: hook.webhookURL })

    router.post(hook.id, `/${hook.id}`, async ctx => {
      const body = ctx.request.body as unknown
      if (
        body === null ||
        typeof body !== 'object' ||
        Object.keys(body).length === 0
      ) {
        ctx.status = StatusCodes.BAD_REQUEST
        ctx.body = ReasonPhrases.BAD_REQUEST

        return
      }

      const data = {
        body,
      }

      const embed = new MessageEmbed().setTitle(replace(hook.embed.title, data))

      try {
        await webhook.send({ embeds: [embed] })
      } catch (error: unknown) {
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
        ctx.body =
          error instanceof Error
            ? error.stack ?? error.message
            : ReasonPhrases.INTERNAL_SERVER_ERROR
      }

      ctx.status = 200
      ctx.body = 'OK'
    })
  }

  app.use(router.routes()).use(router.allowedMethods())
  return app
}
