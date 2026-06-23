create table if not exists profiles (
  id            uuid primary key references auth.users on delete cascade,
  full_name     text,
  department    text,
  role          text not null default 'basic' check (role in ('basic','standard','advanced','admin')),
  avatar_url    text,
  created_at    timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Ver perfil propio" on profiles
  for select using (auth.uid() = id);

create policy "Editar perfil propio" on profiles
  for update using (auth.uid() = id);

create policy "Admin ve todos los perfiles" on profiles
  for all using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- Crear perfil automáticamente al registrar usuario
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
