FROM node:10.15.1
WORKDIR /home/app/
COPY / .
RUN git config --global url."https://".insteadOf git://
RUN npm ci

EXPOSE 8080
CMD ["npm", "start"]