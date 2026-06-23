export type UserRole = 'basic' | 'standard' | 'advanced' | 'admin'

export interface Profile {
  id: string
  full_name: string | null
  department: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface UserQuota {
  user_id: string
  monthly_budget_usd: number
  daily_request_limit: number
  monthly_request_limit: number
  can_use_paid_models: boolean
  requests_today: number
  requests_this_month: number
  spend_this_month_usd: number
  tokens_this_month: number
  last_daily_reset: string
  last_monthly_reset: string
}

export interface Model {
  id: string
  name: string
  provider: string
  is_free: boolean
  is_active: boolean
  cost_input_per_1m: number
  cost_output_per_1m: number
  context_window: number
  description: string
  min_role: UserRole
}

export interface Conversation {
  id: string
  user_id: string
  title: string | null
  model_id: string | null
  agent_id: string | null
  folder: string | null
  tags: string[]
  is_rag: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_id: string | null
  tokens_input: number
  tokens_output: number
  cost_usd: number
  rag_sources: RagSource[] | null
  created_at: string
}

export interface RagSource {
  title: string
  document_id: string
  score: number
  excerpt: string
}

export interface Prompt {
  id: string
  title: string
  content: string
  category: string | null
  tags: string[]
  author_id: string
  is_public: boolean
  rating_avg: number
  rating_count: number
  use_count: number
  version: number
  created_at: string
  updated_at: string
}

export interface RagDocument {
  id: string
  title: string
  source_type: 'upload' | 'gdrive' | 'sharepoint' | 'url'
  source_url: string | null
  department: string | null
  storage_path: string | null
  file_type: string | null
  file_size: number | null
  chunk_count: number
  is_processed: boolean
  uploaded_by: string
  created_at: string
}

export interface UsageLog {
  id: string
  user_id: string
  conversation_id: string | null
  model_id: string | null
  tokens_input: number
  tokens_output: number
  cost_usd: number
  latency_ms: number | null
  is_rag: boolean
  agent_id: string | null
  department: string | null
  created_at: string
}
