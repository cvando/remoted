FROM node:alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        bc \
        nano \
        wget \
        bash \
        mysql-client \
        paxctl && paxctl -cm `which node` && apk del --no-cache paxctl
RUN npm install ws mysql

# Create app directory
WORKDIR /etc/remoted

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "bin/remoteD.js" ]
