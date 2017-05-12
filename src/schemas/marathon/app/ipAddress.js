'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  properties: {
    groups: {
      type: 'array',
      items: [
        {type: 'string'}
      ]
    },
    labels: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    },
    networkName: {
      type: 'string'
    }
  }
}
