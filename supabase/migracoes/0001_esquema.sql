-- ============================================================
-- Esquema do Auditoria no Supabase (PostgreSQL).
-- Aplique com `supabase db push` ou pelo SQL Editor do painel.
--
-- O sistema funciona 100% sem isto (modo local, dados no navegador).
-- Ao definir NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY,
-- as auditorias passam a ser sincronizadas nestas tabelas.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Perfis ----------
-- Nesta versão todos os perfis têm exatamente as mesmas permissões.
create table if not exists public.perfis (
  id          uuid primary key references auth.users (id) on delete cascade,
  usuario     text unique not null,
  nome        text not null,
  perfil      text not null default 'administrador',
  criado_em   timestamptz not null default now()
);

-- ---------- Auditorias ----------
-- O documento completo da auditoria fica em `dados` (jsonb), espelhando o
-- tipo Auditoria do front-end. As colunas geradas existem para filtrar e
-- montar indicadores sem precisar ler o documento inteiro.
create table if not exists public.auditorias (
  id            uuid primary key default gen_random_uuid(),
  proprietario  uuid not null default auth.uid() references auth.users (id) on delete cascade,
  dados         jsonb not null,
  criada_em     timestamptz not null default now(),
  atualizada_em timestamptz not null default now(),

  codigo   text generated always as (dados ->> 'codigo')  stored,
  empresa  text generated always as (dados ->> 'empresa') stored,
  setor    text generated always as (dados ->> 'setor')   stored,
  norma    text generated always as (dados ->> 'norma')   stored,
  auditor  text generated always as (dados ->> 'auditor') stored,
  status   text generated always as (dados ->> 'status')  stored,
  data     date generated always as ((dados ->> 'data')::date) stored
);

create index if not exists auditorias_proprietario_idx on public.auditorias (proprietario);
create index if not exists auditorias_status_idx       on public.auditorias (status);
create index if not exists auditorias_setor_idx        on public.auditorias (setor);
create index if not exists auditorias_data_idx         on public.auditorias (data desc);
create index if not exists auditorias_dados_idx        on public.auditorias using gin (dados);

create or replace function public.tocar_atualizada_em()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.atualizada_em := now();
  return new;
end;
$$;

drop trigger if exists auditorias_atualizada_em on public.auditorias;
create trigger auditorias_atualizada_em
  before update on public.auditorias
  for each row execute function public.tocar_atualizada_em();

-- ---------- Segurança em nível de linha ----------
alter table public.perfis      enable row level security;
alter table public.auditorias  enable row level security;

drop policy if exists "perfis: leitura autenticada" on public.perfis;
create policy "perfis: leitura autenticada"
  on public.perfis for select
  to authenticated
  using (true);

drop policy if exists "perfis: cada um edita o seu" on public.perfis;
create policy "perfis: cada um edita o seu"
  on public.perfis for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Todos os usuários autenticados enxergam e trabalham nas auditorias da
-- organização — é o comportamento pedido para esta versão. Para restringir
-- ao próprio autor, troque `using (true)` por `using ((select auth.uid()) = proprietario)`.
drop policy if exists "auditorias: leitura autenticada" on public.auditorias;
create policy "auditorias: leitura autenticada"
  on public.auditorias for select
  to authenticated
  using (true);

drop policy if exists "auditorias: criação autenticada" on public.auditorias;
create policy "auditorias: criação autenticada"
  on public.auditorias for insert
  to authenticated
  with check ((select auth.uid()) = proprietario);

drop policy if exists "auditorias: edição autenticada" on public.auditorias;
create policy "auditorias: edição autenticada"
  on public.auditorias for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "auditorias: exclusão pelo autor" on public.auditorias;
create policy "auditorias: exclusão pelo autor"
  on public.auditorias for delete
  to authenticated
  using ((select auth.uid()) = proprietario);

-- ---------- Armazenamento das evidências ----------
insert into storage.buckets (id, name, public)
values ('evidencias', 'evidencias', false)
on conflict (id) do nothing;

drop policy if exists "evidencias: leitura autenticada" on storage.objects;
create policy "evidencias: leitura autenticada"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'evidencias');

drop policy if exists "evidencias: envio autenticado" on storage.objects;
create policy "evidencias: envio autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'evidencias');

drop policy if exists "evidencias: exclusão pelo dono" on storage.objects;
create policy "evidencias: exclusão pelo dono"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'evidencias' and (select auth.uid()) = owner_id::uuid);
