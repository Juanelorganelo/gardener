/* eslint-disable @typescript-eslint/no-use-before-define */
import {Presets} from './presets/preset'
import {GitFlowPreset} from './presets/git-flow'
import {PatternPreset} from './presets/pattern'

import type {Preset} from './presets/preset'

import type {Config} from './config'

export async function lint(branchName: string, config: Config): Promise<string | undefined> {
  const preset = createPreset(config)
  const validation = await preset.validate(branchName)

  if (validation) {
    return validation
  }
}

function createPreset(config: Config): Preset {
  let name: string
  let options: Record<string, unknown> | undefined

  if (typeof config.preset === 'string') {
    name = config.preset
  } else {
    name = config.preset.name
    options = config.preset.options
  }

  // Clean up the name.
  name = name.trim()

  switch (name) {
  case Presets.PATTERN:
    return new PatternPreset(options)
  case Presets.GIT_FLOW:
    return new GitFlowPreset(options)
  default:
    throw new Error(`Invalid preset name ${name}`)
  }
}
