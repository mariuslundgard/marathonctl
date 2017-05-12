'use strict'

const docker = require('./docker')
const volume = require('./volume')

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['type', 'docker'],
  additionalProperties: false,
  properties: {
    type: {
      type: 'string'
    },
    docker,
    volumes: {
      type: 'array',
      items: [
        volume
      ]
    }
  }
}
