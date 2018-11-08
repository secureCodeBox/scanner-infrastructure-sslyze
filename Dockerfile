FROM python:3.6

RUN apt-get update && \
    apt-get -y upgrade && \
    curl -sL https://deb.nodesource.com/setup_8.x | bash - && \
    apt-get install -y nodejs && \
    apt-get -y clean

COPY package.json package-lock.json /src/
COPY lib/ src/lib/

WORKDIR /src

RUN ls -l

RUN pip install sslyze && \
    python -m sslyze --update_trust_store
RUN npm install --production

COPY . /src

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD node healthcheck.js || exit 1

RUN ls -l

RUN addgroup --system sslyze_group && adduser --system --ingroup sslyze_group sslyze_user 

USER sslyze_user

EXPOSE 8080

ARG COMMIT_ID=unkown
ARG REPOSITORY_URL=unkown
ARG BRANCH=unkown
ARG BUILD_DATE
ARG VERSION

ENV SCB_COMMIT_ID ${COMMIT_ID}
ENV SCB_REPOSITORY_URL ${REPOSITORY_URL}
ENV SCB_BRANCH ${BRANCH}

LABEL org.opencontainers.image.title="secureCodeBox scanner-infrastructure-sslyze" \
    org.opencontainers.image.description="SSLyze integration for secureCodeBox" \
    org.opencontainers.image.authors="iteratec GmbH" \
    org.opencontainers.image.vendor="iteratec GmbH" \
    org.opencontainers.image.documentation="https://github.com/secureCodeBox/secureCodeBox" \
    org.opencontainers.image.licenses="Apache-2.0" \
    org.opencontainers.image.version=$VERSION \
    org.opencontainers.image.url=$REPOSITORY_URL \
    org.opencontainers.image.source=$REPOSITORY_URL \
    org.opencontainers.image.revision=$COMMIT_ID \
    org.opencontainers.image.created=$BUILD_DATE

ENTRYPOINT [ "npm", "start" ]
