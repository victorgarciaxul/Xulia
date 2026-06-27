'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon, ICONS } from '@/components/ui/Icon'
import { cn } from '@/lib/utils'

type IconName = keyof typeof ICONS

interface Prompt {
  title: string
  description: string
  content: string
}

interface Category {
  id: string
  label: string
  icon: IconName
  color: string
  prompts: Prompt[]
}

const CATEGORIES: Category[] = [
  {
    id: 'marketing',
    label: 'Marketing',
    icon: 'megaphone',
    color: 'violet',
    prompts: [
      {
        title: 'Estrategia de contenido mensual',
        description: 'Plan editorial completo para un mes',
        content: `Actúa como un estratega de marketing digital senior. Crea un plan de contenido para [MARCA] durante el mes de [MES].

Incluye:
- Objetivo principal del mes
- 3-4 pilares de contenido
- Calendario semanal con temas
- Formatos recomendados por canal (Instagram, LinkedIn, X, TikTok)
- KPIs a medir

Sector: [SECTOR]
Público objetivo: [DESCRIPCIÓN DEL PÚBLICO]
Tono de comunicación: [FORMAL / CERCANO / INSPIRADOR]`,
      },
      {
        title: 'Análisis de competencia',
        description: 'Benchmarking de competidores en digital',
        content: `Realiza un análisis de competencia digital para [EMPRESA] en el sector [SECTOR].

Analiza los siguientes competidores: [COMPETIDOR 1], [COMPETIDOR 2], [COMPETIDOR 3]

Para cada uno evalúa:
1. Presencia en redes sociales (frecuencia, formatos, engagement)
2. Posicionamiento de marca y mensajes clave
3. Estrategia de contenido aparente
4. Puntos fuertes y débiles
5. Oportunidades que no están aprovechando

Finaliza con 5 recomendaciones concretas para diferenciarnos.`,
      },
      {
        title: 'Brief de campaña',
        description: 'Documento de briefing para una campaña',
        content: `Redacta un brief de campaña para [NOMBRE DE LA CAMPAÑA].

Completa estas secciones:
- **Contexto**: situación actual de la marca/producto
- **Objetivo**: qué queremos conseguir (específico y medible)
- **Público objetivo**: a quién nos dirigimos (demográfico + psicográfico)
- **Mensaje clave**: una sola frase que resume la campaña
- **Canales**: dónde vamos a estar presentes
- **Presupuesto estimado**: [PRESUPUESTO]
- **Timeline**: fechas clave
- **KPIs de éxito**: cómo mediremos el resultado

Producto/servicio: [DESCRIPCIÓN]`,
      },
      {
        title: 'Informe de resultados',
        description: 'Resumen ejecutivo de métricas para cliente',
        content: `Redacta un informe de resultados de marketing digital para [CLIENTE] correspondiente a [PERIODO].

Estructura:
1. **Resumen ejecutivo** (3 líneas máximo)
2. **Resultados por canal**: alcance, impresiones, clics, conversiones
3. **Comparativa con periodo anterior** y con objetivos marcados
4. **Top 3 contenidos** con mejor rendimiento y análisis del porqué
5. **Aprendizajes clave**
6. **Recomendaciones para el próximo mes**

Datos disponibles: [PEGA AQUÍ LAS MÉTRICAS]
Tono: profesional pero accesible para el cliente`,
      },
    ],
  },
  {
    id: 'rrss',
    label: 'Redes Sociales',
    icon: 'smartphone',
    color: 'blue',
    prompts: [
      {
        title: 'Pack de posts Instagram',
        description: '5 publicaciones listas para programar',
        content: `Crea 5 posts para Instagram de [MARCA] sobre el tema: [TEMA].

Para cada post incluye:
- **Caption** (máx. 150 palabras, empieza con un hook potente)
- **Hashtags** (mezcla de 5 masivos + 5 nicho + 3 de marca)
- **CTA** claro al final
- **Formato sugerido** (carrusel / reels / estático)
- **Descripción visual** de qué mostrar

Tono: [TONO]
Sector: [SECTOR]
Público: [DESCRIPCIÓN]`,
      },
      {
        title: 'Hilo de LinkedIn',
        description: 'Contenido de autoridad para LinkedIn',
        content: `Escribe un hilo de LinkedIn de [NOMBRE/EMPRESA] sobre [TEMA].

Estructura:
- **Tweet 1**: hook que genere curiosidad o polémica (máx. 2 líneas)
- **Tweets 2-7**: desarrollo del tema con datos, ejemplos o pasos concretos
- **Tweet final**: reflexión + pregunta para generar comentarios

Reglas:
- Frases cortas, párrafos de máx. 3 líneas
- Un emoji por punto clave (sin exceso)
- Lenguaje directo, sin jerga corporativa
- Incluye al menos 1 estadística o dato real

Objetivo del hilo: [POSICIONAMIENTO / VENTAS / EDUCACIÓN / VISIBILIDAD]`,
      },
      {
        title: 'Script para Reels / TikTok',
        description: 'Guión de vídeo corto de 30-60 segundos',
        content: `Escribe un script para un Reel/TikTok de [MARCA] de 30-60 segundos sobre [TEMA].

Formato del script:
- **[0-3s] HOOK**: frase o acción que pare el scroll
- **[3-15s] PROBLEMA o CONTEXTO**: por qué esto importa
- **[15-45s] CONTENIDO PRINCIPAL**: tips / proceso / demostración
- **[45-60s] CTA**: qué debe hacer el espectador ahora

Incluye:
- Texto en pantalla (onscreen text) para cada momento
- Música/sonido sugerido
- Transiciones o efectos recomendados

Tono: [EDUCATIVO / ENTRETENIMIENTO / VIRAL / INSPIRADOR]`,
      },
      {
        title: 'Respuesta a comentarios negativos',
        description: 'Gestión de crisis en redes',
        content: `Redacta una respuesta profesional a este comentario negativo en redes sociales:

Comentario: "[PEGA EL COMENTARIO AQUÍ]"

La respuesta debe:
- Empezar agradeciendo el feedback
- Reconocer el problema sin admitir culpa si no la hay
- Ofrecer solución o siguiente paso concreto
- Derivar a canal privado si es necesario
- Mantener un tono empático y no defensivo
- Máximo 3-4 líneas

Contexto de la situación: [DESCRIBE QUÉ PASÓ]`,
      },
    ],
  },
  {
    id: 'licitaciones',
    label: 'Licitaciones',
    icon: 'clipboard',
    color: 'amber',
    prompts: [
      {
        title: 'Análisis de pliego',
        description: 'Extrae los requisitos clave de un concurso',
        content: `Analiza el siguiente pliego de condiciones y extrae la información más relevante para decidir si concursar.

Identifica y resume:
1. **Objeto del contrato** (qué se pide exactamente)
2. **Presupuesto base de licitación** y forma de pago
3. **Criterios de adjudicación** y ponderación de cada uno
4. **Requisitos de solvencia** técnica y económica
5. **Plazo de ejecución**
6. **Penalizaciones o condiciones especiales** relevantes
7. **Fecha límite de presentación**
8. **Riesgos detectados**
9. **Recomendación**: ¿Concursar? Sí / No / Condicional — justifica

[PEGA AQUÍ EL TEXTO DEL PLIEGO O SUS PUNTOS CLAVE]`,
      },
      {
        title: 'Memoria técnica',
        description: 'Redacción de la propuesta técnica',
        content: `Redacta la memoria técnica para el siguiente concurso público.

Concurso: [NOMBRE DEL CONCURSO]
Entidad convocante: [ORGANISMO]
Objeto: [DESCRIPCIÓN DEL SERVICIO/OBRA]

Estructura la memoria con:
1. **Entendimiento del proyecto**: demuestra que comprendemos las necesidades
2. **Metodología de trabajo**: cómo lo vamos a ejecutar fase a fase
3. **Equipo propuesto**: perfiles y dedicación
4. **Cronograma**: hitos y entregables
5. **Valor añadido**: qué nos diferencia de otras ofertas
6. **Experiencia relevante**: proyectos similares realizados

Criterios técnicos que se valoran: [LISTA LOS CRITERIOS DEL PLIEGO]
Puntuación máxima técnica: [PUNTOS]

Tono: técnico, riguroso, con evidencias concretas.`,
      },
      {
        title: 'Carta de presentación',
        description: 'Presentación corporativa para la licitación',
        content: `Redacta una carta de presentación para acompañar la oferta al concurso [NOMBRE].

La carta debe:
- Presentar brevemente la empresa y su trayectoria relevante
- Demostrar conocimiento del proyecto y del organismo convocante
- Destacar los 3 puntos fuertes de nuestra propuesta
- Expresar compromiso con los objetivos del contrato
- Extensión: máximo 1 página

Datos de nuestra empresa:
- Nombre: [EMPRESA]
- Años de experiencia: [AÑOS]
- Especialización: [ÁREA]
- Proyectos similares destacados: [PROYECTOS]`,
      },
      {
        title: 'Resumen ejecutivo de oferta',
        description: 'Síntesis de la propuesta para decisores',
        content: `Escribe un resumen ejecutivo de nuestra oferta para [CONCURSO].

Máximo 1 página. Debe responder a:
- **¿Quiénes somos?** (2 líneas)
- **¿Qué proponemos?** Solución concreta al problema planteado
- **¿Cómo lo haremos?** Metodología en 3-4 puntos
- **¿Qué resultados garantizamos?** KPIs y compromisos medibles
- **¿Por qué nosotros?** Diferenciación respecto a competidores

Propuesta económica: [IMPORTE]
Plazo: [PLAZO]

Tono: directo, orientado a resultados, sin tecnicismos innecesarios.`,
      },
    ],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación',
    icon: 'globe',
    color: 'green',
    prompts: [
      {
        title: 'Nota de prensa',
        description: 'Comunicado oficial para medios',
        content: `Redacta una nota de prensa sobre [TEMA/ACONTECIMIENTO].

Estructura periodística:
- **Titular**: directo, con el hecho más relevante (máx. 10 palabras)
- **Subtítulo**: amplía el titular con contexto
- **Lead** (1er párrafo): quién, qué, cuándo, dónde, por qué
- **Cuerpo** (2-3 párrafos): desarrollo, datos, contexto
- **Cita**: frase atribuible a [PORTAVOZ, CARGO]
- **Boilerplate**: descripción estándar de [EMPRESA/INSTITUCIÓN]
- **Contacto de prensa**: [NOMBRE, EMAIL, TELÉFONO]

Fecha: [FECHA]
Embargo hasta: [FECHA O "Sin embargo"]`,
      },
      {
        title: 'Comunicado interno',
        description: 'Mensaje para empleados o equipo',
        content: `Redacta un comunicado interno para informar a los empleados sobre [TEMA].

El mensaje debe:
- Empezar con el contexto o motivo de la comunicación
- Explicar qué cambia, qué se decide o qué ocurre
- Responder a las preguntas que surgirán: ¿me afecta? ¿cuándo? ¿qué debo hacer?
- Indicar a quién dirigirse para dudas
- Terminar con un mensaje positivo o de agradecimiento

Remitente: [NOMBRE, CARGO]
Destinatarios: [TODO EL EQUIPO / DEPARTAMENTO X]
Tono: [FORMAL / CERCANO]
Extensión: máximo 300 palabras`,
      },
      {
        title: 'Speech o discurso',
        description: 'Intervención oral para evento o acto',
        content: `Escribe un discurso para [NOMBRE] que intervendrá como [ROL] en [EVENTO].

Duración: [MINUTOS] minutos (aprox. 130 palabras/minuto)
Audiencia: [DESCRIPCIÓN DEL PÚBLICO]

Estructura:
1. **Apertura**: saludo protocolario + frase de impacto inicial
2. **Contexto**: por qué estamos aquí, qué celebramos o abordamos
3. **Cuerpo**: 3 ideas principales con ejemplos o anécdotas
4. **Emoción**: momento de conexión humana (historia personal o reconocimiento)
5. **Cierre**: llamada a la acción o frase memorable

Mensajes clave que deben aparecer: [LISTA]
Menciones obligatorias: [PERSONAS / INSTITUCIONES / PATROCINADORES]
Tono: [SOLEMNE / MOTIVADOR / CELEBRATORIO / INFORMATIVO]`,
      },
      {
        title: 'FAQ para medios',
        description: 'Preguntas y respuestas ante la prensa',
        content: `Prepara un documento de Q&A (preguntas y respuestas) para que nuestros portavoces afronten entrevistas sobre [TEMA].

Incluye:
- 10 preguntas probables que harán los periodistas
- Respuesta oficial para cada una (máx. 3 líneas por respuesta)
- 3 preguntas incómodas o críticas con respuesta de gestión
- Frases a evitar y alternativas correctas
- Datos y cifras clave para citar con precisión

Contexto del tema: [DESCRIBE LA SITUACIÓN]
Posición oficial de la organización: [NUESTRA POSTURA]`,
      },
    ],
  },
  {
    id: 'eventos',
    label: 'Eventos',
    icon: 'calendar',
    color: 'rose',
    prompts: [
      {
        title: 'Plan de producción de evento',
        description: 'Checklist completo de organización',
        content: `Crea un plan de producción detallado para el siguiente evento:

Tipo de evento: [CONFERENCIA / RUEDA DE PRENSA / GALA / FERIA / WEBINAR]
Fecha: [FECHA]
Lugar: [LUGAR O PLATAFORMA]
Aforo esperado: [NÚMERO]
Presupuesto: [IMPORTE]

Incluye:
1. **Timeline de preparación** (semanas previas al evento)
2. **Checklist de producción** por áreas: audiovisual, catering, acreditaciones, comunicación, logística
3. **Equipo necesario** y sus responsabilidades
4. **Plan de contingencia** ante imprevistos
5. **Checklist día del evento** (mañana / tarde / cierre)
6. **Acciones post-evento**: seguimiento y métricas`,
      },
      {
        title: 'Programa de acto oficial',
        description: 'Orden del día y minutado del evento',
        content: `Redacta el programa oficial y el minutado del siguiente acto:

Nombre del acto: [NOMBRE]
Fecha y hora de inicio: [FECHA HORA]
Duración total: [HORAS]
Sede: [LUGAR]

Elabora:
- **Programa público** (versión para asistentes): orden del día con horarios
- **Minutado interno** (versión para equipo): con 15 minutos de margen entre actos, indicaciones técnicas y responsables de cada momento
- **Orden de intervenciones** y tiempo asignado a cada ponente/autoridad
- **Protocolo de bienvenida y despedida**

Participantes confirmados: [LISTA DE PONENTES / AUTORIDADES]`,
      },
      {
        title: 'Email de convocatoria',
        description: 'Invitación formal a un evento',
        content: `Redacta el email de invitación para [TIPO DE EVENTO] dirigido a [TIPO DE INVITADOS].

El email debe incluir:
- **Asunto** atractivo que genere apertura
- **Saludo personalizado**
- **Propuesta de valor**: por qué deben asistir, qué van a obtener
- **Datos del evento**: fecha, hora, lugar/enlace, duración
- **Programa resumido** en 3-4 puntos
- **CTA claro**: botón o enlace de confirmación/registro
- **Firma** con datos de contacto

Nombre del evento: [NOMBRE]
Fecha: [FECHA]
Plazo de confirmación: [FECHA]
Cupo: [LIMITADO / ABIERTO]`,
      },
      {
        title: 'Memoria del evento',
        description: 'Informe post-evento para cliente o dirección',
        content: `Redacta una memoria del evento [NOMBRE DEL EVENTO] celebrado el [FECHA].

Secciones:
1. **Resumen ejecutivo**: 3 líneas con lo más destacado
2. **Datos del evento**: asistencia, aforo, duración
3. **Desarrollo del acto**: resumen cronológico de lo ocurrido
4. **Highlights y momentos clave**
5. **Cobertura mediática**: medios presentes, publicaciones, alcance
6. **Redes sociales**: métricas de impacto en el hashtag y publicaciones
7. **Incidencias y cómo se gestionaron**
8. **Valoración general y aprendizajes**
9. **Recomendaciones para próximas ediciones**

Datos disponibles: [PEGA AQUÍ LOS DATOS QUE TENGAS]`,
      },
    ],
  },
  {
    id: 'desarrollo-web',
    label: 'Desarrollo Web',
    icon: 'code',
    color: 'cyan',
    prompts: [
      {
        title: 'Brief técnico de proyecto web',
        description: 'Documento de requisitos para desarrollo',
        content: `Redacta un brief técnico para el desarrollo de [TIPO DE PROYECTO WEB].

Cliente: [NOMBRE]
Objetivo del proyecto: [QUÉ NECESITA RESOLVER]

Incluye:
1. **Descripción del proyecto** y contexto de negocio
2. **Funcionalidades requeridas** (must have / nice to have)
3. **Stack tecnológico sugerido** y justificación
4. **Integraciones** con sistemas existentes: [LISTA]
5. **Requisitos de rendimiento**: velocidad, SEO, accesibilidad
6. **Requisitos de seguridad y RGPD**
7. **Estimación de fases y plazos**
8. **Criterios de aceptación** (cómo sabemos que está terminado)

Presupuesto disponible: [RANGO]
Fecha límite de entrega: [FECHA]`,
      },
      {
        title: 'Revisión de código (Code Review)',
        description: 'Análisis técnico de código existente',
        content: `Realiza una revisión de código del siguiente fragmento. Analiza:

1. **Errores o bugs** potenciales
2. **Seguridad**: vulnerabilidades (XSS, SQL injection, etc.)
3. **Rendimiento**: cuellos de botella o ineficiencias
4. **Legibilidad y mantenibilidad**: naming, estructura, comentarios
5. **Buenas prácticas** del lenguaje/framework
6. **Sugerencias de mejora** con código alternativo

Para cada punto indica: severidad (crítico / importante / menor) y propón la solución.

[PEGA AQUÍ EL CÓDIGO A REVISAR]

Lenguaje/Framework: [TECNOLOGÍA]
Contexto: [PARA QUÉ SIRVE ESTE CÓDIGO]`,
      },
      {
        title: 'Documentación técnica',
        description: 'README o documentación de proyecto',
        content: `Genera la documentación técnica para [NOMBRE DEL PROYECTO].

Crea un README completo con:
- **Descripción** del proyecto (qué hace y para quién)
- **Tecnologías** utilizadas con versiones
- **Requisitos previos** para ejecutar el proyecto
- **Instalación** paso a paso
- **Variables de entorno** necesarias (.env.example)
- **Cómo ejecutar** en desarrollo y producción
- **Estructura de carpetas** explicada
- **Endpoints principales** (si es una API)
- **Cómo contribuir**
- **Licencia**

Información del proyecto: [DESCRIBE EL PROYECTO Y SU STACK]`,
      },
      {
        title: 'Estimación de proyecto',
        description: 'Cálculo de tiempos y presupuesto',
        content: `Ayúdame a estimar el tiempo y coste de desarrollo del siguiente proyecto:

[DESCRIPCIÓN DETALLADA DEL PROYECTO]

Para cada funcionalidad, proporciona:
- Estimación en horas (optimista / realista / pesimista)
- Nivel de complejidad (baja / media / alta)
- Dependencias con otras partes

Al final incluye:
- **Total de horas estimadas** con margen del 20%
- **Fases del proyecto** y su duración
- **Riesgos** que pueden aumentar el tiempo
- **Presupuesto estimado** a [TARIFA €/HORA]

Asume un equipo de: [PERFIL Y NÚMERO DE PERSONAS]`,
      },
    ],
  },
  {
    id: 'imagenes',
    label: 'Crear Imágenes',
    icon: 'layout',
    color: 'purple',
    prompts: [
      {
        title: 'Prompt para imagen publicitaria',
        description: 'Prompt optimizado para Midjourney / DALL-E / Flux',
        content: `Genera un prompt optimizado para crear una imagen publicitaria con IA (Midjourney, DALL-E 3 o Flux).

Concepto de la imagen: [DESCRIBE LA IDEA]
Marca/sector: [EMPRESA / SECTOR]
Uso: [RED SOCIAL / WEB / CARTEL / EMAIL]

El prompt debe incluir:
- Descripción del sujeto principal y composición
- Estilo visual: [FOTOGRAFÍA REAL / ILUSTRACIÓN / 3D / MINIMALISTA]
- Paleta de colores: [COLORES DE MARCA O MOOD]
- Iluminación y atmósfera
- Parámetros técnicos: relación de aspecto, calidad
- Palabras clave de estilo (cinematic, editorial, commercial, etc.)
- Elementos a excluir (negative prompt)

Genera el prompt en inglés, listo para copiar y pegar.`,
      },
      {
        title: 'Pack de prompts para campaña',
        description: 'Serie de imágenes con coherencia visual',
        content: `Crea una serie de 5 prompts de imagen para una campaña visual coherente de [MARCA].

Concepto de campaña: [DESCRIBE EL CONCEPTO]
Plataforma: [INSTAGRAM / WEB / OUTDOOR]

Para cada imagen del pack:
- Número y descripción del momento/ángulo
- Prompt completo en inglés (listo para usar)
- Variación de composición respecto a las demás
- Elementos de marca que deben aparecer

Mantén coherencia en:
- Estilo visual y tratamiento de color
- Iluminación y mood
- Tipografía y elementos gráficos si aplica

Formato de aspecto: [1:1 / 4:5 / 16:9 / 9:16]`,
      },
      {
        title: 'Avatar / retrato profesional IA',
        description: 'Prompt para foto de perfil o equipo',
        content: `Genera un prompt para crear un retrato profesional realista con IA para [USO: perfil LinkedIn / página de equipo / prensa].

Descripción de la persona: [GÉNERO, EDAD APROXIMADA, RASGOS GENERALES]
Entorno/fondo: [OFICINA / FONDO NEUTRO / EXTERIOR URBANO]
Vestimenta: [TIPO DE ROPA]
Expresión: [PROFESIONAL Y CERCANA / SERIA / SONRIENTE]

El prompt debe especificar:
- Calidad fotográfica (lens, cámara, iluminación de estudio)
- Encuadre: busto / medio cuerpo
- Estilo: editorial photography, professional headshot
- Post-procesado: clean, sharp, high detail
- Negative prompt: distortions, extra fingers, artifacts

Genera el prompt en inglés optimizado para DALL-E 3 o Midjourney v6.`,
      },
    ],
  },
  {
    id: 'videos',
    label: 'Crear Vídeos',
    icon: 'zap',
    color: 'orange',
    prompts: [
      {
        title: 'Guión para vídeo corporativo',
        description: 'Vídeo de presentación de empresa o servicio',
        content: `Escribe el guión para un vídeo corporativo de [EMPRESA] de [DURACIÓN] minutos.

Objetivo del vídeo: [PRESENTACIÓN DE EMPRESA / LANZAMIENTO PRODUCTO / TESTIMONIOS / FORMACIÓN]
Audiencia: [CLIENTES POTENCIALES / EMPLEADOS / INVERSORES]

Estructura el guión con:
- **INTRO** (0-15s): gancho visual + tagline
- **PROBLEMA** (15-30s): el dolor o necesidad del cliente
- **SOLUCIÓN** (30-90s): cómo lo resolvemos, qué hacemos
- **PRUEBA SOCIAL** (90-120s): datos, clientes, logros
- **CTA** (últimos 15s): próximo paso claro

Para cada escena incluye:
- Texto narrado (voz en off o a cámara)
- Descripción de lo que se ve en pantalla
- Texto en pantalla sugerido
- Música o sonido recomendado`,
      },
      {
        title: 'Prompt para vídeo IA (Sora / Runway / Kling)',
        description: 'Prompt optimizado para generadores de vídeo',
        content: `Crea un prompt optimizado para generar un vídeo con IA (Sora, Runway Gen-3, Kling, Pika).

Concepto del vídeo: [DESCRIBE LA ESCENA O ACCIÓN]
Duración: [SEGUNDOS]
Uso: [REDES SOCIALES / WEB / PRESENTACIÓN]

El prompt debe especificar:
- **Escena**: descripción detallada de lo que ocurre
- **Movimiento de cámara**: estático / travelling / zoom in / drone shot
- **Estilo visual**: cinematográfico / publicitario / documental / animación
- **Iluminación y hora del día**
- **Ritmo y velocidad**: lento y contemplativo / dinámico y rápido
- **Mood y atmósfera**
- **Elementos que NO deben aparecer**

Genera el prompt en inglés, listo para usar directamente en la herramienta.`,
      },
      {
        title: 'Storyboard para reel',
        description: 'Planificación visual escena por escena',
        content: `Crea un storyboard detallado para un Reel/TikTok de [MARCA] de [DURACIÓN] segundos.

Tema: [TEMA DEL VÍDEO]
Objetivo: [ENTRETENIMIENTO / EDUCACIÓN / VENTAS / BRANDING]

Para cada escena (mínimo 6):
- **Tiempo**: inicio y fin en segundos
- **Plano**: tipo de encuadre (primerísimo plano, plano medio, plano general, etc.)
- **Acción**: qué ocurre en pantalla
- **Audio**: música, voz en off, sonido ambiente o silencio
- **Texto en pantalla**: copy y posición
- **Transición**: corte / fundido / efecto

Incluye también:
- Música o sonido tendencia recomendado
- Ratio de aspecto: 9:16 (vertical)
- Indicaciones de edición para el montador`,
      },
    ],
  },
  {
    id: 'fondos',
    label: 'Fondos Europeos',
    icon: 'award',
    color: 'indigo',
    prompts: [
      {
        title: 'Análisis de convocatoria europea',
        description: 'Evaluación de elegibilidad y oportunidad',
        content: `Analiza la siguiente convocatoria de fondos europeos y determina si somos elegibles y si debemos presentarnos.

[PEGA AQUÍ EL RESUMEN O TEXTO DE LA CONVOCATORIA]

Evalúa:
1. **Elegibilidad**: tipo de entidad beneficiaria, requisitos mínimos
2. **Objetivos y prioridades**: qué tipo de proyectos financia
3. **Presupuesto y cofinanciación**: importes mínimos/máximos, % subvencionable
4. **Criterios de valoración** y su peso
5. **Documentación requerida** y plazos
6. **Nivel de competencia** estimado
7. **Recomendación final**: Presentar / No presentar / Presentar en consorcio

Perfil de nuestra entidad: [TIPO, SECTOR, TAMAÑO, EXPERIENCIA PREVIA EN FONDOS]`,
      },
      {
        title: 'Resumen ejecutivo de proyecto europeo',
        description: 'Executive summary para solicitud de fondos',
        content: `Redacta el resumen ejecutivo de nuestro proyecto para la solicitud de [NOMBRE DEL PROGRAMA/CONVOCATORIA].

El resumen debe incluir (máx. 500 palabras):
- **Título del proyecto** y acrónimo si procede
- **Problema o necesidad** que aborda
- **Objetivos específicos** (3-5 medibles)
- **Metodología e innovación** del enfoque
- **Resultados esperados** e impacto
- **Consorcio**: socios y roles (si aplica)
- **Presupuesto total** y fondos solicitados
- **Duración** del proyecto

Información del proyecto:
- Área temática: [ÁREA]
- Programa: [HORIZONTE EUROPA / INTERREG / FEDER / FSE / OTRO]
- Línea específica: [LÍNEA]`,
      },
    ],
  },
]

