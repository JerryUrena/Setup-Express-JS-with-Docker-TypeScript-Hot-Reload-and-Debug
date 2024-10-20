# Stage 1: Build
FROM node:23

WORKDIR /home/src/app

COPY package*.json .

RUN npm install

COPY tsconfig.json .
COPY development/nodemon.json ./development/nodemon.json
COPY development/dev.tsconfig.json ./development/dev.tsconfig.json