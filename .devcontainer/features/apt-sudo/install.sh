#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install or upgrade sudo.
apt_install_or_upgrade sudo;

# Check if the install/upgrade operating succeeded.
if [ $? -ne 0 ]; then
    # Dump out of the script.
    exit 1;
fi

# Check if the flag to add the remote user to the list of allowed sudoers is set and the remote user is not "root".
if [ $ADD_REMOTE_USER = "true" -a $_REMOTE_USER != "root" ]; then
    # Add the remote user to the list of allowed sudoers.
    printf "$_REMOTE_USER\tALL = (root) NOPASSWD: ALL\n" > /etc/sudoers.d/$_REMOTE_USER && \
    # Make their control file read-only by owner and group, inaccessible by everyone else.
    chmod 0440 /etc/sudoers.d/$USERNAME;
fi
