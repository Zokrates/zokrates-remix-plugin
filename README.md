# ZoKrates Remix Plugin

Zokrates Compiler plugin for [Remix IDE](https://remix.ethereum.org/).

## Installation

To install npm dependencies and build the project run:

```bash
npm run start
```

For development use `npm run dev`

## CI

For deployment to work, `/etc/ssh/sshd_config` has to be updated.
Add the following at the end of the config:

```
PermitUserEnvironment yes
AcceptEnv CIRCLE_BRANCH TAG
```