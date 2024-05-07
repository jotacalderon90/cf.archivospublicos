# Archivos Públicos

cf.archivospublicos es un código fuente creado a partir de cf.framework. Este sistema es base para otras aplicaciones web ya que publica recursos estáticos genéricos que usara el resto de la plataforma web. Aquí encontraremos archivos css, js, img, etc.

## Probar con Node

* Asegúrate de tener Node.js y npm instalados en tu sistema
* Clona este repositorio o descárgalo como un archivo ZIP
* Navega hasta el directorio del proyecto en tu terminal

Ejecuta los siguientes comandos:

```bash
npm install
npm install bower -g
bower install --allow-root
npm run dev
```

## Probar con Docker

* Asegúrate de tener Docker en tu sistema.
* Clona este repositorio o descárgalo como un archivo ZIP.
* Navega hasta el directorio del proyecto en tu terminal.

Ejecuta los siguientes comandos:

```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```