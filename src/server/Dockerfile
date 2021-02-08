# dev
FROM node:14-alpine as dev-stage
WORKDIR /usr/app
COPY package*.json ./
RUN apk update \
    && apk add --no-cache git \
    && npm install
COPY . . 
EXPOSE 5000

# build
FROM dev-stage as build-stage
RUN npm run build \
    && npm prune --production \
    && npm cache clean --force

# prod
FROM node:14-alpine
WORKDIR /usr/app

COPY --from=build-stage /usr/app/build /usr/app/build
COPY --from=build-stage /usr/app/ormconfig.json /usr/app/ormconfig.json 
COPY --from=build-stage /usr/app/package.json  /usr/app/package.json
COPY --from=build-stage /usr/app/dist /usr/app/dist
# COPY --from=build-stage /usr/app/.env /usr/app/.env
COPY --from=build-stage /usr/app/node_modules /usr/app/node_modules
EXPOSE 8080
ENV NODE_PATH=.
CMD [ "npm" , "run", "start:prod"]
# CMD ["ls", "build"]
