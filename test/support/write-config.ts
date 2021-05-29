import fs from 'fs'
import path from 'path'
import yaml from 'yaml'

import type {FancyTypes} from '@oclif/test'
import type {Config} from '../../src/config'

interface WriteConfigContext extends FancyTypes.Context {
  file: string;
}

export function writeConfig(config: Partial<Config>, file = path.join(process.cwd(), '.gardenerrc.yml')): FancyTypes.Plugin<WriteConfigContext> {
  return {
    run(ctx: WriteConfigContext) {
      ctx.file = file
      fs.writeFileSync(file, yaml.stringify(config))
    },
    finally(ctx: WriteConfigContext) {
      fs.unlinkSync(ctx.file)
      ctx.file = ''
    },
  }
}
