'use strict'

/* eslint-disable max-nested-callbacks */

const Promise = require('bluebird')

const assert = require('assert')
const {after, before, describe, it} = require('mocha')
const encodeAuth = require('../src/lib/encodeAuth')
const getAuth = require('../src/lib/getAuth')
const getAuthFilePath = require('../src/lib/getAuthFilePath')
const mkdirp = Promise.promisify(require('mkdirp'))
const path = require('path')
const rimraf = Promise.promisify(require('rimraf'))
const writeFile = Promise.promisify(require('fs').writeFile)

describe('marathonctl utils', () => {
  describe('encodeAuth', () => {
    it('should encode auth string', () => {
      const auth = encodeAuth('test', 'test')
      assert.equal(auth, 'dGVzdDp0ZXN0')
    })
  })

  describe('getAuthFilePath', () => {
    it('should return auth file path', () => {
      const env = {
        HOME: 'test'
      }

      assert.equal(
        getAuthFilePath('https://marathon.mock', env),
        'test/.marathon/https___marathon.mock'
      )
    })
  })

  describe('getAuth', () => {
    before((done) => {
      mkdirp(path.resolve(__dirname, 'fixtures/home/.marathon'))
        .then(() => writeFile(
          path.resolve(__dirname, 'fixtures/home/.marathon/https___marathon.mock'),
          'dGVzdDp0ZXN0'
        ))
        .then(() => done())
    })

    after((done) => {
      rimraf(path.resolve(__dirname, 'fixtures/home/.marathon'))
        .then(() => done())
    })

    it('should read auth string from file', () => {
      const env = {
        HOME: path.resolve(__dirname, 'fixtures/home')
      }
      const auth = getAuth('https://marathon.mock', env)

      assert.equal(auth, 'dGVzdDp0ZXN0')
    })
  })
})
