import { generateFinancialReport, parseReportResult, reportFilename } from "@/backend/reports/financial-intelligence-report";
import { authorizeExecution } from "@/lib/execution-auth";
import { AgentError } from "@/backend/lib/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await authorizeExecution();
    const result = parseReportResult(await request.json());
    const pdf = generateFinancialReport(result);
    return new Response(new Uint8Array(pdf), {
      headers: {
        "Cache-Control": "no-store, private",
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportFilename(result)}"`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const status = error instanceof AgentError ? error.httpStatus : error instanceof SyntaxError ? 400 : 422;
    return Response.json({ message: "The verified report could not be generated." }, { status, headers: { "Cache-Control": "no-store" } });
  }
}
