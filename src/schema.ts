import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type EmbedField = z.infer<typeof EmbedFieldSchema>
const EmbedFieldSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  inline: z.boolean().default(false),
  optional: z
    .boolean()
    .default(false)
    .describe(
      'If set to `true`, skips adding the field if the content resolves to an empty string',
    ),

  stripHtml: z
    .boolean()
    .default(false)
    .describe('Strip HTML tags from `content`'),
})

export type WebhookEmbed = z.infer<typeof WebhookEmbedSchema>
export const WebhookEmbedSchema = z.object({
  title: z.string().min(1),
  description: z
    .object({
      content: z.string().min(1),
      stripHtml: z
        .boolean()
        .default(false)
        .describe('Strip HTML tags from `content`'),
    })
    .optional(),

  url: z.string().url().optional(),
  image: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
  timestamp: z.string().min(1).optional(),

  author: z
    .object({
      name: z.string().min(1),
      url: z.string().url().optional(),
      iconURL: z.string().url().optional(),
    })
    .optional(),

  footer: z
    .object({
      text: z.string().min(1),
      iconURL: z.string().url().optional(),
    })
    .optional(),

  color: z
    .string()
    .min(1)
    // eslint-disable-next-line unicorn/no-unsafe-regex
    .regex(/^#(?:[\da-f]{3}){1,2}$/i)
    .optional()
    .describe('Hex Format'),

  fields: z.array(EmbedFieldSchema).optional(),
})

export type Webhook = z.infer<typeof WebhookSchema>
export const WebhookSchema = z.object({
  id: z
    .string()
    .min(1)
    .regex(/[a-z-]+/)
    .describe('Used as the webhook path'),

  sender: z
    .object({
      username: z.string().min(1).optional(),
      avatarURL: z.string().url().optional(),
    })
    .optional(),

  embed: WebhookEmbedSchema,
  webhookURL: z.string().url(),
})

export type Config = z.infer<typeof ConfigSchema>
export const ConfigSchema = z.object({
  $schema: z.string().min(1).optional(),
  hooks: z.array(WebhookSchema),
})

export const jsonSchema = zodToJsonSchema(ConfigSchema)
