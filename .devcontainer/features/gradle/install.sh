#!/usr/bin/env sh

# Import our function library.
. ./functions.sh;

# Ensure Gradle install location exists.
mkdir -p /opt/gradle/ && \
# Ensure Gradle install location is empty.
rm -rf /opt/gradle/* && \
# Download version of Gradle to install.
wget https://services.gradle.org/versions/current -O - | jq --raw-output .version | xargs -I V wget --directory-prefix=/opt/gradle/ https://services.gradle.org/distributions/gradle-V-all.zip && \
# Unpack version of Gradle to install.
bsdtar xvf /opt/gradle/*.zip -C /opt/gradle/ --strip-components 1 && \
# Remove downloaded Gradle zip.
rm /opt/gradle/*.zip && \
# Add Gradle to path.
prepend_to_path '/opt/gradle/bin';
