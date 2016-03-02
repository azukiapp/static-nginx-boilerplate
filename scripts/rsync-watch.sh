#!/bin/sh

set -o verbose

# send files to server
/usr/bin/rsync -avz -e ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null --progress ./public/** git@104.236.101.211:/tmp/

