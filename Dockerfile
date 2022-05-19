FROM node:12

USER root
RUN apt-get update
RUN apt-get install -y \
    ca-certificates \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libdbus-1-3 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libgbm-dev \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxss1 \
    libxtst6 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    lsb-release \
    wget \
    curl

RUN mkdir /mapgl-ruler

RUN adduser ubuntu
RUN chown ubuntu:ubuntu /mapgl-ruler

WORKDIR /mapgl-ruler

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm cache clean --force
RUN npm ci

COPY --chown=ubuntu:ubuntu . .
USER ubuntu

