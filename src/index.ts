import 'source-map-support/register.js'

import { argv } from 'node:process'
import { jsonSchema } from './schema.js'

const main = async () => {
  if (argv[2]?.toLowerCase() === 'schemagen') {
    const schema = JSON.stringify(jsonSchema, null, 2)
    console.log(schema)

    return
  }

  // TODO
  void 0
}

main().catch(console.error)
