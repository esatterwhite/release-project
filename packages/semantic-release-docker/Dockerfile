# 0000-BASE
FROM docker:latest
RUN apk update && apk upgrade && apk add nodejs npm
WORKDIR /opt/prepare
COPY ./pnpm-lock.yaml ./package.json /opt/prepare/
RUN npm install
COPY . /opt/prepare
WORkDIR /opt/prepare
