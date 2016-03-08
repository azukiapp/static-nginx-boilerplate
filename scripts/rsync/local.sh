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

/usr/bin/rsync -avW                      \
               --delete-before           \
               --progress                \
               ./sites/circle-game/    \
               ./public/circle-game/

# particulate-medusae
mkdir -p public/particulate-medusae/build
/usr/bin/rsync -avW                      \
               --delete-before           \
               --progress                \
               ./sites/particulate-medusae/index.html    \
               ./public/particulate-medusae

/usr/bin/rsync -avW                      \
               --delete-before           \
               --progress                \
               ./sites/particulate-medusae/build    \
               ./public/particulate-medusae
