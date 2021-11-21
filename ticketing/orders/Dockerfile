FROM node:16.6.2-alpine as base

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=prod
COPY . .

CMD ["npm", "run", "start:dev"]

FROM base as production

ENV NODE_PATH=./build
RUN npm run build

CMD ["npm", "start"]
