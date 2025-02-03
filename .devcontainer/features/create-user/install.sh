#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Check parameters.
if [ -z "$USERNAME" ]; then
    write_error "Missing username parameter.";
    exit 1;
fi
if [ -z "$USER_UID" ]; then
    write_error "Missing user uid parameter.";
    exit 1;
fi
if [ -z "$USER_GID" ]; then
    write_error "Missing user gid parameter.";
    exit 1;
fi
if [ -z "$USER_SHELL" ]; then
    # The user didn't provide a shell, assuming the default sh installation
    USER_SHELL="$(which sh)";
fi
if [ ! -f "$USER_SHELL" ]; then
    write_error "Shell '$USER_SHELL' is not a valid shell on this system!";
    exit 1;
fi

# Add our custom group.
groupadd --gid $USER_GID $USERNAME;

if [ $? -ne 0 ]; then
    write_error "Failed to create user group!";
    exit 1;
fi

if [ $CREATE_HOME = "true" ]; then
    # Add our custom user with a home directory.
    useradd --uid $USER_UID --gid $USER_GID -m -s $USER_SHELL $USERNAME
else
    # Add our custom user without a home directory.
    useradd --uid $USER_UID --gid $USER_GID -M -s $USER_SHELL $USERNAME
fi

if [ $? -ne 0 ]; then
    write_error "Failed to create user!";
    exit 1;
fi
