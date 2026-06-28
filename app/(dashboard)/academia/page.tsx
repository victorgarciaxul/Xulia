import Link from 'next/link'
import { MODULES } from '@/lib/academia/modules'
import { Icon, ICONS } from '@/components/ui/Icon'

type IconName = keyof typeof ICONS

const LEVEL_COLORS = {
  'Básico':     'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Intermedio': 'bg-amber-50 text-amber-700 border-amber-200',
  'Avanzado':   'bg-rose-50 text-rose-700 border-rose-200',
}

const GLOSSARY = [
  {
    term: 'LLM',
    full: 'Large Language Model',
    icon: 'cpu' as IconName,
    color: 'violet',
    definition: 'Modelo de lenguaje entrenado con enormes volúmenes de texto capaz de generar, resumir y transformar lenguaje natural. La base de herramientas como ChatGPT o Claude.',
  },
  {
    term: 'Prompt',
    full: 'Instrucción de entrada',
    icon: 'send' as IconName,
    color: 'blue',
    definition: 'Texto que le damos a la IA como instrucción o pregunta. La calidad del prompt determina directamente la calidad de la respuesta obtenida.',
  },
  {
    term: 'Token',
    full: 'Unidad de texto procesada',
    icon: 'code' as IconName,
    color: 'emerald',
    definition: 'Fragmento de texto (aprox. ¾ de palabra) que el modelo procesa. Los costes y límites de los modelos se miden en tokens de entrada y salida.',
  },
  {
    term: 'RAG',
    full: 'Retrieval-Augmented Generation',
    icon: 'search' as IconName,
    color: 'amber',
    definition: 'Técnica que combina búsqueda en bases de conocimiento propias con generación de texto. Permite a la IA responder con información actualizada y privada.',
  },
  {
    term: 'Agente IA',
    full: 'AI Agent',
    icon: 'agent' as IconName,
    color: 'violet',
    definition: 'Sistema de IA que puede planificar y ejecutar tareas de forma autónoma usando herramientas (búsqueda, APIs, código) para alcanzar un objetivo.',
  },
  {
    term: 'Fine-tuning',
    full: 'Ajuste fino del modelo',
    icon: 'settings' as IconName,
    color: 'rose',
    definition: 'Proceso de reentrenar un modelo base con datos propios para especializarlo en una tarea o dominio concreto, mejorando su precisión y tono.',
  },
  {
    term: 'Alucinación',
    full: 'Hallucination',
    icon: 'lightbulb' as IconName,
    color: 'orange',
    definition: 'Cuando la IA genera información falsa o inventada con aparente confianza. Es crucial verificar siempre datos críticos producidos por modelos de lenguaje.',
  },
  {
    term: 'Embedding',
    full: 'Vector semántico',
    icon: 'chart' as IconName,
    color: 'cyan',
    definition: 'Representación numérica (vector) del significado de un texto. Permite comparar textos por similitud semántica y es la base de los sistemas de búsqueda inteligente.',
  },
  {
    term: 'Temperatura',
    full: 'Temperature (parámetro)',
    icon: 'bolt' as IconName,
    color: 'yellow',
    definition: 'Parámetro que controla la creatividad del modelo. Temperatura baja = respuestas más predecibles; temperatura alta = respuestas más variadas y creativas.',
  },
  {
    term: 'Context Window',
    full: 'Ventana de contexto',
    icon: 'layout' as IconName,
    color: 'indigo',
    definition: 'Cantidad máxima de texto que el modelo puede leer y recordar en una sola conversación. Modelos con ventanas más grandes pueden procesar documentos más largos.',
  },
  {
    term: 'Prompt Engineering',
    full: 'Ingeniería de instrucciones',
    icon: 'target' as IconName,
    color: 'violet',
    definition: 'Disciplina de diseñar prompts de forma estructurada para obtener resultados óptimos de los modelos de IA. Incluye técnicas como chain-of-thought o few-shot.',
  },
  {
    term: 'Multimodal',
    full: 'Múltiples modalidades',
    icon: 'file' as IconName,
    color: 'teal',
    definition: 'Capacidad de un modelo de procesar y generar distintos tipos de datos: texto, imágenes, audio y vídeo en una misma conversación.',
  },
]

const GLOSSARY_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'text-violet-500' },
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   icon: 'text-blue-500' },
  emerald:{ bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',icon: 'text-emerald-500' },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  icon: 'text-amber-500' },
  rose:   { bg: 'bg-rose-50',   text: 'text-rose-700',   border: 'border-rose-200',   icon: 'text-rose-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'text-orange-500' },
  cyan:   { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   icon: 'text-cyan-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'text-indigo-500' },
  teal:   { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   icon: 'text-teal-500' },
}

export default function AcademiaPage() {
  const totalLessons = MODULES.reduce((acc, m) => acc + m.lessons.length, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Academy</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Formación práctica en inteligencia artificial para equipos de comunicación y marketing
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Módulos', value: MODULES.length },
          { label: 'Lecciones', value: totalLessons },
          { label: 'Horas de contenido', value: '8h' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-[#e5e5ea] rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MODULES.map((module, idx) => {
          const iconName = module.icon as IconName
          return (
            <Link
              key={module.slug}
              href={`/academia/${module.slug}`}
              className="group bg-white border border-[#e5e5ea] rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all flex flex-col gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Icon name={iconName} className="text-violet-600" size={22} />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-violet-700 transition-colors leading-tight mb-1">
                    {module.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-snug">
                    {module.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>
                    {module.level}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Icon name="book" size={11} className="text-gray-400" />
                    {module.lessons.length} lecciones
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Icon name="clock" size={11} className="text-gray-400" />
                    {module.duration}
                  </span>
                </div>
                <span className="text-xs text-violet-500 group-hover:text-violet-700 transition-colors font-medium shrink-0">
                  Empezar →
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {module.tags.map(tag => (
                  <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 border border-[#e5e5ea] px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Glossary */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Icon name="book" size={16} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Glosario de IA</h2>
            <p className="text-xs text-gray-400">Los términos esenciales que todo profesional debe conocer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
          {GLOSSARY.map((item) => {
            const c = GLOSSARY_COLORS[item.color] ?? GLOSSARY_COLORS.violet
            return (
              <div
                key={item.term}
                className="bg-white border border-[#e5e5ea] rounded-xl p-4 flex gap-3 hover:border-violet-200 hover:shadow-sm transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center shrink-0 mt-0.5`}>
                  <Icon name={item.icon} size={18} className={c.icon} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap mb-1">
                    <span className="font-bold text-gray-900 text-sm">{item.term}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                      {item.full}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.definition}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center mt-8">
        Contenido actualizado en 2025 · Basado en las mejores prácticas del sector
      </p>
    </div>
  )
}
