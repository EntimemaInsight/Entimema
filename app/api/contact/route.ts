import { Resend } from "resend";
import { clientInquiryTypes, isTopicKey, partnershipTypes, problemAreaForTopic, topicOptions } from "@/app/contact/contact-config";

const allowedPartnershipTypes = new Set<string>(partnershipTypes);
const allowedInquiryTypes = new Set<string>(clientInquiryTypes);
const allowedKeys = new Set(["intent", "topic", "topicName", "problemArea", "name", "firstName", "lastName", "email", "companyEmail", "company", "companyName", "country", "phone", "phoneNumber", "referralSource", "marketingConsent", "role", "jobTitle", "partnershipType", "project", "inquiryType", "message", "website"]);
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
  const name = text(body.name, 160);
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

  if (!intent || (intent !== "project" && (!email || !emailPattern.test(email)))) return Response.json({ ok: false }, { status: 400 });
  if (topic && !isTopicKey(topic)) return Response.json({ ok: false }, { status: 400 });

  let subject: string;
  let html: string;
  if (intent === "demo") {
    if (!firstName || !lastName || !company || !country || !phone || (marketingConsent && marketingConsent !== "yes")) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Demo discovery — ${company}`;
    html = row("Type", "Demo / Discover Entimema") + row("First name", firstName) + row("Last name", lastName) + row("E-mail", email) + row("Company", company) + row("Country", country) + row("Job title", role) + row("Phone number", phone) + row("How did you hear about Entimema?", referralSource) + row("Marketing communications consent", marketingConsent === "yes" ? "Yes" : "No");
  } else if (intent === "project") {
    if (!firstName || !lastName || !companyEmail || !emailPattern.test(companyEmail) || !companyName || !country || !jobTitle || !phoneNumber || !message || (marketingConsent && marketingConsent !== "yes")) return Response.json({ ok: false }, { status: 400 });
    const selectedTopic = topic && isTopicKey(topic) ? topicOptions[topic] : null;
    const selectedProblemArea = problemAreaForTopic(topic ?? undefined);
    subject = `[Entimema] New project${selectedTopic ? ` — ${selectedTopic}` : ""}`;
    html = row("Type", "Sales / Start with a problem") + row("Problem area", selectedProblemArea) + row("Topic / service", selectedTopic) + row("First name", firstName) + row("Last name", lastName) + row("E-mail", companyEmail) + row("Company", companyName) + row("Country", country) + row("Job title", jobTitle) + row("Phone number", phoneNumber) + row("How did you hear about Entimema?", referralSource) + row("Marketing communications consent", marketingConsent === "yes" ? "Yes" : "No") + row("Problem / context", message);
  } else if (intent === "partnership") {
    if (!name || !message || !company || !partnershipType || !allowedPartnershipTypes.has(partnershipType)) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Partnership — ${company}`;
    html = row("Type", "Partnership") + row("Name", name) + row("E-mail", email) + row("Company", company) + row("Role", role) + row("Partnership type", partnershipType) + row("Proposal", message);
  } else if (intent === "client") {
    if (!name || !message || !company || !inquiryType || !allowedInquiryTypes.has(inquiryType)) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Existing client — ${inquiryType}`;
    html = row("Type", "Existing client") + row("Name", name) + row("E-mail", email) + row("Company", company) + row("Project / service", project) + row("Inquiry type", inquiryType) + row("Description", message);
  } else {
    return Response.json({ ok: false }, { status: 400 });
  }

  const replyTo = intent === "project" ? companyEmail : email;
  if (!replyTo) return Response.json({ ok: false }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ ok: false }, { status: 503 });

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Entimema Website <website@entimema.net>",
      to: "office@entimema.net",
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
