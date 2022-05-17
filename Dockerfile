FROM  docker-hub.2gis.ru/webmaps/mapgl-ruler-base:latest

COPY --chown=ubuntu:ubuntu . .

USER ubuntu

