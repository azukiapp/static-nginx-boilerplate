FROM alpine:3.3

MAINTAINER Julio Saito <saitodisse@gmail.com>

RUN apk add --update inotify-tools \
    openssh \
    rsync \
    && rm -rf /var/cache/apk/* /var/tmp/* /tmp/*

# VOLUME ["/n2o"]

ENTRYPOINT ["/bin/sh"]
