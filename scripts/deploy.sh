#!/bin/bash
set -e
          
if [ "$CIRCLE_BRANCH" == "develop" ]; then
    export TAG="latest";
fi
if [ "$CIRCLE_BRANCH" == "master" ]; then
    export TAG="stable";
fi
echo $TAG
ssh -o "StrictHostKeyChecking no" circleci@zokrates.blockchain-it.hr "\
echo 'y' | docker system prune && \
rm -rf /home/circleci/zokrates-remix-plugin || true && \
mkdir -p /home/circleci/zokrates-remix-plugin && \
cd /home/circleci/zokrates-remix-plugin && \
curl https://raw.githubusercontent.com/blockchain-it-hr/zokrates-remix-plugin/${CIRCLE_BRANCH}/docker-compose.yml > docker-compose.yml && \
docker pull blockchainit/zokrates-remix-plugin:${TAG} && \
docker-compose up -d"