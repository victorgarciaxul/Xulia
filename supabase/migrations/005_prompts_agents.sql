create table if not exists prompts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  content       text not null,
  category      text,
  tags          text[] not null default '{}',
  author_id     uuid not null references auth.users on delete cascade,
  is_public     boolean not null default true,
  rating_avg    decimal not null default 0,
  rating_count  int not null default 0,
  use_count     int not null default 0,
  version       int not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table prompts enable row level security;

create policy "Leer prompts públicos" on prompts
  for select using (is_public = true and auth.uid() is not null);

create policy "Gestionar prompts propios" on prompts
  for all using (auth.uid() = author_id);

create policy "Admin gestiona todos los prompts" on prompts
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create trigger prompts_updated_at
  before update on prompts
  for each row execute procedure update_updated_at();

-- ─── LOGS DE USO ─────────────────────────────────────────────

create table if not exists usage_logs (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users on delete cascade,
  conversation_id  uuid,
  model_id         text,
  tokens_input     int not null default 0,
  tokens_output    int not null default 0,
  cost_usd         decimal not null default 0,
  latency_ms       int,
  is_rag           boolean not null default false,
  agent_slug       text,
  department       text,
  created_at       timestamptz not null default now()
);

alter table usage_logs enable row level security;

create policy "Ver logs propios" on usage_logs
  for select using (auth.uid() = user_id);

create policy "Admin ve todos los logs" on usage_logs
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

create index on usage_logs (user_id, created_at desc);
create index on usage_logs (created_at desc);
