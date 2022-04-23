import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

export type WebhookEmbed = z.infer<typeof WebhookEmbedSchema>
export const WebhookEmbedSchema = z.object({
  title: z.string().nonempty(),
})

export type Webhook = z.infer<typeof WebhookSchema>
export const WebhookSchema = z.object({
  $schema: z.string().nonempty(),

  id: z.string().nonempty(),
  embed: WebhookEmbedSchema,
})

export const jsonSchema = zodToJsonSchema(WebhookSchema)
