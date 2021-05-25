#!/bin/bash

if [[ ! "$1" ]]; then
  echo "USAGE: yarn push <registry>"
  exit 1
fi

docker buildx rm inventory-alert-builder
docker buildx create --config=buildkitd.toml --use --name inventory-alert-builder
docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t $1/inventory-alert --push .
