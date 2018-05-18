FROM python:3.6

RUN apt-get update && \
    apt-get -y upgrade && \
    curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash - && \
    apt-get install -y nodejs && \
    apt-get -y clean

COPY package.json package-lock.json /src/

WORKDIR /src

RUN ls

RUN pip install sslyze && \
    python -m sslyze --update_trust_store
RUN npm install --production

COPY . /src

RUN addgroup -S sslyze_group && adduser -S -g sslyze_group sslyze_user 

USER sslyze_user

EXPOSE 3000

ARG COMMIT_ID=unkown
ARG REPOSITORY_URL=unkown
ARG BRANCH=unkown

ENV SCB_COMMIT_ID ${COMMIT_ID}
ENV SCB_REPOSITORY_URL ${REPOSITORY_URL}
ENV SCB_BRANCH ${BRANCH}

ENTRYPOINT [ "npm", "start" ]
