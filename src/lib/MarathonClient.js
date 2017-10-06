'use strict'

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
        let _body
        try {
          _body = JSON.parse(body)
        } catch (parseErr) {
          _body = body
        }

        if (err) {
          err.res = res
          return reject(err)
        }

        if (res.statusCode === 401) {
          return reject(new Error('Not authorized'))
        }

        if (res.statusCode >= 400) {
          return reject(new Error(typeof _body === 'object' ? _body.message : _body))
        }

        return resolve(_body)
      })
    })
  }
}

module.exports = MarathonClient
