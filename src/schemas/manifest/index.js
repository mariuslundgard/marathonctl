'use strict'

const app = require('../marathon/app')

module.exports = {
  type: 'object',
  required: ['marathonUrl', 'app'],
  additionalProperties: false,
  properties: {
    auth: {
      type: 'boolean',
      default: false
    },
    marathonUrl: {
      type: 'string',
      format: 'uri',
      'pattern': '^(https?)://'
    },
    app
  }
}
