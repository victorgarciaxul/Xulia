'use client'

import { useState } from 'react'
import { Icon } from '@/components/ui/Icon'

interface Step {
  title: string
  description: string
  tool?: string
}

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Fácil' | 'Medio' | 'Avanzado'
  time: string
  tools: string[]
  saves: string
  steps: Step[]
  prompt?: string
}

const CATEGORIES = ['Todos', 'Informes', 'Contenido', 'Clientes', 'Comunicación', 'Licitaciones', 'Interno']

const TEMPLATES: Template[] = [
  {
    id: 'informe-semanal',
    title: 'Informe semanal de métricas automático',
    description: 'Cada lunes extrae datos de Analytics y redes sociales, genera el resumen con IA y lo envía al cliente por email.',
    category: 'Informes',
    difficulty: 'Medio',
    time: '2-3 horas',
    saves: '4h/semana',
    tools: ['Make / n8n', 'Google Analytics', 'Meta API', 'Gmail', 'XULIA AI'],
    steps: [
      { title: 'Trigger: cada lunes a las 8:00', description: 'Configura un trigger de tipo "Scheduled" en Make / n8n que se active todos los lunes a las 8:00.', tool: 'Make / n8n' },
      { title: 'Obtener datos de Google Analytics', description: 'Conecta el módulo de Google Analytics 4. Filtra por las métricas clave: sesiones, usuarios, duración media, conversiones. Rango: últimos 7 días.', tool: 'Google Analytics' },
      { title: 'Obtener datos de Meta (Instagram/Facebook)', description: 'Usa el módulo de Meta Business Suite. Extrae: alcance, impresiones, interacciones y seguidores ganados de la semana.', tool: 'Meta API' },
      { title: 'Generar narrativa con IA', description: 'Envía los datos a XULIA con este prompt:\n\n"Eres el account manager de una agencia. Con estos datos de la semana [DATOS], redacta un informe ejecutivo de máximo 300 palabras para el cliente. Destaca los puntos positivos, señala lo que necesita mejora y sugiere una acción concreta para la siguiente semana. Tono profesional pero cercano."', tool: 'XULIA AI' },
      { title: 'Enviar email al cliente', description: 'Usa el módulo de Gmail. Destinatario: email del cliente (guárdalo como variable del escenario). Asunto: "Informe semanal [NOMBRE_CLIENTE] — semana del [FECHA]". Cuerpo: el texto generado por la IA.', tool: 'Gmail' },
      { title: 'Notificación interna en Slack', description: 'Opcional: envía una notificación al canal del cliente en Slack indicando que el informe ha sido enviado.', tool: 'Slack' },
    ],
    prompt: '"Eres el account manager de una agencia de comunicación. Con estos datos de la semana:\n\nWeb: [SESIONES] sesiones, [USUARIOS] usuarios únicos, [DURACION] min duración media\nInstagram: [ALCANCE] alcance, [INTERACCIONES] interacciones, [SEGUIDORES] nuevos seguidores\nFacebook: [ALCANCE_FB] alcance, [CLICS] clics\n\nRedacta un informe ejecutivo de máximo 300 palabras. Destaca los puntos positivos, señala lo que necesita mejora y sugiere una acción concreta. Tono profesional pero cercano."',
  },
  {
    id: 'contenido-multicanal',
    title: 'Distribución de contenido multicanal',
    description: 'Cuando publicas un artículo en el blog, la IA adapta automáticamente el contenido para Instagram, LinkedIn, newsletter y X.',
    category: 'Contenido',
    difficulty: 'Fácil',
    time: '1-2 horas',
    saves: '3h por publicación',
    tools: ['Make / n8n', 'RSS / Webhook', 'XULIA AI', 'Buffer / Hootsuite'],
    steps: [
      { title: 'Trigger: nuevo artículo publicado', description: 'Configura un módulo RSS Watch en Make / n8n apuntando al feed de tu blog. O usa un webhook si tu CMS lo soporta (WordPress, Webflow, etc.).', tool: 'Make / RSS' },
      { title: 'Extraer título y contenido', description: 'Usa el módulo de texto de Make / n8n para extraer: título del artículo, URL, primer párrafo (extracto). Estos serán el input para la IA.', tool: 'Make / n8n' },
      { title: 'Generar posts con IA', description: 'Envía a XULIA con el prompt de adaptación multicanal. Usa el modo "JSON output" para recibir todos los formatos en una sola llamada.', tool: 'XULIA AI' },
      { title: 'Programar en Buffer/Hootsuite', description: 'Conecta el módulo de Buffer. Crea una publicación para cada red social con el contenido generado. Programa con 2 horas de diferencia entre cada una.', tool: 'Buffer' },
      { title: 'Guardar en hoja de cálculo', description: 'Añade una fila en Google Sheets con: fecha, título, URL, y los textos generados para cada canal. Útil como archivo de contenido publicado.', tool: 'Google Sheets' },
    ],
    prompt: '"Tengo este artículo de blog:\nTítulo: [TÍTULO]\nExtracto: [EXTRACTO]\nURL: [URL]\n\nGenera el contenido para cada canal en formato JSON:\n{\n  instagram: string (150 palabras, emocional, 5 hashtags),\n  linkedin: string (200 palabras, profesional, sin hashtags, pregunta al final),\n  twitter: string (menos de 280 caracteres, directo, con URL),\n  newsletter: string (párrafo de introducción de 100 palabras para incluir en newsletter)\n}"',
  },
  {
    id: 'seguimiento-leads',
    title: 'Seguimiento automático de leads',
    description: 'Cuando alguien rellena el formulario de contacto de la web, recibe un email personalizado y se crea una tarea en el CRM.',
    category: 'Clientes',
    difficulty: 'Fácil',
    time: '1 hora',
    saves: '2h/semana',
    tools: ['Make / n8n', 'Typeform / Gravity Forms', 'XULIA AI', 'Gmail', 'HubSpot / Notion'],
    steps: [
      { title: 'Trigger: nuevo envío de formulario', description: 'Conecta Typeform, Gravity Forms o tu formulario web mediante webhook a Make / n8n. Captura: nombre, email, empresa, mensaje.', tool: 'Typeform' },
      { title: 'Clasificar el lead con IA', description: 'Envía el mensaje a XULIA para que clasifique: sector del cliente, tipo de servicio que busca, nivel de urgencia y tamaño estimado del cliente. Devuelve JSON.', tool: 'XULIA AI' },
      { title: 'Generar email de respuesta personalizado', description: 'Con la clasificación del lead, genera un email de respuesta personalizado. No genérico: menciona su empresa, el servicio que busca y propone una reunión concreta.', tool: 'XULIA AI' },
      { title: 'Enviar email de respuesta', description: 'Envía el email desde tu cuenta corporativa en menos de 5 minutos desde que se envió el formulario. La rapidez de respuesta aumenta la tasa de conversión x3.', tool: 'Gmail' },
      { title: 'Crear ficha en el CRM', description: 'Crea un contacto en HubSpot (o una fila en Notion/Airtable) con todos los datos del lead + la clasificación de la IA + la hora de contacto.', tool: 'HubSpot' },
      { title: 'Notificar al responsable comercial', description: 'Envía un mensaje de Slack o email interno al responsable con el resumen del lead y la clasificación de IA para que haga el seguimiento.', tool: 'Slack' },
    ],
  },
  {
    id: 'monitoreo-marca',
    title: 'Alerta de menciones de marca',
    description: 'Monitoriza en tiempo real las menciones de tu marca o cliente en medios digitales y recibe alertas con resumen IA.',
    category: 'Comunicación',
    difficulty: 'Medio',
    time: '2 horas',
    saves: '1h/día',
    tools: ['Make / n8n', 'Google Alerts / Mention', 'XULIA AI', 'Slack'],
    steps: [
      { title: 'Configurar fuentes de monitorización', description: 'Opción A (gratuita): configura Google Alerts para el nombre de la marca/cliente y recibe resultados por RSS.\nOpción B (de pago): usa Mention.com o Brand24 con integración directa en Make / n8n.', tool: 'Google Alerts' },
      { title: 'Trigger: nueva mención detectada', description: 'Conecta el feed RSS de alertas a Make / n8n con el módulo "RSS Watch". Se activa cada vez que aparece una nueva mención.', tool: 'Make / n8n' },
      { title: 'Analizar el tono con IA', description: 'Envía el texto de la mención a XULIA con este prompt: analiza el sentimiento (positivo/negativo/neutro), el contexto (noticia, opinión, queja, elogio) y el nivel de urgencia de respuesta (1-5).', tool: 'XULIA AI' },
      { title: 'Filtrar por relevancia', description: 'Usa un router en Make / n8n para separar: menciones urgentes (sentiment negativo + urgencia >3) → canal de crisis. Menciones positivas → canal de oportunidades. Neutras → resumen diario.', tool: 'Make / n8n' },
      { title: 'Enviar alerta a Slack', description: 'Para menciones urgentes: mensaje inmediato al canal #comunicacion con el link, el resumen y la clasificación de IA.\nPara el resto: un digest diario a las 9:00 con todas las menciones del día.', tool: 'Slack' },
    ],
  },
  {
    id: 'resumen-reuniones',
    title: 'Resumen automático de reuniones',
    description: 'Tras cada reunión, transcribe el audio, extrae los puntos clave y las tareas acordadas, y las envía al equipo por email.',
    category: 'Interno',
    difficulty: 'Fácil',
    time: '30 minutos',
    saves: '30 min/reunión',
    tools: ['Make / n8n', 'Whisper / Otter.ai', 'XULIA AI', 'Notion / Gmail'],
    steps: [
      { title: 'Grabar la reunión', description: 'Usa Otter.ai (automático en Google Meet/Zoom) o graba manualmente y sube el MP3/MP4 a una carpeta de Google Drive designada.', tool: 'Otter.ai / Drive' },
      { title: 'Trigger: nuevo archivo en la carpeta', description: 'Make / n8n detecta cuando se sube un nuevo archivo a la carpeta de Drive y lanza el flujo automáticamente.', tool: 'Make + Drive' },
      { title: 'Transcribir con Whisper', description: 'Si usas Otter.ai, ya tienes la transcripción en texto. Si tienes el audio, usa la API de OpenAI Whisper para transcribirlo (coste: ~0,006€/min). Muy preciso incluso con acento.', tool: 'Whisper API' },
      { title: 'Extraer puntos clave con IA', description: 'Envía la transcripción a XULIA con el prompt de resumen de reunión. Obtendrás: asistentes, temas tratados, decisiones tomadas, tareas con responsable y fecha, y próxima reunión.', tool: 'XULIA AI' },
      { title: 'Guardar en Notion', description: 'Crea una nueva página en la base de datos de reuniones de Notion con toda la información estructurada. Vincula con el cliente/proyecto correspondiente.', tool: 'Notion' },
      { title: 'Enviar resumen al equipo', description: 'Envía un email con el resumen a todos los asistentes (extrae los emails de la transcripción o tenlos guardados en el escenario de Make / n8n).', tool: 'Gmail' },
    ],
    prompt: '"Eres un asistente de agencia. Analiza esta transcripción de reunión y extrae:\n\n1. ASISTENTES: lista de personas mencionadas\n2. CONTEXTO: cliente y proyecto (1 línea)\n3. TEMAS TRATADOS: lista de temas discutidos\n4. DECISIONES: decisiones tomadas (lista)\n5. TAREAS: lista de tareas con formato [RESPONSABLE] — [TAREA] — [FECHA LÍMITE]\n6. PRÓXIMA REUNIÓN: fecha y objetivo si se mencionó\n\nTranscripción:\n[TRANSCRIPCIÓN]"',
  },
  {
    id: 'analisis-pliego',
    title: 'Análisis exprés de pliego de licitación',
    description: 'Sube un PDF de pliego y en minutos recibes el análisis completo: requisitos, criterios, riesgos y recomendación de concursar.',
    category: 'Licitaciones',
    difficulty: 'Medio',
    time: '2 horas',
    saves: '4h por pliego',
    tools: ['Make / n8n', 'Google Drive', 'XULIA AI', 'Gmail / Notion'],
    steps: [
      { title: 'Subir el PDF a una carpeta de Drive', description: 'Designa una carpeta en Google Drive llamada "Pliegos pendientes análisis". Cualquier PDF que subas ahí lanzará el flujo automáticamente.', tool: 'Google Drive' },
      { title: 'Trigger: nuevo PDF en la carpeta', description: 'Make / n8n detecta el nuevo archivo y lo descarga para procesarlo.', tool: 'Make / n8n' },
      { title: 'Extraer texto del PDF', description: 'Usa el módulo PDF de Make / n8n (o una API como PDF.co) para extraer el texto completo del pliego. Para pliegos muy largos (+100 páginas), divide en secciones.', tool: 'Make / PDF.co' },
      { title: 'Análisis con IA (modelo contexto largo)', description: 'Envía el texto a XULIA usando el modelo Gemini 1.5 Pro (contexto de 2M tokens, ideal para documentos largos). Usa el prompt de análisis de pliego.', tool: 'XULIA AI (Gemini)' },
      { title: 'Guardar análisis en Notion', description: 'Crea una ficha en la base de datos de licitaciones con: nombre del contrato, organismo, presupuesto, criterios, riesgos, recomendación y link al pliego original.', tool: 'Notion' },
      { title: 'Notificar al equipo de licitaciones', description: 'Envía email/Slack al equipo con el resumen ejecutivo del análisis y la recomendación de concursar o no.', tool: 'Slack / Gmail' },
    ],
    prompt: '"Actúa como consultor experto en licitaciones públicas. Analiza este pliego y dame:\n\n1. OBJETO: qué se contrata (2 líneas)\n2. PRESUPUESTO: importe base y forma de pago\n3. PLAZO: duración del contrato y fecha límite de presentación\n4. SOLVENCIA: requisitos técnicos y económicos para poder concursar\n5. CRITERIOS: criterios de adjudicación con su ponderación (%)\n6. RIESGOS: los 3 principales riesgos o condiciones desfavorables\n7. RECOMENDACIÓN: CONCURSAR / NO CONCURSAR / CONDICIONAL con justificación de 2 líneas\n\n[TEXTO DEL PLIEGO]"',
  },
  {
    id: 'onboarding-cliente',
    title: 'Onboarding automático de nuevo cliente',
    description: 'Cuando se firma un contrato, se crean automáticamente las carpetas, se envía el email de bienvenida y se asignan las tareas iniciales al equipo.',
    category: 'Clientes',
    difficulty: 'Avanzado',
    time: '3-4 horas',
    saves: '3h por cliente nuevo',
    tools: ['Make / n8n', 'DocuSign / PandaDoc', 'Google Drive', 'XULIA AI', 'Asana / Notion', 'Gmail'],
    steps: [
      { title: 'Trigger: contrato firmado', description: 'Conecta DocuSign o PandaDoc a Make / n8n. El trigger se activa cuando un contrato cambia a estado "completed/signed". Extrae: nombre del cliente, servicio contratado, importe, responsable de cuenta.', tool: 'DocuSign' },
      { title: 'Crear estructura de carpetas en Drive', description: 'Usa la plantilla de carpetas de la agencia. Make / n8n crea automáticamente: /Clientes/[NOMBRE_CLIENTE]/{Briefings, Creatividades, Informes, Facturas, Contratos}.', tool: 'Google Drive' },
      { title: 'Generar email de bienvenida personalizado', description: 'XULIA redacta un email de bienvenida específico para el cliente mencionando el servicio contratado, el responsable de cuenta y los primeros pasos del trabajo.', tool: 'XULIA AI' },
      { title: 'Enviar email de bienvenida', description: 'El email sale desde la cuenta del responsable de cuenta asignado (no de un genérico). Incluye: presentación, próximos pasos, y solicitud de kickoff call.', tool: 'Gmail' },
      { title: 'Crear proyecto en el gestor de tareas', description: 'Crea el proyecto en Asana/Notion a partir de la plantilla de onboarding. Asigna las tareas iniciales: reunión kickoff, brief, accesos a plataformas, configuración de reporting.', tool: 'Asana / Notion' },
      { title: 'Notificar al equipo interno', description: 'Mensaje en el canal #nuevos-clientes de Slack con: nombre del cliente, servicio, responsable y link al proyecto recién creado.', tool: 'Slack' },
    ],
  },
  {
    id: 'digest-prensa',
    title: 'Digest diario de prensa del sector',
    description: 'Cada mañana a las 7:30 recibes un resumen con las noticias más relevantes del sector de tus clientes, curado por IA.',
    category: 'Comunicación',
    difficulty: 'Fácil',
    time: '1 hora',
    saves: '1h/día',
    tools: ['Make / n8n', 'RSS / News API', 'XULIA AI', 'Email / Slack'],
    steps: [
      { title: 'Configurar fuentes RSS por cliente/sector', description: 'Recopila los RSS de los medios más relevantes para cada sector (marketing, sector público, hostelería, etc.). Puedes usar Google News RSS filtrado por keywords.', tool: 'RSS / News API' },
      { title: 'Trigger: cada día a las 7:00', description: 'Make / n8n ejecuta el escenario a las 7:00 para recopilar noticias de las últimas 24 horas.', tool: 'Make / n8n' },
      { title: 'Recopilar y filtrar noticias', description: 'Obtén los últimos artículos de cada fuente RSS. Filtra por relevancia: usa XULIA para descartar noticias irrelevantes y quedarte con las 5-10 más importantes.', tool: 'Make + XULIA AI' },
      { title: 'Generar el digest con IA', description: 'XULIA redacta el digest: título llamativo, 5-8 noticias con resumen de 2 líneas cada una, y una reflexión final sobre qué implican para la estrategia del sector.', tool: 'XULIA AI' },
      { title: 'Enviar por email a las 7:30', description: 'El digest llega a las 7:30 al equipo directivo o al responsable de comunicación. Formato HTML limpio, listo para leer en el móvil.', tool: 'Gmail' },
    ],
    prompt: '"Eres un analista de comunicación. Tienes estas noticias del sector de hoy:\n\n[LISTA DE NOTICIAS CON TÍTULO Y URL]\n\nRedacta un digest ejecutivo con:\n1. TITULAR del día (lo más importante en 1 frase)\n2. TOP 5 NOTICIAS con resumen de 2 líneas cada una y link\n3. IMPLICACIÓN ESTRATÉGICA: qué significa esto para las marcas/clientes del sector (3-4 líneas)\n\nTono: profesional, directo, sin relleno."',
  },
]

