#!/bin/sh

set -o verbose

# watch files to public folder
./scripts/onchange.sh \
  /usr/bin/rsync -avW \
                 --progress \
                 --delete-before \
                 ./sites/hexo-blog/public/ \
                 ./public/
