import type { FinancialRun } from "../schema";
export type RunListItem={runId:string;filename:string;selectedStatement:string|null;status:FinancialRun["status"];periods:number;financialRows:number;openTasks:number;createdAt:string;updatedAt:string;revision:number};
export type PersistEvent={type:string;before?:Record<string,unknown>;after?:Record<string,unknown>};
export interface FinancialRunRepository {
 create(ownerId:string,run:FinancialRun,event:PersistEvent):Promise<FinancialRun>;
 list(ownerId:string):Promise<RunListItem[]>;
 get(ownerId:string,runId:string):Promise<FinancialRun|null>;
 update(ownerId:string,run:FinancialRun,expectedRevision:number,event:PersistEvent,snapshot?:Record<string,unknown>):Promise<FinancialRun>;
 listForReview?(operatorId:string):Promise<RunListItem[]>;
 getForReview?(operatorId:string,runId:string):Promise<FinancialRun|null>;
 updateForReview?(operatorId:string,run:FinancialRun,expectedRevision:number,event:PersistEvent,snapshot?:Record<string,unknown>):Promise<FinancialRun>;
}
export class PersistenceConflictError extends Error{}
