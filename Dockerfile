FROM node:20-alpine

WORKDIR /srv/cf.archivospublicos

COPY package.json ./
COPY frontend/assets/lib/package.json frontend/assets/lib/

RUN npm install --omit=dev
RUN npm install --omit=dev -C frontend/assets/lib

COPY . .

EXPOSE $PORT

CMD ["npm", "run", "start"]