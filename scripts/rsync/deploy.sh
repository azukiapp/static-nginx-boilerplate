#!/bin/bash

set -o verbose

. ./scripts/rsync/local.sh

# send files to server
/usr/bin/rsync -avW -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
               --progress \
               --delete-before \
               ./public/ \
               "git@$DEPLOY_REMOTE_IP:$DEPLOY_REMOTE_PROJECT_PATH/public/"
