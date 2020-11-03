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
COPY package*.json ./

#RUN npm install
RUN npm ci

#RUN npm install --silent --production \
#    && apk del build-dependencies \
#    && rm -rf /var/cache/apk/*

# The instructions for second stage
FROM keymetrics/pm2:10-alpine

WORKDIR /usr/src/app
COPY --from=builder node_modules node_modules

COPY assets /usr/src/app/assets

COPY . .

CMD [ "npm", "run", "prod" ]