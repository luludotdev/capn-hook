import 'source-map-support/register.js'

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { argv, env } from 'node:process'
import { field } from '@lolpants/jogger'
import mkdirp from 'mkdirp'
import { exists } from './fs.js'
import { ctxField, logger } from './logger.js'
import { ConfigSchema, jsonSchema } from './schema.js'
import { createServer } from './server.js'

const ctx = ctxField('main')

const main = async () => {
  const configDir = join('.', 'config')
  await mkdirp(configDir)

  if (argv[2]?.toLowerCase() === 'schemagen') {
    const schemaPath = join(configDir, 'config.schema.json')
    const schema = JSON.stringify(jsonSchema, null, 2) + '\n'

    await writeFile(schemaPath, schema)
    return
  }

  const configPath = join(configDir, 'config.json')
  const configExists = await exists(configPath)
  if (!configExists) {
    throw new Error(`Config file "${configPath}" does not exist!`)
  }

  const data = await readFile(configPath, 'utf8')
  const json = JSON.parse(data) as unknown
  const config = await ConfigSchema.parseAsync(json)

  const app = await createServer(config)
  const port = env.PORT ? Number.parseInt(env.PORT, 10) : 3_000

  logger.info(ctx, field('action', 'init'), field('port', port))
  app.listen(port)
}

main().catch(console.error)
