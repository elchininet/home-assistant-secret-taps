#!/bin/bash

pushd www/home-assistant-secret-taps-configs

rm -f ../secret-taps.yaml

if [[ $1 ]]; then
    FILE="${1}.yaml"
    cp "${FILE}" ../secret-taps.yaml
fi

popd