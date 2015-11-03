FROM node:4.2.1-slim

# Commands
RUN \
  apt-get update && \
  apt-get upgrade -y && \
  apt-get install -y git python make g++ libfreetype6 libfontconfig bzip2 && \
  apt-get autoremove -y && \
  apt-get clean all

WORKDIR /opt/reack

#COPY ./node_modules node_modules

RUN \
  npm install --loglevel=warn -g gulp grunt-cli

COPY ./package.json package.json

RUN \
  npm install --loglevel=warn --no-optional --no-bin-links

COPY ./polyfill.js polyfill.js

WORKDIR /opt/reack/app

CMD ["/bin/bash", "-c", "gulp dev"]
