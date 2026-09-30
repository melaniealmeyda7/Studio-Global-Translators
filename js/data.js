// Datos iniciales para Global Translators Studio
window.GT_DATA_INITIAL = {
  practicantes: [
    {
      id: "p1",
      nombre: "Valentina Morales",
      rol: "Practicante de Traducción Audiovisual & Subtitulaje",
      universidad: "Universidad Ricardo Palma",
      semestre: "9no Ciclo",
      idiomas: ["Inglés (C1)", "Español (Nativo)", "Portugués (B2)"],
      catTools: ["Subtitle Edit", "Trados Studio", "Aegisub"],
      horasCompletadas: 340,
      horasMeta: 480,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      colorTag: "pink",
      cvUrl: "https://drive.google.com/sample-cv-valentina",
      resumenCv: "Estudiante de Traducción e Interpretación con 1 año de experiencia académica en subtitulaje para streaming, localización de guiones y doblaje. Dominio de timing y normas de accesibilidad.",
      habilidades: ["Control de tiempos (CPS)", "Localización cultural", "Revisión bilingüe", "Glosarios audiovisuales"]
    },
    {
      id: "p2",
      nombre: "Camila Navarro",
      rol: "Practicante de Traducción Jurídica & Comercial",
      universidad: "Universidad Femenina del Sagrado Corazón",
      semestre: "10mo Ciclo",
      idiomas: ["Francés (C1)", "Inglés (B2)", "Español (Nativo)"],
      catTools: ["Trados Studio", "MemoQ", "Wordfast"],
      horasCompletadas: 410,
      horasMeta: 480,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
      colorTag: "lavender",
      cvUrl: "https://drive.google.com/sample-cv-camila",
      resumenCv: "Especialización en traducción legal, contratos comerciales societarios, apostillas y documentación financiera. Experiencia en memorias de traducción complejas.",
      habilidades: ["Derecho comparado", "Terminología jurídica", "QA bilingüe", "Manejo de TMs"]
    },
    {
      id: "p3",
      nombre: "Luciana Reyes",
      rol: "Practicante de Traducción Técnica & Médica",
      universidad: "Universidad Peruana de Ciencias Aplicadas",
      semestre: "8vo Ciclo",
      idiomas: ["Alemán (B2)", "Inglés (C1)", "Español (Nativo)"],
      catTools: ["Smartcat", "MemoQ", "Xbench"],
      horasCompletadas: 220,
      horasMeta: 480,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      colorTag: "mint",
      cvUrl: "https://drive.google.com/sample-cv-luciana",
      resumenCv: "Enfocada en manuales de equipos biomédicos, prospectos farmacéuticos y ensayos clínicos. Riguroso apego a normas de precisión y glosarios normalizados.",
      habilidades: ["Terminología MeSH", "Control de Calidad (Xbench)", "Redacción científica", "Formatos DTP"]
    },
    {
      id: "p4",
      nombre: "Sofía Mendoza",
      rol: "Practicante de Localización Web & Marketing",
      universidad: "Pontificia Universidad Católica del Perú",
      semestre: "9no Ciclo",
      idiomas: ["Inglés (C2)", "Italiano (B1)", "Español (Nativo)"],
      catTools: ["Phrase", "Crowdin", "Notion"],
      horasCompletadas: 295,
      horasMeta: 480,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
      colorTag: "sky",
      cvUrl: "https://drive.google.com/sample-cv-sofia",
      resumenCv: "Transcreación de campañas publicitarias, localización de interfaces UI/UX de apps y plataformas SaaS. Enfoque en tono de voz y SEO multilingüe.",
      habilidades: ["Transcreación creativa", "Localización de apps (JSON/PO)", "SEO multilingüe", "Copywriting"]
    }
  ],

  entregas: [
    {
      id: "ent-sm-1",
      titulo: "Preservando Historias San Mateo: Transcripción y Traducción de Relatos Orales de Ancianos (Ep. 01 & 02)",
      practicanteId: "p1",
      practicanteNombre: "Valentina Morales",
      parIdiomas: "ES ➔ EN",
      categoria: "Patrimonio / Testimonial",
      fechaLimite: "2026-10-02",
      horaLimite: "16:00",
      prioridad: "Express",
      estado: "en-progreso",
      progreso: 78,
      palabras: 5400,
      documentoUrl: "https://drive.google.com/sample-san-mateo-oral-history-01",
      notas: "Proyecto Preservando Historias San Mateo. Cuidar la preservación de modismos y valor patrimonial de los ancianos."
    },
    {
      id: "ent-sm-2",
      titulo: "Preservando Historias San Mateo: Glosario Toponímico y de Medicina Tradicional",
      practicanteId: "p3",
      practicanteNombre: "Luciana Reyes",
      parIdiomas: "Quechua/ES ➔ ES/EN",
      categoria: "Terminología / San Mateo",
      fechaLimite: "2026-10-05",
      horaLimite: "18:00",
      prioridad: "Urgente",
      estado: "pendiente",
      progreso: 25,
      palabras: 3200,
      documentoUrl: "https://drive.google.com/sample-san-mateo-glosario",
      notas: "Proyecto Preservando Historias San Mateo. Validar fitonimia y nombres de parajes con comuneros."
    },
    {
      id: "ent-sm-3",
      titulo: "Preservando Historias San Mateo: Subtitulado Bilingüe Archivo Audiovisual Comunitario",
      practicanteId: "p4",
      practicanteNombre: "Sofía Mendoza",
      parIdiomas: "ES ➔ EN",
      categoria: "Audiovisual / San Mateo",
      fechaLimite: "2026-09-30",
      horaLimite: "12:00",
      prioridad: "Normal",
      estado: "revision",
      progreso: 92,
      palabras: 2800,
      documentoUrl: "https://drive.google.com/sample-san-mateo-subtitulos",
      notas: "Proyecto Preservando Historias San Mateo. Sincronización con el archivo de video histórico."
    },
    {
      id: "ent-1",
      titulo: "Subtitulaje Documental Netflix: Océanos Vivos (Ep. 03)",
      practicanteId: "p1",
      practicanteNombre: "Valentina Morales",
      parIdiomas: "EN ➔ ES",
      categoria: "Audiovisual",
      fechaLimite: "2026-10-02",
      horaLimite: "17:00",
      prioridad: "Urgente",
      estado: "en-progreso", // pendiente, en-progreso, revision, entregado
      progreso: 65,
      palabras: 4200,
      documentoUrl: "https://drive.google.com/file/d/sample-subtitles-01",
      notas: "Verificar sincronización con el corte final. Mantener límite de 37 caracteres por línea."
    },
    {
      id: "ent-2",
      titulo: "Contrato de Alianza Estratégica & Confidencialidad (NDA)",
      practicanteId: "p2",
      practicanteNombre: "Camila Navarro",
      parIdiomas: "FR ➔ ES",
      categoria: "Jurídica",
      fechaLimite: "2026-10-04",
      horaLimite: "14:00",
      prioridad: "Normal",
      estado: "en-progreso",
      progreso: 40,
      palabras: 3100,
      documentoUrl: "https://drive.google.com/file/d/sample-legal-contract",
      notas: "Revisar cláusulas de arbitraje comercial con el glosario oficial de Global Translators."
    },
    {
      id: "ent-3",
      titulo: "Manual de Operación de Ventilador Pulmonar MedTech",
      practicanteId: "p3",
      practicanteNombre: "Luciana Reyes",
      parIdiomas: "DE ➔ ES",
      categoria: "Médica / Técnica",
      fechaLimite: "2026-10-06",
      horaLimite: "18:00",
      prioridad: "Normal",
      estado: "pendiente",
      progreso: 15,
      palabras: 5800,
      documentoUrl: "https://drive.google.com/file/d/sample-manual-medtech",
      notas: "Verificar tabla de alarmas y parámetros hemodinámicos."
    },
    {
      id: "ent-4",
      titulo: "Localización de Interfaz y Landing Page FinTech PayGlobal",
      practicanteId: "p4",
      practicanteNombre: "Sofía Mendoza",
      parIdiomas: "EN ➔ ES",
      categoria: "Marketing / UI",
      fechaLimite: "2026-09-30",
      horaLimite: "12:00",
      prioridad: "Express",
      estado: "revision",
      progreso: 90,
      palabras: 2600,
      documentoUrl: "https://drive.google.com/file/d/sample-fintech-ui",
      notas: "Revisión final de microcopy en botones y mensajes de error."
    },
    {
      id: "ent-5",
      titulo: "Guía Turística de Patrimonio Cultural: Valle Sagrado",
      practicanteId: "p1",
      practicanteNombre: "Valentina Morales",
      parIdiomas: "ES ➔ EN",
      categoria: "Editorial",
      fechaLimite: "2026-09-28",
      horaLimite: "19:00",
      prioridad: "Normal",
      estado: "entregado",
      progreso: 100,
      palabras: 3500,
      documentoUrl: "https://drive.google.com/file/d/sample-turismo-valle",
      notas: "Entregado a tiempo. Excelente adaptación de modismos andinos."
    }
  ],

  coachingSessions: [
    {
      id: "c1",
      practicanteId: "p1",
      practicanteNombre: "Valentina Morales",
      tipo: "Mock Interview (Entrevista en Inglés)",
      coach: "Lic. Andrea Paz (Head of Talent)",
      fecha: "2026-10-03",
      hora: "10:30",
      estado: "programada",
      objetivo: "Simulacro de entrevista técnica para agencia internacional de localización.",
      acuerdos: "Preparar 3 ejemplos de proyectos con metodología STAR y métricas de calidad.",
      enlaceSala: "https://meet.google.com/gts-coaching-p1",
      calificacion: null
    },
    {
      id: "c2",
      practicanteId: "p2",
      practicanteNombre: "Camila Navarro",
      tipo: "Optimización de CV & Portfolio Jurídico",
      coach: "Mg. Fernando Valenzuela",
      fecha: "2026-10-05",
      hora: "16:00",
      estado: "programada",
      objetivo: "Adaptación del CV a formato ATS y estructuración de muestras de traducción legal sin vulnerar NDAs.",
      acuerdos: "Redactar casos de estudio anonimizados de contratos mercantiles.",
      enlaceSala: "https://meet.google.com/gts-coaching-p2",
      calificacion: null
    },
    {
      id: "c3",
      practicanteId: "p3",
      practicanteNombre: "Luciana Reyes",
      tipo: "LinkedIn Pro & Marca Personal para Traductoras",
      coach: "Lic. Andrea Paz (Head of Talent)",
      fecha: "2026-09-27",
      hora: "11:00",
      estado: "completada",
      objetivo: "Perfil optimizado con palabras clave de traducción médica y contacto con Project Managers globales.",
      acuerdos: "Publicar un artículo corto sobre precisión en ensayos clínicos y activar banner de disponibilidad.",
      enlaceSala: "https://meet.google.com/gts-coaching-p3",
      calificacion: "Sobresaliente (9.5/10) - Gran claridad en su propuesta de valor."
    },
    {
      id: "c4",
      practicanteId: "p4",
      practicanteNombre: "Sofía Mendoza",
      tipo: "Negociación de Tarifas y Transición a Freelance / Staff",
      coach: "Director Mateo Castillo",
      fecha: "2026-10-07",
      hora: "15:00",
      estado: "programada",
      objetivo: "Cálculo de tarifas por palabra/hora en localización y contratos marco internacionales.",
      acuerdos: "Armar hoja de cálculo de costos fijos y tarifa base por tipo de servicio.",
      enlaceSala: "https://meet.google.com/gts-coaching-p4",
      calificacion: null
    }
  ],

  roadmapSteps: [
    { id: "r1", titulo: "CV Formato Internacional ATS", desc: "Diseño limpio en inglés y español con verbos de acción.", hecho: true },
    { id: "r2", titulo: "Perfil LinkedIn Bilingüe Optimizado", desc: "Titular estratégico, extracto con palabras clave y sección de destacados.", hecho: true },
    { id: "r3", titulo: "Portafolio de Traducción con Muestras Limpias", desc: "Textos origen y meta autorizados demostrando precisión y estilo.", hecho: false },
    { id: "r4", titulo: "Simulacro de Entrevista Técnica (Mock Interview)", desc: "Roleplay de resolución de imprevistos, plazos ajustados y pruebas de traducción.", hecho: false },
    { id: "r5", titulo: "Estrategia de Prospección y Agencias Globales", desc: "Postulación a agencias en Proz, TranslatorsCafe y LinkedIn.", hecho: false }
  ],

  glosario: [
    { id: "g1", origen: "Severability Clause", meta: "Cláusula de divisibilidad / nulidad parcial", campo: "Jurídico", notas: "Común en contratos societarios." },
    { id: "g2", origen: "Informed Consent Form (ICF)", meta: "Formulario de consentimiento informado", campo: "Médico", notas: "No traducir como 'forma de consentimiento'." },
    { id: "g3", origen: "Lip-sync dubbing", meta: "Doblaje con sincronía labial", campo: "Audiovisual", notas: "Requiere ajuste riguroso de longitud silábica." },
    { id: "g4", origen: "Call to Action (CTA)", meta: "Llamada a la acción", campo: "Marketing", notas: "Adaptar según tono de la marca (Tú / Usted)." },
    { id: "g5", origen: "Non-Disclosure Agreement (NDA)", meta: "Acuerdo de confidencialidad", campo: "Jurídico", notas: "Abreviatura estandarizada en la industria." }
  ],

  stickyNotes: [
    { id: "n1", color: "pink", texto: "🌸 Recordatorio: Las entregas express tienen prioridad de revisión en el canal de Slack #qa-review." },
    { id: "n2", color: "lavender", texto: "💜 Próximo Taller de CAT Tools: MemoQ Avanzado este viernes 4 PM. ¡Asistencia obligatoria!" },
    { id: "n3", color: "mint", texto: "🌿 Subir el archivo de respaldo Excel cada fin de mes para el cálculo de horas acreditadas." }
  ],

  excelTemplateData: [
    { "ID": "PRAC-001", "Practicante": "Valentina Morales", "Especialidad": "Audiovisual", "Idiomas": "EN > ES", "Horas Acumuladas": 340, "Meta Horas": 480, "Estado CV": "Aprobado", "Próximo Coaching": "Mock Interview (03/10)" },
    { "ID": "PRAC-002", "Practicante": "Camila Navarro", "Especialidad": "Jurídica", "Idiomas": "FR > ES", "Horas Acumuladas": 410, "Meta Horas": 480, "Estado CV": "En Revisión", "Próximo Coaching": "Portfolio Legal (05/10)" },
    { "ID": "PRAC-003", "Practicante": "Luciana Reyes", "Especialidad": "Médica", "Idiomas": "DE > ES", "Horas Acumuladas": 220, "Meta Horas": 480, "Estado CV": "Aprobado", "Próximo Coaching": "Completado (27/09)" },
    { "ID": "PRAC-004", "Practicante": "Sofía Mendoza", "Especialidad": "Localización UI", "Idiomas": "EN > ES", "Horas Acumuladas": 295, "Meta Horas": 480, "Estado CV": "Pendiente", "Próximo Coaching": "Tarifas & Freelance (07/10)" }
  ]
};
