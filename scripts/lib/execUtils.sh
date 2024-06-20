# Locate an executable.
#
# If the location to store the path in already exists and has a non-empty value,
# this function does nothing.
#
# === Arguments ===
# $1 - The name of the executable to locate.
# $2 - The variable to store the path to the executable in. Defaults to
#      "${1^^}_BIN".
function locateExecutable() {
    local EXEC_NAME="$1"
    local EXEC_VAR_NAME="$2"
    if [[ -z "${EXEC_VAR_NAME}" ]]; then
        EXEC_VAR_NAME="${EXEC_NAME^^}_BIN"
    fi
    eval "[[ -n \"${EXEC_VAR_NAME}\" ]]"
    if [[ $? != 0 ]]; then
        return
    fi
    eval "${EXEC_VAR_NAME}"="$(which "${EXEC_NAME}")"
}
