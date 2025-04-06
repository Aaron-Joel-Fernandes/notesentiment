FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
RUN ["npm", "rebuild", "sqlite3"]
CMD ["node", "index.js"]