'use strict'

const chalk = require('chalk')

const taskStateView = (state) => {
  switch (state) {
    case 'TASK_STAGING':
      return chalk.yellow(state)
    case 'TASK_RUNNING':
      return chalk.green(state)
    case 'TASK_FAILED':
    case 'TASK_KILLED':
      return chalk.red(state)
    default:
      return state
  }
}

const statusView = (data) => {
  // console.log(JSON.stringify(data, null, 1))

  const {app} = data

  return `
APPLICATION ${chalk.blue(app.id)}
  Command:                  ${app.cmd ? app.cmd : chalk.grey('—')}
  Executor:                 ${app.executor ? app.executor : chalk.grey('—')}
  URIs:                     ${app.uris.length ? app.uris.map((uri) => `${uri}`).join('\n                          ') : chalk.grey('—')}
  Instances:                ${app.instances}
  CPUs:                     ${app.cpus}
  GPUs:                     ${app.gpus}
  Memory:                   ${app.mem} MB
  Disk:                     ${app.disk} MB
  Backoff:                  ${app.backoffSeconds} seconds
  Backoff factor:           ${app.backoffFactor}
  Max launch delay:         ${app.maxLaunchDelaySeconds} seconds

CONSTRAINTS
  ${app.constraints && Object.keys(app.constraints).length ? app.constraints.map((constraint) => `${constraint.join(', ')}`).join('\n  ') : chalk.grey('—')}

LABELS
  ${app.labels && Object.keys(app.labels).length ? Object.keys(app.labels).map((key) => `${key}=${app.labels[key]}`).join('\n  ') : chalk.grey('—')}

ENVIRONMENT VARIABLES
  ${app.env && Object.keys(app.env).length ? Object.keys(app.env).map((key) => `${key}=${app.env[key]}`).join('\n  ') : chalk.grey('—')}

CONTAINER
  Type:                     ${app.container.type}
  Docker image:             ${app.container.docker.image}
  Network:                  ${app.container.docker.network}
  Privileged:               ${app.container.docker.privileged ? 'Yes' : 'No'}
  Force pull image:         ${app.container.docker.forcePullImage ? 'Yes' : 'No'}
  Port mappings:            ${app.container.docker.portMappings.map((d) =>
    `${d.servicePort}->${d.containerPort}/${d.protocol}`).join('\n                            ')}

VERSION INFORMATION
  Last scaled               ${app.versionInfo.lastScalingAt}
  Configuration changed     ${app.versionInfo.lastConfigChangeAt}
${app.deployments && app.deployments.length ? `
CURRENT DEPLOYMENTS
${app.deployments.map((d) =>
`  ${d.id}`).join('')}
` : ''}
TASKS
  Staged                    ${app.tasksStaged}
  Running                   ${app.tasksRunning}
  Healthy                   ${app.tasksHealthy}
  Unhealthy                 ${app.tasksUnhealthy}
${app.tasks.map((task, taskIdx) => `
TASK ${task.id}
  State                     ${taskStateView(task.state)}
  Slave ID                  ${task.slaveId}
  Host                      ${task.host}
  Ports                     ${task.ports}
  Started at                ${task.startedAt || chalk.grey('—')}
  Staged at                 ${task.stagedAt || chalk.grey('—')}
  Version                   ${task.version}
${task.ipAddresses ? `
  IP ADDRESSES${task.ipAddresses.map((ipAddress, ipAddressIdx) => `
    ${ipAddress.ipAddress} (${ipAddress.protocol})`).join('')}` : ''}
${task.healthCheckResults ? `
  ${task.healthCheckResults.map((healthCheckResult, healthCheckResultIdx) => `HEALTH CHECK #${healthCheckResultIdx}
    Alive                   ${healthCheckResult.alive ? chalk.green('Yes') : chalk.red('No')}
    Consecutive failures    ${healthCheckResult.consecutiveFailures}
    First success           ${healthCheckResult.firstSuccess || chalk.grey('—')}
    Last failure            ${healthCheckResult.lastFailure || chalk.grey('—')}
    Last success            ${healthCheckResult.lastSuccess || chalk.grey('—')}
    Last failure cause      ${healthCheckResult.lastFailureCause || chalk.grey('—')}
`).join('')}` : ''}`).join('')}${app.lastTaskFailure ? `
LAST FAILURE: ${chalk.red(app.lastTaskFailure.message)}
  Host                     ${app.lastTaskFailure.host}
  State                    ${taskStateView(app.lastTaskFailure.state)}
  Task ID                  ${app.lastTaskFailure.taskId}
  Timestamp                ${app.lastTaskFailure.timestamp}
  Version                  ${app.lastTaskFailure.version}
  Slave ID                 ${app.lastTaskFailure.slaveId}
` : ''}`
}

module.exports = statusView
