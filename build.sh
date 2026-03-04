#!/usr/bin/env bash

# ./build.sh [component] [tag] [--no-cache] [--use-nerdctl]

COMPONENT=""
INPUT_TAG=""
FLAGS=""
NO_CACHE=false
USE_NERDCTL=false
BUILD_TOOL="docker"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --no-cache) NO_CACHE=true ;;
        --use-nerdctl) USE_NERDCTL=true ;;
        *)
            if [[ -z "$COMPONENT" ]]; then
                COMPONENT="$1"
            else
                INPUT_TAG="$1"
            fi
            ;;
    esac
    shift
done

if [[ "$USE_NERDCTL" == true ]]; then
    BUILD_TOOL="nerdctl"
fi

if [[ "$NO_CACHE" == true ]]; then
    FLAGS="--no-cache"
fi

BUILD_TAG=${INPUT_TAG:-'local'}
FIND_CMD="find . -mindepth 2 -maxdepth 3 -print | grep Dockerfile | grep -vE '(test|.j2)'"
FIND_CMD="${FIND_CMD} | grep $COMPONENT/"

for DOCKERFILE in $(eval ${FIND_CMD} | xargs)
do
    COMPONENT=$(echo "${DOCKERFILE}" | awk -F '/' '{print $(NF-1)}')
    echo "Building image for ${COMPONENT}, build tag: ${BUILD_TAG}"
    $BUILD_TOOL build $FLAGS -t ${COMPONENT}:${BUILD_TAG} -f ${DOCKERFILE} .

    build_status_code="$?"
    if [ "$build_status_code" -gt 0 ]; then
        exit $build_status_code
    fi
done
