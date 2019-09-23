FROM node:10-alpine

ARG WORKSPACE_DIR=/usr/src/app
WORKDIR ${WORKSPACE_DIR}

COPY . ${WORKSPACE_DIR}
RUN npm run build

EXPOSE 10000
CMD ["npm", "run", "serve"]