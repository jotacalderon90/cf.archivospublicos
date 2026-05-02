FROM node:20-alpine

WORKDIR /srv/cf.archivospublicos

COPY package*.json ./
COPY frontend/assets/lib/package*.json frontend/assets/lib/

RUN npm ci --omit=dev \
  && npm ci --omit=dev -C frontend/assets/lib \
  && npm cache clean --force

COPY . .

CMD ["npm", "run", "start"]