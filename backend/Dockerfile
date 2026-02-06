FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 5001
CMD ["node", "src/app.js"]
