create table if not exists conversations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users on delete cascade,
  title        text,
  model_id     text references models(id) on delete set null,
  agent_slug   text,
  folder       text,
  tags         text[] not null default '{}',
  is_rag       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table conversations enable row level security;

create policy "Conversaciones propias" on conversations
  for all using (auth.uid() = user_id);

create index on conversations (user_id, updated_at desc);

-- Actualizar updated_at automáticamente
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger conversations_updated_at
  before update on conversations
  for each row execute procedure update_updated_at();

-- ─── MENSAJES ────────────────────────────────────────────────

create table if not exists messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid not null references conversations on delete cascade,
  role             text not null check (role in ('user','assistant','system')),
  content          text not null,
  model_id         text,
  tokens_input     int not null default 0,
  tokens_output    int not null default 0,
  cost_usd         decimal not null default 0,
  rag_sources      jsonb,
  created_at       timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Mensajes de conversaciones propias" on messages
  for all using (
    exists (
      select 1 from conversations
      where id = messages.conversation_id
      and user_id = auth.uid()
    )
  );

create index on messages (conversation_id, created_at asc);
