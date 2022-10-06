FROM node:14
WORKDIR /home/node/app/dashboard/server
COPY ./dashboard /home/node/app/
RUN npm install