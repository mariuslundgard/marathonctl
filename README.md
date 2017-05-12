# marathonctl

A CLI utility for simple deployment using the Marathon API.

```sh
npm install marathonctl
```

[![build status](https://img.shields.io/travis/mariuslundgard/marathonctl/master.svg?style=flat-square)](https://travis-ci.org/mariuslundgard/marathonctl)
[![npm version](https://img.shields.io/npm/v/marathonctl.svg?style=flat-square)](https://www.npmjs.com/package/marathonctl)

## Features

* **Uses a manifest file.** Maintain a `marathon.json` in your repo to configure the application.
* **Cross-platform.** Works on Darwin and Linux systems.
* **Supports promptless usage.** Allow machine users (CI systems) to deploy using options such as username and password.

## Usage

```
  Usage: marathonctl [command] [options]

  Options:

    --pass
    --user
    --quiet
    --timeout <milliseconds>

  Commands:

    - deploy <marathon-json-path> <tag>
    - destroy <marathon-json-path>
    - login <marathon-json-path>
    - status <marathon-json-path>
```

## Documentation

`marathonctl` may also be used as a Node.js module.

### `marathonctl(args, flags, opts)`

```js
const marathonctl = require('marathonctl')

const args = ['deploy', 'marathon.json', 'latest']
const flags = {quiet: true}
const opts = {
  cwd: path.resolve(__dirname, 'path/to/repo'),
  env: process.env
}

marathonctl(args, flags, opts)
  .then(() => {
    console.log('Deployed successfully')
  })
  .catch((err) => {
    console.error(`Could not deploy: ${err.message}`)
  })
```

### Manifest example

> NOTE: The "image" must NOT include the image tag.

```json
{
  "auth": true,
  "marathonUrl": "https://my.marathon.com",
  "app": {
    "id": "/myapp",
    "cpus": 0.1,
    "mem": 64,
    "disk": 0,
    "instances": 1,
    "container": {
      "type": "DOCKER",
      "docker": {
        "image": "myapp",
        "network": "BRIDGE",
        "portMappings": [
          {
            "containerPort": 3000,
            "hostPort": 0,
            "protocol": "tcp"
          }
        ]
      }
    },
    "healthChecks": [
      {
        "protocol": "HTTP",
        "portIndex": 0,
        "path": "/health",
        "gracePeriodSeconds": 30,
        "intervalSeconds": 30,
        "timeoutSeconds": 30,
        "maxConsecutiveFailures": 3
      }
    ]
  }
}
```
