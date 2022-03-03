FROM node:16.13.1 as build-stage

CMD mkdir /srv/app

COPY ["package.json","bower.json",".bowerrc","/srv/app/"]

WORKDIR /srv/app

RUN npm install --only=production

RUN npm install bower -g

RUN bower install --allow-root

COPY [".", "/srv/app/"]

EXPOSE 80

CMD [ "npm", "run", "start" ]
