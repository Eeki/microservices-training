FROM node:16.6.2-alpine

# Add the following line
ENV CI=true

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY ./ ./

CMD ["npm", "start"]
