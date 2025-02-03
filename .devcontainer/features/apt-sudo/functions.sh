# Write to `stderr`.
echo_err () {
    awk "BEGIN {printf \"$1\n\" > \"/dev/stderr\"; exit 1;}";
}

# Write an error to the output.
write_error () {
    echo_err "\033[38:5:196m[ERROR]\033[0m $1";
}

# Write a warning to the output.
write_warning () {
    printf "\033[38:5:214m[WARN]\033[0m $1\n";
}

# Write a informational message to the output.
write_info () {
    printf "\033[38:5:117m[INFO]\033[0m $1\n";
}

# Write a debugging message to the output.
write_debug () {
    if [ "$PRINT_DEBUG" = "true" -o "$PRINT_DEBUG" = "1" ]; then
        printf "\033[38:5:170m[DEBUG]\033[0m $1\n";
    fi
}

# Check if a package is installed.
dpkg_check_installed () {
    write_debug "Checking if '$1' is installed via dpkg-query...";
    dpkg-query -s $1 2>&1 > /dev/null;
    if [ $? -eq 0 ]; then
        write_debug "Package is installed";
        return 0;
    fi
    write_debug "Package is not installed";
    return 1;
}

# Check if a package needs an upgrade.
apt_check_upgradable () {
    write_debug "Checking if '$1' is upgradable via apt...";
    local DEBIAN_FRONTEND=noninteractive;
    apt list --upgradable | grep $1;
    if [ $? -eq 0 ]; then
        write_debug "Package is upgradable";
        return 0;
    fi
    write_debug "Package is not upgradable";
    return 1;
}

