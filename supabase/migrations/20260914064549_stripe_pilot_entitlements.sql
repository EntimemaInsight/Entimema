create table if not exists public.workspace_product_entitlements (
  entitlement_id uuid primary key default gen_random_uuid(),
  customer_email text not null check (customer_email = lower(btrim(customer_email))),
  organization_name text not null,
  product_id text not null check (product_id in ('financial-intelligence')),
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  source text not null check (source in ('stripe')),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  stripe_price_id text not null,
  livemode boolean not null,
  amount_total bigint not null check (amount_total > 0),
  currency text not null check (currency = lower(currency)),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create index if not exists workspace_product_entitlements_access_idx
  on public.workspace_product_entitlements (customer_email, product_id, ends_at desc)
  where status = 'active';

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  livemode boolean not null,
  stripe_session_id text not null,
  entitlement_id uuid references public.workspace_product_entitlements(entitlement_id),
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sending', 'sent')),
  notification_claimed_at timestamptz,
  notification_sent_at timestamptz,
  created_at timestamptz not null default now(),
  processed_at timestamptz not null default now()
);

alter table public.workspace_product_entitlements enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on public.workspace_product_entitlements, public.stripe_webhook_events
  from public, anon, authenticated;
grant select, insert, update on public.workspace_product_entitlements, public.stripe_webhook_events
  to service_role;

create or replace function public.workspace_fulfill_stripe_pilot(
  p_event_id text,
  p_event_type text,
  p_livemode boolean,
  p_session_id text,
  p_payment_intent_id text,
  p_customer_email text,
  p_organization_name text,
  p_price_id text,
  p_amount_total bigint,
  p_currency text,
  p_access_ends_at timestamptz
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(btrim(p_customer_email));
  v_entitlement_id uuid;
  v_event_inserted_count integer := 0;
begin
  if v_email = '' or position('@' in v_email) <= 1 then
    raise exception 'invalid customer email';
  end if;
  if p_currency <> lower(p_currency) or p_amount_total <= 0 then
    raise exception 'invalid payment amount or currency';
  end if;

  insert into workspace_product_entitlements (
    customer_email, organization_name, product_id, source,
    stripe_session_id, stripe_payment_intent_id, stripe_price_id,
    livemode, amount_total, currency, ends_at
  ) values (
    v_email, btrim(p_organization_name), 'financial-intelligence', 'stripe',
    p_session_id, p_payment_intent_id, p_price_id,
    p_livemode, p_amount_total, p_currency, p_access_ends_at
  )
  on conflict (stripe_session_id) do update set
    updated_at = workspace_product_entitlements.updated_at
  returning entitlement_id into v_entitlement_id;

  insert into stripe_webhook_events (
    event_id, event_type, livemode, stripe_session_id, entitlement_id
  ) values (
    p_event_id, p_event_type, p_livemode, p_session_id, v_entitlement_id
  )
  on conflict (event_id) do nothing;
  get diagnostics v_event_inserted_count = row_count;

  return jsonb_build_object(
    'duplicate', v_event_inserted_count = 0,
    'entitlement_id', v_entitlement_id
  );
end
$$;

create or replace function public.workspace_has_product_access(
  p_email text,
  p_product_id text,
  p_allow_test boolean default false
) returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from workspace_product_entitlements
    where customer_email = lower(btrim(p_email))
      and product_id = p_product_id
      and status = 'active'
      and starts_at <= now()
      and ends_at > now()
      and (livemode or p_allow_test)
  )
$$;

create or replace function public.workspace_claim_stripe_notification(p_event_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update stripe_webhook_events
  set notification_status = 'sending', notification_claimed_at = now()
  where event_id = p_event_id
    and (
      notification_status = 'pending'
      or (notification_status = 'sending' and notification_claimed_at < now() - interval '10 minutes')
    );
  return found;
end
$$;

create or replace function public.workspace_complete_stripe_notification(
  p_event_id text,
  p_succeeded boolean
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update stripe_webhook_events
  set notification_status = case when p_succeeded then 'sent' else 'pending' end,
      notification_sent_at = case when p_succeeded then now() else null end,
      notification_claimed_at = case when p_succeeded then notification_claimed_at else null end
  where event_id = p_event_id and notification_status = 'sending';
  return found;
end
$$;

revoke all on function public.workspace_fulfill_stripe_pilot(
  text, text, boolean, text, text, text, text, text, bigint, text, timestamptz
) from public, anon, authenticated;
revoke all on function public.workspace_has_product_access(text, text, boolean)
  from public, anon, authenticated;
revoke all on function public.workspace_claim_stripe_notification(text)
  from public, anon, authenticated;
revoke all on function public.workspace_complete_stripe_notification(text, boolean)
  from public, anon, authenticated;

grant execute on function public.workspace_fulfill_stripe_pilot(
  text, text, boolean, text, text, text, text, text, bigint, text, timestamptz
) to service_role;
grant execute on function public.workspace_has_product_access(text, text, boolean)
  to service_role;
grant execute on function public.workspace_claim_stripe_notification(text)
  to service_role;
grant execute on function public.workspace_complete_stripe_notification(text, boolean)
  to service_role;
