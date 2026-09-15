# Kingdoom Agent Protocol — kingdoom-library (Codex CLI)

Este documento es la guía técnica y protocolo de comportamiento para **Codex CLI**, Antigravity, Jules y cualquier agente de IA que opere en este repositorio.

---

## 0. Alcance de este repo

Dominio biblioteca/lore: Aplicación web estática nativa (HTML/CSS/JS) para el lore, guías de inicio rápido, reglas oficiales de rol y distribución de APKs del ecosistema Kingdoom.

**REGLA DE CARRIL:** Trabajás exclusivamente en este repo. No tocás `Kingdoom-sync` ni `kingdoom-bot` sin pedido explícito.

### Ecosistema Kingdoom:
- `Kingdoom-sync` (en carpeta `Kingdoom`): Portal web SPA, panel admin y economía.
- `kingdoom-bot`: Bot de WhatsApp y minijuegos.
- `kingdoom-library`: Este repositorio (códice digital y biblioteca estática).
- `kingdoom-graphify-ops`: Operaciones compartidas de Graphify y scripts.

---

## 1. Arquitectura del Repositorio

Estructura de archivos del sitio web estático:
- `index.html`: Contenido semántico HTML completo, metadatos, secciones de lore, tablas de razas, reglas de juego y marcado.
- `styles.css`: Hoja de estilos responsiva con estética de libro/códice medieval (tema oscuro, acentos cálidos pergamino, tipografía legible y animaciones suaves).
- `app.js`: Lógica frontend nativa que incluye buscador en tiempo real, filtro de razas/clases, seguimiento de progreso de lectura y helpers para copiar plantillas de fichas de personaje.
- `package.json`: Configuración de scripts y comandos de verificación del proyecto.
- `test-site.mjs`: Script de prueba para validar la integridad estructural del HTML, enlaces y recursos sin suites de testing pesadas.
- `vercel.json`: Configuración de encabezados y enrutamiento para despliegue en Vercel.

---

## 2. Reglas de Ingeniería y Guardrails

- **Tecnologías Web Puras:** Evitar agregar frameworks pesados (React, Vue) o transpiladores de build salvo pedido explícito. Mantener HTML5, CSS3 y JavaScript vanilla limpios y de alto rendimiento.
- **Consistencia Estética:** Asegurar que las nuevas secciones respeten la identidad visual de códice/libro antiguo (paleta de colores cálida/oscura, espaciado armónico y diseño responsive).
- **Dependencias:** No modificar ni commitear `package-lock.json` sin indicación previa.

---

## 3. Reglas del LoreKeeper (Narrativa y Contenido)

- **Coherencia del Universo:** ⛔ **PROHIBIDO** romper la cuarta pared o introducir contradicciones con el canon oficial del Reino de las Sombras.
- **Nuevos Elementos:** ⛔ **PROHIBIDO** introducir facciones, magias, razas o monedas nuevas sin documentarlas explícitamente para el resto del equipo.
- **Formato WhatsApp:** Cuando el contenido o guías estén destinados a ser reutilizados en el bot, asegurar formato compatible (negritas `*texto*`, cursivas `_texto_` y emojis temáticos).
- **Calidad Textual:** Redacción cuidada en español neutro, tono épico/medieval e impecable ortografía.

---

## 4. Protocolo de Sesión (Sin Rituales)

No anunciar "contexto cargado". Cargar en silencio y ejecutar directo.

---

## 5. Protocolo de Honestidad en Subidas y Despliegues (Push & Deploy Honesty)

Antes de reportar una subida a GitHub o deploy en Vercel como exitoso:
1. Ejecutar el comando real (`git push`, etc.) en el terminal.
2. Leer la salida completa del comando.
3. Reportar éxito solo si la salida confirma código 0 sin errores.

⛔ **PROHIBIDO** reportar éxito sin haberlo verificado en la terminal en la misma sesión.

---

## 6. Protocolo de Disciplina de Reportes (Report Discipline)

Mismo formato cerrado de reporte que el resto del ecosistema (Tarea / Archivos / Cambios / Comandos / Riesgos / Estado) sin duplicar contenido anterior.

---

## 7. Anti-Pereza y Calidad

- Cero placeholders/TODOs en HTML, CSS o JS entregado.
- Validar visualmente cambios de contenido y layout responsive antes de dar por terminada la tarea.

---

## 8. Pasos de Validación y Testing Previos a Commit

- Ejecutar `node test-site.mjs` para validar que no existan etiquetas rotas, selectores huérfanos o errores de script.
- Verificar que la navegación responsive (menú móvil, tablas deslizables) funcione fluidamente.

---

## 9. Integración con Graphify

Este proyecto cuenta con su grafo de conocimiento en `graphify-out/`.

- Rutas operativas: `graphify-out/graph.json` y `.codex/hooks.json` (locales e ignorados por Git).
- Reglas:
  - Para consultas sobre secciones, razas o estilos, utilizar `graphify query "<pregunta>"`.
  - Ejecutar `npm run graphify:update` tras modificaciones estructurales en HTML/CSS/JS.

---

## 10. Protocolo de Diagnóstico Forense y Validación de Integridad (Anti-Parches Superficiales)

Este protocolo es de cumplimiento estricto para **Codex CLI**, Antigravity y cualquier agente ante tareas de auditoría, soporte de incidencias o corrección de bugs reportados:

### A. Evidencia en Logs y Red Primero (Ground Truth First)
- ⛔ **PROHIBIDO adivinar o asumir la causa de un fallo** basándose únicamente en lecturas superficiales.
- Ante un error reportado por un usuario (descarga rota de APK, fallo de render, asset faltante o error en app.js), el agente **DEBE consultar los logs reales del sistema** (logs de red, consola o respuestas HTTP) en la marca de tiempo exacta del incidente.
- Identificar el código de error exacto (404, CORS, syntax error, broken link) antes de modificar código.

### B. Pruebas de Límites y Recursos Reales (Boundary Testing)
- ⛔ **PROHIBIDO validar correcciones únicamente con "caminos felices" o pruebas triviales.**
- Si un cambio involucra enlaces de descarga (APKs), versiones de assets o rutas dinámicas, probar obligatoriamente los enlaces completos con `curl` o fetch real para validar que el recurso existe y devuelve HTTP 200.
- Si una prueba no verifica la disponibilidad del recurso real, la tarea **NO está resuelta**.

### C. Prohibición de Declaración de Éxito Prematuro (Verification Gate)
- Un bug no se considera resuelto porque "el archivo guardó sin errores".
- La validación debe demostrar que el **caso exacto reportado por el usuario** ahora se completa satisfactoriamente.
- Ejecutar `node test-site.mjs` y confirmar que no existan errores estructurales residuales.

