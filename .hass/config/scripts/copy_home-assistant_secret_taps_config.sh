#!/bin/bash

pushd www/home-assistant-secret-taps-configs

##echo -e -n "So,$1\n" > ./log.txt
FILE="${1}.yaml"

rm -f ../secret-taps.yaml
cp "${FILE}" ../secret-taps.yaml

popd