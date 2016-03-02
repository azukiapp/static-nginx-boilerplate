#!/bin/sh

set -o verbose

# copy from site to public folder
/usr/bin/rsync -avW \
               --progress \
               --delete-before \
               ./sites/hexo-blog/public/ \
               ./public/
