# exit on error
set -e

# preparation
mkdir -p public

rm -rf public/*

# client production build
cd ui

npm i

npm run build

cp -r build/* ../public

cd ..

# server production build
sbt packageZipTarball
