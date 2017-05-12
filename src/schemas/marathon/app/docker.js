'use strict'

const portMapping = require('./portMapping')

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  properties: {
    image: {
      type: 'string'
    },
    network: {
      type: 'string'
    },
    portMappings: {
      type: 'array',
      items: [
        portMapping
      ]
    },
    privileged: {
      type: 'boolean'
    }
  }
}
