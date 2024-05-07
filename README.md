# Archivos Públicos

cf.archivospublicos es un código fuente creado a partir de cf.framework. Este sistema es base para otras aplicaciones web ya que publica recursos estáticos genéricos que usara el resto de la plataforma web. Aquí encontraremos archivos css, js, img, etc.

## Probar con Node

1.- Asegúrate de tener Node.js y npm instalados en tu sistema.
2.- Clona este repositorio o descárgalo como un archivo ZIP.
3.- Navega hasta el directorio del proyecto en tu terminal.
4.- Ejecuta `npm install` para instalar las dependencias del backend.
5.- Ejecuta `npm install bower -g` para instalar gestor de paquetes frontend.
6.- Ejecuta `bower install --allow-root` para instalar las dependencias del frontend.
7.- Ejecuta `npm run dev` para levantar sistema web.

## Probar con Docker

1.- Asegúrate de tener Docker en tu sistema.
2.- Clona este repositorio o descárgalo como un archivo ZIP.
3.- Navega hasta el directorio del proyecto en tu terminal.
4.- Ejecuta `docker-compose -f docker-compose.dev.yml build` para construir imagen.
5.- Ejecuta `docker-compose -f docker-compose.dev.yml up` para levantar contenedor.

### Script

```bash
npm install
npm install bower -g
bower install --allow-root
npm run dev
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up