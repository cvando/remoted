FROM node:boron

# Create app directory
WORKDIR /etc/remoted

RUN apt-get update && apt-get install -y \
bc \
nano \
grep \
wget \
mysql-client \
paxctl && paxctl -cm `which node`

RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64.deb
RUN dpkg -i dumb-init_*.deb

# Install app dependencies
COPY package.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD [ "npm", "start" ]
