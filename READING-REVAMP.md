# Reading Studio — renovación de octubre de 2026

## Cambios

El Reading principal se sustituye por una nueva interfaz y un banco original de 38 preguntas. El banco generado anterior sigue conservado en el repositorio, pero no alimenta la interfaz de Reading renovada. No se intenta convertir sus preguntas antiguas en material calibrado cambiando únicamente sus opciones.

- Parte 1: 11 preguntas, 11 minutos; email y respuesta con cinco huecos.
- Parte 2: 8 preguntas, 9 minutos; tabla, condiciones y email con tres huecos.
- Parte 3: 9 preguntas, 10 minutos; cuatro párrafos y opción de información no indicada.
- Parte 4: 10 preguntas, 13 minutos; varias opiniones y comentario con cinco huecos.
- Simulacro: esas cuatro partes en secuencia, con cierre por parte y corrección al final. No incluye bloque experimental.
- Entrenamiento sin reloj y práctica cronometrada por parte.
- Una evaluación distinta de nueve preguntas, con diez minutos iniciales y cinco minutos extra. No revela puntaje, clave ni evidencia entre etapas.

La evaluación guarda una copia de las respuestas al primer límite, permite continuar automáticamente y presenta ambas versiones al final. Las respuestas pendientes cuentan como incorrectas. Puede terminarse una etapa antes: el informe conserva su duración real y no presenta ese intento como diez minutos completos.

Cada pregunta nueva incluye clave, evidencia textual y explicación de las opciones incorrectas. Las opciones se redactan con longitud comparable y errores de condición, alcance, atribución o tiempo. La revisión editorial no equivale a validación psicométrica: no se asigna nivel CLB al banco.

## Registro

Se guardan intentos completos en localStorage, sin sobrescribir los resultados anteriores. Se registran respuestas iniciales, respuestas al corte, respuestas finales, cambios y eventos con hora y fase. Las horas de selección no son una medida directa del tiempo de lectura. Se señalan textos repetidos; el simulacro y los módulos comparten material, mientras que la evaluación usa otro texto.

Se pueden añadir explicaciones después de responder, copiar o compartir un resumen por WhatsApp y descargar un JSON del intento o del historial. Compartir abre WhatsApp para que la persona elija destinatario y envíe. No hay transmisión automática de resultados. Los datos no se sincronizan entre dispositivos; si el navegador no permite guardarlos, aparece un aviso.

Hay un registro manual para resultados de packs oficiales, que no importa ni reproduce material comprado. Los resultados introducidos por el usuario no se verifican con el proveedor.

## Páginas y archivos

- `index.html`: Reading Studio, ahora portada del sitio.
- `reading.css`, `reading-app.js`, `reading-bank.js`: interfaz, flujo y material nuevo.
- `diagnostico-tiempo.html`: enlace corto a la evaluación de 10 + 5 minutos.
- `diagnostico.html`: se conserva la prueba rápida anterior y su URL.
- `listening-practice.html`: conserva las actividades de Listening existentes, con conteo correcto por ejercicio. La serie antigua ya no se anuncia como simulacro oficial ni incluye el Reading retirado.
- `celpip_data.js` y los generadores antiguos permanecen como fuente del Listening y archivo histórico; la portada renovada no carga ese banco.

## Límites

Esta edición tiene un simulacro original y una evaluación adicional. No promete equivalencia con un pack oficial, una dificultad CLB específica ni un resultado oficial. Usar un texto conocido mejora por familiaridad y se marca como repetición. El simulacro comparte textos con el entrenamiento; para medir generalización se necesitan textos nuevos.

El reloj usa fechas absolutas y continúa al cambiar de pestaña o recargar, en lugar de depender de un contador que se ralentice en segundo plano. La clave de un sitio estático está en el código fuente; la interfaz solo la muestra al finalizar y no se presenta como un examen protegido.

Referencia de formato y tiempos aproximados: [CELPIP Reading Pro Study Pack](https://www.celpip.ca/wp-content/uploads/2026/01/Reading-Pro-Study-Pack-2026.pdf). La evaluación de dos etapas es una observación propia y no forma parte del examen oficial.

