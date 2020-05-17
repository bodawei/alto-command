import * as Config from '@oclif/config'
import {HelpBase} from 'alto-plugin-help'

import {Command} from '.'
import {getHelpClass} from 'alto-plugin-help'

export class Main extends Command {
  static run(argv = process.argv.slice(2), options?: Config.LoadOptions) {
    return super.run(argv, options || (module.parent && module.parent.parent && module.parent.parent.filename) || __dirname)
  }

  /*
   * Override the parent class' _run() routine so we can conert from a space-delimited
   * set of subcommands to the heroku-style colon delimited style. This allows the overall
   * machinery to keep working with the colon-separated style.
   */
  async _run<T>(): Promise<T | undefined> {
    let herokuizedCommandId = ''
    let argsConsumed = 0
    // Loop the argv array (subcommand + flags + other args), concatenating each
    // successive argument into a colon-separated string, and then check if it
    // matches a command (e.g. foo:bar:baz:doit). If so, success, otherwise,
    // check if it matches a "topic" (the foo:bar:baz portion of the previous)
    // example. If it does, then we're possibly heading towards command match.
    for (let index = 0; index < this.argv.length; index++) {
      const arg = this.argv[index]
      const divider = index === 0 ? '' : ':'
      const candidate = `${herokuizedCommandId}${divider}${arg}`
      const matchingCommand = this.config.findCommand(candidate)
      const topic = this.config.findTopic(candidate)
      argsConsumed++
      if (matchingCommand) {
        herokuizedCommandId = candidate
        break
      }
      if (!topic) {
        argsConsumed--
        break
      }
      herokuizedCommandId = candidate
    }
    // Replace the portion of argv that was turned into a colon-separated
    // id with that id, then yield to the superclass.  It won't ever know
    // the user typed in spaces.
    if (argsConsumed > 0) {
      this.argv.splice(0, argsConsumed, herokuizedCommandId)
    }
    return super._run()
  }

  async init() {
    const [id, ...argv] = this.argv
    await this.config.runHook('init', {id, argv})
    return super.init()
  }

  async run() {
    const [id, ...argv] = this.argv
    this.parse({strict: false, '--': false, ...this.ctor as any})
    if (!this.config.findCommand(id)) {
      const topic = this.config.findTopic(id)
      if (topic) return this._help()
    }
    await this.config.runCommand(id, argv)
  }

  protected _helpOverride(): boolean {
    if (['-v', '--version', 'version'].includes(this.argv[0])) return this._version() as any
    if (['-h', 'help'].includes(this.argv[0])) return true
    if (this.argv.length === 0) return true
    for (const arg of this.argv) {
      if (arg === '--help') return true
      if (arg === '--') return false
    }
    return false
  }

  protected _help() {
    const HelpClass = getHelpClass(this.config)
    const help: HelpBase = new HelpClass(this.config)
    help.showHelp(this.argv)
    return this.exit(0)
  }
}

export function run(argv = process.argv.slice(2), options?: Config.LoadOptions) {
  return Main.run(argv, options)
}
