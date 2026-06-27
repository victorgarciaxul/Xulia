export interface ModelMeta {
  id: string
  name: string
  provider: string
  is_free: boolean
  context_window: number
  description: string
  min_role: 'basic' | 'standard' | 'advanced' | 'admin'
  cost_input_per_1m: number
  cost_output_per_1m: number
}

export const AVAILABLE_MODELS: ModelMeta[] = [
  // ── FREE ────────────────────────────────────────────────────────────────
  {
    id: 'nvidia/nemotron-nano-9b-v2:free',
    name: 'Nemotron Nano 9B',
    provider: 'NVIDIA',
    is_free: true,
    context_window: 32000,
    description: 'Gratuito. Rápido y ligero, ideal para consultas del día a día.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'google/gemma-4-31b-it:free',
    name: 'Gemma 4 31B',
    provider: 'Google',
    is_free: true,
    context_window: 262144,
    description: 'Gratuito. Muy capaz para redacción y análisis de Google.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'nvidia/nemotron-3-super-120b-a12b:free',
    name: 'Nemotron 120B',
    provider: 'NVIDIA',
    is_free: true,
    context_window: 1000000,
    description: 'Gratuito. Modelo potente de NVIDIA con 1M de contexto.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'openai/gpt-oss-120b:free',
    name: 'GPT OSS 120B',
    provider: 'OpenAI',
    is_free: true,
    context_window: 131072,
    description: 'Gratuito. Modelo open source de OpenAI para razonamiento y análisis.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct:free',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    is_free: true,
    context_window: 131072,
    description: 'Gratuito. Llama 3.3 de Meta, excelente para redacción y análisis general.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    name: 'Nemotron Ultra 550B',
    provider: 'NVIDIA',
    is_free: true,
    context_window: 1000000,
    description: 'Gratuito. El modelo open source más potente disponible, 550B parámetros.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'qwen/qwen3-coder:free',
    name: 'Qwen3 Coder',
    provider: 'Qwen',
    is_free: true,
    context_window: 1048576,
    description: 'Gratuito. Especializado en código y razonamiento técnico.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },

  // ── GOOGLE / GEMINI ──────────────────────────────────────────────────────
  {
    id: 'google/gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    is_free: true,
    context_window: 1048576,
    description: 'Gratuito (Workspace). Rápido, 1M de contexto, ideal para consultas frecuentes.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    is_free: true,
    context_window: 1048576,
    description: 'Gratuito (Workspace). El más capaz de Google, 1M de contexto para documentos largos.',
    min_role: 'basic',
    cost_input_per_1m: 0,
    cost_output_per_1m: 0,
  },

  // ── OPENAI ────────────────────────────────────────────────────────────────
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    is_free: false,
    context_window: 128000,
    description: 'Versión económica de GPT-4o. Equilibrio perfecto entre calidad y coste.',
    min_role: 'basic',
    cost_input_per_1m: 0.15,
    cost_output_per_1m: 0.60,
  },
  {
    id: 'openai/o4-mini',
    name: 'o4-mini',
    provider: 'OpenAI',
    is_free: false,
    context_window: 200000,
    description: 'Modelo de razonamiento compacto de OpenAI. Excelente para análisis lógico y matemático.',
    min_role: 'basic',
    cost_input_per_1m: 1.10,
    cost_output_per_1m: 4.40,
  },
  {
    id: 'openai/gpt-4.1',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    is_free: false,
    context_window: 1047576,
    description: 'Última versión de GPT-4. 1M de contexto, muy capaz en redacción y análisis.',
    min_role: 'basic',
    cost_input_per_1m: 2.00,
    cost_output_per_1m: 8.00,
  },
  {
    id: 'openai/gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    is_free: false,
    context_window: 128000,
    description: 'Modelo avanzado de OpenAI. Muy capaz en multitarea y análisis.',
    min_role: 'basic',
    cost_input_per_1m: 2.50,
    cost_output_per_1m: 10.00,
  },
  {
    id: 'openai/o3',
    name: 'o3',
    provider: 'OpenAI',
    is_free: false,
    context_window: 200000,
    description: 'Modelo de razonamiento avanzado de OpenAI. Para problemas complejos y estratégicos.',
    min_role: 'basic',
    cost_input_per_1m: 2.00,
    cost_output_per_1m: 8.00,
  },

  // ── ANTHROPIC / CLAUDE ───────────────────────────────────────────────────
  {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    is_free: false,
    context_window: 200000,
    description: 'El Claude más rápido y económico. Ideal para tareas rápidas y alto volumen.',
    min_role: 'basic',
    cost_input_per_1m: 1.00,
    cost_output_per_1m: 5.00,
  },
  {
    id: 'anthropic/claude-sonnet-4.6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    is_free: false,
    context_window: 1000000,
    description: 'Alto rendimiento. 1M contexto, ideal para propuestas, licitaciones y análisis complejos.',
    min_role: 'basic',
    cost_input_per_1m: 3.00,
    cost_output_per_1m: 15.00,
  },
  {
    id: 'anthropic/claude-opus-4.8',
    name: 'Claude Opus 4.8',
    provider: 'Anthropic',
    is_free: false,
    context_window: 1000000,
    description: 'El más potente de Anthropic. 1M contexto, para tareas de máxima complejidad.',
    min_role: 'basic',
    cost_input_per_1m: 5.00,
    cost_output_per_1m: 25.00,
  },
]

export function getFreeModels() {
  return AVAILABLE_MODELS.filter(m => m.is_free)
}

export function getModelById(id: string) {
  return AVAILABLE_MODELS.find(m => m.id === id)
}
