FROM node:14.16.1-alpine3.10 as node

RUN mkdir -p /opt/xcloud_api
WORKDIR /opt/xcloud_api

COPY . /opt/xcloud_api
RUN npm install && npm run build

EXPOSE 8080

CMD npm run deploy