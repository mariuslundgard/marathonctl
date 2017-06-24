'use strict'

const Promise = require('bluebird')

const chalk = require('chalk')
const encodeAuth = require('../encodeAuth')
const getAuth = require('../getAuth')
const loadManifest = require('../loadManifest')
const MarathonClient = require('../lib/MarathonClient')
const ora = require('ora')
const path = require('path')
const statusView = require('../views/status')

module.exports = function status (args, flags, opts) {
  const env = opts.env || {}
  const manifestPath = args.shift() || 'marathon.json'

  return loadManifest(path.resolve(opts.cwd, manifestPath))
    .then((manifest) => {
      const authString = manifest.auth
        ? (flags.user && flags.pass
          ? encodeAuth(flags.user, flags.pass)
          : getAuth(manifest.marathonUrl, env))
        : null

      const apiClient = new MarathonClient({
        marathonUrl: manifest.marathonUrl,
        transport: opts.transport,
        authString
      })

      const spinner = flags.quiet
        ? null
        : ora(` Fetching ${chalk.blue(manifest.app.id)}`).start()

      return apiClient.getApp(manifest.app.id)
        .then((data) => {
          if (spinner) {
            spinner.stop()
            console.log(statusView(data))
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
