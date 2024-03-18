# exit on error
set -e

# preparation
mkdir -p public

rm -rf public/*

# client production build
cd vite_ui

npm i

npm run build

cp -r dist/* ../public

cd ..

# server production build
sbt packageZipTarball
