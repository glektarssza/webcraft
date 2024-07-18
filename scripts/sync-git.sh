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

#-- Argument Defaults
ORIGIN_REMOTE="origin"
MAIN_BRANCH=$(git config --default $(git branch -r | grep -E "^\\s+origin/(master|main)$" | sed "s/origin\///") --get init.defaultBranch)
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
RESTORE_CURRENT_BRANCH=false

if [[ "${MAIN_BRANCH}" != "${CURRENT_BRANCH}" ]]; then
    RESTORE_CURRENT_BRANCH=true
fi

#-- Utilities
function printHelp() {
    echo "$0"
    echo "Prune branches that no longer exist in the remote repository."
    echo ""
    echo "=== Options ==="
    echo ""
    echo -e "--dry-run\t\t\tDo not actually perform any actions."
    echo ""
    echo -e "--verbose\t\t\tLog verbose messages."
    echo ""
    echo -e "--help|-h\t\t\tShow this information and exit."
    echo ""
    echo -e "--origin-remote [REMOTE]\t\tSet the remote origin to operate on.\n[default: ${ORIGIN_REMOTE}]"
    echo ""
    echo -e "--main-branch [BRANCH]\t\tSet the main branch to checkout to.\n[default: ${MAIN_BRANCH}]"
    echo ""
    echo -e "--restore-current-branch\tRestore the current branch (if it still exists) once done."
    echo ""
    echo -e "--no-restore-current-branch\tDo not restore the current branch once done."
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
        --origin-remote)
            shift
            ORIGIN_REMOTE="$1"
        ;;
        --main-branch)
            shift
            MAIN_BRANCH="$1"
        ;;
        --restore-current-branch)
            RESTORE_CURRENT_BRANCH=true
        ;;
        --no-restore-current-branch)
            RESTORE_CURRENT_BRANCH=false
        ;;
    esac
    shift
done

logVerbose "Origin remote: ${ORIGIN_REMOTE}"
logVerbose "Main branch: ${MAIN_BRANCH}"
logVerbose "Current branch: ${CURRENT_BRANCH}"
logVerbose "Restore current branch? ${RESTORE_CURRENT_BRANCH}"

logInfo "Looking for Git install..."

locateExecutable "git"

if [[ -z "${GIT_BIN}" ]]; then
    logError "Could not find Git, please install it!"
    exit 1
fi

logInfo "Found Git install at '${GIT_BIN}'"

logInfo "Checking out main branch..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'git checkout ${MAIN_BRANCH}'"
else
    git checkout ${MAIN_BRANCH}
    if [[ $? != 0 ]]; then
        logError "Failed to checkout main branch!"
        exit $?
    fi
fi

logInfo "Pulling latest changes..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'git pull'"
else
    git pull
    if [[ $? != 0 ]]; then
        logError "Failed to pull latest changes!"
        exit $?
    fi
fi

logInfo "Pruning branches that no longer exist in remote..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'git prune remote ${ORIGIN_REMOTE}'"
else
    git remote prune ${ORIGIN_REMOTE}
    if [[ $? != 0 ]]; then
        logError "Failed to prune branches!"
        exit $?
    fi
fi

logInfo "Pruning merged branches..."

if [[ $DRY_RUN == "true" ]]; then
    logInfo "Would have run 'git branch --merged | grep -vE \"${MAIN_BRANCH}\" | xargs -n1 git branch -d'"
else
    git branch --merged | grep -vE "${MAIN_BRANCH}" | xargs -n1 git branch -d
    if [[ $? != 0 ]]; then
        logError "Failed to prune merged branches!"
        exit $?
    fi
fi

if [[ "${RESTORE_CURRENT_BRANCH}" -eq "true" ]]; then
    logInfo "Restoring original branch..."

    if [[ $DRY_RUN == "true" ]]; then
        logInfo "Would have run 'git checkout ${CURRENT_BRANCH}'"
    else
        git checkout ${CURRENT_BRANCH}
        if [[ $? != 0 ]]; then
            logError "Failed to checkout original branch!"
            exit $?
        fi
    fi
fi

logInfo "${COLOR_FG_GREEN}Success!${COLOR_RESET}"
