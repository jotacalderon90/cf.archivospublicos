FROM node:24-slim AS base
WORKDIR /srv/cf.archivospublicos
COPY package*.json ./
COPY frontend/assets/lib/package*.json frontend/assets/lib/

# ---- Desarrollo ----
FROM base AS dev
ENV NODE_ENV=development
RUN npm ci && npm ci -C frontend/assets/lib
CMD ["npm", "run", "dev"]

# ---- Producción ----
FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --omit=dev && npm ci --omit=dev -C frontend/assets/lib && npm cache clean --force
COPY --chown=node:node . .
USER node
CMD ["node", "app.js"]