# 0000-BASE
FROM node:12 as base

WORKDIR /opt/app

ARG GITHUB_TOKEN
COPY ./pnpm-lock.yaml ./package.json /opt/app/

RUN touch .npmrc \
  && echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" > .npmrc \
  && echo "@esatterwhite:registry=https://npm.pkg.github.com/" >> .npmrc \

RUN npx pnpm install
COPY . /opt/app

# 0001-RELEASE
FROM debian:buster-slim as release

RUN groupadd --gid 1000 api \
  && useradd --uid 1000 --gid api --shell /bin/bash --create-home api

COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base /usr/local/include/node /usr/local/include
COPY --from=base /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=base --chown=api:api /opt/app /opt/app

USER 1000

WORkDIR /opt/app
CMD ["node", "index.js"]
