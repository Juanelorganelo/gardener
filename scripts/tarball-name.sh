#!/bin/sh -l
# Copyright (c) Juan Manuel Garcia Junco Moreno.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.
PACKAGE_JSON_PATH="${1-.}"

echo "Reading package.json from ${PACKAGE_JSON_PATH}/package.json"

PACKAGE_NAME=$(cat ${PACKAGE_JSON_PATH}/package.json | grep name | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
PACKAGE_VERSION=$(cat ${PACKAGE_JSON_PATH}/package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

echo ::set-output name=tarball-name::${PACKAGE_NAME}-v${PACKAGE_VERSION}.tgz
