import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length > 0 && value.trim().length <= maxLength
    ? value.trim()
    : null;
}

function pilotPriceId() {
  return (process.env.STRIPE_PILOT_PRICE_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .find(Boolean) ?? null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  if (origin && origin !== requestOrigin) {
    return Response.json({ ok: false }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (Object.keys(body).some((key) => key !== "companyEmail" && key !== "companyName")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const companyEmail = clean(body.companyEmail, 254)?.toLowerCase() ?? null;
  const companyName = clean(body.companyName, 160);
  const priceId = pilotPriceId();
  if (!companyEmail || !emailPattern.test(companyEmail) || !companyName || !priceId) {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: companyEmail,
      customer_creation: "always",
      client_reference_id: companyEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      invoice_creation: { enabled: true },
      metadata: {
        company_name: companyName,
        product: "financial_intelligence_controlled_pilot",
      },
      success_url: `${requestOrigin}/pilot/financial-intelligence/payment-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${requestOrigin}/pilot/financial-intelligence/offer#accept-offer`,
    });

    if (!session.url) return Response.json({ ok: false }, { status: 502 });
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
