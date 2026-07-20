# Archivum Kingdoom

Biblioteca y guía standalone para nuevos jugadores de Kingdoom. Reúne historia, reinos,
demografía, geopolítica, razas oficiales, normas de creación, plantilla de personaje y acceso al
instalador Android de Kingdoom Fichas.

## Arquitectura

El proyecto utiliza solamente HTML, CSS y JavaScript nativos:

- `index.html`: contenido semántico completo y metadatos.
- `styles.css`: sistema visual responsive del códice.
- `app.js`: índice móvil, búsqueda, filtro de razas, progreso de lectura y copia de ficha.
- `vercel.json`: cabeceras de seguridad y configuración del hosting estático.
- `test-site.mjs`: comprobación estructural sin dependencias.

No requiere instalación de paquetes ni proceso de compilación.

## Desarrollo local

Desde esta carpeta:

```powershell
python -m http.server 4173
```

Abrir `http://localhost:4173`.

Validación:

```powershell
node --check app.js
node test-site.mjs
```

## Despliegue en Vercel

1. Crear un repositorio propio para `kingdoom-library` y subir el contenido de esta carpeta.
2. Importar el repositorio desde Vercel.
3. Seleccionar `Other` como Framework Preset.
4. Dejar vacíos Build Command y Output Directory; la raíz del repositorio es el sitio público.
5. Desplegar.

Vercel servirá `index.html` directamente. No se necesitan variables de entorno.

## Kingdoom Fichas

La descarga utiliza el release automatizado oficial:

- Release: `https://github.com/XxxRaiconxxX/kingdoom-fichas/releases/tag/latest`
- APK: `https://github.com/XxxRaiconxxX/kingdoom-fichas/releases/download/latest/app-debug.apk`

El workflow de `kingdoom-fichas` reemplaza el asset del tag `latest`, por lo que la biblioteca no
necesita cambiar de URL en cada actualización.

## Criterio de contenido

El sitio presenta únicamente los manuscritos y reglas suministrados para Kingdoom. No completa
campos canónicos pendientes ni asigna custodios, fechas o territorios que no estén confirmados.
