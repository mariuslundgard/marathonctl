'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['protocol', 'maxConsecutiveFailures'],
  additionalProperties: false,
  properties: {
    protocol: {
      type: 'string'
    },
    path: {
      type: 'string'
    },
    gracePeriodSeconds: {
      type: 'integer'
    },
    intervalSeconds: {
      type: 'integer'
    },
    port: {
      type: 'integer'
    },
    portIndex: {
      type: 'integer'
    },
    timeoutSeconds: {
      type: 'integer'
    },
    command: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    },
    maxConsecutiveFailures: {
      type: 'integer'
    }
  }
}
