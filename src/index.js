'use strict'

const commands = require('./commands')

const printUsage = () => {
  console.log(`
  Usage: marathonctl [command] [options]

  Options:

    --force
    --user
    --pass
    --quiet
    --timeout <milliseconds>

  Commands:

    - deploy <marathon-json-path> <tag>
    - destroy <marathon-json-path>
    - login <marathon-json-path>
    - status <marathon-json-path>
`)
}

module.exports = function marathonctl (args, flags, opts) {
  const command = args.shift()

  if (!command) {
    printUsage()
    return Promise.resolve()
  } else if (!commands[command]) {
    return Promise.reject(new Error(`unknown command: ${command}`))
  }

  return commands[command](args, flags, opts)
}
