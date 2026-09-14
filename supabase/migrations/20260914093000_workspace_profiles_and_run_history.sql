create table if not exists public.workspace_run_records (
  run_id uuid primary key,
  customer_email text not null check (customer_email = lower(btrim(customer_email))),
  organization_name text not null,
  product_id text not null check (product_id in ('financial-intelligence')),
  workflow_id text not null check (workflow_id in ('income-statement-analysis')),
  source_name text not null,
  document_type text not null,
  control_status text not null check (control_status in ('completed', 'review-required', 'failed')),
  duration_ms integer not null check (duration_ms >= 0),
  created_at timestamptz not null default now()
);

create index if not exists workspace_run_records_customer_created_idx
  on public.workspace_run_records (customer_email, created_at desc);

alter table public.workspace_run_records enable row level security;
revoke all on public.workspace_run_records from public, anon, authenticated;
grant select, insert on public.workspace_run_records to service_role;

create or replace function public.workspace_get_access_profile(
  p_email text,
  p_allow_test boolean default false
) returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select jsonb_build_object(
    'organization_name', organization_name,
    'access_ends_at', ends_at,
    'livemode', livemode
  )
  from workspace_product_entitlements
  where customer_email = lower(btrim(p_email))
    and status = 'active'
    and starts_at <= now()
    and ends_at > now()
    and (livemode or p_allow_test)
  order by ends_at desc
  limit 1
$$;

create or replace function public.workspace_record_run(
  p_run_id uuid,
  p_customer_email text,
  p_organization_name text,
  p_source_name text,
  p_document_type text,
  p_control_status text,
  p_duration_ms integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into workspace_run_records (
    run_id, customer_email, organization_name, product_id, workflow_id,
    source_name, document_type, control_status, duration_ms
  ) values (
    p_run_id, lower(btrim(p_customer_email)), btrim(p_organization_name),
    'financial-intelligence', 'income-statement-analysis',
    left(btrim(p_source_name), 255), left(btrim(p_document_type), 120),
    p_control_status, p_duration_ms
  )
  on conflict (run_id) do nothing;
  return found;
end
$$;

create or replace function public.workspace_list_runs(
  p_email text,
  p_limit integer default 25
) returns jsonb
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(jsonb_agg(to_jsonb(records) order by records.created_at desc), '[]'::jsonb)
  from (
    select run_id, created_at, source_name, document_type, control_status,
           product_id, workflow_id, duration_ms
    from workspace_run_records
    where customer_email = lower(btrim(p_email))
    order by created_at desc
    limit least(greatest(p_limit, 1), 100)
  ) records
$$;

revoke all on function public.workspace_get_access_profile(text, boolean)
  from public, anon, authenticated;
revoke all on function public.workspace_record_run(uuid, text, text, text, text, text, integer)
  from public, anon, authenticated;
revoke all on function public.workspace_list_runs(text, integer)
  from public, anon, authenticated;

grant execute on function public.workspace_get_access_profile(text, boolean) to service_role;
grant execute on function public.workspace_record_run(uuid, text, text, text, text, text, integer) to service_role;
grant execute on function public.workspace_list_runs(text, integer) to service_role;
