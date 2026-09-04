import {AgentError} from "@/backend/lib/errors";
import type {AuthorizedActor} from "@/lib/execution-auth";
export type OperatorCheck=(actorId:string)=>Promise<boolean>;
export const checkPersistedOperator:OperatorCheck=async(actorId)=>{const url=process.env.FINANCIAL_DATABASE_REST_URL?.replace(/\/$/,""),key=process.env.FINANCIAL_DATABASE_SERVICE_KEY;if(!url||!key)return false;const response=await fetch(`${url}/rest/v1/rpc/fi_is_operator`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({p_actor_id:actorId}),cache:"no-store"});return response.ok&&(await response.json())===true};
export function createOperatorAuthorizer(base:()=>Promise<AuthorizedActor>,check:OperatorCheck=checkPersistedOperator){return async()=>{const actor=await base();if(!await check(actor.actorId))throw new AgentError("ACCESS_FORBIDDEN",404);return actor}}
export const authorizeFinancialOperator=async()=>{const {authorizeExecution}=await import("@/lib/execution-auth");return createOperatorAuthorizer(authorizeExecution)()};
