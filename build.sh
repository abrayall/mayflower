#!/bin/bash

declare -x VERSION=1.0.1
declare -x HEADER="// mayflower.js v$VERSION"

rm -rf build
mkdir -p build/work

echo $HEADER > build/mayflower.js
echo $HEADER > build/mayflower.min.js

cat src/main/javascript/lang.js src/main/javascript/widget.js >> build/mayflower.js
cp build/mayflower.js build/mayflower-$VERSION.js

curl -X POST -s --data-urlencode "input@build/mayflower.js" https://javascript-minifier.com/raw >> build/mayflower.min.js
cp build/mayflower.min.js build/mayflower-$VERSION.min.js
