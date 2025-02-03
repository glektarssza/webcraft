#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Install or upgrade locales.
apt_install_or_upgrade locales;

if [ $? -ne 0 ]; then
    write_error "Failed to install 'locales' package!";
    exit 1;
fi

if [ -f /etc/locale.gen ]; then
    rm /etc/locale.gen;
fi

write_info "Setting up locales to generated...";
for LOCALE in $GENERATE_LOCALES; do
    write_info "Marking '$LOCALE' to be generated...";
    echo "$LOCALE UTF-8" >> /etc/locale.gen;
done
write_info "Set up locales to generated";

write_info "Regenerating locales...";
dpkg-reconfigure --frontend=noninteractive locales

if [ $? -ne 0 ]; then
    write_error "Failed to regenerate locales!";
    exit 1;
fi

write_info "Updating default system locale...";
update-locale LANG=$DEFAULT_LOCALE;

if [ $? -ne 0 ]; then
    write_error "Failed to update default system locale!";
    exit 1;
fi
