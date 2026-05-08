FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates dumb-init git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV GIT_ROOT=/data/repositories
ENV CONFIG_ROOT=/data/config

EXPOSE 3000
VOLUME ["/data"]

CMD ["dumb-init", "npm", "run", "start"]
