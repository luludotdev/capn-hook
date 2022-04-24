import Router from '@koa/router'
import { type HexColorString, MessageEmbed, WebhookClient } from 'discord.js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Koa from 'koa'
import koaBody from 'koa-body'
import { createReplace } from './replace.js'
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

      const data = Object.freeze({
        body,
      })

      const replace = createReplace(data)
      const embed = new MessageEmbed()

      embed.setTitle(replace(hook.embed.title))
      if (hook.embed.description) {
        embed.setDescription(replace(hook.embed.description))
      }

      if (hook.embed.url) embed.setURL(replace(hook.embed.url))
      if (hook.embed.image) embed.setImage(replace(hook.embed.image))
      if (hook.embed.thumbnail) {
        embed.setThumbnail(replace(hook.embed.thumbnail))
      }

      if (hook.embed.author) {
        const name = replace(hook.embed.author.name)
        const url = hook.embed.author.url && replace(hook.embed.author.url)
        const iconURL =
          hook.embed.author.iconURL && replace(hook.embed.author.iconURL)

        embed.setAuthor({ name, url, iconURL })
      }

      if (hook.embed.footer) {
        const text = replace(hook.embed.footer.text)
        const iconURL =
          hook.embed.footer.iconURL && replace(hook.embed.footer.iconURL)

        embed.setFooter({ text, iconURL })
      }

      if (hook.embed.color) {
        const color = replace(hook.embed.color)
        embed.setColor(color as HexColorString)
      }

      for (const field of hook.embed.fields ?? []) {
        const name = replace(field.name)
        const content = replace(field.content)

        embed.addField(name, content, field.inline)
      }

      try {
        await webhook.send({ embeds: [embed] })

        ctx.status = 200
        ctx.body = 'OK'
      } catch (error: unknown) {
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR
        ctx.body =
          error instanceof Error
            ? error.stack ?? error.message
            : ReasonPhrases.INTERNAL_SERVER_ERROR
      }
    })
  }

  app.use(router.routes()).use(router.allowedMethods())
  return app
}
