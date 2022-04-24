import { type HexColorString, MessageEmbed, Util } from 'discord.js'
import { createReplace } from './replace.js'
import { type Webhook } from './schema.js'

export const generateEmbed: <T extends Record<string, unknown>>(
  hook: Webhook,
  data: Readonly<T>
) => MessageEmbed = (hook, data) => {
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

  if (hook.embed.timestamp) {
    const timestamp = replace(hook.embed.timestamp)
    const date = new Date(timestamp)

    embed.setTimestamp(date)
  }

  for (const field of hook.embed.fields ?? []) {
    const name = replace(field.name)
    const content = replace(field.content)

    const [first, ...split] = Util.splitMessage(content, { maxLength: 1950 })
    embed.addField(name, first, field.inline)

    for (const cont of split) {
      embed.addField(`${name} (cont.)`, cont, field.inline)
    }
  }

  return embed
}
