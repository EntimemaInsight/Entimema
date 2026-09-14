import { getStripe } from "@/lib/stripe";
import { hasPaidWorkspaceProductAccess } from "@/lib/workspace-entitlements";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId?.startsWith("cs_")) {
    return Response.json({ paid: false, ready: false }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const email = session.customer_details?.email?.trim().toLowerCase() ??
      session.customer_email?.trim().toLowerCase();
    const expectedLiveMode = process.env.STRIPE_EXPECTED_LIVEMODE === "true";
    const paid = session.mode === "payment" && session.payment_status === "paid" &&
      session.livemode === expectedLiveMode &&
      session.metadata?.product === "financial_intelligence_controlled_pilot";
    const ready = Boolean(paid && email && await hasPaidWorkspaceProductAccess(email, "financial-intelligence"));
    return Response.json({ paid, ready }, { headers: { "Cache-Control": "no-store, private" } });
  } catch {
    return Response.json({ paid: false, ready: false }, { status: 404 });
  }
}
