#!/usr/bin/env sh

# Import our utility library
. ./functions.sh;

# Install oh-my-zsh as the remote user
su ${_REMOTE_USER} -c 'sh -c "$(wget https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)" --unattended' && \
# Ensure zsh profile exists for remote user.
su ${_REMOTE_USER} -c "touch ~${_REMOTE_USER}/.zshrc" && \
# Copy any custom themes from the container to our local install.
su ${_REMOTE_USER} -c "cp /usr/share/zsh-themes/* ~${_REMOTE_USER}/.oh-my-zsh/custom/themes/" && \
# Set oh-my-zsh theme for the remote user
su ${_REMOTE_USER} -c "zsh -ic \"omz theme set ${THEME}\"" && \
# Enable oh-my-zsh plugins for the remote user
su ${_REMOTE_USER} -c "zsh -ic \"omz plugin enable ${PLUGINS}\"";
