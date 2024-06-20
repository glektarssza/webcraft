source "$LIBRARY_DIR/colors.sh"

# Write some logging output.
#
# === Arguments ===
# $1  - The log level to write at. One of:
#           * ERROR
#           * WARN
#           * INFO
#           * VERBOSE
# ... - The data to write.
function writeLog() {
    local LOG_LEVEL="$1"
    local LOG_COLOR="$COLOR_RESET"
    case "${LOG_LEVEL^^}" in
        ERROR)
            LOG_COLOR="$COLOR_FG_RED"
        ;;
        WARN)
            LOG_COLOR="$COLOR_FG_YELLOW"
        ;;
        INFO)
            LOG_COLOR="$COLOR_FG_CYAN"
        ;;
        VERBOSE)
            LOG_COLOR="$COLOR_FG_MAGENTA"
        ;;
    esac
    shift
    printf "[$LOG_COLOR${LOG_LEVEL^^}$COLOR_RESET] $*$COLOR_RESET\n"
}

# Write some error logging output.
#
# === Arguments ===
# ... - The data to write.
function logError() {
    writeLog error $*
}

# Write some warning logging output.
#
# === Arguments ===
# ... - The data to write.
function logWarning() {
    writeLog warn $*
}

# Write some informational logging output.
#
# === Arguments ===
# ... - The data to write.
function logInfo() {
    writeLog info $*
}

# Write some verbose logging output.
#
# === Arguments ===
# ... - The data to write.
#
# === Environment ===
# VERBOSE - Whether to write verbose output. Disables output from this function
#           if its value is 0, "false", or "FALSE".
function logVerbose() {
    if [[ -z $VERBOSE ]]; then
        return
    fi
    case $VERBOSE in
        0|false|FALSE)
            return
        ;;
    esac
    writeLog verbose $*
}
