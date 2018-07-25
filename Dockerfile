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

RUN ls -l

RUN addgroup --system sslyze_group && adduser --system --ingroup sslyze_group sslyze_user 

USER sslyze_user

EXPOSE 8080

ARG COMMIT_ID=unkown
ARG REPOSITORY_URL=unkown
ARG BRANCH=unkown

ENV SCB_COMMIT_ID ${COMMIT_ID}
ENV SCB_REPOSITORY_URL ${REPOSITORY_URL}
ENV SCB_BRANCH ${BRANCH}

ENTRYPOINT [ "npm", "start" ]
