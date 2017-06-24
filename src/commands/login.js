'use strict'

const Promise = require('bluebird')

const chalk = require('chalk')
const encodeAuth = require('../encodeAuth')
const getAuthFilePath = require('../getAuthFilePath')
const loadManifest = require('../loadManifest')
const MarathonClient = require('../lib/MarathonClient')
const mkdirp = Promise.promisify(require('mkdirp'))
const ora = require('ora')
const path = require('path')
const prompt = require('prompt-sync')()
const writeFile = Promise.promisify(require('fs').writeFile)

module.exports = function login (args, flags, opts) {
  const env = opts.env || {}
  const manifestPath = args.shift() || 'marathon.json'

  return loadManifest(path.resolve(opts.cwd, manifestPath))
    .then((manifest) => {
      if (!manifest.auth) {
        console.log(`no auth required for ${manifest.marathonUrl}`)
        return true
      }

      const user = flags.user || prompt('Enter username: ', null)
      const pass = flags.pass || prompt('Enter password: ', null, {echo: '*'})
      const authString = encodeAuth(user, pass)
      const apiClient = new MarathonClient({
        marathonUrl: manifest.marathonUrl,
        transport: opts.transport,
        authString
      })

      const spinner = flags.quiet
        ? null
        : ora(` Destroying ${chalk.blue(manifest.app.id)}`).start()

      return apiClient.getApps().then(() => {
        const authFilePath = getAuthFilePath(manifest.marathonUrl, env)
        return mkdirp(path.dirname(authFilePath)).then(() => {
          return writeFile(authFilePath, authString)
        })
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
    })
}
