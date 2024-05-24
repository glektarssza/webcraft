#!/usr/bin/env bash

source "${LIB_DIR}/colors.sh"

# Initialize logging colors
if [[ -z "${COLOR_FG_ERROR}" ]]; then
    COLOR_FG_ERROR="${COLOR_FG_BRIGHT_RED}"
fi
if [[ -z "${COLOR_FG_WARN}" ]]; then
    COLOR_FG_WARN="${COLOR_FG_BRIGHT_YELLOW}"
fi
if [[ -z "${COLOR_FG_INFO}" ]]; then
    COLOR_FG_INFO="${COLOR_FG_BRIGHT_CYAN}"
fi
if [[ -z "${COLOR_FG_VERBOSE}" ]]; then
    COLOR_FG_VERBOSE="${COLOR_FG_BRIGHT_MAGENTA}"
fi

if [[ -z "${COLOR_BG_ERROR}" ]]; then
    COLOR_BG_ERROR="${COLOR_RESET}"
fi
if [[ -z "${COLOR_BG_WARN}" ]]; then
    COLOR_BG_WARN="${COLOR_RESET}"
fi
if [[ -z "${COLOR_BG_INFO}" ]]; then
    COLOR_BG_INFO="${COLOR_RESET}"
fi
if [[ -z "${COLOR_BG_VERBOSE}" ]]; then
    COLOR_BG_VERBOSE="${COLOR_RESET}"
fi

function writeLog() {
    local LOG_LEVEL_FG_COLOR="${COLOR_RESET}"
    local LOG_LEVEL_BG_COLOR="${COLOR_RESET}"
    local LOG_LEVEL_NAME="${1^^}"
    shift
    case "${LOG_LEVEL_NAME}" in
        ERROR)
            LOG_LEVEL_FG_COLOR="${COLOR_FG_ERROR}"
            LOG_LEVEL_BG_COLOR="${COLOR_BG_ERROR}"
        ;;
        WARN)
            LOG_LEVEL_FG_COLOR="${COLOR_FG_WARN}"
            LOG_LEVEL_BG_COLOR="${COLOR_BG_WARN}"
        ;;
        INFO)
            LOG_LEVEL_FG_COLOR="${COLOR_FG_INFO}"
            LOG_LEVEL_BG_COLOR="${COLOR_BG_INFO}"
        ;;
        VERBOSE)
            LOG_LEVEL_FG_COLOR="${COLOR_FG_VERBOSE}"
            LOG_LEVEL_BG_COLOR="${COLOR_BG_VERBOSE}"
        ;;
        *)
            LOG_LEVEL_NAME="INFO"
            LOG_LEVEL_FG_COLOR="${COLOR_FG_INFO}"
            LOG_LEVEL_BG_COLOR="${COLOR_BG_INFO}"
        ;;
    esac

    printf "${COLOR_RESET}[${LOG_LEVEL_BG_COLOR}${LOG_LEVEL_FG_COLOR}${LOG_LEVEL_NAME}${COLOR_RESET}] ${@}${COLOR_RESET}\n"
}

# Write an error log.
function error() {
    writeLog "ERROR" "${@}"
}

# Write a warning log.
function warn() {
    writeLog "WARN" "${@}"
}

# Write an informational log.
function info() {
    writeLog "INFO" "${@}"
}

# Write a verbose log if the `VERBOSE` variable is `true` or non-zero.
function verbose() {
    if [[ -n "${VERBOSE+x}" && (${VERBOSE} != 0 || "${VERBOSE^^}" == "TRUE") ]]; then
        writeLog "VERBOSE" "${@}"
    fi
}
