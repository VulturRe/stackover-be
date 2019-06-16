FROM node:10.12.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --only=production
COPY . ./
ARG port=3000
EXPOSE $port
CMD [ "npm", "start" ]
