#!/usr/bin/env bash

SCRIPT_SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SCRIPT_SOURCE" ]; do
  SCRIPT_DIR=$(cd -P "$( dirname "$SCRIPT_SOURCE" )" > /dev/null 2>&1 && pwd)
  SCRIPT_SOURCE=$(readlink "$SCRIPT_SOURCE")
  [[ $SCRIPT_SOURCE != /* ]] && SCRIPT_SOURCE="$SCRIPT_DIR/$SCRIPT_SOURCE"
done
SCRIPT_DIR=$(cd -P "$( dirname "$SCRIPT_SOURCE" )" > /dev/null 2>&1 && pwd)

LIBRARY_DIR="$SCRIPT_DIR/lib"
PROJECT_DIR="$SCRIPT_DIR/.."
OUT_DIR="$PROJECT_DIR/public"

source "$LIBRARY_DIR/logging.sh"
source "$LIBRARY_DIR/execUtils.sh"

while [[ -n $1 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
        ;;
        --verbose)
            VERBOSE=true
        ;;
    esac
    shift
done

logInfo "Looking for ImageMagick install..."

locateExecutable "magick"

logVerbose "ImageMagick binary: ${MAGICK_BIN}"

if [[ -z "${MAGICK_BIN}" ]]; then
    logError "Could not find ImageMagick, please install it!"
    exit 1
fi

logInfo "Found ImageMagick install at '${MAGICK_BIN}'"

logInfo "Ensure directories exist..."

if [[ ! -d "${OUT_DIR}" ]]; then
    logInfo "'${OUT_DIR}' does not exist, creating..."
    mkdir -p "${OUT_DIR}"
    if [[ $? != 0 ]]; then
        logError "Failed to create '${OUT_DIR}'!"
        exit $?
    fi
else
    logInfo "'${OUT_DIR}' exists, continuing..."
fi

logInfo "Generating favicon..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'magick -background transparent \"\${PROJECT_ROOT}/logo.svg\" -define \"icon:auto-resize=128,84,64,48,32,24,16\" \"\${OUT_DIR}/favicon.ico\"'"
else
    magick -background transparent "${PROJECT_DIR}/logo.svg" -define "icon:auto-resize=128,84,64,48,32,24,16" "${OUT_DIR}/favicon.ico"
    if [[ $? != 0 ]]; then
        logError "Failed to generate favicon!"
        exit $?
    fi
fi

logInfo "${COLOR_FG_GREEN}Success!"
