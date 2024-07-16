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
SOURCE_FILE="$PROJECT_DIR/logo.svg"
OUT_DIR="$PROJECT_DIR/public"
DESIRED_SIZES="256,128,64,48,32,24,16"

source "$LIBRARY_DIR/logging.sh"
source "$LIBRARY_DIR/execUtils.sh"

function printHelp() {
    echo "$0"
    echo "Generate an ICO file and several differently sized PNG files for the project logo."
    echo ""
    echo "=== Options ==="
    echo ""
    echo -e "--dry-run\t\tDo not actually perform any actions."
    echo ""
    echo -e "--verbose\t\tLog verbose messages."
    echo ""
    echo -e "--help|-h\t\tShow this information and exit."
    echo ""
    echo -e "--src-file [FILE]\tSet the file to load as the source image.\n[default: ${SOURCE_FILE}]"
    echo ""
    echo -e "--out-dir [DIR]\t\tSet the directory to place outputs in.\n[default: ${OUT_DIR}]"
    echo ""
    echo -e "--sizes [SIZES]\t\tA comma-separated list of sizes to generate PNGs for and to include in the final ICO file.\n[default: ${DESIRED_SIZES}]"
    echo ""
    echo "Copyright (c) 2024 G'lek Tarssza, all rights reserved."
}

while [[ -n $1 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
        ;;
        --verbose)
            VERBOSE=true
        ;;
        --help|-h)
            printHelp
            exit 0
        ;;
        --src-file)
        shift
        SOURCE_FILE="$1"
        ;;
        --out-dir)
        shift
        OUT_DIR="$1"
        ;;
        --sizes)
        shift
        DESIRED_SIZES="$1"
        ;;
    esac
    shift
done

# Validate source file
if [[ ! -e "$SOURCE_FILE" ]]; then
    logError "Source '${SOURCE_FILE}' does not exist!"
    exit 1
fi
if [[ ! -f "$SOURCE_FILE" ]]; then
    logError "Source '${SOURCE_FILE}' is not a regular file!"
    exit 1
fi

# Validate destination
if [[ ! -e "$OUT_DIR" ]]; then
    if [[ $DRY_RUN == "true" ]]; then
        logInfo "Would have executed 'mkdir -p \"$OUT_DIR\"'"
    else
        mkdir -p "$OUT_DIR"
    fi
    if [[ ! -e "$OUT_DIR" && $DRY_RUN != true ]]; then
        logError "Failed to create destination '${OUT_DIR}'!"
        exit 1
    fi
elif [[ ! -d "$OUT_DIR" ]]; then
    logError "Destination '${OUT_DIR}' is not a directory!"
    exit 1
fi


logVerbose "Source file: ${SOURCE_FILE}"
logVerbose "Destination: ${OUT_DIR}"

logInfo "Looking for ImageMagick install..."

locateExecutable "magick"

logVerbose "ImageMagick binary: ${MAGICK_BIN}"

if [[ -z "${MAGICK_BIN}" ]]; then
    logError "Could not find ImageMagick, please install it!"
    exit 1
fi

logInfo "Found ImageMagick install at '${MAGICK_BIN}'"

logInfo "Generating favicon PNG file..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'magick -background transparent \"${SOURCE_FILE}\" +repage \"${OUT_DIR}/logo.png\"'"
else
    magick -background transparent "${SOURCE_FILE}" "${OUT_DIR}/logo.png"
    if [[ $? != 0 ]]; then
        logError "Failed to generate PNG favicon!"
        exit $?
    fi
fi

logInfo "Generating resized favicon PNG files..."

DESIRED_PNG_SIZES=( $(echo "$DESIRED_SIZES" | awk 'BEGIN {FS = ","} {for (i = 1; i <= NF; i++) {print $i}}') )

for SIZE in ${DESIRED_PNG_SIZES[@]}; do
    logInfo "Generating favicon PNG file for size ${SIZE}x${SIZE}"
    if [[ $DRY_RUN == "true" ]]; then
        logInfo "Would have run 'magick -background transparent \"${SOURCE_FILE}\" -resize ${SIZE}x${SIZE} +repage \"${OUT_DIR}/logo-${SIZE}.png\"'"
    else
        magick -background transparent "${SOURCE_FILE}" -resize ${SIZE}x${SIZE} +repage "${OUT_DIR}/logo-${SIZE}.png"
        if [[ $? != 0 ]]; then
            logError "Failed to generate PNG favicon for size '${SIZE}'!"
            exit $?
        fi
    fi
done

logInfo "Generating favicon ICO file..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'magick -background transparent \"${SOURCE_FILE}\" -define \"icon:auto-resize=${DESIRED_SIZES[@]}\" \"${OUT_DIR}/favicon.ico\"'"
else
    magick -background transparent "${SOURCE_FILE}" -define "icon:auto-resize=${DESIRED_SIZES[@]}" "${OUT_DIR}/favicon.ico"
    if [[ $? != 0 ]]; then
        logError "Failed to generate favicon!"
        exit $?
    fi
fi

logInfo "${COLOR_FG_GREEN}Success!${COLOR_RESET}"
