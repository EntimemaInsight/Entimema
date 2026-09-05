-- Controlled cross-owner specialist review. Customer reads remain owner-scoped.
create or replace function public.fi_operator_review_runs(p_actor_id text)
returns setof public.financial_runs language sql security definer stable set search_path=public as $$
 select r.* from financial_runs r
 where public.fi_is_operator(p_actor_id) and r.status='review_required'
 order by r.updated_at asc
$$;
create or replace function public.fi_operator_get_run(p_actor_id text,p_run_id uuid)
returns setof public.financial_runs language sql security definer stable set search_path=public as $$
 select r.* from financial_runs r
 where public.fi_is_operator(p_actor_id) and r.run_id=p_run_id
 limit 1
$$;
create or replace function public.fi_operator_update_run(p_actor_id text,p_run_id uuid,p_expected_revision integer,p_contract jsonb,p_status text,p_event jsonb,p_snapshot jsonb default null)
returns setof public.financial_runs language plpgsql security definer set search_path=public as $$
begin
 if not public.fi_is_operator(p_actor_id) then return; end if;
 update financial_runs set contract=p_contract,status=p_status,revision=p_expected_revision+1,updated_at=now(),validated_at=case when p_status='validated' then now() else validated_at end
 where run_id=p_run_id and revision=p_expected_revision and status not in ('archived','validated');
 if not found then return; end if;
 insert into financial_audit_events(run_id,revision,actor_id,event_type,before_state,after_state)
 values(p_run_id,p_expected_revision+1,p_actor_id,p_event->>'type',p_event->'before',p_event->'after');
 if p_snapshot is not null then insert into financial_validated_snapshots(run_id,revision,snapshot,integrity_hash)
 values(p_run_id,p_expected_revision+1,p_snapshot,p_snapshot->>'integrityHash'); end if;
 return query select * from financial_runs where run_id=p_run_id;
end $$;
revoke all on function public.fi_operator_review_runs(text),public.fi_operator_get_run(text,uuid),public.fi_operator_update_run(text,uuid,integer,jsonb,text,jsonb,jsonb) from public,anon,authenticated;
grant execute on function public.fi_operator_review_runs(text),public.fi_operator_get_run(text,uuid),public.fi_operator_update_run(text,uuid,integer,jsonb,text,jsonb,jsonb) to service_role;
