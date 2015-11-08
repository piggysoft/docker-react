FROM nktpro/node-npm3

RUN \
  npm install --quiet -g gulp grunt-cli

WORKDIR /opt/reack

COPY ./package.json package.json

RUN \
  npm install --quiet --no-optional && \
  npm cache clean

COPY ./polyfill.js polyfill.js

WORKDIR /opt/reack/app

CMD ["/bin/sh", "-c", "gulp dev"]
