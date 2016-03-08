#!/bin/sh

set -o verbose

# watch files to public folder
. ./scripts/onchange.sh /usr/bin/rsync -avt \
               --delete-before \
               --progress \
               ./sites/home/ \
               ./public/home/

. ./scripts/onchange.sh /usr/bin/rsync -avt \
               --delete-before \
               --progress \
               ./sites/infinite-city/ \
               ./public/infinite-city/


