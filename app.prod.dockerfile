FROM node:18-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache git

# TODO Shift back to prod settings when app.postcss fixed and testing finished
# CMD yarn; npx prisma db push; npx prisma generate; npx prisma studio & yarn vite dev --port 3000

CMD yarn; npx prisma db push; npx prisma generate; yarn build; yarn start:prod;