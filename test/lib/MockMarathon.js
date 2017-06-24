'use strict'

/* eslint-disable max-nested-callbacks */

const Promise = require('bluebird')

const encodeAuth = require('../../src/lib/encodeAuth')

const delay = (delayMs) => new Promise((resolve) => {
  setTimeout(resolve, delayMs)
})

class MockMarathon {
  constructor (params) {
    this.auth = params.auth || null
    this.accounts = params.accounts || []
    this.protocol = params.protocol || 'https:'
    this.host = params.host || 'marathon.mock'
    this.data = {apps: params.apps || []}
    this.requests = []
  }

  getApps () {
    return delay(100).then(() => this.data.apps)
  }

  request (opts, cb) {
    const baseUrl = `${this.protocol}//${this.host}`
    const req = {
      method: opts.method || 'GET',
      path: opts.uri.substr(baseUrl.length),
      headers: opts.headers || {},
      json: opts.json
    }

    this.requests.push(req)

    switch (req.method) {
      case 'GET':
        return this.handleGETRequest(req, cb)
      case 'POST':
        return this.handlePOSTRequest(req, cb)
      case 'PUT':
        return this.handlePUTRequest(req, cb)
      case 'DELETE':
        return this.handleDELETERequest(req, cb)
      default:
        return cb(new Error(`${req} is not a supported HTTP method`))
    }
  }

  handleAuth (req, cb, handler) {
    switch (this.auth) {
      case 'basic': {
        const authStrings = this.accounts.map((d) =>
          `Basic ${encodeAuth(d.user, d.pass)}`
        )

        if (authStrings.indexOf(req.headers['Authorization']) > -1) {
          return handler()
        }

        return cb(new Error('Not authorized'))
      }

      default:
        return handler()
    }
  }

  handleGETRequest (req, cb) {
    this.handleAuth(req, cb, () => {
      const res = {
        statusCode: 200
      }

      switch (true) {
        case req.path === '/v2/apps':
          delay(100).then(() => {
            const body = JSON.stringify(this.data.apps)

            return cb(null, res, body)
          })
          break

        case req.path.indexOf('/v2/apps') === 0:
          delay(100).then(() => {
            const id = req.path.substr(8)
            const matches = this.data.apps.filter((app) => {
              return app.id === id
            })

            if (matches.length) {
              const payload = {app: matches[0]}
              const body = JSON.stringify(payload)

              return cb(null, res, body)
            }

            res.statusCode = 404

            return cb(new Error(`App '${id}' does not exist`))
          })
          break

        case req.path === '/v2/deployments':
          delay(100).then(() => {
            const deployments = this.data.apps.reduce((curr, app) => {
              return curr.concat(app.deployments || [])
            }, [])
            const payload = deployments
            const body = JSON.stringify(payload)

            return cb(null, res, body)
          })
          break

        default:
          delay(100).then(() => {
            const payload = {message: `Not found: ${req.method} ${req.path}`}
            const body = JSON.stringify(payload)

            res.statusCode = 404

            return cb(null, res, body)
          })
          break
      }
    })
  }

  handlePOSTRequest (req, cb) {
    this.handleAuth(req, cb, () => {
      const res = {
        statusCode: 200
      }

      switch (true) {
        case req.path === '/v2/apps':
          delay(100).then(() => {
            const app = req.json

            this.data.apps.push(app)

            app.deployments = [
              {id: 'foo'}
            ]

            setTimeout(() => {
              app.deployments = []
            }, 500)

            const payload = app
            const body = JSON.stringify(payload)

            cb(null, res, body)
          })
          break

        default:
          delay(100).then(() => {
            const payload = {message: `Not found: ${req.method} ${req.path}`}
            const body = JSON.stringify(payload)
            res.statusCode = 404
            cb(null, res, body)
          })
          break
      }
    })
  }

  handlePUTRequest (req, cb) {
    this.handleAuth(req, cb, () => {
      const res = {
        statusCode: 200
      }

      switch (true) {
        case req.path.indexOf('/v2/apps') === 0:
          delay(100).then(() => {
            const id = req.path.substr(8)
            const matches = this.data.apps.filter((app) => {
              return app.id === id
            })

            if (matches.length) {
              const appIndex = this.data.apps.indexOf(matches[0])

              this.data.apps[appIndex] = req.json
              this.data.apps[appIndex].deployments = [
                {id: 'foo'}
              ]

              setTimeout(() => {
                this.data.apps[appIndex].deployments = this.data.apps[appIndex].deployments
                  .filter((d) => {
                    return d.id !== 'foo'
                  })
              }, 500)

              const payload = {deploymentId: 'foo'}
              const body = JSON.stringify(payload)

              return cb(null, res, body)
            }

            res.statusCode = 404
            return cb(new Error(`App '${id}' does not exist`))
          })
          break

        default:
          delay(100).then(() => {
            const payload = {message: `Not found: ${req.method} ${req.path}`}
            const body = JSON.stringify(payload)
            res.statusCode = 404
            cb(null, res, body)
          })
          break
      }
    })
  }

  handleDELETERequest (req, cb) {
    this.handleAuth(req, cb, () => {
      const res = {
        statusCode: 200
      }

      switch (true) {
        case req.path.indexOf('/v2/apps') === 0:
          delay(100).then(() => {
            const id = req.path.substr(8)
            const matches = this.data.apps.filter((app) => {
              return app.id === id
            })

            if (matches.length) {
              const appIndex = this.data.apps.indexOf(matches[0])

              this.data.apps[appIndex].deployments = [
                {id: 'foo'}
              ]

              setTimeout(() => {
                this.data.apps.splice(appIndex, 1)
              }, 500)

              const payload = {deploymentId: 'foo'}
              const body = JSON.stringify(payload)

              return cb(null, res, body)
            }

            res.statusCode = 404
            return cb(new Error(`App '${id}' does not exist`))
          })
          break

        default:
          delay(100).then(() => {
            const payload = {message: `Not found: ${req.method} ${req.path}`}
            const body = JSON.stringify(payload)
            res.statusCode = 404
            cb(null, res, body)
          })
          break
      }
    })
  }
}

module.exports = MockMarathon