const DIFFICULTY_COLORS = {
  'Fácil':    'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Medio':    'bg-amber-50 text-amber-700 border-amber-200',
  'Avanzado': 'bg-rose-50 text-rose-700 border-rose-200',
}

const TOOL_COLORS: Record<string, string> = {
  'Make / n8n': 'bg-purple-50 text-purple-700',
  'XULIA AI': 'bg-violet-50 text-violet-700',
  'Gmail': 'bg-red-50 text-red-700',
  'Slack': 'bg-green-50 text-green-700',
  'Notion': 'bg-gray-100 text-gray-700',
  'Google Drive': 'bg-blue-50 text-blue-700',
  'Google Sheets': 'bg-emerald-50 text-emerald-700',
  'HubSpot': 'bg-orange-50 text-orange-700',
  'Buffer': 'bg-sky-50 text-sky-700',
}

export default function AutomatizacionesPage() {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [openTemplate, setOpenTemplate] = useState<string | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)

  const filtered = activeCategory === 'Todos'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory)

  const handleCopyPrompt = (id: string, prompt: string) => {
    navigator.clipboard.writeText(prompt)
    setCopiedPrompt(id)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  const open = openTemplate ? TEMPLATES.find(t => t.id === openTemplate) : null

  return (
      <div className="flex h-full min-h-0">
      {/* Left sidebar — categories */}
      <aside className="w-52 shrink-0 border-r border-[#e5e5ea] bg-white flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-[#e5e5ea]">
          <h2 className="text-xs font-semibold text-gray-700">Categorías</h2>
        </div>
        <nav className="p-3 space-y-0.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenTemplate(null) }}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-violet-50 text-violet-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {cat}
              <span className="float-right text-gray-400 font-normal">
                {cat === 'Todos' ? TEMPLATES.length : TEMPLATES.filter(t => t.category === cat).length}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-[#e5e5ea]">
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-violet-800 mb-1">¿Tienes una idea?</p>
            <p className="text-[11px] text-violet-600 leading-snug">
              Cuéntanos qué proceso quieres automatizar y lo añadimos como template.
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {open ? (
          /* Template detail view */
          <div className="max-w-3xl mx-auto px-8 py-8">
            <button
              onClick={() => setOpenTemplate(null)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-6"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver a automatizaciones
            </button>

            {/* Header */}
            <div className="bg-white border border-[#e5e5ea] rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                      {open.category}
                    </span>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[open.difficulty]}`}>
                      {open.difficulty}
                    </span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 mb-2">{open.title}</h1>
                  <p className="text-gray-500 text-sm">{open.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4 border-t border-[#f0f0f0]">
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Icon name="clock" size={14} className="text-gray-400" />
                  <span>Configuración: <strong className="text-gray-700">{open.time}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Icon name="zap" size={14} className="text-violet-500" />
                  <span>Ahorra: <strong className="text-violet-700">{open.saves}</strong></span>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Herramientas necesarias</h3>
              <div className="flex flex-wrap gap-2">
                {open.tools.map(tool => (
                  <span key={tool} className={`text-xs font-medium px-3 py-1 rounded-full ${TOOL_COLORS[tool] ?? 'bg-gray-100 text-gray-700'}`}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Pasos de configuración</h3>
              <div className="space-y-3">
                {open.steps.map((step, i) => (
                  <div key={i} className="flex gap-4 bg-white border border-[#e5e5ea] rounded-xl p-4">
                    <div className="w-7 h-7 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900">{step.title}</h4>
                        {step.tool && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${TOOL_COLORS[step.tool] ?? 'bg-gray-100 text-gray-700'}`}>
                            {step.tool}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt */}
            {open.prompt && (
              <div className="bg-violet-50 border border-violet-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-violet-800 flex items-center gap-2">
                    <Icon name="file-text" size={14} className="text-violet-600" />
                    Prompt de IA recomendado
                  </h3>
                  <button
                    onClick={() => handleCopyPrompt(open.id, open.prompt!)}
                    className="flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                  >
                    <Icon name={copiedPrompt === open.id ? 'check' : 'file-text'} size={12} />
                    {copiedPrompt === open.id ? 'Copiado' : 'Copiar prompt'}
                  </button>
                </div>
                <pre className="text-xs text-violet-700 leading-relaxed whitespace-pre-wrap font-mono bg-white/60 rounded-lg p-3 border border-violet-100">
                  {open.prompt}
                </pre>
                <button
                  onClick={() => {
                    sessionStorage.setItem('hub_prompt', open.prompt!)
                    window.location.href = '/hub'
                  }}
                  className="mt-3 flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
                >
                  <Icon name="chat" size={12} />
                  Probar en Chat →
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Template list */
          <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Automatizaciones</h1>
              <p className="text-gray-400 mt-1 text-sm">
                Templates listos para configurar — conecta tus herramientas y automatiza procesos repetitivos
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Templates disponibles', value: TEMPLATES.length },
                { label: 'Horas ahorradas/semana', value: '15h+' },
                { label: 'Herramientas integradas', value: '12' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map(template => (
                <button
                  key={template.id}
                  onClick={() => setOpenTemplate(template.id)}
                  className="group text-left bg-white border border-[#e5e5ea] rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                          {template.category}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[template.difficulty]}`}>
                          {template.difficulty}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight">
                        {template.title}
                      </h3>
                    </div>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-gray-300 group-hover:text-violet-500 transition-colors shrink-0 mt-1">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>

                  <p className="text-xs text-gray-500 leading-snug">{template.description}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#f5f5f5]">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Icon name="clock" size={11} className="text-gray-400" />
                        {template.time}
                      </span>
                      <span className="text-[11px] text-violet-600 font-medium flex items-center gap-1">
                        <Icon name="zap" size={11} className="text-violet-500" />
                        Ahorra {template.saves}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {template.tools.slice(0, 3).map(tool => (
                        <span key={tool} className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${TOOL_COLORS[tool] ?? 'bg-gray-100 text-gray-600'}`}>
                          {tool.split(' ')[0]}
                        </span>
                      ))}
                      {template.tools.length > 3 && (
                        <span className="text-[9px] text-gray-400">+{template.tools.length - 3}</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
