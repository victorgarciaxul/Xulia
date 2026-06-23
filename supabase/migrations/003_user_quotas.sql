create table if not exists user_quotas (
  user_id                uuid primary key references auth.users on delete cascade,
  monthly_budget_usd     decimal not null default 0,
  daily_request_limit    int not null default 50,
  monthly_request_limit  int not null default 500,
  allowed_model_ids      text[],
  can_use_paid_models    boolean not null default false,
  requests_today         int not null default 0,
  requests_this_month    int not null default 0,
  spend_this_month_usd   decimal not null default 0,
  tokens_this_month      bigint not null default 0,
  last_daily_reset       date not null default current_date,
  last_monthly_reset     date not null default date_trunc('month', now()),
  updated_at             timestamptz not null default now()
);

alter table user_quotas enable row level security;

create policy "Ver cuota propia" on user_quotas
  for select using (auth.uid() = user_id);

create policy "Admin gestiona cuotas" on user_quotas
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Crear cuota automáticamente al crear perfil
create or replace function public.handle_new_profile()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.user_quotas (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create or replace trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_profile();
