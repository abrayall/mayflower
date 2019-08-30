#!/bin/bash

NAME=`grep "name" project.properties  | cut -d '=' -f2`
VERSION=`grep "version" project.properties  | cut -d '=' -f2`
declare -x HEADER="// $NAME.js v$VERSION"

rm -rf build
mkdir -p build/work

echo $HEADER > build/$NAME.js
echo $HEADER > build/$NAME.min.js

echo "[build] Building $NAME v$VERSION..."
echo "[build] Generating $NAME.js..."
cat src/main/javascript/lang.js src/main/javascript/io.js src/main/javascript/widget.js >> build/$NAME.js
cp build/$NAME.js build/$NAME-$VERSION.js

echo "[build] Generating $NAME.min.js..."
curl -X POST -s --data-urlencode "input@build/$NAME.js" https://javascript-minifier.com/raw >> build/$NAME.min.js
cp build/$NAME.min.js build/$NAME-$VERSION.min.js
