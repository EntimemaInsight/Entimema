create extension if not exists pgcrypto;
-- Supabase/PostgreSQL migration. Financial contracts are versioned JSONB; ownership and concurrency remain relational.
create table if not exists public.financial_runs (
 run_id uuid primary key, owner_id text not null, status text not null check(status in ('processing','review_required','validated','failed','archived')),
 revision integer not null check(revision > 0), contract jsonb not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), validated_at timestamptz,
 unique(owner_id,run_id)
);
create index if not exists financial_runs_owner_updated_idx on public.financial_runs(owner_id,updated_at desc);
create table if not exists public.financial_audit_events (
 event_id uuid primary key default gen_random_uuid(), run_id uuid not null references public.financial_runs(run_id), revision integer not null,
 actor_id text not null, event_type text not null, before_state jsonb, after_state jsonb, created_at timestamptz not null default now(),
 integrity_hash text not null
);
create or replace function public.fi_set_audit_integrity_hash() returns trigger language plpgsql set search_path=public as $$ begin
 new.integrity_hash := encode(extensions.digest(new.run_id::text || new.revision::text || new.actor_id || new.event_type || extract(epoch from new.created_at)::text || coalesce(new.before_state::text,'') || coalesce(new.after_state::text,''),'sha256'),'hex');
 return new;
end $$;
drop trigger if exists financial_audit_events_integrity_hash on public.financial_audit_events;
create trigger financial_audit_events_integrity_hash before insert on public.financial_audit_events for each row execute function public.fi_set_audit_integrity_hash();
create table if not exists public.financial_validated_snapshots (
 run_id uuid not null references public.financial_runs(run_id), revision integer not null, snapshot jsonb not null, integrity_hash text not null, created_at timestamptz not null default now(), primary key(run_id,revision)
);
revoke update,delete on public.financial_audit_events,public.financial_validated_snapshots from public,anon,authenticated;
grant select on public.financial_runs,public.financial_audit_events,public.financial_validated_snapshots to service_role;
alter table public.financial_runs enable row level security; alter table public.financial_audit_events enable row level security; alter table public.financial_validated_snapshots enable row level security;
create or replace function public.fi_create_run(p_owner_id text,p_run_id uuid,p_contract jsonb,p_event jsonb) returns setof public.financial_runs language plpgsql security definer set search_path=public as $$ begin
 insert into financial_runs(run_id,owner_id,status,revision,contract) values(p_run_id,p_owner_id,p_contract->>'status',1,p_contract);
 insert into financial_audit_events(run_id,revision,actor_id,event_type,before_state,after_state) values(p_run_id,1,p_owner_id,p_event->>'type',p_event->'before',p_event->'after'); return query select * from financial_runs where run_id=p_run_id and owner_id=p_owner_id; end $$;
create or replace function public.fi_update_run(p_owner_id text,p_run_id uuid,p_expected_revision integer,p_contract jsonb,p_status text,p_event jsonb,p_snapshot jsonb default null) returns setof public.financial_runs language plpgsql security definer set search_path=public as $$ begin
 update financial_runs set contract=p_contract, status=p_status, revision=p_expected_revision+1, updated_at=now(), validated_at=case when p_status='validated' then now() else validated_at end where run_id=p_run_id and owner_id=p_owner_id and revision=p_expected_revision and status not in ('archived','validated'); if not found then return; end if;
 insert into financial_audit_events(run_id,revision,actor_id,event_type,before_state,after_state) values(p_run_id,p_expected_revision+1,p_owner_id,p_event->>'type',p_event->'before',p_event->'after');
 if p_snapshot is not null then insert into financial_validated_snapshots(run_id,revision,snapshot,integrity_hash) values(p_run_id,p_expected_revision+1,p_snapshot,p_snapshot->>'integrityHash'); end if;
 return query select * from financial_runs where run_id=p_run_id and owner_id=p_owner_id; end $$;
revoke all on function public.fi_create_run(text,uuid,jsonb,jsonb),public.fi_update_run(text,uuid,integer,jsonb,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.fi_create_run(text,uuid,jsonb,jsonb),public.fi_update_run(text,uuid,integer,jsonb,text,jsonb,jsonb) to service_role;
