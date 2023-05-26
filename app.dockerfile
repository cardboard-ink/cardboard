FROM node:16-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

RUN apk add --no-cache git
RUN git config --global --add safe.directory /app

CMD yarn; npx prisma db push; npx prisma generate; npx prisma studio & yarn dev
