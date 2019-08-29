FROM node:10
SHELL ["/bin/bash", "-c"]

WORKDIR /usr/src/app

COPY . ./
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y
RUN source $HOME/.cargo/env
RUN source $HOME/.bashrc
RUN PATH=$PATH:$HOME/.cargo/bin/rustup
RUN rustup install nightly
RUN rustup target add wasm32-unknown-unknown --toolchain nightly
RUN rustup default nightly
RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s -- -y
RUN npm run setup

EXPOSE 8080
CMD [ "npm", "run", "start" ]