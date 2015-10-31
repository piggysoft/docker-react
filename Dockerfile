FROM mhart/alpine-node:4.2.1

WORKDIR /opt/reack

COPY ./package.json package.json

RUN apk --update add --virtual build-dependencies git python make g++ \
    && npm install \
    && npm install -g gulp \
    && apk del build-dependencies \
	&& rm /var/cache/apk/*

COPY ./polyfill.js polyfill.js

CMD ["/bin/sh", "-c", "gulp dev"]