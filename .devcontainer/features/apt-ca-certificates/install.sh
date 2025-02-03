#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install or upgrade ca-certificates.
apt_install_or_upgrade ca-certificates;
