FROM node:8.15.1

WORKDIR /usr/src/smart-brain-api
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm install

CMD [ "/bin/bash" ]