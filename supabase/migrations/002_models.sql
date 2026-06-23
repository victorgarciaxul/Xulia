create table if not exists models (
  id                    text primary key,
  name                  text not null,
  provider              text not null,
  is_free               boolean not null default false,
  is_active             boolean not null default true,
  cost_input_per_1m     decimal not null default 0,
  cost_output_per_1m    decimal not null default 0,
  context_window        int,
  description           text,
  min_role              text not null default 'basic' check (min_role in ('basic','standard','advanced','admin')),
  created_at            timestamptz not null default now()
);

alter table models enable row level security;

create policy "Leer modelos activos" on models
  for select using (is_active = true and auth.uid() is not null);

create policy "Admin gestiona modelos" on models
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Seed: modelos iniciales
insert into models (id, name, provider, is_free, cost_input_per_1m, cost_output_per_1m, context_window, description, min_role) values
  ('meta-llama/llama-3.1-8b-instruct:free', 'Llama 3.1 8B', 'Meta', true, 0, 0, 131072, 'Rápido y gratuito. Ideal para consultas del día a día.', 'basic'),
  ('google/gemini-2.0-flash-exp:free', 'Gemini 2.0 Flash', 'Google', true, 0, 0, 1048576, 'Gratuito con contexto muy largo. Perfecto para documentos grandes.', 'basic'),
  ('mistralai/mistral-7b-instruct:free', 'Mistral 7B', 'Mistral', true, 0, 0, 32768, 'Ligero y gratuito. Bueno para redacción y resúmenes.', 'basic'),
  ('deepseek/deepseek-r1:free', 'DeepSeek R1', 'DeepSeek', true, 0, 0, 65536, 'Gratuito. Excelente para razonamiento y análisis.', 'basic'),
  ('anthropic/claude-sonnet-4-5', 'Claude Sonnet 4.5', 'Anthropic', false, 3, 15, 200000, 'Alto rendimiento. Ideal para propuestas, licitaciones y análisis complejos.', 'standard'),
  ('openai/gpt-4o', 'GPT-4o', 'OpenAI', false, 2.5, 10, 128000, 'Modelo avanzado de OpenAI. Muy capaz en multitarea.', 'standard'),
  ('google/gemini-1.5-pro', 'Gemini 1.5 Pro', 'Google', false, 1.25, 5, 2097152, 'Contexto de 2M tokens. Para documentos corporativos masivos.', 'advanced'),
  ('anthropic/claude-opus-4', 'Claude Opus 4', 'Anthropic', false, 15, 75, 200000, 'El más potente de Anthropic. Para tareas de máxima complejidad.', 'advanced')
on conflict (id) do nothing;
