# Archivos Públicos

`cf.archivospublicos` es un servicio base construido sobre **cf.framework**, cuyo objetivo es centralizar y publicar recursos estáticos reutilizables dentro del ecosistema de aplicaciones web.

Este repositorio actúa como una **capa común de assets** (CSS, JavaScript, imágenes, librerías, etc.), permitiendo que múltiples aplicaciones consuman recursos compartidos de forma consistente, desacoplada y mantenible.

## 🎯 Propósito

En lugar de duplicar archivos estáticos en cada proyecto, este servicio:

* Centraliza recursos frontend comunes
* Reduce duplicación de código
* Permite versionamiento controlado de assets
* Facilita mantenimiento y escalabilidad del ecosistema
* Sirve como base para otras aplicaciones construidas sobre `cf.framework`

## 🧩 Tecnologías

### Backend

* Node.js
* Express (a través de `cf.framework`)
* Zod (validaciones)

### Frontend

* jQuery / jQuery UI
* Bootstrap 5
* Font Awesome
* Vue 3
* Summernote
* Chart.js
* Leaflet + Leaflet Draw
* Socket.IO
* Luxon

## 🚀 Ejecución local

### Con Node.js

En Windows puedes usar el script:

```bash
script.ini.bat
```

O manualmente:

```bash
npm install
npm install -C frontend/assets/lib
npm run dev
```

Para producción:

```bash
npm run start
```

---

### 🐳 Con Docker

Modo desarrollo:

```bash
docker-compose -f docker-compose.dev.yml build
docker-compose -f docker-compose.dev.yml up
```

Modo producción:

```bash
docker-compose build
docker-compose up
```

---

## 🧠 Filosofía

Este proyecto forma parte de un enfoque mayor: construir software basado en **capacidades reutilizables**, donde cada componente cumple un rol claro dentro del sistema.

`cf.archivospublicos` no es una aplicación final, sino una **pieza estructural del ecosistema**.

---

## 📌 Notas

* Este repositorio está pensado para integrarse con otros servicios del ecosistema.
* No contiene lógica de negocio, solo exposición de recursos.
* Puede ser consumido por múltiples aplicaciones simultáneamente.
