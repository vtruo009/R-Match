#! /bin/bash

cd ./server && rm ./build
cd ../client && yarn build  && mv ./build ../server/
cd ../server
heroku container:push --app=obscure-ocean-12960 web
heroku container:release --app=obscure-ocean-12960 web
