#!/bin/bash

declare -x VERSION=1.0.0
declare -x HEADER="// mayflower.js v$VERSION"

rm -rf build
mkdir build

echo $HEADER > build/mayflower.js
cat lang.js widget.js >> build/mayflower.js
cp build/mayflower.js build/mayflower-$VERSION.js
