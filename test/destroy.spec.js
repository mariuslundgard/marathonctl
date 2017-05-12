'use strict'

const assert = require('assert')
const {describe, it} = require('mocha')
const marathonctl = require('../src')
const MockMarathon = require('./lib/MockMarathon')
const path = require('path')

describe('marathonctl destroy', () => {
  it('should destroy existing app successfully', (done) => {
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
      'destroy',
      'marathon.json'
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
        assert.equal(mockMarathon.requests[1].method, 'DELETE')
        assert.equal(mockMarathon.requests[1].path, '/v2/apps/user/app')
        assert.equal(mockMarathon.requests[1].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        done()
      })
      .catch((err) => {
        throw err
      })
  })

  it('should destroy non-existing app with failure', (done) => {
    const mockMarathon = new MockMarathon({
      auth: 'basic',
      accounts: [
        {user: 'test', pass: 'test'}
      ]
    })

    const args = [
      'destroy'
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
      .catch((err) => {
        assert.equal(err.message, 'App \'/user/app\' does not exist')
        assert.equal(mockMarathon.requests.length, 1)
        assert.equal(mockMarathon.requests[0].method, 'GET')
        assert.equal(mockMarathon.requests[0].path, '/v2/apps/user/app')
        assert.equal(mockMarathon.requests[0].headers['Authorization'], 'Basic dGVzdDp0ZXN0')
        done()
      })
      .catch((err) => {
        throw err
      })
  })
})
