# The instructions for the first stage
FROM keymetrics/pm2:10-alpine as builder

RUN apk --no-cache --update add g++ nano curl
# Install all build dependencies
# Add bash for debugging purposes
RUN apk update \
    && apk add --virtual build-dependencies \
    build-base \
    gcc \
    wget \
    git \
    && apk add \
    bash

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY assets /usr/src/app/assets

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "prod" ]