const COLOR_CLASSES: Record<string, { bg: string; text: string; badge: string; hover: string; active: string }> = {
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', badge: 'bg-violet-100 text-violet-700', hover: 'hover:border-violet-300 hover:bg-violet-50', active: 'border-violet-400 bg-violet-50' },
  blue:   { bg: 'bg-blue-100',   text: 'text-blue-600',   badge: 'bg-blue-100 text-blue-700',   hover: 'hover:border-blue-300 hover:bg-blue-50',   active: 'border-blue-400 bg-blue-50' },
  amber:  { bg: 'bg-amber-100',  text: 'text-amber-600',  badge: 'bg-amber-100 text-amber-700',  hover: 'hover:border-amber-300 hover:bg-amber-50',  active: 'border-amber-400 bg-amber-50' },
  green:  { bg: 'bg-emerald-100',text: 'text-emerald-600',badge: 'bg-emerald-100 text-emerald-700',hover: 'hover:border-emerald-300 hover:bg-emerald-50',active: 'border-emerald-400 bg-emerald-50' },
  rose:   { bg: 'bg-rose-100',   text: 'text-rose-600',   badge: 'bg-rose-100 text-rose-700',   hover: 'hover:border-rose-300 hover:bg-rose-50',   active: 'border-rose-400 bg-rose-50' },
  cyan:   { bg: 'bg-cyan-100',   text: 'text-cyan-600',   badge: 'bg-cyan-100 text-cyan-700',   hover: 'hover:border-cyan-300 hover:bg-cyan-50',   active: 'border-cyan-400 bg-cyan-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700',hover: 'hover:border-purple-300 hover:bg-purple-50',active: 'border-purple-400 bg-purple-50' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700',hover: 'hover:border-orange-300 hover:bg-orange-50',active: 'border-orange-400 bg-orange-50' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700',hover: 'hover:border-indigo-300 hover:bg-indigo-50',active: 'border-indigo-400 bg-indigo-50' },
}

