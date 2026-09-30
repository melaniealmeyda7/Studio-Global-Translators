# Global Translators • Cute Intern Studio & Hub ✨

Espacio virtual interactivo de gestión integral para las practicantes de **Global Translators**, diseñado con estética **cute pastel**, dinamismo en tiempo real, cronograma de entregas, calendario interactivo, repositorio de CVs, módulo de **Job Coaching** y lector/gestor de hojas de cálculo de **Excel (.xlsx / .csv)**.

---

## 🌸 Características Principales

1. **Dashboard & Resumen Dinámico:**
   - Saludo inteligente según la hora del día y carrusel de frases motivacionales para traductoras.
   - 4 métricas clave: Entregas activas, practicantes registradas, sesiones de coaching y promedio de horas de prácticas.
   - Reproductor de **Lofi Zen Studio** (música ambiental relajante con acordes generados vía Web Audio API, 100% offline).

2. **📋 Cronograma de Entregas (Kanban & Lista):**
   - 4 columnas de flujo: *Por Iniciar*, *En Traducción*, *Revisión & QA*, *Entregado ✨*.
   - Botón de 1 clic para avanzar estados con animación de confeti.
   - Filtros en vivo por texto, practicante y par de idiomas (`EN ➔ ES`, `FR ➔ ES`, `DE ➔ ES`, etc.).
   - Prioridades (*Normal*, *Urgente*, *Express*), enlaces directos a Google Drive y notas de estilo.

3. **📅 Calendario Interactivo:**
   - Vista mensual completa con navegación de meses.
   - Marcadores visuales en colores pastel para entregas y sesiones de coaching.
   - Panel lateral del día seleccionado con botón rápido para agendar entregas en esa fecha.

4. **👩‍🎓 Practicantes & Repositorio de CVs:**
   - Fichas de perfil con avatar cute, universidad, ciclo, idiomas y CAT Tools dominadas.
   - Barra de progreso interactiva de horas acumuladas vs. meta (480 hrs).
   - Modal de visualización de CV con extracto profesional y enlace directo al documento en Drive o PDF.

5. **🎯 Módulo de Job Coaching & Empleabilidad:**
   - Agenda de sesiones 1 a 1 de asesoría laboral (Mock Interviews, optimización de CV formato ATS, auditoría de LinkedIn, negociación de tarifas).
   - Roadmap interactivo de 5 hitos para graduarse como traductora profesional.
   - Registro de feedback y acuerdos por sesión.

6. **📊 Gestor & Visor de Excel (.xlsx / .csv):**
   - Motor SheetJS integrado para arrastrar y soltar cualquier archivo Excel y visualizarlo en una tabla pastel interactiva.
   - Búsqueda en tiempo real dentro de la hoja de cálculo.
   - **Descarga directa de Plantilla Excel (.xlsx)** lista para rellenar con practicantes y entregas.
   - **Exportación en un clic de todos los datos en vivo** a un libro de Excel con 3 hojas (*Practicantes*, *Entregas*, *Job_Coaching*).

7. **🛠️ Kit de Traductora & Notas Pastel:**
   - Glosario terminológico colaborativo con filtro por especialidad (Jurídico, Médico, Audiovisual, Marketing).
   - Contador de palabras y caracteres con estimador de tiempo de traducción (250 palabras/hora).
   - Notas adhesivas pastel con guardado automático.

---

## 🚀 Cómo Ejecutar la Aplicación

Puedes abrir `index.html` directamente en tu navegador o levantarlo con un servidor local de Python:

```bash
cd /Users/melaniealmeyda/.gemini/antigravity/scratch/global-translators-studio
python3 -m http.server 8080
```

Luego abre en tu navegador:
[http://localhost:8080](http://localhost:8080)

---

## 💾 Persistencia de Datos

Todos los registros y modificaciones se guardan de forma instantánea y persistente en el navegador (`localStorage`). Puedes respaldar o restaurar la información en cualquier momento usando el botón de base de datos en la barra superior.
