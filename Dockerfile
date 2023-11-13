FROM node:alpine
COPY . .
WORKDIR /app
RUN yarn install
EXPOSE 3000
CMD ["node", "index.js"]

