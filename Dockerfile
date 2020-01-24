FROM node:11.15.0

# Create app directory
RUN mkdir -p /usr/src/recommendit-server
WORKDIR /usr/src/recommendit-server

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

EXPOSE 5000
CMD ["npm", "start"]