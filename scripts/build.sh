#!/bin/sh

set -e

echo 'Copying home files...'
sudo rm -rf public/*.*
cp -R sites/home/** public

echo 'Building hexo-blog...'
azk start -Rvv hexo-blog-build

sudo chown -R `whoami` .

azk status
