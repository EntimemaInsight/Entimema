import "server-only";

type RpcOptions = {
  timeoutMs?: number;
};

export async function callFinancialDatabaseRpc<T>(
  functionName: string,
  body: Record<string, unknown>,
  options: RpcOptions = {},
): Promise<T | null> {
  const baseUrl = process.env.FINANCIAL_DATABASE_REST_URL?.replace(/\/$/, "");
  const serviceKey = process.env.FINANCIAL_DATABASE_SERVICE_KEY;
  if (!baseUrl || !serviceKey) return null;

  const response = await fetch(`${baseUrl}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
    signal: AbortSignal.timeout(options.timeoutMs ?? 8_000),
  });

  if (!response.ok) {
    throw new Error(`Financial database RPC failed: ${functionName}`);
  }

  return (await response.json()) as T;
}
