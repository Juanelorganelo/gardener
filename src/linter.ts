import type {Config} from './config'

const presets: Record<string, RegExp> = {
  'git-flow': /^(release|hotfix|bugfix|feature)\/.+$/,
  'git-flow-kebab': /^(release|hotfix|bugfix|feature)\/[a-z0-9](-[a-z0-9])*$/,
}

function compilePattern(sourceOrPreset: string): RegExp {
  if (sourceOrPreset in presets) {
    return presets[sourceOrPreset]
  }

  return new RegExp(String.raw`${sourceOrPreset}`)
}

export function lint(branchName: string, config: Config): string {
  const pattern = compilePattern(config.preset ?? config.pattern!)

  if (!pattern.test(branchName)) {
    return config.preset ? `Branch name ${branchName} does not match preset ${config.preset}` : `Branch name ${branchName} does not match pattern ${config.pattern}`
  }

  return ''
}
