FROM node:17.4.0 AS development

ARG NODE_ENV=develpment
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build