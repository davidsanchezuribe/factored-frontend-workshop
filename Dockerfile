FROM node:lts AS builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY .env ./
RUN npm ci 
COPY . .
RUN npm run compile

FROM nginx:alpine
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY --from=builder /usr/src/app/.env /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
