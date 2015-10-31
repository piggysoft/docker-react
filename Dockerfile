FROM node:4.2.1-slim

# Env
ENV PHANTOMJS_VERSION 1.9.8

# Commands
RUN \
  apt-get update && \
  apt-get upgrade -y

RUN \
  apt-get install -y git wget libfreetype6 libfontconfig bzip2

RUN \
  mkdir -p /srv/var && \
  wget -q --no-check-certificate -O /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 && \
  tar -xjf /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 -C /tmp && \
  rm -f /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64.tar.bz2 && \
  mv /tmp/phantomjs-$PHANTOMJS_VERSION-linux-x86_64/ /srv/var/phantomjs && \
  ln -s /srv/var/phantomjs/bin/phantomjs /usr/bin/phantomjs

RUN \
  apt-get autoremove -y && \
  apt-get clean all

WORKDIR /opt/reack

COPY ./package.json package.json

RUN npm install \
    && npm install -g gulp \
    && npm shrinkwrap

COPY ./polyfill.js polyfill.js

CMD ["/bin/sh", "-c", "gulp dev"]
