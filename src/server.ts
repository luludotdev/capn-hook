import Router from '@koa/router'
import { field } from '@lolpants/jogger'
import { WebhookClient } from 'discord.js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import { generateEmbed } from './embed.js'
import { ctxField, errorField, logger } from './logger.js'
import { replace } from './replace.js'
import type { Config } from './schema.js'

const context = ctxField('server')

export const createServer = async (config: Config) => {
  const app = new Koa()

  const router = new Router()
  router.use(koaBody({ json: true, urlencoded: false, text: false }))

  for (const hook of config.hooks) {
    const webhookURLs = Array.isArray(hook.webhookURL)
      ? hook.webhookURL
      : [hook.webhookURL]

    const webhooks = webhookURLs.map(url => new WebhookClient({ url }))
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

      const data = Object.freeze({
        body,
        ctx: {
          id: hook.id,
          now: new Date().toISOString(),
        },
      })

      try {
        const username =
          hook.sender?.username && replace(data, hook.sender.username)

        const avatarURL =
          hook.sender?.avatarURL && replace(data, hook.sender.avatarURL)

        const embed = generateEmbed(hook, data)
        for (const webhook of webhooks) {
          // eslint-disable-next-line no-await-in-loop
          await webhook.send({ embeds: [embed], username, avatarURL })
        }

        ctx.status = 200
        ctx.body = 'OK'
      } catch (error: unknown) {
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
        ctx.body =
          error instanceof Error
            ? error.stack ?? error.message
            : ReasonPhrases.INTERNAL_SERVER_ERROR

        if (error instanceof Error) {
          logger.error(context, field('id', hook.id), errorField(error))
        }
      }
    })

    logger.info(context, field('action', 'register'), field('id', hook.id))
  }

  app.use(router.routes()).use(router.allowedMethods())
  return app
}
