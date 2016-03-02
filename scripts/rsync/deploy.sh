#!/bin/sh

set -o verbose

# send files to server
/usr/bin/rsync -avW -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
               --progress \
               --delete-before \
               ./public/ \
               git@104.236.101.211:/home/git/71b4e7a/public/ \

