#!/bin/sh

set -o verbose

# echo 'Copying home files...'
# sudo rm -rf public/*.*
# cp -R sites/home/** public

# Building hexo-blog...
azk start -Rvv hexo-blog-build

# Change files owner
sudo chown -R `id -un`:`id -gn` .

# Cleaning public folder
rm -rf ./public/**

# Copying dist files
cp -R ./sites/hexo-blog/public/** ./public/
