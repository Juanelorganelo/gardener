import {expect} from '@oclif/test'
import Gardener from '../src'
import {test} from './support'

describe('git-flow', () => {
  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['feature/foo']))
  .it('allows feature branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['feature/foo']))
  .it('allows bugfix branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['feature/foo']))
  .it('allows hotfix branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['feature/foo']))
  .it('allows release branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['main']))
  .it('doesnt error on "main" branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['master']))
  .it('doesnt error on "master" branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['develop']))
  .it('doesnt error on "develop" branches', ctx => {
    expect(ctx.stderr).to.be.empty
  })

  test
  .stdout()
  .stderr()
  .config({
    preset: {
      name: 'git-flow',
      options: {
        issueNumber: {
          pattern: 'FF-\\d+',
        },
      },
    },
  })
  .do(() => Gardener.run(['feature/foo']))
  .catch(error => {
    expect(error.message).to.contain('Invalid branch description. Missing issue number')
  })
  .it('should enforce issue number patterns')

  test
  .stdout()
  .stderr()
  .do(() => Gardener.run(['feature/foo-FF-3453']))
  .it('should enforce issue number patterns', ctx => {
    expect(ctx.stdout).to.be.empty
  })
})
