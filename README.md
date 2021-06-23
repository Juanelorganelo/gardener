# Gardener
===========

A simple linter for Git branches

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![License](https://img.shields.io/npm/l/@ck/blinter.svg)](https://github.com/course-key/gardener/blob/master/package.json)

## WIP :warning:

<!-- toc -->
* [Usage](#usage)
* [Options](#options)
<!-- tocstop -->
## Usage
<!-- usage -->
```sh-session
$ npm install -g git+https://github.com/course-key/gardener
$ gardener [options] [branch_name]
```
If no branch name is provided, `gardener` will lint the name of the Git branch currently checked out.
<!-- usagestop -->
## Options
<!-- options -->
### `-e, --exclude`
A list of branch names to exclude from linting. Branches must match the string on the exclude list exactly.

### `-p, --preset`
This flag will enable you to use one of the predefined branch patterns. Available values are `git-flow` and `git-flow-kebab`.

### `-r, --pattern`
A custom regular expression used to validate branch names. This flag will be ignored if `preset` is present.

### `-h, --help`
Display usage on the CLI.

<!-- optionsstop -->
