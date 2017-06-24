'use strict'

const delay = require('./delay')
const Promise = require('bluebird')

class MarathonClient {
  constructor (opts = {}) {
    this.marathonUrl = opts.marathonUrl
    this.authString = opts.authString
    this.transport = opts.transport
  }

  getApps () {
    return this.makeRequest('GET', '/apps')
  }

  getApp (id) {
    return this.makeRequest('GET', `/apps/${id.indexOf('/') === 0 ? id.substr(1) : id}`)
  }

  createApp (payload) {
    return this.makeRequest('POST', '/apps', payload)
  }

  updateApp (payload) {
    const id = payload.id
    return this.makeRequest('PUT', `/apps/${id.indexOf('/') === 0 ? id.substr(1) : id}`, payload)
  }

  deleteApp (id) {
    return this.makeRequest('DELETE', `/apps/${id.indexOf('/') === 0 ? id.substr(1) : id}`)
  }

  getDeployments () {
    return this.makeRequest('GET', '/deployments')
  }

  waitForDeployments (deploymentIds, timeoutMs = -1) {
    const startTime = Date.now()
    const delayMs = 500

    const check = () => {
      return this.getDeployments().then((data) => {
        const ids = data.map((d) => d.id)
        const found = []

        ids.forEach((deploymentId) => {
          if (deploymentIds.indexOf(deploymentId) > -1) {
            found.push(deploymentId)
          }
        })

        if (found.length > 0) {
          return delay(delayMs).then(() => {
            const duration = Date.now() - startTime

            if (timeoutMs > -1 && duration > timeoutMs) {
              return Promise.reject(new Error('Timed out'))
            }

            return check()
          })
        }

        return true
      })
    }

    return check()
  }

  makeRequest (method, path, payload) {
    const uri = `${this.marathonUrl}/v2${path}`

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }

    if (this.authString) {
      headers['Authorization'] = `Basic ${this.authString}`
    }

    const opts = {
      method,
      uri,
      headers
    }

    if (payload) {
      opts.json = payload
    }

    return new Promise((resolve, reject) => {
      this.transport(opts, (err, res, body) => {
        const _body = typeof body === 'string' ? JSON.parse(body) : body

        if (err) {
          err.res = res
          return reject(err)
        }

        if (res.statusCode >= 400) {
          return reject(new Error(_body.message))
        }

        return resolve(_body)
      })
    })
  }
}

module.exports = MarathonClient
