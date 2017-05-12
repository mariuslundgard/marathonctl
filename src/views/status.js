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
  const {app} = data

  return `APPLICATION
  ID:                       ${chalk.blue(app.id)}
  Command:                  ${app.cmd ? app.cmd : chalk.grey('—')}
  Environment variables:    ${app.env && Object.keys(app.env).length ? Object.keys(app.env).map((key) => `${key}: "${app.env[key]}"`).join('\n                          ') : chalk.grey('—')}
  Instances:                ${app.instances}
  CPUs:                     ${app.cpus}
  Memory:                   ${app.mem} M
  Backoff:                  ${app.backoffSeconds} seconds
  Backoff factor:           ${app.backoffFactor}
  Max launch delay:         ${app.maxLaunchDelaySeconds} seconds

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

${app.deployments ? `CURRENT DEPLOYMENTS
${app.deployments.map((d) =>
`  ${d.id}
`).join('')}` : ''}
TASKS
  Staged                    ${app.tasksStaged}
  Running                   ${app.tasksRunning}
  Healthy                   ${app.tasksHealthy}
  Unhealthy                 ${app.tasksUnhealthy}
${app.tasks.map((task, taskIdx) => `
TASK #${taskIdx}
  ID                        ${task.id}
  Slave ID                  ${task.slaveId}
  Host                      ${task.host}
  Ports                     ${task.ports}
  State                     ${taskStateView(task.state)}
  Started at                ${task.startedAt ? task.startedAt : chalk.grey('—')}
  Staged at                 ${task.stagedAt}
  Version                   ${task.version}
  ${task.ipAddresses ? `
  ${task.ipAddresses.map((ipAddress, ipAddressIdx) => `IP #${ipAddressIdx}
    Address                 ${ipAddress.ipAddress}
    Protocol                ${ipAddress.protocol}
`).join('')}` : ''}`)}${app.lastTaskFailure ? `
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
