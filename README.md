# Archivos Públicos

cf.archivospublicos es un código fuente creado a partir de cf.framework. Este sistema es base para otras aplicaciones web ya que publica recursos estáticos genéricos que usara el resto de la plataforma web. Aquí encontraremos archivos css, js, img, etc.

## Probar con Node

```bash
npm install
npm install bower -g
bower install --allow-root
npm run dev
```

Para producción reemplazar `npm run dev` por `npm run start`

## Probar con Docker

```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

Para producción quitar `-f docker-compose.dev.yml`