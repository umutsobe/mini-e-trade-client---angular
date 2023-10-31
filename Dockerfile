FROM node:18 AS build
WORKDIR /app
COPY ./package.json /app/
RUN npm install
COPY . /app/

RUN npm run build

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

FROM node:18-alpine AS ssr-server
COPY --from=build /app/dist /app/dist/
COPY ./package.json /app/package.json

COPY ./certs /app/certs

WORKDIR /app
EXPOSE 4200

CMD npm run start