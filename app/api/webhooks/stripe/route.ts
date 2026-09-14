import type Stripe from "stripe";
import { Resend } from "resend";
import { callFinancialDatabaseRpc } from "@/lib/financial-database";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

type FulfillmentResult = {
  duplicate: boolean;
  entitlement_id: string;
};

function configuredPriceIds() {
  return new Set(
    (process.env.STRIPE_PILOT_PRICE_IDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function paymentEmail(session: Stripe.Checkout.Session) {
  return session.customer_details?.email?.trim().toLowerCase() ??
    session.customer_email?.trim().toLowerCase() ?? null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]!);
}

function accessConfirmation(companyName: string, accessEndsAt: string) {
  const safeCompany = escapeHtml(companyName);
  return `
    <div style="background:#f6f8fa;padding:40px 20px;color:#071b4d;font-family:Arial,sans-serif">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-top:3px solid #de873d;padding:36px">
        <p style="margin:0 0 24px;font-size:12px;font-weight:700;letter-spacing:.14em">ENTIMEMA · FINANCIAL INTELLIGENCE</p>
        <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15">Payment confirmed. Your pilot workspace is ready.</h1>
        <p style="margin:0 0 24px;color:#53647a;line-height:1.65">We have confirmed the Financial Intelligence pilot payment for <strong>${safeCompany}</strong>.</p>
        <div style="border:1px solid #d5dde6;padding:22px;margin:0 0 24px">
          <p style="margin:0 0 10px"><strong>Product:</strong> Financial Intelligence · Income Statement Analysis</p>
          <p style="margin:0"><strong>Workspace access:</strong> available until ${accessEndsAt}</p>
        </div>
        <p style="margin:0 0 18px;color:#53647a;line-height:1.65">Sign in with the same work email used at checkout. Do not email confidential financial documents; upload them only through the authenticated workspace.</p>
        <p style="margin:0"><a href="https://www.entimema.com/auth/sign-in?callbackUrl=%2Fworkspace" style="color:#071b4d;font-weight:700">Open Entimema Workspace →</a></p>
      </div>
    </div>`;
}

async function sendConfirmation(
  eventId: string,
  email: string,
  companyName: string,
  accessEndsAt: string,
) {
  const claimed = await callFinancialDatabaseRpc<boolean>(
    "workspace_claim_stripe_notification",
    { p_event_id: eventId },
  );
  if (!claimed) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured");

  try {
    const resend = new Resend(apiKey);
    const safeCompany = escapeHtml(companyName);
    const safeEmail = escapeHtml(email);
    const safeEventId = escapeHtml(eventId);
    const { error } = await resend.batch.send([
      {
        from: "Entimema <website@entimema.net>",
        to: email,
        replyTo: "office@entimema.com",
        subject: "Financial Intelligence pilot — payment confirmed",
        html: accessConfirmation(companyName, accessEndsAt),
      },
      {
        from: "Entimema <website@entimema.net>",
        to: "office@entimema.com",
        replyTo: email,
        subject: `[Entimema] Pilot paid — ${companyName}`,
        html: `<p><strong>Customer:</strong> ${safeCompany}</p><p><strong>Email:</strong> ${safeEmail}</p><p><strong>Stripe event:</strong> ${safeEventId}</p>`,
      },
    ]);
    if (error) throw new Error("Resend rejected the payment confirmation");
    await callFinancialDatabaseRpc("workspace_complete_stripe_notification", {
      p_event_id: eventId,
      p_succeeded: true,
    });
  } catch (error) {
    await callFinancialDatabaseRpc("workspace_complete_stripe_notification", {
      p_event_id: eventId,
      p_succeeded: false,
    }).catch(() => null);
    throw error;
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return Response.json({ received: false }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch {
    return Response.json({ received: false }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return Response.json({ received: true });
  }

  const session = event.data.object;
  const expectedLiveMode = process.env.STRIPE_EXPECTED_LIVEMODE === "true";
  if (event.livemode !== expectedLiveMode) {
    return Response.json({ received: false }, { status: 409 });
  }
  if (session.mode !== "payment" || session.payment_status !== "paid") {
    return Response.json({ received: true });
  }

  const email = paymentEmail(session);
  const priceIds = configuredPriceIds();
  if (!email || priceIds.size === 0 || !session.amount_total || session.currency !== "eur") {
    return Response.json({ received: false }, { status: 422 });
  }

  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
    limit: 10,
    expand: ["data.price.product"],
  });
  const matchingLineItems = lineItems.data.filter(
    (item) => item.price?.id && priceIds.has(item.price.id),
  );
  if (matchingLineItems.length !== 1 || lineItems.data.length !== 1) {
    return Response.json({ received: false }, { status: 422 });
  }

  const priceId = matchingLineItems[0].price!.id;
  const companyName = session.metadata?.company_name?.trim() ||
    session.customer_details?.name?.trim() || email.split("@")[1];
  const accessEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const fulfillment = await callFinancialDatabaseRpc<FulfillmentResult>(
    "workspace_fulfill_stripe_pilot",
    {
      p_event_id: event.id,
      p_event_type: event.type,
      p_livemode: event.livemode,
      p_session_id: session.id,
      p_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      p_customer_email: email,
      p_organization_name: companyName,
      p_price_id: priceId,
      p_amount_total: session.amount_total,
      p_currency: session.currency,
      p_access_ends_at: accessEndsAt,
    },
  );
  if (!fulfillment) {
    return Response.json({ received: false }, { status: 503 });
  }

  await sendConfirmation(event.id, email, companyName, accessEndsAt);
  return Response.json({ received: true, duplicate: fulfillment.duplicate });
}
