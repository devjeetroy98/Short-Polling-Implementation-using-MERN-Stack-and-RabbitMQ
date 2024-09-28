FROM node:alpine
WORKDIR /api-gateway
COPY package*.json ./
RUN npm install 
COPY . . 
EXPOSE 8080
CMD npm start