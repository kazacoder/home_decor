FROM node:16-alpine AS build
WORKDIR /frontend
RUN npm install -g @angular/cli@14
COPY package.json .
RUN npm install
COPY . .

FROM nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /frontend/dist/pizza_chief_ng /usr/share/nginx/html
EXPOSE 7777
