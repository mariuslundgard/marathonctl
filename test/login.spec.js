'use strict'

/* eslint-disable max-nested-callbacks */

const Promise = require('bluebird')

const assert = require('assert')
const {afterEach, describe, it} = require('mocha')
const marathonctl = require('../src')
const MockMarathon = require('./lib/MockMarathon')
const path = require('path')
const rimraf = Promise.promisify(require('rimraf'))

describe('marathonctl login', () => {
  afterEach((done) => {
    rimraf(path.resolve(__dirname, 'fixtures/home/.marathon'))
      .then(() => done())
  })

  it('should login successfully', (done) => {
    const mockMarathon = new MockMarathon({
      auth: 'basic',
      accounts: [
        {user: 'test', pass: 'test'}
      ],
      apps: [
        {
          id: '/app',
          deployments: []
        }
      ]
    })

    const args = [
      'login',
      'https://marathon.mock'
    ]

    const flags = {
      user: 'test',
      pass: 'test',
      quiet: true
    }

    const opts = {
      cwd: path.resolve(__dirname, 'fixtures/valid-project'),
      env: {
        HOME: path.resolve(__dirname, 'fixtures/home')
      },
      transport: mockMarathon.request.bind(mockMarathon)
    }

    marathonctl(args, flags, opts)
      .then(() => {
        assert.equal(mockMarathon.requests.length, 1)
        assert.equal(mockMarathon.requests[0].method, 'GET')
        assert.equal(mockMarathon.requests[0].path, '/v2/apps')
        assert.equal(mockMarathon.requests[0].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        assert.equal(mockMarathon.requests[0].headers['Accept'], 'application/json')
        assert.equal(mockMarathon.requests[0].headers['Content-Type'], 'application/json')
        done()
      })
      .catch((err) => {
        console.log(err.stack)
        throw err
      })
  })
})
