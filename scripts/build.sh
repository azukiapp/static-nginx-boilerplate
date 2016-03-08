#!/bin/sh

set -o verbose

# Building node site static site...
azk start particulate-medusae -Rvv

# Change files owner
sudo chown -R `id -un`:`id -gn` .

# local sync
azk start sync -Rvv
