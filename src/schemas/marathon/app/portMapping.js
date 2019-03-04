'use strict'

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['containerPort', 'hostPort', 'protocol'],
  additionalProperties: true,
  properties: {
    containerPort: {
      type: 'integer'
    },
    hostPort: {
      type: 'integer'
    },
    servicePort: {
      type: 'integer'
    },
    protocol: {
      type: 'string'
    }
  }
}
