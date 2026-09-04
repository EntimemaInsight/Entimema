import assert from "node:assert/strict";import test from "node:test";
import {createOperatorAuthorizer} from "../../lib/financial-operator-auth";
test("operator authorization requires an explicit persisted permission",async()=>{const denied=createOperatorAuthorizer(async()=>({actorId:"customer-a"}),async()=>false);await assert.rejects(denied(),(e:unknown)=>(e as {httpStatus?:number}).httpStatus===404);const allowed=createOperatorAuthorizer(async()=>({actorId:"operator-a"}),async id=>id==="operator-a");assert.equal((await allowed()).actorId,"operator-a")});
