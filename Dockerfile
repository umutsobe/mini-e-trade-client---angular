FROM node:18 AS build
WORKDIR /app
COPY ./package.json /app/
RUN npm install
COPY . /app/

RUN npm run build

FROM nginx:latest AS client-browser
COPY --from=build /app/dist/client-angular/browser/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV NODE_TLS_REJECT_UNAUTHORIZED=0

FROM node:18-alpine AS ssr-server
COPY --from=build /app/dist /app/dist/
COPY ./package.json /app/package.json
WORKDIR /app
EXPOSE 4200

CMD npm run start