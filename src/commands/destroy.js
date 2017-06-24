'use strict'

const Promise = require('bluebird')

const chalk = require('chalk')
const encodeAuth = require('../lib/encodeAuth')
const getAuth = require('../lib/getAuth')
const loadManifest = require('../loadManifest')
const MarathonClient = require('../lib/MarathonClient')
const ora = require('ora')
const path = require('path')
const waitForDeployments = require('../lib/waitForDeployments')

module.exports = function destroy (args, flags, opts) {
  const env = opts.env || {}
  const manifestPath = args.shift() || 'marathon.json'
  const timeoutMs = flags.timeout ? parseInt(flags.timeout, 10) : -1

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
        : ora(` Destroying ${chalk.blue(manifest.app.id)}`).start()

      return apiClient.getApp(manifest.app.id)
        .then(() =>
          apiClient.deleteApp(manifest.app.id)
        )
        .then((data) =>
          waitForDeployments(apiClient, [data.deploymentId], timeoutMs)
        )
        .then(() => {
          if (spinner) {
            spinner.succeed(` ${chalk.blue(manifest.app.id)} was destroyed`)
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
