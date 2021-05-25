# inventory-alert
##### Containerized node application for reporting when inventory comes back in stock to Slack or Discord

## requirements
requires node 16.x, docker, and yarn

## environment
copy `.env-template` to `.env` and set variables before building

## configuration
set configuration in `./config/index.js`

## docker

#### `yarn build`
builds inventory-alert

#### `yarn start`
runs inventory-alert in a container

#### `yarn stop`
stops inventory-alert and removes the container

#### `yarn attach`
attaches to the inventory-alert terminal, `ctrl-p ctrl-q` to detach

#### `yarn push <registry>`
builds multi-arch and pushes inventory-alert to a docker registry

## development

#### `yarn prod`
starts inventory-alert locally
