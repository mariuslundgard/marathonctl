'use strict'

const Promise = require('bluebird')

const chalk = require('chalk')
const encodeAuth = require('../lib/encodeAuth')
const getAuthFilePath = require('../lib/getAuthFilePath')
const MarathonClient = require('../lib/MarathonClient')
const mkdirp = Promise.promisify(require('mkdirp'))
const ora = require('ora')
const path = require('path')
const prompt = require('prompt-sync')()
const writeFile = Promise.promisify(require('fs').writeFile)

module.exports = function login (args, flags, opts) {
  const env = opts.env || {}
  const marathonUrl = args.shift()

  if (!marathonUrl) {
    return Promise.reject(new Error('No marathon URL provided'))
  }

  const user = flags.user || prompt('Enter username: ', null)
  const pass = flags.pass || prompt('Enter password: ', null, {echo: '*'})
  const authString = encodeAuth(user, pass)
  const apiClient = new MarathonClient({
    marathonUrl: marathonUrl,
    transport: opts.transport,
    authString
  })

  const spinner = flags.quiet
    ? null
    : ora(` Logging in to ${chalk.blue(marathonUrl)}`).start()

  return apiClient.getApps().then(() => {
    const authFilePath = getAuthFilePath(marathonUrl, env)

    return mkdirp(path.dirname(authFilePath)).then(() =>
      writeFile(authFilePath, authString)
    )
  })
  .then(() => {
    if (spinner) {
      spinner.succeed(' Successfully logged in')
    }
  })
  .catch((err) => {
    if (spinner) {
      spinner.stop()
    }
    return Promise.reject(err)
  })
}
