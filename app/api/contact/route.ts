import { Resend } from "resend";
import { clientInquiryTypes, isTopicKey, partnershipTypes, problemAreaForTopic, topicOptions } from "@/app/contact/contact-config";
import { agents } from "@/app/agents/agent-library-data";

const allowedPartnershipTypes = new Set<string>(partnershipTypes);
const allowedInquiryTypes = new Set<string>(clientInquiryTypes);
const allowedPilotDocumentTypes = new Set(["Income Statement", "Management accounts", "Financial model", "Other"]);
const allowedPilotVolumes = new Set(["1–10", "11–50", "51–200", "200+"]);
const allowedPilotObjectives = new Set(["Faster financial analysis", "Data validation and reconciliation", "Standardized management reporting", "Traceable review and audit evidence", "Other"]);
const allowedKeys = new Set(["intent", "topic", "topicName", "problemArea", "agentId", "agentName", "firstName", "lastName", "email", "companyEmail", "company", "companyName", "country", "phone", "phoneNumber", "referralSource", "marketingConsent", "newsletterConsent", "role", "jobTitle", "partnershipType", "project", "inquiryType", "message", "documentType", "monthlyVolume", "primaryObjective", "privacyConsent", "website"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  return typeof value === "string" && value.trim().length <= max ? value.trim() : null;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]!);
}

function row(label: string, value: string | null) {
  return value ? `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>` : "";
}

