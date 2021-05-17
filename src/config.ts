/* eslint-disable @typescript-eslint/no-use-before-define */
import fs from 'fs'
import AJV from 'ajv'
import path from 'path'
import yaml from 'yaml'
import configSchema from './config-schema.json'

const files = [
  '.gardenerrc.yml',
  '.gardenerrc.json',
  '.gardenerrc.js',
  '.gardenerrc',
]

export type Preset = 'git-flow' | 'git-flow-kebab'

export interface Config {
  pattern?: string;
  preset?: Preset;
  exclude?: string[];
}

const ajv = new AJV()

export async function load(): Promise<Config> {
  let config: Record<string, unknown>

  const pkg = findPackageJson()

  if (pkg.blinter) {
    config = pkg.blinter as Record<string, unknown>
  } else {
    const file = findUpstream(files)
    config = yaml.parse(fs.readFileSync(file, {encoding: 'utf-8'}))
  }

  if (!ajv.validate(configSchema, config)) {
    throw new Error('Invalid configuration file')
  }

  return config as Config
}

function findUpstream(files: string[], cwd = process.cwd(), maxDepth = 7): string {
  let depth = 0
  let currentDir = cwd

  while (depth < maxDepth) {
    for (const file of files) {
      const currentPath = path.join(currentDir, file)

      if (fs.existsSync(currentPath)) {
        return currentPath
      }

      currentDir = path.resolve('..', currentDir)
      depth++
    }
  }

  return ''
}

function findPackageJson(cwd?: string, maxDepth?: number): Record<string, unknown> {
  const file = findUpstream(['package.json'], cwd, maxDepth)
  return JSON.parse(fs.readFileSync(file, {encoding: 'utf8'}))
}