const GUIDE_SECTIONS = [
  {
    title: '¿Qué es un prompt?',
    icon: '💡',
    content: 'Un prompt es la instrucción que le das a la IA. Cuanto más claro y detallado sea, mejor será la respuesta. La IA no adivina tu intención — debes explicarla.',
  },
  {
    title: 'Estructura básica',
    icon: '🏗️',
    blocks: [
      { label: 'ROL', desc: 'Dile a la IA quién debe ser', example: '"Actúa como un director de marketing con 10 años de experiencia"' },
      { label: 'TAREA', desc: 'Qué debe hacer exactamente', example: '"Redacta un email de presentación para un nuevo cliente"' },
      { label: 'CONTEXTO', desc: 'Información relevante del caso', example: '"La empresa es una agencia de comunicación especializada en sector público"' },
      { label: 'FORMATO', desc: 'Cómo quieres la respuesta', example: '"En bullet points, máximo 200 palabras, tono formal"' },
    ],
  },
  {
    title: 'Técnicas avanzadas',
    icon: '⚡',
    tips: [
      { name: 'Few-shot', desc: 'Da ejemplos de lo que quieres: "Escríbelo así como este ejemplo: [ejemplo]"' },
      { name: 'Chain of thought', desc: 'Pide que razone paso a paso: "Piensa paso a paso antes de responder"' },
      { name: 'Restricciones', desc: 'Define lo que NO quieres: "Sin tecnicismos, sin introducción, sin conclusión"' },
      { name: 'Variables', desc: 'Usa [CORCHETES] para marcar lo que debes personalizar en cada uso' },
      { name: 'Iteración', desc: 'Si no es perfecto, refina: "Hazlo más corto / más formal / enfocado en X"' },
    ],
  },
  {
    title: 'Errores comunes',
    icon: '🚫',
    errors: [
      { bad: 'Escribe un email', good: 'Escribe un email de seguimiento post-reunión para [CLIENTE], recordando los 3 puntos acordados y proponiendo fecha para la siguiente llamada' },
      { bad: 'Analiza esto', good: 'Analiza el siguiente texto e identifica: tono, público objetivo, 3 puntos fuertes y 2 áreas de mejora' },
      { bad: 'Dame ideas', good: 'Dame 10 ideas de contenido para LinkedIn de una agencia de comunicación, enfocadas en generar leads B2B, en formato de lista numerada' },
    ],
  },
  {
    title: 'Fórmula ganadora',
    icon: '🏆',
    formula: '"Actúa como [ROL EXPERTO]. Tu tarea es [QUÉ HACER] para [PARA QUIÉN/QUÉ]. Ten en cuenta que [CONTEXTO CLAVE]. El resultado debe ser [FORMATO + EXTENSIÓN + TONO]."',
  },
]

