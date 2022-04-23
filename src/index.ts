import 'source-map-support/register.js'

import mkdirp from 'mkdirp'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { argv } from 'node:process'
import { jsonSchema } from './schema.js'

const main = async () => {
  if (argv[2]?.toLowerCase() === 'schemagen') {
    const dir = join('.', 'config')
    await mkdirp(dir)

    const path = join(dir, 'config.schema.json')
    const schema = JSON.stringify(jsonSchema, null, 2) + '\n'
    await writeFile(path, schema)

    return
  }

  // TODO
  void 0
}

main().catch(console.error)
