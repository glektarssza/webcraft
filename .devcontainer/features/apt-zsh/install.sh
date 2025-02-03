#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install or upgrade zsh and zsh-doc.
apt_install_or_upgrade_multiple zsh zsh-doc;
