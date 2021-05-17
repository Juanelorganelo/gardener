import {Command, flags} from '@oclif/command'

import {lint} from './linter'
import {load, Preset} from './config'
import {getCurrentBranch} from './git'

export class Gardener extends Command {
  static description = 'A simple linter for Git branches'

  static flags = {
    help: flags.help({char: 'h'}),
    version: flags.version({char: 'v'}),
    exclude: flags.string({
      char: 'e',
      multiple: true,
    }),
    preset: flags.string({char: 'p'}),
    pattern: flags.string({char: 'r'}),
  }

  static args = [
    {
      name: 'branch',
    },
  ]

  async run() {
    const {args, flags} = this.parse(Gardener)

    const config = await load()
    const currentBranch = args.branch ?? await getCurrentBranch()

    if (flags.preset) {
      config.preset = flags.preset as Preset
    }
    if (flags.pattern) {
      config.pattern = flags.pattern
    }
    if (flags.exclude) {
      config.exclude = flags.exclude
    }

    if (config.exclude && config.exclude.some(name => currentBranch === name)) {
      this.log(`Branch ${currentBranch} configured as excluded, skipping`)
      return
    }

    const errorMessage = lint(currentBranch, config)

    if (errorMessage) {
      this.error(errorMessage)
    }
  }
}
