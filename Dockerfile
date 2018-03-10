FROM node:alpine

RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        bc \
        nano \
        dpkg \
        wget \
        bash \
        mysql-client
RUN npm install ws mysql

# Create app directory
WORKDIR /etc/remoted

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb
RUN dpkg -i dumb-init_*.deb

# Bundle app source
COPY . .

EXPOSE 8080
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "node", "bin/remoteD.js" ]
