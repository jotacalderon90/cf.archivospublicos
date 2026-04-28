# Archivos Públicos

`cf.archivospublicos` es un servicio base construido sobre **cf.framework**, cuyo objetivo es centralizar y publicar recursos estáticos reutilizables dentro del ecosistema de aplicaciones web.

Este repositorio actúa como una capa común de assets y archivos públicos, incluyendo CSS, JavaScript, imágenes, librerías y documentos (PDF, MP3, MP4, DOCX, Excel, entre otros), permitiendo que múltiples aplicaciones consuman recursos de forma consistente, desacoplada y mantenible.

---

## 🎯 Propósito

En lugar de duplicar archivos estáticos en cada proyecto, este servicio:

* Centraliza recursos públicos
* Reduce duplicación de código
* Facilita mantenimiento y escalabilidad del ecosistema
* Sirve como base para otras aplicaciones construidas sobre `cf.framework`

---

## 🌐 Independencia de CDN externos

Una de las decisiones fundamentales de este proyecto es **no depender de CDN públicos** para la carga de recursos estáticos.

Esto responde a escenarios reales donde:

* Clientes operan en **redes locales (intranet)** sin acceso a internet
* Existen **intermitencias o caídas de conectividad**
* Se requiere **alta disponibilidad en entornos críticos**
* Hay **restricciones de seguridad** que impiden consumir recursos externos

En estos contextos, depender de CDN introduce un punto de falla externo que impacta directamente la experiencia del usuario.

Por esta razón, `cf.archivospublicos`:

* Aloja localmente todas las librerías necesarias
* Garantiza disponibilidad incluso sin conexión a internet
* Permite control total sobre archivos y dependencias
* Asegura consistencia en entornos aislados o restringidos

> La experiencia ha demostrado que los sistemas internos deben ser **autosuficientes** y no depender de servicios externos para su funcionamiento base.

---

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

## 📌 Notas

* Este repositorio está pensado para integrarse con otros servicios del ecosistema.
* No contiene lógica de negocio, solo exposición de recursos.
* Puede ser consumido por múltiples aplicaciones simultáneamente.
