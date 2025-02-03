#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

run_as_interactive_remote_user "curl -fsSL https://fnm.vercel.app/install | bash -s -- --skip-shell --install-dir ~/.fnm" && \
prepend_to_path '$HOME/.fnm' && \
install_to_zsh_profile 'eval "$(fnm env --use-on-cd)"' && \
install_to_bash_profile 'eval "$(fnm env --use-on-cd)"';

if [ $? -ne 0 ]; then
    write_error "Failed to install fnm!";
    exit 1
fi

if [ "$INSTALL_LATEST" = "true" ]; then
    write_info "Installing latest NodeJS version...";
    run_as_interactive_remote_user "fnm install --progress never --latest";
    if [ $? -ne 0 ]; then
        write_error "Failed to install!";
        exit 1;
    fi
fi
if [ "$INSTALL_LATEST" = "true" ]; then
    write_info "Installing latest LTS NodeJS version...";
    run_as_interactive_remote_user "fnm install --progress never --lts";
    if [ $? -ne 0 ]; then
        write_error "Failed to install!";
        exit 1;
    fi
fi
if [ -n "$INSTALL_VERSIONS" ]; then
    for VERSION in $INSTALL_VERSIONS; do
        write_info "Installing NodeJS version '$VERSION'...";
        run_as_interactive_remote_user "fnm install --progress never $VERSION";
    done
fi
