'use strict'

/* eslint-disable max-nested-callbacks */

const Promise = require('bluebird')

const chalk = require('chalk')
const encodeAuth = require('../encodeAuth')
const getAuth = require('../getAuth')
const loadManifest = require('../loadManifest')
const MarathonClient = require('../lib/MarathonClient')
const ora = require('ora')
const path = require('path')

module.exports = function deploy (args, flags, opts) {
  const env = opts.env || {}
  const manifestPath = args.shift() || 'marathon.json'
  const tag = args.shift() || 'latest'
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
        : ora(`Deploying ${chalk.blue(manifest.app.id)}`).start()

      // Append tag to image name
      manifest.app.container.docker.image = `${manifest.app.container.docker.image}:${tag}`

      return apiClient.getApp(manifest.app.id)
        .then(() =>
          apiClient.updateApp(manifest.app)
            .then((data) => [data.deploymentId])
        )
        .catch(() =>
          apiClient.createApp(manifest.app)
            .then((data) => data.deployments.map((d) => d.id))
        )
        .then((deploymentIds) =>
          apiClient.waitForDeployments(deploymentIds, timeoutMs)
        )
        .then(() => {
          if (spinner) {
            spinner.succeed(`${chalk.blue(manifest.app.id)} was deployed`)
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
