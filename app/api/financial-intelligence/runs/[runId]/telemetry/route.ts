import {createResolverTelemetryHandler} from "@/backend/api/financial-intelligence/persisted-http";
import {financialRunService} from "@/backend/financial-intelligence/persistence";
import {authorizeFinancialOperator} from "@/lib/financial-operator-auth";

export const runtime="nodejs",dynamic="force-dynamic";
export const GET=createResolverTelemetryHandler({authorize:authorizeFinancialOperator,service:financialRunService});
