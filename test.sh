#!/bin/bash
docker build -t local/reack .
docker run -it --rm --expose 11111 -e VIRTUAL_HOST=reack-test.docker -v ${PWD}/test:/opt/reack/app -w /opt/reack/app local/reack $@
