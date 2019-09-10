FROM blockchainit/zokrates-base
WORKDIR /usr/src/app

COPY remix-plugin ./remix-plugin

WORKDIR /usr/src/app/remix-plugin

RUN npm run build

EXPOSE 10000
CMD [ "npm", "run", "start" ]