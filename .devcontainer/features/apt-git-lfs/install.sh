#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install or upgrade git-lfs.
apt_install_or_upgrade git-lfs && \
# Install Git LFS across the system.
git lfs install --system;
