import { field as logField } from '@lolpants/jogger'
import { type HexColorString, EmbedBuilder } from 'discord.js'
import { ctxField, errorField, logger } from './logger.js'
import { createReplace } from './replace.js'
import type { Webhook } from './schema.js'
import { splitMessage } from '@lolpants/splitmessage'

const ctx = ctxField('embed')

export const generateEmbed: <T extends Record<string, unknown>>(
  hook: Webhook,
  data: Readonly<T>
) => EmbedBuilder = (hook, data) => {
  const replace = createReplace(data)
  const embed = new EmbedBuilder()

  embed.setTitle(replace(hook.embed.title))
  if (hook.embed.description) {
    const stripHtml = hook.embed.description.stripHtml
    embed.setDescription(replace(hook.embed.description.content, { stripHtml }))
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

  if (hook.embed.timestamp) {
    const timestamp = replace(hook.embed.timestamp)
    const date = new Date(timestamp)

    embed.setTimestamp(date)
  }

  for (const field of hook.embed.fields ?? []) {
    const name = replace(field.name)
    const content = replace(field.content, { stripHtml: field.stripHtml })

    if (content === '' && field.optional) {
      continue
    }

    try {
      const [first, ...split] = splitMessage(content, { maxLength: 1000 })
      embed.addFields({ name, value: first, inline: field.inline })

      for (const cont of split) {
        embed.addFields({
          name: `${name} (cont.)`,
          value: cont,
          inline: field.inline,
        })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          ctx,
          logField(
            'field',
            logField('name', name),
            logField('content', content)
          ),
          errorField(error)
        )
      }

      // Re-throw
      throw error
    }
  }

  return embed
}
