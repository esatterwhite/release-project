# 0000-BASE
FROM us.gcr.io/logdna-k8s/node:12 as base

WORKDIR /opt/services/app

COPY ./packages/ /opt/packages
COPY ./pnpm-lock.yaml ./package.json /opt/services/app/

RUN npx pnpm install
COPY ./services/api-service /opt/services/app

RUN ls -alh /opt

# 0001-RELEASE
# RELEASE
FROM debian:buster-slim as release

RUN groupadd --gid 1000 api \
  && useradd --uid 1000 --gid api --shell /bin/bash --create-home api

COPY --from=base /usr/local/bin /usr/local/bin
COPY --from=base /usr/local/include/node /usr/local/include
COPY --from=base /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=base --chown=api:api /opt /opt

USER 1000

WORkDIR /opt/services/app

CMD ["node", "index.js"]
