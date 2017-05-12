'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.export = {
  type: 'object',
  required: ['uri'],
  additionalProperties: false,
  properties: {
    uri: {
      type: 'string'
    },
    executable: {
      type: 'boolean'
    },
    extract: {
      type: 'boolean'
    },
    cache: {
      type: 'boolean'
    }
  }
}
