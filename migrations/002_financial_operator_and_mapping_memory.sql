-- Zero-configuration interpretation: explicit operator authorization and tenant-isolated mapping memory.
create table if not exists public.financial_operator_roles (
 actor_id text primary key, role text not null check (role in ('financial_operator')), active boolean not null default true,
 granted_by text not null, granted_at timestamptz not null default now(), revoked_at timestamptz
);
create table if not exists public.financial_mapping_memory (
 memory_id uuid primary key default gen_random_uuid(), owner_id text not null, normalized_source_label text not null,
 row_role text not null, statement_type text not null check(statement_type='income_statement'), structural_fingerprint text not null,
 canonical_concept text not null, schema_version text not null, approval_source text not null check(approval_source in ('operator','controlled_import')),
 confidence numeric not null check(confidence between 0 and 1), active boolean not null default true, deprecated_at timestamptz,
 approved_by text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists financial_mapping_memory_lookup_idx on public.financial_mapping_memory(owner_id,normalized_source_label,row_role,statement_type,schema_version,structural_fingerprint) where active;
alter table public.financial_operator_roles enable row level security;
alter table public.financial_mapping_memory enable row level security;
revoke all on public.financial_operator_roles,public.financial_mapping_memory from public,anon,authenticated;
grant select,insert,update on public.financial_mapping_memory to service_role;
grant select on public.financial_operator_roles to service_role;
create or replace function public.fi_is_operator(p_actor_id text) returns boolean language sql security definer stable set search_path=public as $$ select exists(select 1 from financial_operator_roles where actor_id=p_actor_id and role='financial_operator' and active and revoked_at is null) $$;
revoke all on function public.fi_is_operator(text) from public,anon,authenticated;
grant execute on function public.fi_is_operator(text) to service_role;