# Clean up `apt` packages and indices.
apt_cleanup () {
    write_debug "Cleaning up apt...";
    write_debug "Cleaning up apt package cache...";
    local DEBIAN_FRONTEND=noninteractive;
    apt clean -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt package cache!";
        return 1;
    fi
    write_debug "Cleaning up apt indices...";
    rm -rf /var/lib/apt/lists/*;
    if [ $? -ne 0 ]; then
        write_error "Failed clean up apt indices!";
        return 1;
    fi
    write_debug "Cleaned up apt";
    return 0;
}

# Install a package via `apt`.
apt_install () {
    write_debug "Installing package '$1' via apt...";
    write_debug "Checking if package is installed...";
    dpkg_check_installed $1;
    if [ $? -eq 0 ]; then
        write_info "Package '$1' is already installed";
        return 0;
    fi
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    write_debug "Installing package via apt..."
    apt install -y --no-install-recommends $1;
    if [ $? -ne 0 ]; then
        write_error "Failed to install package '$1' via apt!";
        return 1;
    fi
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package installation!";
        return 1;
    fi
    write_info "Installed package '$1' via apt";
    return 0;
}

# Install multiple packages via `apt`.
apt_install_multiple () {
    local PACKAGES="$*"
    write_debug "Mass installing packages '$PACKAGES' via apt...";
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    for PKG in $PACKAGES; do
        write_debug "Installing package '$PKG' via apt...";
        write_debug "Checking if package is installed...";
        dpkg_check_installed $PKG;
        if [ $? -eq 0 ]; then
            write_info "Package '$PKG' is already installed";
            continue;
        fi
        apt install -y --no-install-recommends $PKG;
        if [ $? -ne 0 ]; then
            write_error "Failed to install package '$PKG' via apt!";
            return 1;
        fi
    done
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package installation!";
        return 1;
    fi
    write_info "Mass installed packages via apt";
    return 0;
}

# Upgrade a specific package via `apt`.
apt_upgrade () {
    write_debug "Upgrading package '$1' via apt...";
    write_debug "Checking if package is installed...";
    dpkg_check_installed $1;
    if [ $? -ne 0 ]; then
        write_error "Package '$1' is not installed!";
        return 1;
    fi
    local DEBIAN_FRONTEND=noninteractive;
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    write_debug "Checking if package needs an upgrade...";
    apt_check_upgradable $1
    if [ $? -ne 0 ]; then
        write_info "Package '$1' does not need an upgrade";
        return 0;
    fi
    write_debug "Upgrading package via apt..."
    apt upgrade -y $1
    if [ $? -ne 0 ]; then
        write_error "Failed to upgrade package '$1' via apt!";
        return 1;
    fi
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package upgrade!";
        return 1;
    fi
    write_info "Upgraded package '$1' via apt";
    return 0;
}

# Upgrade multiple packages via `apt`.
apt_upgrade_multiple () {
    local PACKAGES="$*"
    write_debug "Mass upgrading packages '$PACKAGES' via apt...";
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    for PKG in $PACKAGES; do
        write_debug "Upgrading package '$PKG' via apt...";
        write_debug "Checking if package is installed...";
        dpkg_check_installed $PKG;
        if [ $? -ne 0 ]; then
            write_error "Package '$PKG' is not installed!";
            return 1;
        fi
        write_debug "Checking if package needs an upgrade...";
        apt_check_upgradable $PKG
        if [ $? -ne 0 ]; then
            write_info "Package '$PKG' does not need an upgrade";
            continue;
        fi
        write_debug "Upgrading package via apt..."
        apt upgrade -y $PKG
        if [ $? -ne 0 ]; then
            write_error "Failed to upgrade package '$PKG' via apt!";
            return 1;
        fi
    done
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package upgrade!";
        return 1;
    fi
    write_info "Mass upgraded packages via apt";
    return 0;
}

# Upgrade all packages via `apt`.
apt_upgrade_all () {
    write_debug "Mass upgrading all packages via apt...";
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    write_debug "Upgrading all packages via apt...";
    apt upgrade -y
    if [ $? -ne 0 ]; then
        write_error "Failed to upgrade packages via apt!";
        return 1;
    fi
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package upgrade!";
        return 1;
    fi
    write_info "Mass upgraded all packages via apt";
    return 0;
}

# Install or upgrade a package via `apt`.
apt_install_or_upgrade () {
    write_debug "Installing or upgrading package '$1' via apt...";
    write_debug "Checking if package is installed...";
    dpkg_check_installed $1;
    if [ $? -eq 0 ]; then
        write_info "Package '$1' is already installed";
        local DEBIAN_FRONTEND=noninteractive;
        write_debug "Updating apt indices...";
        apt update -y;
        if [ $? -ne 0 ]; then
            write_error "Failed to update apt indices!";
            return 1;
        fi
        write_debug "Checking if package needs an upgrade...";
        apt_check_upgradable $1
        if [ $? -ne 0 ]; then
            write_info "Package '$1' does not need an upgrade";
            return 0;
        fi
        write_debug "Upgrading package via apt..."
        apt upgrade -y $1
        if [ $? -ne 0 ]; then
            write_error "Failed to upgrade package '$1' via apt!";
            return 1;
        fi
        apt_cleanup;
        if [ $? -ne 0 ]; then
            write_error "Failed to clean up apt after package upgrade!";
            return 1;
        fi
        write_info "Upgraded package '$1' via apt";
        return 0;
    fi
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    write_debug "Installing package via apt..."
    apt install -y --no-install-recommends $1;
    if [ $? -ne 0 ]; then
        write_error "Failed to install package '$1' via apt!";
        return 1;
    fi
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package installation!";
        return 1;
    fi
    write_info "Installed package '$1' via apt";
    return 0;
}

# Install or upgrade multiple packages via `apt`.
apt_install_or_upgrade_multiple () {
    local PACKAGES="$*"
    write_debug "Mass installing or upgrading packages '$PACKAGES' via apt...";
    local DEBIAN_FRONTEND=noninteractive;
    write_debug "Updating apt indices...";
    apt update -y;
    if [ $? -ne 0 ]; then
        write_error "Failed to update apt indices!";
        return 1;
    fi
    for PKG in $PACKAGES; do
        write_debug "Checking if package '$PKG' is installed...";
        dpkg_check_installed $PKG;
        if [ $? -eq 0 ]; then
            write_info "Package '$PKG' is already installed";
            write_debug "Checking if package needs an upgrade...";
            apt_check_upgradable $PKG
            if [ $? -ne 0 ]; then
                write_info "Package '$PKG' does not need an upgrade";
                continue;
            fi
            write_debug "Upgrading package via apt..."
            apt upgrade -y $PKG
            if [ $? -ne 0 ]; then
                write_error "Failed to upgrade package '$PKG' via apt!";
                return 1;
            fi
            apt_cleanup;
            if [ $? -ne 0 ]; then
                write_error "Failed to clean up apt after package upgrade!";
                return 1;
            fi
            write_info "Upgraded package '$PKG' via apt";
            continue;
        fi
        write_debug "Updating apt indices...";
        apt update -y;
        if [ $? -ne 0 ]; then
            write_error "Failed to update apt indices!";
            return 1;
        fi
        write_debug "Installing package via apt..."
        apt install -y --no-install-recommends $PKG;
        if [ $? -ne 0 ]; then
            write_error "Failed to install package '$PKG' via apt!";
            return 1;
        fi
    done
    apt_cleanup;
    if [ $? -ne 0 ]; then
        write_error "Failed to clean up apt after package mass installation or upgrade!";
        return 1;
    fi
    write_info "Mass installed or upgraded packages '$PACKAGES' via apt";
    return 0;
}

# Get the home directory of the remote user.
get_remote_user_home () {
    write_debug "Getting home directory for remote user '${_REMOTE_USER}'...";
    run_as_interactive_remote_user_quietly 'echo $HOME';
    if [ $? -ne 0 ]; then
        write_error "Failed to get home directory for remote user!";
        return 1;
    fi
    return 0;
}

# Install the first argument into the remote user's ZSH profile.
install_to_zsh_profile () {
    local REMOTE_USER_HOME="$(get_remote_user_home)";
    write_info "Installing config '$1' to '${REMOTE_USER_HOME}/.zshrc'...";
    if [ -f "${REMOTE_USER_HOME}/.zshrc" ]; then
        echo "$1" >> "${REMOTE_USER_HOME}/.zshrc";
    else
        echo "$1" > "${REMOTE_USER_HOME}/.zshrc";
    fi
    return 0;
}

# Install the first argument into the remote user's Bash profile.
install_to_bash_profile () {
    local REMOTE_USER_HOME="$(get_remote_user_home)";
    write_info "Installing config '$1' to '${REMOTE_USER_HOME}/.bashrc'...";
    if [ -f "${REMOTE_USER_HOME}/.bashrc" ]; then
        echo "$1" >> "${REMOTE_USER_HOME}/.bashrc";
    else
        echo "$1" > "${REMOTE_USER_HOME}/.bashrc";
    fi
    return 0;
}

# Install the first argument into the remote user's sh profile.
install_to_sh_profile () {
    local REMOTE_USER_HOME="$(get_remote_user_home)";
    write_info "Installing config '$1' to '${REMOTE_USER_HOME}/.profile'...";
    if [ -f "${REMOTE_USER_HOME}/.profile" ]; then
        echo "$1" >> "${REMOTE_USER_HOME}/.profile";
    else
        echo "$1" > "${REMOTE_USER_HOME}/.profile";
    fi
    return 0;
}

# Install the first argument into all the remote user's shell profiles.
install_to_shell_profiles () {
    if [ $? -ne 0 ]; then
        write_error "Failed install config to remote user shell profiles!";
        return 1;
    fi
    install_to_zsh_profile "$1"
    if [ $? -ne 0 ]; then
        write_error "Failed to install config to remote user ZSH profile!";
        return 1;
    fi
    install_to_bash_profile "$1"
    if [ $? -ne 0 ]; then
        write_error "Failed to install config to remote user Bash profile!";
        return 1;
    fi
    install_to_sh_profile "$1"
    if [ $? -ne 0 ]; then
        write_error "Failed to install config to remote user sh profile!";
        return 1;
    fi
    return 0;
}

# Add the first argument to the PATH environment variable for all shells.
append_to_path () {
    local REMOTE_USER_HOME="$(get_remote_user_home)";
    write_info "Appending '$1' to PATH of user '${_REMOTE_USER}'...";
    # Append path to PATH variable in remote user configs.
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.zshrc ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2\\\\3:$1\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"\$PATH:$1\\\"\";}}' ${REMOTE_USER_HOME}/.zshrc > ${REMOTE_USER_HOME}/.zshrc.tmp && mv ${REMOTE_USER_HOME}/.zshrc.tmp ${REMOTE_USER_HOME}/.zshrc; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to append new path to PATH variable!";
        return 1;
    fi
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.bashrc ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2\\\\3:$1\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"\$PATH:$1\\\"\";}}' ${REMOTE_USER_HOME}/.bashrc > ${REMOTE_USER_HOME}/.bashrc.tmp && mv ${REMOTE_USER_HOME}/.bashrc.tmp ${REMOTE_USER_HOME}/.bashrc; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to append new path to PATH variable!";
        return 1;
    fi
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.profile ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2\\\\3:$1\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"\$PATH:$1\\\"\";}}' ${REMOTE_USER_HOME}/.profile > ${REMOTE_USER_HOME}/.profile.tmp && mv ${REMOTE_USER_HOME}/.profile.tmp ${REMOTE_USER_HOME}/.profile; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to append new path to PATH variable!";
        return 1;
    fi
    return 0;
}

# Add the first argument to the PATH environment variable for all shells.
prepend_to_path () {
    local REMOTE_USER_HOME="$(get_remote_user_home)";
    write_info "Prepending '$1' to PATH of user '${_REMOTE_USER}'...";
    # Prepend path to PATH variable in remote user configs.
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.zshrc ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2$1:\\\\3\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"$1:\$PATH\\\"\";}}' ${REMOTE_USER_HOME}/.zshrc > ${REMOTE_USER_HOME}/.zshrc.tmp && mv ${REMOTE_USER_HOME}/.zshrc.tmp ${REMOTE_USER_HOME}/.zshrc; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to append new path to PATH variable!";
        return 1;
    fi
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.bashrc ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2$1:\\\\3\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"$1:\$PATH\\\"\";}}' ${REMOTE_USER_HOME}/.bashrc > ${REMOTE_USER_HOME}/.bashrc.tmp && mv ${REMOTE_USER_HOME}/.bashrc.tmp ${REMOTE_USER_HOME}/.bashrc; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to append new path to PATH variable!";
        return 1;
    fi
    run_as_remote_user "if [ -f ${REMOTE_USER_HOME}/.profile ]; then gawk 'BEGIN {foundPath = false;} {if (!/#/ && /PATH=/) {\$0 = gensub(/^(.*)PATH=(\")?(.*)(\")?\$/, \"\\\\1PATH=\\\\2$1:\\\\3\\\\4\", \$0); foundPath = true;} print;} END {if (!foundPath) {print \"export PATH=\\\"$1:\$PATH\\\"\";}}' ${REMOTE_USER_HOME}/.profile > ${REMOTE_USER_HOME}/.profile.tmp && mv ${REMOTE_USER_HOME}/.profile.tmp ${REMOTE_USER_HOME}/.profile; fi";
    if [ $? -ne 0 ]; then
        write_error "Failed to prepend new path to PATH variable!";
        return 1;
    fi
    return 0;
}

# Run the first argument as the remote user using a shell.
run_as_remote_user () {
    write_info "Running command '$1' as user '${_REMOTE_USER}' using a shell...";
    run_as_remote_user_quietly "$1";
    if [ $? -ne 0 ]; then
        return 1;
    fi
    return 0;
}

# Run the first argument as the remote user using a shell without logging.
run_as_remote_user_quietly () {
    su ${_REMOTE_USER} -c "$1";
    if [ $? -ne 0 ]; then
        write_error "Failed to run command!";
        return 1;
    fi
    return 0;
}

# Run the first argument as the remote user using an interactive/login shell.
run_as_interactive_remote_user () {
    write_info "Running command '$1' as user '${_REMOTE_USER}' using an interactive shell...";
    run_as_interactive_remote_user_quietly "$1";
    if [ $? -ne 0 ]; then
        return 1;
    fi
    return 0;
}

# Run the first argument as the remote user using an interactive/login shell without logging.
run_as_interactive_remote_user_quietly () {
    su ${_REMOTE_USER} -lc "$1";
    if [ $? -ne 0 ]; then
        write_error "Failed to run command!";
        return 1;
    fi
    return 0;
}
