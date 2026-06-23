export interface ModelMeta {
  id: string
  name: string
  provider: string
  is_free: boolean
  context_window: number
  description: string
  min_role: 'basic' | 'standard' | 'advanced' | 'admin'
}

export const AVAILABLE_MODELS: ModelMeta[] = [
  {
    id: 'meta-llama/llama-3.1-8b-instruct:free',
    name: 'Llama 3.1 8B',
    provider: 'Meta',
    is_free: true,
    context_window: 131072,
    description: 'Rápido y gratuito. Ideal para consultas del día a día.',
    min_role: 'basic',
  },
  {
    id: 'google/gemini-2.0-flash-exp:free',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    is_free: true,
    context_window: 1048576,
    description: 'Gratuito con contexto muy largo. Perfecto para documentos grandes.',
    min_role: 'basic',
  },
  {
    id: 'mistralai/mistral-7b-instruct:free',
    name: 'Mistral 7B',
    provider: 'Mistral',
    is_free: true,
    context_window: 32768,
    description: 'Ligero y gratuito. Bueno para redacción y resúmenes.',
    min_role: 'basic',
  },
  {
    id: 'deepseek/deepseek-r1:free',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    is_free: true,
    context_window: 65536,
    description: 'Gratuito. Excelente para razonamiento y análisis.',
    min_role: 'basic',
  },
  {
    id: 'anthropic/claude-sonnet-4-5',
    name: 'Claude Sonnet 4.5',
    provider: 'Anthropic',
    is_free: false,
    context_window: 200000,
    description: 'Alto rendimiento. Ideal para propuestas, licitaciones y análisis complejos.',
    min_role: 'standard',
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    is_free: false,
    context_window: 128000,
    description: 'Modelo avanzado de OpenAI. Muy capaz en multitarea.',
    min_role: 'standard',
  },
  {
    id: 'google/gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    is_free: false,
    context_window: 2097152,
    description: 'Contexto de 2M tokens. Para documentos corporativos masivos.',
    min_role: 'advanced',
  },
  {
    id: 'anthropic/claude-opus-4',
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    is_free: false,
    context_window: 200000,
    description: 'El más potente de Anthropic. Para tareas de máxima complejidad.',
    min_role: 'advanced',
  },
]

export function getFreeModels() {
  return AVAILABLE_MODELS.filter(m => m.is_free)
}

export function getModelById(id: string) {
  return AVAILABLE_MODELS.find(m => m.id === id)
}
