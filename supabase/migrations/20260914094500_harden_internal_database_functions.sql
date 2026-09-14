revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

create index if not exists stripe_webhook_events_entitlement_idx
  on public.stripe_webhook_events (entitlement_id);
