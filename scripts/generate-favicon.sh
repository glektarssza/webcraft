#!/usr/bin/env bash

SCRIPT_SOURCE="${BASH_SOURCE[0]}"
while [[ -L "$SCRIPT_SOURCE" ]]; do
  SCRIPT_DIR="$(cd -P "$( dirname "$SCRIPT_SOURCE" )" >/dev/null 2>&1 && pwd)"
  SCRIPT_SOURCE="$(readlink "$SCRIPT_SOURCE")"
  [[ $SCRIPT_SOURCE != /* ]] && SCRIPT_SOURCE="$SCRIPT_DIR/$SCRIPT_SOURCE"
done
SCRIPT_DIR="$(cd -P "$(dirname "$SCRIPT_SOURCE")" >/dev/null 2>&1 && pwd)"

COLOR_GREEN_FG="\x1B[32m"
COLOR_GREEN_BG="\x1B[42m"
COLOR_BRIGHT_RED_FG="\x1B[91m"
COLOR_BRIGHT_RED_BG="\x1B[101m"
COLOR_BRIGHT_GREEN_FG="\x1B[92m"
COLOR_BRIGHT_GREEN_BG="\x1B[102m"
COLOR_BRIGHT_YELLOW_FG="\x1B[93m"
COLOR_BRIGHT_YELLOW_BG="\x1B[103m"
COLOR_BRIGHT_MAGENTA_FG="\x1B[95m"
COLOR_BRIGHT_MAGENTA_BG="\x1B[105m"
COLOR_BRIGHT_CYAN_FG="\x1B[96m"
COLOR_BRIGHT_CYAN_BG="\x1B[106m"
COLOR_RESET="\x1B[0m"

if [[ -z "$COLOR_ERROR_FG" ]]; then
    COLOR_ERROR_FG="$COLOR_BRIGHT_RED_FG"
fi
if [[ -z "$COLOR_WARN_FG" ]]; then
    COLOR_WARN_FG="$COLOR_BRIGHT_RED_FG"
fi
if [[ -z "$COLOR_INFO_FG" ]]; then
    COLOR_INFO_FG="$COLOR_BRIGHT_CYAN_FG"
fi
if [[ -z "$COLOR_VERBOSE_FG" ]]; then
    COLOR_VERBOSE_FG="$COLOR_BRIGHT_MAGENTA_FG"
fi

function writeLog() {
    local LOG_COLOR="$COLOR_RESET"
    local LOG_NAME="$1"
    case "$LOG_NAME" in
        error|ERROR)
            LOG_COLOR="$COLOR_ERROR_FG"
        ;;
        warn|WARN)
            LOG_COLOR="$COLOR_WARN_FG"
        ;;
        info|INFO)
            LOG_COLOR="$COLOR_INFO_FG"
        ;;
        verbose|VERBOSE)
            LOG_COLOR="$COLOR_VERBOSE_FG"
        ;;
        *)
            LOG_COLOR="$COLOR_INFO_FG"
            LOG_NAME="INFO"
        ;;
    esac
    shift
    printf "[$LOG_COLOR$LOG_NAME$COLOR_RESET] $@$COLOR_RESET\n"
}

function error() {
    writeLog "ERROR" "$@"
}

function warn() {
    writeLog "WARN" "$@"
}

function info() {
    writeLog "INFO" "$@"
}

function log() {
    writeLog "INFO" "$@"
}

function verbose() {
    if [[ "$VERBOSE" == "true" || "$VERBOSE" == "1" ]]; then
        writeLog "VERBOSE" "$@"
    fi
}

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

PROJECT_ROOT="$SCRIPT_DIR/.."
DESIRED_SIZES=( "128" "64" "32" "16" )

findExecutable "magick"

pushd "$PROJECT_ROOT" > /dev/null

mkdir -p "temp"

pushd "temp" > /dev/null

info "Generating updated favicon..."

"$MAGICK_BIN" convert -background transparent "../logo.svg" -define "icon:auto-resize=128,84,64,48,32,24,16" "favicon.ico"

info "Replacing old favicon..."

cp "favicon.ico" "../public/"

popd > /dev/null

rm -r "temp"

popd > /dev/null

info "${COLOR_GREEN_FG}Success!"
