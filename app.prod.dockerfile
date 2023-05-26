FROM node:16-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git

CMD yarn; npx prisma db push; npx prisma generate; npx prisma studio & yarn build; yarn start:prod;