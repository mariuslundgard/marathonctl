'use strict'

const container = require('./container')
const healthCheck = require('./healthCheck')
const ipAddress = require('./ipAddress')
const portDefinition = require('./portDefinition')
const remoteResource = require('./remoteResource')

// See: https://mesosphere.github.io/marathon/docs/rest-api.html#apps

module.exports = {
  type: 'object',
  required: ['id', 'cpus', 'mem', 'instances', 'healthChecks', 'container'],
  properties: {
    id: {
      type: 'string'
    },
    cmd: {
      type: 'string'
    },
    cpus: {
      type: 'number'
    },
    mem: {
      type: 'number'
    },
    portDefinitions: {
      type: 'array',
      items: [
        portDefinition
      ]
    },
    requirePorts: {
      type: 'boolean'
    },
    instances: {
      type: 'integer'
    },
    executor: {
      type: 'string'
    },
    container,
    env: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    },
    constraints: {
      type: 'array',
      items: [
        {type: 'string'}
      ]
    },
    acceptedResourceRoles: {
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
    fetch: {
      type: 'array',
      items: [
        remoteResource
      ]
    },
    dependencies: {
      type: 'array',
      items: [
        {type: 'string'}
      ]
    },
    healthChecks: {
      type: 'array',
      items: [
        healthCheck
      ]
    },
    backoffSeconds: {
      type: 'integer'
    },
    backoffFactor: {
      type: 'number'
    },
    maxLaunchDelaySeconds: {
      type: 'integer'
    },
    taskKillGracePeriodSeconds: {
      type: 'integer'
    },
    upgradeStrategy: {
      type: 'object',
      additionalProperties: {
        type: 'number'
      }
    },
    ipAddress
  }
}
