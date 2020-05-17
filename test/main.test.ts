import {expect, fancy} from 'fancy-test'

import {Main} from '../src/main'

const pjson = require('../package.json')
const version = `alto-command/${pjson.version} ${process.platform}-${process.arch} node-${process.version}`

describe('main', () => {
  fancy
  .stdout()
  .do(() => Main.run(['plugins']))
  .do(output => expect(output.stdout).to.equal('no plugins installed\n'))
  .it('runs plugins')

  fancy
  .stdout()
  .do(() => Main.run(['-v']))
  .catch('EEXIT: 0')
  .do(output => expect(output.stdout).to.equal(version + '\n'))
  .it('runs -v')

  fancy
  .stdout()
  .do(() => Main.run(['-h']))
  .catch('EEXIT: 0')
  .do(output => expect(output.stdout).to.equal(`alto-clif base command

VERSION
  ${version}

USAGE
  $ alto-command [COMMAND]

COMMANDS
  help     display help for alto-command
  plugins  list installed plugins

`))
  .it('runs -h')
})
