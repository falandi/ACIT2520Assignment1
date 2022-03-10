FROM node:17.3.0

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]

# docker build -t snoopy/nodedocker:1.0.0 .

# docker run -d -p 5000:3000 -d snoopy/nodedocker:1.0.0
