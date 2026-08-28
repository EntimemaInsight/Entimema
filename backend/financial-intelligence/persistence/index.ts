import { financialRunRepository } from "./supabase";
import { FinancialRunService } from "./service";
export const financialRunService=new FinancialRunService(financialRunRepository);
