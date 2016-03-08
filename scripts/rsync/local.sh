#!/bin/sh

set -o verbose

# copy from site to public folder
/usr/bin/rsync -avW                      \
               --delete-before           \
               --progress                \
               ./sites/home/             \
               ./public/home/

/usr/bin/rsync -avW                      \
               --delete-before           \
               --progress                \
               ./sites/infinite-city/    \
               ./public/infinite-city/
