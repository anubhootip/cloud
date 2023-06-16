FROM node:latest

WORKDIR /app

COPY package-lock.json package.json /app/

RUN npm install

COPY index.js /app

CMD ["node", "index.js"]