'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['port', 'protocol', 'name'],
  additionalProperties: false,
  properties: {
    port: {
      type: 'integer'
    },
    protocol: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    labels: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    }
  }
}
