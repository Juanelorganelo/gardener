/* eslint-disable @typescript-eslint/no-use-before-define */
import {spawn} from 'child_process'

export async function getCurrentBranch(): Promise<string> {
  const lines = await git('rev-parse', {abbrevRef: 'HEAD'})

  for (const line of lines.split('\n')) {
    if (!isWhitespaceOrEmpty(line)) {
      return line
    }
  }

  throw new Error('Unexpected error while getting branch name')
}

function git(command: string, flags?: Record<string, unknown>, args?: unknown[]): Promise<string> {
  const argv: string[] = []

  if (args) {
    argv.push(...args.map(String))
  }
  if (flags) {
    argv.push(...serializeFlags(flags))
  }

  const child = spawn('git', [command, ...argv])

  return new Promise((resolve, reject) => {
    let result = ''
    child.on('data', (chunk: Buffer) => {
      result += chunk.toString()
    })
    child.on('exit', (code: number) => {
      if (code === 0) {
        resolve(result.trim())
      } else {
        reject(new Error(`Command ${command} exited with code ${code}`))
      }
    })
    child.on('error', error => {
      reject(error)
    })
  })
}

const KEBAB_TRANSFORM = /\B(?:([A-Z])(?=[a-z]))|(?:(?<=[a-z0-9])([A-Z]))/g

function kebab(string: string): string {
  return string.replace(KEBAB_TRANSFORM, '-$1$2').toLowerCase()
}

function serializeFlags(flags: Record<string, unknown>): string[] {
  const stack = []

  for (const [key, value] of Object.entries(flags)) {
    if (key.length === 0) {
      stack.push(`-${key}`)
    } else {
      stack.push(`--${kebab(key)}`)
    }
    stack.push(String(value))
  }

  return stack
}

const WHITESPACE = /^[\s\r\n]+$/

function isWhitespaceOrEmpty(string: string): boolean {
  return string === '' || WHITESPACE.test(string)
}
