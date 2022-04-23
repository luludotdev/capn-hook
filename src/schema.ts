import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type EmbedField = z.infer<typeof EmbedFieldSchema>
const EmbedFieldSchema = z.object({
  name: z.string().nonempty(),
  content: z.string().nonempty(),
  inline: z.boolean().default(false),
})

export type WebhookEmbed = z.infer<typeof WebhookEmbedSchema>
export const WebhookEmbedSchema = z.object({
  title: z.string().nonempty(),
  fields: z.array(EmbedFieldSchema).optional(),
})

export type Webhook = z.infer<typeof WebhookSchema>
export const WebhookSchema = z.object({
  id: z
    .string()
    .nonempty()
    .regex(/[a-z-]+/),

  embed: WebhookEmbedSchema,
  webhookURL: z.string().url(),
})

export type Config = z.infer<typeof ConfigSchema>
export const ConfigSchema = z.object({
  $schema: z.string().nonempty(),

  hmacSecret: z.string().nonempty(),
  hooks: z.array(WebhookSchema),
})

export const jsonSchema = zodToJsonSchema(ConfigSchema)
