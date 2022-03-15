FROM node:12.22.8 as builder

WORKDIR /usr/src/app

COPY dist/ .
COPY package.json .
COPY server.js .

RUN npm i --production

FROM node:12.22.8-slim
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app .

EXPOSE 80

CMD ["node", "server.js"]