function pilotAcceptanceConfirmation(companyName: string) {
  const company = escapeHtml(companyName);
  return `
    <div style="background:#f6f8fa;padding:40px 20px;color:#071b4d;font-family:Arial,sans-serif">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border-top:3px solid #de873d;padding:36px">
        <p style="margin:0 0 24px;font-size:12px;font-weight:700;letter-spacing:.14em">ENTIMEMA · FINANCIAL INTELLIGENCE</p>
        <h1 style="margin:0 0 18px;font-size:30px;line-height:1.15">Your pilot offer has been accepted.</h1>
        <p style="margin:0 0 24px;color:#53647a;line-height:1.65">We have recorded the standard Financial Intelligence pilot acceptance for <strong>${company}</strong>.</p>
        <div style="border:1px solid #d5dde6;padding:22px;margin:0 0 24px">
          <p style="margin:0 0 10px"><strong>Fixed pilot fee:</strong> €490 excluding VAT, where applicable</p>
          <p style="margin:0"><strong>Payment:</strong> 100% in advance</p>
        </div>
        <h2 style="margin:0 0 14px;font-size:20px">What happens next</h2>
        <ol style="margin:0 0 24px;padding-left:20px;color:#53647a;line-height:1.75">
          <li>The secure Stripe payment page opens immediately after acceptance.</li>
          <li>You confirm the supported documents and provide valid pilot inputs.</li>
          <li>Restricted Workspace access is activated automatically after confirmed payment.</li>
          <li>The pilot result is delivered within 5 business days after valid inputs are received.</li>
        </ol>
        <p style="margin:0 0 12px;color:#53647a;line-height:1.65">Do not send confidential financial documents by replying to this email. Secure submission instructions will be provided separately.</p>
        <p style="margin:0;color:#53647a;line-height:1.65">Questions? Reply to this email or contact <a href="mailto:office@entimema.com" style="color:#071b4d">office@entimema.com</a>.</p>
      </div>
    </div>`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (Object.keys(body).some((key) => !allowedKeys.has(key)) || Object.values(body).some((value) => typeof value !== "string")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  if (text(body.website, 200)) return Response.json({ ok: true });

  const intent = text(body.intent, 20);
  const firstName = text(body.firstName, 80);
  const lastName = text(body.lastName, 80);
  const email = text(body.email, 254);
  const company = text(body.company, 160);
  const role = text(body.role, 160);
  const country = text(body.country, 160);
  const phone = text(body.phone, 80);
  const referralSource = text(body.referralSource, 500);
  const marketingConsent = text(body.marketingConsent, 3);
  const message = text(body.message, 4000);
  const topic = text(body.topic, 80);
  const partnershipType = text(body.partnershipType, 160);
  const project = text(body.project, 160);
  const inquiryType = text(body.inquiryType, 160);
  const companyEmail = text(body.companyEmail, 254);
  const companyName = text(body.companyName, 160);
  const jobTitle = text(body.jobTitle, 160);
  const phoneNumber = text(body.phoneNumber, 80);
  const newsletterConsent = text(body.newsletterConsent, 3);
  const agentId = text(body.agentId, 120);
  const agentName = text(body.agentName, 200);
  const documentType = text(body.documentType, 160);
  const monthlyVolume = text(body.monthlyVolume, 40);
  const primaryObjective = text(body.primaryObjective, 200);
  const privacyConsent = text(body.privacyConsent, 3);

  if (!intent || (intent === "demo" && (!email || !emailPattern.test(email)))) return Response.json({ ok: false }, { status: 400 });
  if (topic && !isTopicKey(topic)) return Response.json({ ok: false }, { status: 400 });
  const selectedAgent = agentId ? agents.find((agent) => agent.id === agentId) : null;
  if ((agentId || agentName) && (!selectedAgent || selectedAgent.name !== agentName)) return Response.json({ ok: false }, { status: 400 });

  let subject: string;
  let html: string;
  if (intent === "demo") {
    if (!firstName || !lastName || !company || !country || !phone || (marketingConsent && marketingConsent !== "yes")) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] ${selectedAgent ? `${selectedAgent.name} demo` : "Demo discovery"} — ${company}`;
    html = row("Type", selectedAgent ? "Agent demo request" : "Demo / Discover Entimema") + row("Agent ID", agentId) + row("Agent name", agentName) + row("First name", firstName) + row("Last name", lastName) + row("E-mail", email) + row("Company", company) + row("Country", country) + row("Job title", role) + row("Phone number", phone) + row("How did you hear about Entimema?", referralSource) + row("Marketing communications consent", marketingConsent === "yes" ? "Yes" : "No");
  } else if (intent === "pilot") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !country || !jobTitle || !documentType || !allowedPilotDocumentTypes.has(documentType) || !monthlyVolume || !allowedPilotVolumes.has(monthlyVolume) || !primaryObjective || !allowedPilotObjectives.has(primaryObjective) || privacyConsent !== "yes") return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Financial Intelligence pilot — ${companyName}`;
    html = row("Type", "Financial Intelligence controlled pilot") + row("First name", firstName) + row("Last name", lastName) + row("Work email", companyEmail) + row("Company", companyName) + row("Role", jobTitle) + row("Country", country) + row("Document type", documentType) + row("Approximate monthly volume", monthlyVolume) + row("Primary objective", primaryObjective) + row("Privacy consent", "Yes");
  } else if (intent === "pilot_acceptance") {
    if (!companyEmail || !emailPattern.test(companyEmail) || !companyName || privacyConsent !== "yes") return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Standard pilot offer accepted — ${companyName}`;
    html = row("Type", "Financial Intelligence standard pilot acceptance") + row("Work email", companyEmail) + row("Company", companyName) + row("Offer", "€490 excluding VAT, where applicable") + row("Payment", "100% in advance") + row("Privacy consent", "Yes");
  } else if (intent === "project") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !country || !jobTitle || !phoneNumber || !message || (marketingConsent && marketingConsent !== "yes")) return Response.json({ ok: false }, { status: 400 });
    const selectedTopic = topic && isTopicKey(topic) ? topicOptions[topic] : null;
    const selectedProblemArea = problemAreaForTopic(topic ?? undefined);
    subject = `[Entimema] New project${selectedTopic ? ` — ${selectedTopic}` : ""}`;
    html = row("Type", "Sales / Start with a problem") + row("Problem area", selectedProblemArea) + row("Topic / service", selectedTopic) + row("First name", firstName) + row("Last name", lastName) + row("E-mail", companyEmail) + row("Company", companyName) + row("Country", country) + row("Job title", jobTitle) + row("Phone number", phoneNumber) + row("How did you hear about Entimema?", referralSource) + row("Marketing communications consent", marketingConsent === "yes" ? "Yes" : "No") + row("Problem / context", message);
  } else if (intent === "partnership") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !country || !jobTitle || !phoneNumber || !message || !partnershipType || !allowedPartnershipTypes.has(partnershipType) || (marketingConsent && marketingConsent !== "yes")) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Partnership — ${companyName}`;
    html = row("Type", "Partnership") + row("First name", firstName) + row("Last name", lastName) + row("E-mail", companyEmail) + row("Company", companyName) + row("Country", country) + row("Job title", jobTitle) + row("Phone number", phoneNumber) + row("How did you hear about Entimema?", referralSource) + row("Marketing communications consent", marketingConsent === "yes" ? "Yes" : "No") + row("Partnership type", partnershipType) + row("Proposal", message);
  } else if (intent === "client") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !phoneNumber || !message || !inquiryType || !allowedInquiryTypes.has(inquiryType)) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Existing client — ${inquiryType}`;
    html = row("Type", "Existing client") + row("First name", firstName) + row("Last name", lastName) + row("E-mail", companyEmail) + row("Company", companyName) + row("Phone number", phoneNumber) + row("Project / service", project) + row("Inquiry type", inquiryType) + row("Description", message);
  } else if (intent === "newsletter") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !jobTitle || newsletterConsent !== "yes") return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Newsletter subscription — ${companyName}`;
    html = row("Type", "Decision Signals subscription") + row("First name", firstName) + row("Last name", lastName) + row("Job title", jobTitle) + row("E-mail", companyEmail) + row("Company", companyName) + row("Newsletter consent", "Yes");
  } else {
    return Response.json({ ok: false }, { status: 400 });
  }

  const replyTo = intent === "pilot" || intent === "pilot_acceptance" || intent === "project" || intent === "partnership" || intent === "client" || intent === "newsletter" ? companyEmail : email;
  if (!replyTo) return Response.json({ ok: false }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ ok: false }, { status: 503 });

  try {
    const resend = new Resend(apiKey);
    const { error } = intent === "pilot_acceptance"
      ? await resend.batch.send([
          {
            from: "Entimema <website@entimema.net>",
            to: "office@entimema.com",
            replyTo,
            subject,
            html,
          },
          {
            from: "Entimema <website@entimema.net>",
            to: replyTo,
            replyTo: "office@entimema.com",
            subject: "Financial Intelligence pilot — acceptance confirmed",
            html: pilotAcceptanceConfirmation(companyName!),
          },
        ])
      : await resend.emails.send({
          from: "Entimema Website <website@entimema.net>",
          to: "office@entimema.com",
          replyTo,
          subject,
          html,
        });
    if (error) return Response.json({ ok: false }, { status: 502 });
    return Response.json({ ok: true }, { headers: { "X-Entimema-Submission": "accepted" } });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
