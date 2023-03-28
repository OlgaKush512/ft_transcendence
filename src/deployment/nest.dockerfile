FROM node:16-alpine

WORKDIR /app

COPY .env ./
COPY ./src/backend/package*.json ./
RUN npm install
COPY ./src/backend/ ./
RUN npm run build
RUN rm tsconfig.json


COPY ./src/frontend/ ./client/
RUN cd ./client && npm install
RUN cd ./client && npm run build

# Expose application port
EXPOSE 5000

# Start application
CMD [ "node", "dist/main.js" ]