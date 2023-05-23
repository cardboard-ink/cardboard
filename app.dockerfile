FROM node:16-alpine

WORKDIR /app

COPY ./package.json ./
COPY ./yarn.lock ./

CMD yarn; npx prisma db push; npx prisma generate; npx prisma studio & yarn dev
