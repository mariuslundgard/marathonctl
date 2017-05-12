'use strict'

const assert = require('assert')
const {describe, it} = require('mocha')
const marathonctl = require('../src')
const MockMarathon = require('./lib/MockMarathon')
const path = require('path')

describe('marathonctl deploy', () => {
  it('should deploy existing app successfully', (done) => {
    const mockMarathon = new MockMarathon({
      auth: 'basic',
      accounts: [
        {user: 'test', pass: 'test'}
      ],
      apps: [
        {
          id: '/user/app'
        }
      ]
    })

    const args = [
      'deploy',
      'marathon.json',
      'latest'
    ]

    const flags = {
      quiet: true,
      user: 'test',
      pass: 'test'
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
        assert.equal(mockMarathon.requests[0].method, 'GET')
        assert.equal(mockMarathon.requests[0].path, '/v2/apps/user/app')
        assert.equal(mockMarathon.requests[0].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        assert.equal(mockMarathon.requests[1].method, 'PUT')
        assert.equal(mockMarathon.requests[1].path, '/v2/apps/user/app')
        assert.equal(mockMarathon.requests[1].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        assert.equal(mockMarathon.requests[2].method, 'GET')
        assert.equal(mockMarathon.requests[2].path, '/v2/deployments')
        assert.equal(mockMarathon.requests[2].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        done()
      })
  })

  it('should deploy non-existing app successfully', (done) => {
    const mockMarathon = new MockMarathon({
      auth: 'basic',
      accounts: [
        {user: 'test', pass: 'test'}
      ],
      apps: []
    })

    const args = [
      'deploy',
      'marathon.json',
      'latest'
    ]

    const flags = {
      quiet: true,
      user: 'test',
      pass: 'test'
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
        assert.equal(mockMarathon.requests[0].method, 'GET')
        assert.equal(mockMarathon.requests[0].path, '/v2/apps/user/app')
        assert.equal(mockMarathon.requests[0].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        assert.equal(mockMarathon.requests[1].method, 'POST')
        assert.equal(mockMarathon.requests[1].path, '/v2/apps')
        assert.equal(mockMarathon.requests[1].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        assert.equal(mockMarathon.requests[2].method, 'GET')
        assert.equal(mockMarathon.requests[2].path, '/v2/deployments')
        assert.equal(mockMarathon.requests[2].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
})
