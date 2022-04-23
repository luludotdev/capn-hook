import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type WebhookEmbed = z.infer<typeof WebhookEmbedSchema>
export const WebhookEmbedSchema = z.object({
  title: z.string().nonempty(),
})

export type Webhook = z.infer<typeof WebhookSchema>
export const WebhookSchema = z.object({
  id: z.string().nonempty(),
  embed: WebhookEmbedSchema,
})

export type Config = z.infer<typeof ConfigSchema>
export const ConfigSchema = z.object({
  $schema: z.string().nonempty(),
  hooks: z.array(WebhookSchema),
})

export const jsonSchema = zodToJsonSchema(ConfigSchema)
