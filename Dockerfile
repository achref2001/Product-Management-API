FROM node:alpine AS builder 

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

EXPOSE 4444

CMD ["npm", "run", "dev"]
