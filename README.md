alto-command
===============
[![Version](https://img.shields.io/npm/v/alto-command.svg)](https://npmjs.org/package/alto-command)
[![License](https://img.shields.io/npm/l/alto-command.svg)](https://github.com/bodawei/alto-command/blob/master/package.json)

### About
This is a fork of [@oclif/command](https://github.com/oclif/command).
The reason for this fork is to change this to allow space-separated subcommands rather than
the heroku-style colon delimited.  This is a minimal change, which should allow this to be
used with the rest of the `@oclif/*` system.

Note that this accepts both the heroku style and the space-delimited style at the moment.

### Notes/Next steps
* This hasn't been particularly heavily tested, at this moment.
* Other parts of the `@oclif/*` system will need to be alto-ized (e.g. the help plugin)
* Would like to set up a "heroku" flag in the package hosting this one, and let that drive whether this does or does not accept colons.

### Warning

Consider this situation. You have a command like this:
  ```
  mycmd topic1 topic2 cmd arg  # that is, in heroku-land mycmd topic1:topic2:cmd arg
  ```
imagine you mis-type this:
  ```
  mycmd topic1 topic2 arg
  ```
and your arg happens to have the value "cmd". Then this will execute the command when you
might have expected an error (this is hardly a surprise in the land of command line interfaces
where many things like this can happy, but worth pointing out as a "failure mode" to be aware of)

### Name explanation
This is an alternate oclif, which is to say: "alt-oclif", which is to say "alto-clif".

### Thanks

Thanks to the [`@oclif` team and contributors](https://github.com/oclif/command/graphs/contributors).
There are are lot of great ideas in oclif! Without them, of course, this package wouldn't exist!

Original README info, below
===============


oclif base command

[![Version](https://img.shields.io/npm/v/@oclif/command.svg)](https://npmjs.org/package/bodawei/alto-command)
[![License](https://img.shields.io/npm/l/@oclif/command.svg)](https://github.com/bodawei/alto-command/blob/master/package.json)

This is about half of the main codebase for oclif. The other half lives in [@oclif/config](https://github.com/oclif/config). This can be used directly, but it probably makes more sense to build your CLI with the [generator](https://github.com/oclif/oclif).

Usage
=====

Without the generator, you can create a simple CLI like this:

**TypeScript**
```js
#!/usr/bin/env ts-node

import * as fs from 'fs'
import {Command, flags} from '@oclif/command'

class LS extends Command {
  static flags = {
    version: flags.version(),
    help: flags.help(),
    // run with --dir= or -d=
    dir: flags.string({
      char: 'd',
      default: process.cwd(),
    }),
  }

  async run() {
    const {flags} = this.parse(LS)
    let files = fs.readdirSync(flags.dir)
    for (let f of files) {
      this.log(f)
    }
  }
}

LS.run()
.catch(require('@oclif/errors/handle'))
```

**JavaScript**
```js
#!/usr/bin/env node

const fs = require('fs')
const {Command, flags} = require('@oclif/command')

class LS extends Command {
  async run() {
    const {flags} = this.parse(LS)
    let files = fs.readdirSync(flags.dir)
    for (let f of files) {
      this.log(f)
    }
  }
}

LS.flags = {
  version: flags.version(),
  help: flags.help(),
  // run with --dir= or -d=
  dir: flags.string({
    char: 'd',
    default: process.cwd(),
  }),
}

LS.run()
.catch(require('@oclif/errors/handle'))
```

Then run either of these with:

```sh-session
$ ./myscript
...files in current dir...
$ ./myscript --dir foobar
...files in ./foobar...
$ ./myscript --version
myscript/0.0.0 darwin-x64 node-v9.5.0
$ ./myscript --help
USAGE
  $ @oclif/command

OPTIONS
  -d, --dir=dir  [default: /Users/jdickey/src/github.com/oclif/command]
  --help         show CLI help
  --version      show CLI version
```

See the [generator](https://github.com/oclif/oclif) for all the options you can pass to the command.
