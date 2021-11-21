FROM node:16.6.2-alpine as base

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci --only=prod
COPY . .
RUN npm run disabletelemetry

CMD ["npm", "run", "start:dev"]

FROM base as production

ENV NODE_PATH=./next
RUN npm run build

CMD ["npm", "start"]
