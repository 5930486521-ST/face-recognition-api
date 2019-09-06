FROM node:8.15.1

WORKDIR /usr/src/smart-brain-api
COPY ./ ./
RUN npm install

CMD [ "/bin/bash" ]