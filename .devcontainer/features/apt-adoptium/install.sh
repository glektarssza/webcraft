#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install the Adoptium GPG key and source list.
mkdir -p /usr/local/share/keyrings && \
wget -qO - https://packages.adoptium.net/artifactory/api/gpg/key/public | gpg --dearmor | tee /usr/local/share/keyrings/adoptium.gpg > /dev/null && \
echo "deb [signed-by=/usr/local/share/keyrings/adoptium.gpg] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list;

# Install or upgrade sudo.
apt_install_or_upgrade_multiple $PACKAGES;
