#!/usr/bin/env bash

# Find the directory of the root script.
function findScriptDir() {
    local SCRIPT_SOURCE="${BASH_SOURCE[0]}"
    while [[ -L "${SCRIPT_SOURCE}" ]]; do
    local SCRIPT_DIR="$(cd -P "$( dirname "${SCRIPT_SOURCE}" )" >/dev/null 2>&1 && pwd)"
    local SCRIPT_SOURCE="$(readlink "${SCRIPT_SOURCE}")"
    [[ $SCRIPT_SOURCE != /* ]] && SCRIPT_SOURCE="${SCRIPT_DIR}/${SCRIPT_SOURCE}"
    done
    SCRIPT_DIR="$(cd -P "$(dirname "${SCRIPT_SOURCE}")" >/dev/null 2>&1 && pwd)"
}

# Locate the script library directory.
function findLibDir() {
    if [[ -z "${LIB_DIR}" ]]; then
        findScriptDir
        LIB_DIR="${SCRIPT_DIR}/lib"
    fi
}

findLibDir
source "${LIB_DIR}/logging.sh"

# Locate an executable on the system.
function findExecutable() {
    local VARNAME="${1^^}_BIN"
    if [[ -z "${!VARNAME}" ]]; then
        eval "$VARNAME"="$(which magick)"
        if [[ -z "${!VARNAME}" ]]; then
            error "Could not locate \"${1}\"!"
            exit 1
        fi
        verbose "No path provided for \"${1}\", falling back to \"${!VARNAME}\""
    fi
}

# Setup paths
PROJECT_ROOT="${SCRIPT_DIR}/.."
OUT_DIR="${PROJECT_ROOT}/public"
DESIRED_SIZES=( "128" "64" "32" "16" )

# Locate ImageMagick
findExecutable "magick"

info "Generating updated favicon..."

# Generate new favicon
"$MAGICK_BIN" convert -background transparent "${PROJECT_ROOT}/logo.svg" -define "icon:auto-resize=128,84,64,48,32,24,16" "${OUT_DIR}/favicon.ico"

info "${COLOR_FG_GREEN}Success!"
