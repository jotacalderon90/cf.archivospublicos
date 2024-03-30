FROM node:16.13.1 as build-stage

CMD mkdir /srv/cf.archivospublicos

COPY ["package.json","bower.json",".bowerrc","/srv/cf.archivospublicos/"]

WORKDIR /srv/cf.archivospublicos

RUN npm install --only=production

RUN npm install bower -g

RUN bower install --allow-root

COPY [".", "/srv/cf.archivospublicos/"]

EXPOSE $PORT

CMD [ "npm", "run", "start" ]
