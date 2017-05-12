'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['containerPath', 'hostPath', 'mode'],
  additionalProperties: false,
  properties: {
    containerPath: {
      type: 'string'
    },
    hostPath: {
      type: 'string'
    },
    mode: {
      type: 'string'
    }
  }
}
