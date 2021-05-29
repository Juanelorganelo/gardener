import {expect} from '@oclif/test'
import {test} from './support'
import Gardener from '../src'

describe('config', () => {
  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['foo']))
  .catch(error => {
    expect(error.message).to.contain('Invalid branch name. GitFlow branches must match the following pattern <type>/<description>')
  })
  .it('uses a git-flow preset by default')

  test
  .stdout()
  .do(() => Gardener.run(['foo', '--exclude', 'foo']))
  .it('skips the given branch from linting', ctx => {
    expect(ctx.stdout).to.contain('Branch foo configured as excluded, skipping')
  })

  test
  .stdout()
  .config({exclude: ['foo']})
  .do(() => Gardener.run(['foo']))
  .it('uses the config defined in the rc file', ctx => {
    expect(ctx.stdout).to.contain('Branch foo configured as excluded, skipping')
  })
})
