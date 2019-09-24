#!/bin/bash
set -e
CIRCLE_BRANCH="develop"
          
if [ "$CIRCLE_BRANCH" == "develop" ]; then
    export TAG="latest";
fi
if [ "$CIRCLE_BRANCH" == "master" ]; then
    export TAG="stable";
fi
echo $TAG
ssh -o "StrictHostKeyChecking no" circleci@zokrates.blockchain-it.hr "\
echo 'y' | docker system prune \
rm -rf /home/circleci/zokrates-remix-plugin || true \
cd /home/circleci \
git clone https://github.com/blockchain-it-hr/zokrates-remix-plugin \
cd /home/circleci/zokrates-remix-plugin && git checkout ${CIRCLE_BRANCH} \
docker pull blockchainit/zokrates-remix-plugin:${TAG} \
docker-compose up -d"