export default function PromptsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [showGuide, setShowGuide] = useState(false)
  const router = useRouter()

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleUseInHub = (content: string) => {
    sessionStorage.setItem('xulia_draft_prompt', content)
    router.push('/hub')
  }

  const filteredCategories = CATEGORIES
    .filter(c => activeCategory === 'all' || c.id === activeCategory)
    .map(c => ({
      ...c,
      prompts: c.prompts.filter(p =>
        !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(c => c.prompts.length > 0)

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar de categorías */}
      <aside className="w-52 shrink-0 border-r border-[#e5e5ea] bg-white flex flex-col py-4 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Categorías</p>
        <button
          onClick={() => { setShowGuide(true); setActiveCategory('') }}
          className={cn(
            'flex items-center gap-2.5 px-4 py-2 text-sm transition-colors w-full text-left',
            showGuide ? 'text-violet-700 font-medium bg-violet-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', showGuide ? 'bg-violet-100' : 'bg-gray-100')}>
            <Icon name="lightbulb" size={13} className={showGuide ? 'text-violet-600' : 'text-gray-400'} />
          </div>
          Cómo escribir prompts
        </button>

        <div className="border-t border-[#f0f0f0] my-2 mx-4" />

        <button
          onClick={() => { setActiveCategory('all'); setShowGuide(false) }}
          className={cn(
            'flex items-center gap-2.5 px-4 py-2 text-sm transition-colors w-full text-left',
            !showGuide && activeCategory === 'all' ? 'text-violet-700 font-medium bg-violet-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          )}
        >
          <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', !showGuide && activeCategory === 'all' ? 'bg-violet-100' : 'bg-gray-100')}>
            <Icon name="layout" size={13} className={!showGuide && activeCategory === 'all' ? 'text-violet-600' : 'text-gray-400'} />
          </div>
          Todos
          <span className="ml-auto text-xs text-gray-400">{CATEGORIES.reduce((s, c) => s + c.prompts.length, 0)}</span>
        </button>
        {CATEGORIES.map(cat => {
          const colors = COLOR_CLASSES[cat.color]
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'flex items-center gap-2.5 px-4 py-2 text-sm transition-colors w-full text-left',
                isActive ? `${colors.text} font-medium` : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                isActive && 'bg-gray-50'
              )}
            >
              <div className={cn('w-6 h-6 rounded-md flex items-center justify-center', isActive ? colors.bg : 'bg-gray-100')}>
                <Icon name={cat.icon} size={13} className={isActive ? colors.text : 'text-gray-400'} />
              </div>
              {cat.label}
              <span className="ml-auto text-xs text-gray-400">{cat.prompts.length}</span>
            </button>
          )
        })}
      </aside>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto bg-[#f4f4f6]">
        <div className="p-6">

          {/* GUÍA */}
          {showGuide && (
            <div className="max-w-3xl mx-auto space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cómo escribir un buen prompt</h1>
                <p className="text-gray-400 text-sm mt-1">Guía práctica para sacar el máximo partido a la IA</p>
              </div>

              {GUIDE_SECTIONS.map(section => (
                <div key={section.title} className="bg-white border border-[#e5e5ea] rounded-2xl p-6">
                  <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>{section.icon}</span> {section.title}
                  </h2>

                  {'content' in section && (
                    <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                  )}

                  {'blocks' in section && (
                    <div className="grid grid-cols-2 gap-3">
                      {section.blocks!.map(b => (
                        <div key={b.label} className="bg-gray-50 rounded-xl p-4 border border-[#f0f0f0]">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">{b.label}</span>
                          <p className="text-sm font-medium text-gray-800 mt-2">{b.desc}</p>
                          <p className="text-xs text-gray-400 mt-1 italic">{b.example}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {'tips' in section && (
                    <div className="space-y-3">
                      {section.tips!.map(t => (
                        <div key={t.name} className="flex gap-3">
                          <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg shrink-0 h-fit">{t.name}</span>
                          <p className="text-sm text-gray-600">{t.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {'errors' in section && (
                    <div className="space-y-3">
                      {section.errors!.map((e, i) => (
                        <div key={i} className="grid grid-cols-2 gap-3">
                          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-rose-500 mb-1">✗ VAGO</p>
                            <p className="text-xs text-rose-700">{e.bad}</p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                            <p className="text-[10px] font-bold text-emerald-600 mb-1">✓ PRECISO</p>
                            <p className="text-xs text-emerald-700">{e.good}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {'formula' in section && (
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
                      <p className="text-sm text-violet-800 font-medium leading-relaxed italic">{section.formula}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* BIBLIOTECA */}
          {!showGuide && <>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Biblioteca de Prompts</h1>
              <p className="text-gray-400 text-sm mt-1">Plantillas listas para usar en tus conversaciones</p>
            </div>
            <div className="relative">
              <Icon name="search" size={14} className="text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar prompts..."
                className="pl-8 pr-3 py-2 text-sm border border-[#e5e5ea] rounded-lg bg-white focus:outline-none focus:border-violet-300 w-52"
              />
            </div>
          </div>

          {/* Categorías + prompts */}
          <div className="space-y-8">
            {filteredCategories.map(cat => {
              const colors = COLOR_CLASSES[cat.color]
              return (
                <div key={cat.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center', colors.bg)}>
                      <Icon name={cat.icon} size={15} className={colors.text} />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-800">{cat.label}</h2>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', colors.badge)}>{cat.prompts.length} prompts</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {cat.prompts.map((prompt, i) => {
                      const id = `${cat.id}-${i}`
                      const isExpanded = expandedId === id
                      const isCopied = copiedId === id

                      return (
                        <div
                          key={id}
                          className={cn(
                            'bg-white border rounded-xl transition-all overflow-hidden',
                            isExpanded ? `border-gray-300 shadow-sm` : `border-[#e5e5ea] ${colors.hover}`
                          )}
                        >
                          {/* Card header */}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : id)}
                            className="w-full flex items-start gap-3 p-4 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900">{prompt.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{prompt.description}</p>
                            </div>
                            <Icon
                              name="send"
                              size={14}
                              className={cn('shrink-0 mt-0.5 transition-transform', isExpanded ? 'rotate-90 text-gray-400' : 'text-gray-300')}
                            />
                          </button>

                          {/* Expanded content */}
                          {isExpanded && (
                            <div className="border-t border-[#f0f0f0]">
                              <pre className="text-xs text-gray-600 leading-relaxed p-4 whitespace-pre-wrap font-sans bg-gray-50">
                                {prompt.content}
                              </pre>
                              <div className="flex items-center gap-2 px-4 py-3 border-t border-[#f0f0f0]">
                                <button
                                  onClick={() => handleCopy(id, prompt.content)}
                                  className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                                    isCopied
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                  )}
                                >
                                  <Icon name={isCopied ? 'award' : 'file-text'} size={13} />
                                  {isCopied ? '¡Copiado!' : 'Copiar'}
                                </button>
                                <button
                                  onClick={() => handleUseInHub(prompt.content)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 hover:bg-gray-700 text-white transition-colors"
                                >
                                  <Icon name="chat" size={13} />
                                  Usar en Hub
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}

            {filteredCategories.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Icon name="search" size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No se encontraron prompts para "{search}"</p>
              </div>
            )}
          </div>
          </>}
        </div>
      </div>
    </div>
  )
}
