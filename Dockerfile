# build stage
FROM node:lts-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json ./

RUN npm install
RUN npm install react-scripts@latest -g

COPY . .

RUN npm run build:production-docker


# production stage
FROM nginx:stable-alpine as production

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
