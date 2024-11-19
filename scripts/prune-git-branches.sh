#!/usr/bin/env bash

SCRIPT_SOURCE="${BASH_SOURCE[0]}"
while [ -L "$SCRIPT_SOURCE" ]; do
  SCRIPT_DIR=$(cd -P "$( dirname "$SCRIPT_SOURCE" )" > /dev/null 2>&1 && pwd)
  SCRIPT_SOURCE=$(readlink "$SCRIPT_SOURCE")
  [[ $SCRIPT_SOURCE != /* ]] && SCRIPT_SOURCE="$SCRIPT_DIR/$SCRIPT_SOURCE"
done
SCRIPT_DIR=$(cd -P "$( dirname "$SCRIPT_SOURCE" )" > /dev/null 2>&1 && pwd)

#-- Directory Constants
LIBRARY_DIR="$SCRIPT_DIR/lib"
PROJECT_DIR="$SCRIPT_DIR/.."

#-- Import Libraries
source "$LIBRARY_DIR/logging.sh"
source "$LIBRARY_DIR/execUtils.sh"

#-- Utilities
function printHelp() {
    echo "$0"
    echo "Prune Git branches that no longer exist in the remote repository."
    echo ""
    echo "=== Options ==="
    echo ""
    echo -e "--dry-run\t\tDo not actually perform any actions."
    echo ""
    echo -e "--verbose\t\tLog verbose messages."
    echo ""
    echo -e "--help|-h\t\tShow this information and exit."
    echo ""
    echo "Copyright (c) 2024 G'lek Tarssza, all rights reserved."
}

#-- Parse Arguments
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
    esac
    shift
done

logInfo "Looking for Git install..."

locateExecutable "git"

logVerbose "Git binary: ${GIT_BIN}"

if [[ -z "${GIT_BIN}" ]]; then
    logError "Could not find Git, please install it!"
    exit 1
fi

logInfo "Fetching Git remotes..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'git remote'"
else
    GIT_REMOTES=( $(git remote | xargs) )
    if [[ $? != 0 ]]; then
        logError "Failed fetch Git remotes!"
        exit $?
    fi
fi

for REMOTE in ${GIT_REMOTES[@]}; do
    logInfo "Pruning '${REMOTE}'..."
    if [[ $DRY_RUN == "true" ]]; then
        logInfo "Would have run 'git prune \"${REMOTE}\"'"
    else
        PRUNED_BRANCHES=( $(git remote prune "${REMOTE}" | grep 'pruned' | awk 'gsub("[*\\[\\]]|pruned|[[:space:]]", "", $0)' | xargs ) )
        if [[ $? != 0 ]]; then
            logError "Failed to prune remove '${REMOTE}'!"
            exit $?
        fi
        logInfo "Pruned remote '${REMOTE}'"
        if [[ ${#PRUNED_BRANCHES[@]} > 0 ]]; then
            logInfo "Founded candidate branches for removal:"
            for BRANCH in ${PRUNED_BRANCHES[@]}; do
                logInfo "* ${BRANCH}"
            done
            logInfo "Removing pruned branches from '${REMOTE}'..."
            for BRANCH in ${PRUNED_BRANCHES[@]}; do
                logInfo "Removing branch '${BRANCH}'..."
                if [[ $DRY_RUN == "true" ]]; then
                    logInfo "Would have run 'git branch -D \"${REMOTE}\"'"
                else
                    git branch -D "${BRANCH}"
                    if [[ $? != 0 ]]; then
                        logError "Failed to remove branch '${BRANCH}'!"
                        exit $?
                    fi
                    logInfo "Removed branch '${BRANCH}'"
                fi
            done
        else
            logInfo "No candidate branches for removal!"
        fi
    fi
done

logInfo "${COLOR_FG_GREEN}Success!${COLOR_RESET}"
