export interface Lesson {
  id: string
  title: string
  duration: string
  sections: Section[]
}

export interface Section {
  type: 'intro' | 'concept' | 'example' | 'tip' | 'exercise' | 'quote' | 'list' | 'warning'
  title?: string
  content: string
  items?: string[]
  author?: string
}

export interface Module {
  slug: string
  title: string
  description: string
  level: 'Básico' | 'Intermedio' | 'Avanzado'
  duration: string
  icon: string
  lessons: Lesson[]
  objectives: string[]
  tags: string[]
}

export const MODULES: Module[] = [
  {
    slug: 'introduccion-ia',
    title: 'Introducción a la IA Generativa',
    description: 'Qué es, cómo funciona y cómo cambia el trabajo en agencias de comunicación y marketing.',
    level: 'Básico',
    duration: '45 min',
    icon: 'cpu',
    objectives: [
      'Entender qué es la IA generativa y qué la diferencia de otras tecnologías',
      'Conocer los modelos más relevantes y sus capacidades',
      'Identificar oportunidades concretas en el trabajo diario de la agencia',
      'Saber qué tareas se pueden delegar a la IA y cuáles no',
    ],
    tags: ['Fundamentos', 'LLM', 'Productividad'],
    lessons: [
      {
        id: 'que-es-ia',
        title: '¿Qué es la IA Generativa?',
        duration: '15 min',
        sections: [
          {
            type: 'intro',
            content: 'La inteligencia artificial generativa es un tipo de IA capaz de crear contenido nuevo: texto, imágenes, código, audio y vídeo. A diferencia de los sistemas de IA clásicos, que clasifican o predicen, la IA generativa produce. Y eso lo cambia todo.',
          },
          {
            type: 'concept',
            title: 'Cómo funciona un modelo de lenguaje (LLM)',
            content: 'Un Large Language Model (LLM) es un sistema entrenado con cantidades masivas de texto. Durante ese entrenamiento, el modelo aprende los patrones del lenguaje: gramática, hechos, razonamientos, estilos. Cuando le escribes un mensaje, el modelo predice, palabra a palabra, qué texto tiene más sentido como respuesta.',
          },
          {
            type: 'example',
            title: 'Una analogía útil',
            content: 'Imagina un colaborador que ha leído toda la biblioteca municipal, todas las webs de internet y millones de libros. Cuando le haces una pregunta, combina todo ese conocimiento para darte una respuesta coherente. Eso es, en esencia, lo que hace un LLM. La diferencia es que este colaborador no cobra vacaciones y está disponible las 24 horas.',
          },
          {
            type: 'list',
            title: 'Los modelos más importantes ahora mismo',
            content: 'Existen varios modelos líderes, cada uno con sus fortalezas:',
            items: [
              'Claude (Anthropic) — Excelente para textos largos, análisis y razonamiento matizado. Muy bueno con documentos',
              'GPT-4o (OpenAI) — Versátil y rápido. Muy popular y con buena capacidad multimodal',
              'Gemini (Google) — Integración con el ecosistema Google. Contexto muy largo',
              'Llama (Meta) — Modelo de código abierto. Gratuito y personalizable',
              'Mistral — Modelos ligeros y rápidos, ideales para tareas simples sin coste',
            ],
          },
          {
            type: 'concept',
            title: 'La diferencia entre "inteligente" y "correcto"',
            content: 'Los LLMs no son bases de datos. No buscan la verdad, generan texto plausible. Esto significa que pueden equivocarse, inventar datos o citar fuentes que no existen. Se llama "alucinación". Por eso, cualquier dato factual que te dé una IA debe verificarse antes de publicarse o enviarse a un cliente.',
          },
          {
            type: 'warning',
            title: 'Error frecuente',
            content: 'Copiar y pegar directamente la respuesta de la IA sin revisarla. La IA es un primer borrador brillante, no una fuente de verdad. Tu criterio profesional siempre tiene que estar en el bucle.',
          },
        ],
      },
      {
        id: 'ia-en-agencias',
        title: 'La IA en el día a día de la agencia',
        duration: '15 min',
        sections: [
          {
            type: 'intro',
            content: 'Las agencias de comunicación, marketing y consultoría pública son de los sectores que más pueden beneficiarse de la IA generativa. El trabajo es intensivo en texto, creatividad y análisis — justo lo que los LLMs hacen mejor.',
          },
          {
            type: 'list',
            title: 'Lo que la IA puede hacer por ti ahora mismo',
            content: 'Estas tareas se pueden delegar total o parcialmente a la IA hoy:',
            items: [
              'Redactar primeros borradores de emails, informes y propuestas',
              'Resumir documentos largos (pliegos, informes, actas)',
              'Generar ideas y conceptos creativos para campañas',
              'Adaptar un mismo contenido a diferentes formatos y tonos',
              'Traducir textos manteniendo el registro corporativo',
              'Analizar datos y extraer conclusiones en lenguaje natural',
              'Crear copys para redes sociales en múltiples variantes',
              'Revisar y mejorar textos ya escritos',
            ],
          },
          {
            type: 'list',
            title: 'Lo que la IA NO puede hacer',
            content: 'Hay tareas que siguen siendo tuyas:',
            items: [
              'Conocer al cliente en profundidad y construir la relación',
              'Tomar decisiones estratégicas con responsabilidad',
              'Verificar datos factuales y fuentes',
              'Aportar el contexto local, político o cultural específico',
              'Firmar documentos legales y asumir responsabilidad',
              'Crear desde la experiencia vivida o la emoción genuina',
            ],
          },
          {
            type: 'quote',
            content: 'La IA no va a quitarte el trabajo. Pero las personas que sepan usar la IA sí van a quitárselo a las que no.',
            author: 'Consenso del sector tecnológico, 2024',
          },
          {
            type: 'tip',
            title: 'Cómo empezar esta semana',
            content: 'Elige una tarea repetitiva que hagas con frecuencia: un tipo de email, un resumen semanal, un primer borrador de propuesta. Prueba a pedírsela a la IA con contexto detallado. Mide cuánto tiempo ahorras. Eso te dará perspectiva real sobre el potencial.',
          },
        ],
      },
      {
        id: 'modelos-y-herramientas',
        title: 'Herramientas disponibles en XULIA',
        duration: '15 min',
        sections: [
          {
            type: 'intro',
            content: 'XULIA te da acceso a los mejores modelos de IA desde una sola plataforma. No necesitas tener cuentas en múltiples servicios ni pagar individualmente. Desde el AI Hub puedes elegir el modelo más adecuado para cada tarea.',
          },
          {
            type: 'concept',
            title: 'Modelos gratuitos vs. de pago',
            content: 'Los modelos gratuitos (identificados con la etiqueta FREE) son perfectos para la mayoría de tareas del día a día: redacción, resúmenes, ideas. Los modelos de pago tienen mayor capacidad de razonamiento, contexto más amplio y son más precisos en tareas complejas como análisis jurídico o documentos técnicos extensos.',
          },
          {
            type: 'list',
            title: 'Guía rápida de selección de modelo',
            content: 'Usa esta guía para elegir bien:',
            items: [
              'Email, copy, ideas → Llama 3.1 o Gemini Flash (gratuitos, rápidos)',
              'Resumir documentos → Gemini Flash (contexto largo, gratuito)',
              'Análisis complejo, propuestas importantes → Claude Sonnet o GPT-4o',
              'Razonamiento técnico difícil → DeepSeek R1 (gratuito y potente)',
              'Documentos de 100+ páginas → Gemini 1.5 Pro (contexto de 2M tokens)',
            ],
          },
          {
            type: 'exercise',
            title: 'Ejercicio práctico',
            content: 'Ve al AI Hub y prueba esta misma petición con tres modelos diferentes:\n\n"Resume en 5 puntos qué es la IA generativa y cómo puede ayudar a una agencia de comunicación"\n\nCompara la calidad, el estilo y la velocidad de cada respuesta. Eso te dará intuición sobre cuándo usar cada modelo.',
          },
        ],
      },
    ],
  },
  {
    slug: 'prompt-engineering',
    title: 'Prompt Engineering para no técnicos',
    description: 'Técnicas probadas para obtener mejores respuestas de cualquier modelo de IA.',
    level: 'Básico',
    duration: '60 min',
    icon: 'file-text',
    objectives: [
      'Comprender qué es un prompt y por qué la calidad del prompt importa',
      'Dominar las técnicas básicas y avanzadas de prompting',
      'Evitar los errores más comunes al usar IA',
      'Construir prompts reutilizables para las tareas habituales',
    ],
    tags: ['Prompts', 'Técnicas', 'Productividad'],
    lessons: [
      {
        id: 'que-es-un-prompt',
        title: 'Qué es un prompt y por qué importa',
        duration: '15 min',
        sections: [
          {
            type: 'intro',
            content: 'Un prompt es el mensaje que le escribes a la IA. Puede ser una pregunta, una instrucción, un contexto o una combinación de todo. La calidad del output de la IA depende directamente de la calidad del input que tú le das.',
          },
          {
            type: 'concept',
            title: 'El principio fundamental',
            content: 'La IA no lee entre líneas, no conoce tu empresa, no sabe qué has hecho antes ni qué quieres conseguir. Solo tiene lo que le escribes en ese momento. Por eso, más contexto = mejores resultados.',
          },
          {
            type: 'example',
            title: 'Prompt malo vs. prompt bueno',
            content: '❌ MALO: "Escribe un email"\n\n✅ BUENO: "Eres un consultor de comunicación corporativa senior. Escribe un email para presentar nuestra agencia XUL a una empresa de infraestructuras que acaba de ganar un contrato de obra pública en Valencia. El email debe ser formal pero cercano, de no más de 200 palabras, e incluir una propuesta de reunión. Nuestros servicios principales son: comunicación institucional, gestión de licitaciones y marketing digital."',
          },
          {
            type: 'list',
            title: 'Los 5 elementos de un prompt efectivo',
            content: 'Un prompt completo incluye:',
            items: [
              '🎭 ROL — Quién es la IA: "Actúa como un experto en..."',
              '📋 TAREA — Qué debe hacer exactamente',
              '🌍 CONTEXTO — Información de fondo relevante',
              '📐 FORMATO — Cómo debe estructurar la respuesta',
              '🎯 TONO — Cómo debe sonar (formal, cercano, técnico...)',
            ],
          },
        ],
      },
      {
        id: 'tecnicas-avanzadas',
        title: 'Técnicas avanzadas de prompting',
        duration: '25 min',
        sections: [
          {
            type: 'intro',
            content: 'Una vez dominas la estructura básica, hay técnicas específicas que multiplican la calidad de las respuestas en casos concretos.',
          },
          {
            type: 'concept',
            title: 'Chain of Thought — pídele que piense paso a paso',
            content: 'Cuando la tarea es compleja o requiere razonamiento, añade "Piensa paso a paso antes de responder" o "Razona en voz alta". Esto hace que el modelo estructure su proceso mental antes de dar la respuesta final, reduciendo errores significativamente.',
          },
          {
            type: 'example',
            title: 'Ejemplo: análisis de pliego',
            content: '"Analiza este pliego de licitación. Antes de responder, piensa paso a paso: 1) qué se pide, 2) qué requisitos hay, 3) qué criterios se valoran, 4) qué riesgos ves. Luego dame tu análisis estructurado. [texto del pliego]"',
          },
          {
            type: 'concept',
            title: 'Few-shot prompting — muéstrale ejemplos',
            content: 'Si tienes un estilo o formato muy concreto, muéstrale ejemplos antes de pedir el resultado. "Aquí tienes tres emails que escribimos nosotros. Escribe un cuarto con el mismo estilo para..."',
          },
          {
            type: 'concept',
            title: 'Iteración — refina en la conversación',
            content: 'No tienes que hacerlo perfecto al primer intento. Empieza con un prompt básico y refina con instrucciones adicionales: "Hazlo más corto", "Usa un tono más formal", "Añade datos concretos", "Cambia el principio para que sea más impactante".',
          },
          {
            type: 'tip',
            title: 'Técnica del rol experto',
            content: 'Asignar un rol específico a la IA mejora notablemente la calidad. "Actúa como el Director de Comunicación de una administración pública con 20 años de experiencia" te dará respuestas muy diferentes a simplemente "escribe un comunicado".',
          },
          {
            type: 'list',
            title: 'Frases que mejoran cualquier prompt',
            content: 'Añade estas instrucciones para resultados más precisos:',
            items: [
              '"Sé específico y concreto, evita generalidades"',
              '"Dame al menos 3 opciones diferentes"',
              '"Indica si hay algo que necesitas saber antes de responder"',
              '"Si no estás seguro de algo, dímelo explícitamente"',
              '"Formato: usa encabezados, listas y negritas para facilitar la lectura"',
              '"Longitud: máximo X palabras / exactamente X párrafos"',
            ],
          },
          {
            type: 'exercise',
            title: 'Ejercicio: mejora este prompt',
            content: 'Toma este prompt básico y aplica todas las técnicas aprendidas:\n\n"Escríbeme algo sobre redes sociales para nuestro cliente de hostelería"\n\nTu versión mejorada debe incluir: rol, tarea específica, contexto del cliente, formato deseado y tono. Después pruébalo en el Hub y compara los resultados.',
          },
        ],
      },
      {
        id: 'errores-comunes',
        title: 'Los 7 errores más comunes',
        duration: '20 min',
        sections: [
          {
            type: 'intro',
            content: 'Después de analizar miles de conversaciones con IA, estos son los patrones de error más frecuentes. Evitarlos te ahorrará tiempo y frustración.',
          },
          {
            type: 'list',
            title: 'Los 7 errores a evitar',
            content: '',
            items: [
              '1. Prompt demasiado vago — "Escríbeme algo sobre X". La IA no sabe qué quieres',
              '2. No dar contexto del cliente/proyecto — cada cliente es diferente, la IA no lo sabe',
              '3. Pedir demasiadas cosas a la vez — un prompt, una tarea principal',
              '4. No iterar — si el primer resultado no es perfecto, pide mejoras específicas',
              '5. Publicar sin revisar — la IA comete errores factuales, siempre revisa',
              '6. Ignorar el tono — no es lo mismo un cliente público que una startup',
              '7. Empezar desde cero cada vez — guarda tus mejores prompts en la Biblioteca',
            ],
          },
          {
            type: 'warning',
            title: 'El error más caro',
            content: 'Enviar a un cliente una propuesta o comunicado generado por IA sin revisión editorial. La IA puede inventar datos, usar términos incorrectos del sector o tener un tono inadecuado para ese cliente concreto. Tu firma profesional siempre debe estar detrás de cada documento.',
          },
          {
            type: 'tip',
            title: 'El flujo ideal',
            content: 'Prompt bien construido → Revisión crítica del output → Refinamiento con instrucciones específicas → Edición humana final → Envío. La IA acelera el proceso, no lo elimina.',
          },
        ],
      },
    ],
  },
  {
    slug: 'ia-marketing',
    title: 'IA en Marketing y Comunicación',
    description: 'Casos de uso reales: copys, campañas, análisis de audiencias y gestión de contenido.',
    level: 'Intermedio',
    duration: '90 min',
    icon: 'megaphone',
    objectives: [
      'Aplicar IA en el proceso creativo de campañas publicitarias',
      'Generar y adaptar contenido para múltiples canales con IA',
      'Usar IA para análisis de audiencias y estrategia de marca',
      'Integrar IA en los flujos de trabajo del equipo creativo',
    ],
    tags: ['Marketing', 'Campañas', 'Contenido', 'Creatividad'],
    lessons: [
      {
        id: 'ia-proceso-creativo',
        title: 'IA en el proceso creativo',
        duration: '30 min',
        sections: [
          {
            type: 'intro',
            content: 'La IA no reemplaza la creatividad humana — la amplifica. Los mejores creativos del sector ya usan IA para generar decenas de ideas en minutos, explorar territorios creativos inesperados y superar el bloqueo del folio en blanco.',
          },
          {
            type: 'concept',
            title: 'El modelo de co-creación',
            content: 'El flujo recomendado es: tú defines el problema creativo, la IA genera opciones diversas, tú seleccionas y refinas las más prometedoras, la IA desarrolla, tú editas y aportas la chispa humana. La IA es un junior muy productivo: necesita dirección, pero genera volumen.',
          },
          {
            type: 'list',
            title: 'Usos en campañas',
            content: 'La IA encaja en estas fases de una campaña:',
            items: [
              'Briefing: analizar el brief del cliente y reformularlo con insights',
              'Investigación: resumir estudios de mercado, tendencias del sector',
              'Ideación: generar 20-50 conceptos creativos en minutos',
              'Naming: crear nombres de campaña, hashtags y claim options',
              'Copywriting: redactar textos para todos los formatos y canales',
              'Adaptación: adaptar el mensaje principal a diferentes audiencias',
              'Revisión: detectar inconsistencias de tono o mensajes off-brand',
            ],
          },
          {
            type: 'example',
            title: 'Caso real: campaña de turismo regional',
            content: 'Situación: brief de una campaña para promover el turismo interior de una comunidad autónoma. Objetivo: atraer turistas nacionales durante temporada baja.\n\nProceso con IA:\n1. Pedimos a la IA que analizara el brief e identificara los "insights" más potentes del viajero nacional\n2. Generamos 30 conceptos de campaña en 10 minutos\n3. Seleccionamos 3 direcciones creativas para desarrollar\n4. La IA redactó 5 versiones del claim para cada dirección\n5. El equipo humano eligió, refinó y aportó el tratamiento visual\n\nResultado: el proceso de ideación pasó de 3 días a 4 horas.',
          },
          {
            type: 'tip',
            title: 'Truco para el bloqueo creativo',
            content: 'Cuando estés bloqueado, pide a la IA: "Dame 10 formas completamente diferentes de comunicar [beneficio clave] a [público]. Incluye opciones racionales, emocionales, humorísticas y provocadoras." La diversidad forzada genera las ideas más inesperadas.',
          },
        ],
      },
      {
        id: 'contenido-multicanal',
        title: 'Producción de contenido multicanal',
        duration: '30 min',
        sections: [
          {
            type: 'intro',
            content: 'Uno de los mayores cuellos de botella en agencias es adaptar el mismo mensaje a múltiples formatos y canales. La IA elimina este problema: puedes partir de un contenido base y generar todas las variantes en minutos.',
          },
          {
            type: 'concept',
            title: 'El contenido piloto',
            content: 'La técnica del contenido piloto consiste en crear primero una versión larga y completa (un artículo de blog, un dossier, un vídeo largo) y usar la IA para derivar todo lo demás: posts de redes, newsletter, nota de prensa, hilo de LinkedIn, script de vídeo corto.',
          },
          {
            type: 'example',
            title: 'Un contenido, 8 formatos',
            content: 'A partir de un artículo de 1.000 palabras sobre "tendencias de comunicación pública en 2025", pedimos a la IA:\n\n→ 5 posts de Instagram (cada uno con un dato del artículo)\n→ 1 hilo de LinkedIn de 8 tweets\n→ 1 newsletter de 300 palabras\n→ 1 nota de prensa de 400 palabras\n→ 3 headlines para Google Ads\n→ 5 variantes de caption para Facebook\n→ 1 script para un Reel de 60 segundos\n→ 10 preguntas para una encuesta en Stories\n\nTiempo total: 45 minutos. Antes: 2 días.',
          },
          {
            type: 'list',
            title: 'Instrucciones por canal',
            content: 'Cada canal tiene sus reglas — díselas a la IA:',
            items: [
              'Instagram: hook visual, máx. 150 palabras, 5-10 hashtags, CTA claro',
              'LinkedIn: primera línea que corte, párrafos cortos, sin emojis excesivos, pregunta final',
              'X/Twitter: máx. 280 caracteres, directo, opinativo o con dato sorpresa',
              'Newsletter: saludo personal, un tema principal, un enlace CTA',
              'Nota de prensa: lead con los 5W, pirámide invertida, cita de portavoz',
            ],
          },
          {
            type: 'exercise',
            title: 'Ejercicio práctico',
            content: 'Elige un servicio de tu agencia. Pide a la IA que cree el contenido base: un párrafo de 200 palabras explicando el servicio y su valor diferencial. Después, con ese párrafo como input, pide que genere: 1 post de LinkedIn + 3 posts de Instagram + 1 subject line de email. Observa cómo adapta el tono a cada canal.',
          },
        ],
      },
      {
        id: 'analisis-audiencias',
        title: 'Análisis de audiencias y estrategia',
        duration: '30 min',
        sections: [
          {
            type: 'intro',
            content: 'La IA puede actuar como un analista estratégico: ayudarte a segmentar audiencias, construir buyer personas, analizar competidores y detectar oportunidades de comunicación.',
          },
          {
            type: 'concept',
            title: 'Buyer personas con IA',
            content: 'Un buyer persona es una representación semi-ficticia del cliente ideal. La IA puede construirlos en profundidad si le das los datos correctos. No inventes a ciegas — dale datos reales: sector del cliente, datos demográficos conocidos, comportamiento de compra, objeciones habituales.',
          },
          {
            type: 'example',
            title: 'Prompt para crear buyer persona',
            content: '"Crea un buyer persona detallado para el servicio de [SERVICIO] de nuestra agencia. El cliente típico es [DESCRIPCIÓN BÁSICA]. Incluye: nombre ficticio, cargo, empresa, edad, motivaciones principales, miedos y objeciones, canales donde se informa, qué valora de una agencia y qué mensaje le haría contratar."',
          },
          {
            type: 'list',
            title: 'Análisis competitivo con IA',
            content: 'La IA puede ayudarte a estructurar tu análisis de competencia:',
            items: [
              'Comparar mensajes y posicionamiento de competidores',
              'Identificar gaps de comunicación que puedes aprovechar',
              'Analizar el tono y estilo de comunicación del sector',
              'Sugerir ángulos diferenciadores para tu propuesta',
              'Construir argumentarios de venta contra competidores concretos',
            ],
          },
          {
            type: 'tip',
            title: 'Limitar las alucinaciones en análisis',
            content: 'Para análisis de mercado, proporciona siempre tú los datos (puedes pegar texto de webs, informes o noticias). Pide a la IA que analice e interprete esos datos, no que los invente. "Analiza estos datos que te proporciono y extrae conclusiones" es mucho más fiable que "dime qué está pasando en el mercado de X".',
          },
        ],
      },
    ],
  },
  {
    slug: 'automatizacion',
    title: 'Automatización de procesos con IA',
    description: 'Conecta flujos de trabajo, elimina tareas repetitivas y construye tu stack de productividad con IA.',
    level: 'Avanzado',
    duration: '120 min',
    icon: 'zap',
    objectives: [
      'Identificar qué procesos de la agencia son automatizables',
      'Conocer las herramientas de automatización más útiles',
      'Diseñar flujos de trabajo con IA integrada',
      'Medir el ROI de la automatización',
    ],
    tags: ['Automatización', 'Flujos', 'Productividad', 'Tools'],
    lessons: [
      {
        id: 'mapa-automatizacion',
        title: 'Qué se puede automatizar en una agencia',
        duration: '40 min',
        sections: [
          {
            type: 'intro',
            content: 'Antes de automatizar, hay que mapear. No todo proceso merece ser automatizado — solo aquellos que son repetitivos, predecibles y de bajo valor añadido humano.',
          },
          {
            type: 'concept',
            title: 'El criterio de automatización',
            content: 'Un proceso es buen candidato para automatizar si: (1) se repite con frecuencia, (2) sigue siempre una estructura similar, (3) no requiere juicio estratégico ni relación con el cliente, y (4) el coste de hacerlo manualmente supera el coste de automatizarlo en 3-6 meses.',
          },
          {
            type: 'list',
            title: 'Procesos más automatizables en agencias',
            content: 'Ordenados de mayor a menor facilidad:',
            items: [
              'Resúmenes de reuniones y extracción de tareas — muy fácil con IA',
              'Generación de informes periódicos de métricas — plantilla + IA',
              'Clasificación y respuesta inicial a emails de cliente — con supervisión',
              'Creación de primeros borradores de contenido recurrente — newsletters, posts',
              'Seguimiento de menciones y alertas de marca — monitorización automática',
              'Transcripción de entrevistas y vídeos — Whisper o herramientas similares',
              'Traducción de contenidos al español y otros idiomas',
              'Generación de variantes de creatividades para A/B testing',
            ],
          },
          {
            type: 'concept',
            title: 'Stack de herramientas recomendado',
            content: 'No necesitas ser programador para automatizar. Estas herramientas permiten conectar apps y crear flujos con IA sin código:\n\n• Make (ex-Integromat) — el más potente para agencias\n• Zapier — más fácil, más caro\n• n8n — open source, requiere más configuración\n• XULIA Automations — módulo integrado en esta plataforma (próximamente)',
          },
          {
            type: 'example',
            title: 'Flujo real: informe semanal automático',
            content: 'Flujo actual (manual): el account manager recopila datos de 5 plataformas, los copia en una plantilla Excel, redacta el resumen y lo envía por email. 3-4 horas semanales.\n\nFlujo automatizado:\n1. Trigger: cada lunes a las 8:00\n2. Extrae datos de Analytics, Meta, LinkedIn vía API\n3. Los pasa a la IA con una plantilla de prompt\n4. La IA genera el informe narrativo\n5. Se envía automáticamente al cliente\n\nTiempo reducido: 3-4h → 10 minutos de revisión.',
          },
          {
            type: 'exercise',
            title: 'Ejercicio: mapea tus procesos',
            content: 'Lista 10 tareas que realizas con frecuencia en tu trabajo. Para cada una, evalúa del 1-5: ¿qué tan repetitiva es? ¿qué tan predecible es su estructura? ¿cuánto tiempo te lleva por semana?\n\nLas que tengan puntuación alta en los tres criterios son tus candidatas prioritarias de automatización.',
          },
        ],
      },
      {
        id: 'construir-flujos',
        title: 'Diseñar y construir flujos de trabajo',
        duration: '50 min',
        sections: [
          {
            type: 'intro',
            content: 'Un flujo de automatización tiene tres partes: un disparador (trigger), una o varias acciones, y un resultado. La IA puede ser parte de ese flujo o el flujo entero.',
          },
          {
            type: 'concept',
            title: 'Anatomía de un flujo',
            content: 'TRIGGER → ACCIÓN(ES) → OUTPUT\n\nEjemplo: "Nuevo email de cliente" → "Clasifica el asunto y prioridad con IA" + "Crea tarea en el gestor de proyectos" → "Notifica al responsable de cuenta"',
          },
          {
            type: 'list',
            title: '5 flujos de alto impacto para agencias',
            content: 'Empieza por alguno de estos:',
            items: [
              '1. Seguimiento de leads: formulario web → CRM → email personalizado automático',
              '2. Monitorización de marca: mención en medios → resumen IA → alerta Slack',
              '3. Informe de cliente: datos analítica → IA redacta informe → PDF → email',
              '4. Gestión de contenido: post aprobado → IA adapta a cada red → programación',
              '5. Onboarding de cliente: firma contrato → crea carpetas → envía bienvenida → asigna tareas',
            ],
          },
          {
            type: 'tip',
            title: 'Empieza pequeño',
            content: 'No intentes automatizar un proceso complejo de 20 pasos al principio. Empieza con un flujo de 3-4 pasos que te ahorre tiempo cada semana. Una vez funciona bien, compléjalo gradualmente.',
          },
        ],
      },
      {
        id: 'medir-roi',
        title: 'Medir el impacto y ROI',
        duration: '30 min',
        sections: [
          {
            type: 'intro',
            content: 'Automatizar por automatizar no tiene sentido. Hay que medir el impacto real para saber si vale la pena el esfuerzo de configuración y mantenimiento.',
          },
          {
            type: 'concept',
            title: 'Cómo calcular el ROI de la automatización',
            content: 'Fórmula básica:\n\nROI = (Horas ahorradas × Coste hora) - Coste de la herramienta\n\nSi automatizas 5 horas semanales a 50€/hora = 250€/semana ahorrados. Si la herramienta cuesta 80€/mes, el ROI mensual es de (250×4) - 80 = 920€/mes. Amortización: inmediata.',
          },
          {
            type: 'list',
            title: 'Métricas a seguir',
            content: 'Mide estas variables antes y después de automatizar:',
            items: [
              'Tiempo dedicado a la tarea por semana',
              'Errores humanos detectados (olvidos, inconsistencias)',
              'Tiempo de respuesta al cliente',
              'Satisfacción del equipo (carga de trabajo percibida)',
              'Calidad del output (¿es tan bueno como el manual?)',
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'licitaciones-ia',
    title: 'Licitaciones y Fondos Europeos con IA',
    description: 'Redacción técnica asistida, análisis de pliegos, memorias y candidaturas europeas.',
    level: 'Avanzado',
    duration: '90 min',
    icon: 'clipboard',
    objectives: [
      'Usar IA para analizar pliegos y detectar oportunidades de concurso',
      'Redactar memorias técnicas y propuestas con asistencia de IA',
      'Identificar convocatorias de fondos europeos relevantes',
      'Construir equipos de trabajo y presupuestos con IA',
    ],
    tags: ['Licitaciones', 'Fondos Europeos', 'Sector Público'],
    lessons: [
      {
        id: 'analisis-pliegos',
        title: 'Análisis rápido de pliegos con IA',
        duration: '30 min',
        sections: [
          {
            type: 'intro',
            content: 'Los pliegos de licitación pública pueden tener cientos de páginas. La IA puede leerlos y extraer en minutos lo que más te importa para decidir si concursar y cómo hacerlo.',
          },
          {
            type: 'concept',
            title: 'La regla del 3-5-10',
            content: 'Un análisis de pliego efectivo responde a 3 preguntas estratégicas, 5 criterios técnicos y 10 requisitos operativos. La IA puede estructurarte ese análisis si le das el texto del pliego.',
          },
          {
            type: 'list',
            title: '3 preguntas estratégicas',
            content: 'Lo primero que debes saber:',
            items: [
              '¿Podemos ganar? (¿cumplimos los criterios y somos competitivos?)',
              '¿Queremos ganar? (¿es rentable, estratégico, compatible con nuestra capacidad?)',
              '¿Cómo ganamos? (¿dónde podemos diferenciarnos de los competidores?)',
            ],
          },
          {
            type: 'example',
            title: 'Prompt para análisis de pliego',
            content: '"Actúa como un consultor experto en licitaciones públicas. Analiza el siguiente pliego de condiciones y dame:\n1. Resumen del objeto del contrato en 3 líneas\n2. Presupuesto base y forma de pago\n3. Criterios de adjudicación con su ponderación\n4. Requisitos de solvencia técnica y económica\n5. Los 3 riesgos principales que detectas\n6. Recomendación: concursar / no concursar / condicional\n\n[PEGA EL TEXTO DEL PLIEGO]"',
          },
          {
            type: 'tip',
            title: 'Para pliegos muy largos',
            content: 'Si el pliego tiene más de 50 páginas, usa Gemini 1.5 Pro (disponible en XULIA) — tiene un contexto de 2 millones de tokens y puede procesar el documento entero de una sola vez. Para documentos medianos, Gemini Flash funciona perfectamente.',
          },
        ],
      },
      {
        id: 'memorias-tecnicas',
        title: 'Redacción de memorias técnicas',
        duration: '35 min',
        sections: [
          {
            type: 'intro',
            content: 'La memoria técnica es donde se ganan o pierden los concursos. La IA puede ayudarte a construir un documento técnico riguroso, coherente y orientado a los criterios de valoración en mucho menos tiempo.',
          },
          {
            type: 'concept',
            title: 'El enfoque correcto',
            content: 'La IA no debe inventar tu metodología — debe ayudarte a articularla mejor. Tú aportas el know-how real: qué hacéis, cómo lo hacéis, qué resultados habéis obtenido. La IA lo estructura, lo redacta con el registro técnico adecuado y lo alinea con los criterios del pliego.',
          },
          {
            type: 'list',
            title: 'Proceso recomendado',
            content: 'Sigue este orden para construir la memoria:',
            items: [
              '1. Pide a la IA que analice los criterios técnicos del pliego y los ordene por importancia',
              '2. Para cada criterio, escribe en bruto tu propuesta (no importa cómo quede)',
              '3. Pide a la IA que lo redacte de forma técnica y alineada con el criterio',
              '4. Revisa, corrige y añade detalles específicos de tu empresa o proyecto',
              '5. Pide a la IA que revise la coherencia global y detecte contradicciones',
              '6. Revisión humana final antes de entregar',
            ],
          },
          {
            type: 'warning',
            title: 'Nunca dejes que la IA invente datos',
            content: 'Proyectos de referencia, datos de equipo, certificaciones, volúmenes de facturación — todos deben ser reales. La IA puede ayudarte a presentarlos mejor, pero nunca debe generarlos. Las mesas de contratación verifican estos datos.',
          },
        ],
      },
      {
        id: 'fondos-europeos',
        title: 'Fondos Europeos: identificación y solicitud',
        duration: '25 min',
        sections: [
          {
            type: 'intro',
            content: 'Los fondos europeos son una oportunidad enorme para agencias y sus clientes. El problema es que las convocatorias son complejas, en múltiples idiomas y con requisitos muy específicos. La IA puede ser un copiloto fundamental en este proceso.',
          },
          {
            type: 'list',
            title: 'Cómo usa la IA para fondos europeos',
            content: 'Aplicaciones concretas:',
            items: [
              'Identificar convocatorias relevantes: describe tu proyecto a la IA y pídele que sugiera programas europeos compatibles',
              'Analizar bases de convocatorias en inglés o francés',
              'Redactar el resumen ejecutivo y los objetivos del proyecto',
              'Construir el presupuesto y la justificación de costes',
              'Revisar la coherencia entre objetivos, actividades y resultados esperados',
              'Adaptar el proyecto a los criterios específicos de cada convocatoria',
            ],
          },
          {
            type: 'example',
            title: 'Prompt para identificar fondos',
            content: '"Soy el director de una agencia de comunicación española con 15 años de experiencia en comunicación institucional y marketing digital. Queremos desarrollar un proyecto de [DESCRIBE TU IDEA]. ¿Qué programas europeos podrían financiar este proyecto? Dame el nombre del programa, el tipo de proyectos que financia, el presupuesto típico por proyecto y la frecuencia de convocatorias."',
          },
        ],
      },
    ],
  },
  {
    slug: 'etica-ia',
    title: 'Ética y Responsabilidad en el Uso de IA',
    description: 'Marco legal, sesgos, privacidad de datos y buenas prácticas corporativas en el uso de IA.',
    level: 'Intermedio',
    duration: '60 min',
    icon: 'scale',
    objectives: [
      'Conocer el marco legal europeo de la IA (AI Act)',
      'Identificar y gestionar los sesgos de los modelos de IA',
      'Proteger los datos confidenciales al usar herramientas de IA',
      'Establecer políticas de uso responsable en la agencia',
    ],
    tags: ['Ética', 'Legal', 'RGPD', 'Responsabilidad'],
    lessons: [
      {
        id: 'marco-legal',
        title: 'El marco legal: AI Act y RGPD',
        duration: '20 min',
        sections: [
          {
            type: 'intro',
            content: 'Europa lidera la regulación de la IA. El AI Act, en vigor desde 2024, establece un marco de obligaciones según el nivel de riesgo de cada aplicación de IA. Como agencia, es fundamental conocer qué implica usar IA con datos de clientes.',
          },
          {
            type: 'concept',
            title: 'El AI Act en 3 minutos',
            content: 'El Reglamento Europeo de IA clasifica las aplicaciones según riesgo:\n\n• RIESGO INACEPTABLE: prohibidas (ej. manipulación subliminal, scoring social)\n• ALTO RIESGO: obligaciones estrictas (ej. IA en RRHH, crédito, infraestructuras críticas)\n• RIESGO LIMITADO: obligaciones de transparencia (ej. chatbots — debes decir que es IA)\n• RIESGO MÍNIMO: sin obligaciones (ej. filtros de spam, IA generativa para uso interno)',
          },
          {
            type: 'concept',
            title: 'RGPD y datos de clientes',
            content: 'El RGPD sigue siendo la norma de referencia para datos personales. Al usar IA con datos de clientes, aplican las mismas obligaciones: no puedes pasar datos personales a una IA sin base legal suficiente. Usar los datos de un cliente para entrenar un modelo o pasarlos a una API sin cláusulas contractuales puede ser una infracción.',
          },
          {
            type: 'list',
            title: 'Reglas de oro para agencias',
            content: 'Cumple estos principios y estarás del lado correcto:',
            items: [
              'No introduzcas datos personales identificables en prompts sin anonimizar',
              'Lee los términos de uso de cada herramienta de IA antes de usarla con datos de clientes',
              'Utiliza herramientas con procesamiento en Europa cuando sea posible',
              'Incluye en tus contratos con clientes cláusulas sobre el uso de IA',
              'Informa al cliente si el contenido que entregas ha sido creado con IA',
            ],
          },
          {
            type: 'tip',
            title: 'XULIA y la privacidad',
            content: 'Esta plataforma utiliza la API de OpenRouter, que no usa tus conversaciones para entrenar modelos. Aun así, evita introducir datos personales sensibles (DNIs, datos bancarios, información médica o información confidencial de clientes que no hayan dado su consentimiento).',
          },
        ],
      },
      {
        id: 'sesgos-ia',
        title: 'Sesgos, errores y limitaciones',
        duration: '20 min',
        sections: [
          {
            type: 'intro',
            content: 'Los modelos de IA aprenden de datos humanos y, por tanto, heredan los sesgos de esos datos. Conocer estos sesgos te permite detectarlos y corregirlos antes de que lleguen a un cliente o al público.',
          },
          {
            type: 'list',
            title: 'Tipos de sesgo más comunes',
            content: 'En el contexto de una agencia, presta especial atención a:',
            items: [
              'Sesgo de género: la IA puede estereotipar roles o usar lenguaje no inclusivo',
              'Sesgo cultural: los modelos están entrenados mayoritariamente en inglés y cultura anglosajona',
              'Sesgo temporal: el conocimiento tiene fecha de corte, los eventos recientes no están incluidos',
              'Sesgo de confirmación: la IA tiende a confirmar lo que le preguntas, no a contradecirte',
              'Alucinaciones: datos, estadísticas o citas inventadas pero presentadas con confianza',
            ],
          },
          {
            type: 'example',
            title: 'Cómo detectar alucinaciones',
            content: 'Señales de alerta:\n• Cifras muy específicas sin fuente citada ("según el estudio de 2023...")\n• Nombres de personas o cargos que no puedes verificar\n• Legislación o normativa citada con número de artículo concreto\n• Tendencias o datos de mercado muy recientes\n\nRegla: si la IA cita un dato que importa, búscalo. Si no aparece, no lo uses.',
          },
          {
            type: 'warning',
            title: 'El caso de los comunicados institucionales',
            content: 'En comunicación institucional, los errores factuales son especialmente graves. Una cifra incorrecta en una nota de prensa, un cargo mal atribuido o una fecha equivocada pueden generar una crisis de reputación. Toda información factual generada por IA debe verificarse contra fuentes primarias.',
          },
        ],
      },
      {
        id: 'politica-uso',
        title: 'Política de uso responsable en la agencia',
        duration: '20 min',
        sections: [
          {
            type: 'intro',
            content: 'Tener una política clara de uso de IA en la agencia protege a los clientes, al equipo y a la empresa. No se trata de prohibir, sino de establecer estándares.',
          },
          {
            type: 'list',
            title: 'Elementos de una política de uso de IA',
            content: 'Una política básica debe cubrir:',
            items: [
              'Qué herramientas están aprobadas y cuáles no',
              'Qué datos pueden y no pueden introducirse en las herramientas',
              'Quién revisa y firma el contenido generado con IA',
              'Cómo se comunica al cliente el uso de IA en los entregables',
              'Formación mínima requerida antes de usar IA con clientes',
              'Proceso para reportar errores o incidentes relacionados con IA',
            ],
          },
          {
            type: 'quote',
            content: 'La IA hace el trabajo más rápido; la ética hace que ese trabajo sea bueno. Ambas son necesarias y no son incompatibles.',
            author: 'Principios de uso responsable de IA — XULIA',
          },
          {
            type: 'exercise',
            title: 'Ejercicio final',
            content: 'Diseña en 15 minutos una política de uso de IA para tu equipo. Responde a estas preguntas:\n\n1. ¿Qué herramientas de IA pueden usar los miembros del equipo?\n2. ¿Qué tipos de datos están prohibidos en las herramientas de IA?\n3. ¿Quién revisa el contenido antes de enviarlo al cliente?\n4. ¿Cómo comunicamos al cliente cuando hemos usado IA?\n\nComparte el resultado con tu responsable y conviértelo en el punto de partida de vuestra política interna.',
          },
        ],
      },
    ],
  },
]
