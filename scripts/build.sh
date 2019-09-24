#!/bin/bash
set -e

if [ "$CIRCLE_BRANCH" == "develop" ]; then 
    export TAG="latest"
    echo $TAG
fi

if [ "$CIRCLE_BRANCH" == "master" ]; then
    export TAG="stable"; 
    echo $TAG
fi
echo $TAG

docker login -u $DOCKER_USER -p $DOCKER_PASS
docker build --file Dockerfile --tag blockchainit/zokrates-remix-plugin:$TAG .
docker push blockchainit/zokrates-remix-plugin:$TAG