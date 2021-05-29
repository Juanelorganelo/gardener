import {test as fancy} from '@oclif/test'
import {writeConfig} from './write-config'

export const test = fancy.register('config', writeConfig)
