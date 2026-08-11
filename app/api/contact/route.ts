import { Resend } from "resend";
import { clientInquiryTypes, isTopicKey, partnershipTypes, problemAreas, topicOptions } from "@/app/contact/contact-config";

const allowedPartnershipTypes = new Set<string>(partnershipTypes);
const allowedInquiryTypes = new Set<string>(clientInquiryTypes);
const allowedProblemAreas = new Set<string>(problemAreas);
const allowedKeys = new Set(["intent", "topic", "topicName", "problemArea", "name", "email", "company", "role", "partnershipType", "project", "inquiryType", "message", "website"]);
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
  const email = text(body.email, 254);
  const company = text(body.company, 160);
  const role = text(body.role, 160);
  const message = text(body.message, 4000);
  const topic = text(body.topic, 80);
  const topicName = text(body.topicName, 80);
  const problemArea = text(body.problemArea, 80);
  const partnershipType = text(body.partnershipType, 160);
  const project = text(body.project, 160);
  const inquiryType = text(body.inquiryType, 160);

  if (!name || !email || !emailPattern.test(email) || !message || !intent) return Response.json({ ok: false }, { status: 400 });
  if (topic && !isTopicKey(topic)) return Response.json({ ok: false }, { status: 400 });

  let subject: string;
  let html: string;
  if (intent === "project") {
    if (!problemArea || !allowedProblemAreas.has(problemArea)) return Response.json({ ok: false }, { status: 400 });
    if (topicName && !isTopicKey(topicName)) return Response.json({ ok: false }, { status: 400 });
    const selectedTopic = topicName && isTopicKey(topicName) ? topicOptions[topicName] : topic && isTopicKey(topic) ? topicOptions[topic] : null;
    subject = `[Entimema] New project${selectedTopic ? ` — ${selectedTopic}` : ""}`;
    html = row("Type", "New project") + row("Problem area", problemArea) + row("Topic / service", selectedTopic) + row("Name", name) + row("E-mail", email) + row("Company", company) + row("Role", role) + row("Problem / context", message);
  } else if (intent === "partnership") {
    if (!company || !partnershipType || !allowedPartnershipTypes.has(partnershipType)) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Partnership — ${company}`;
    html = row("Type", "Partnership") + row("Name", name) + row("E-mail", email) + row("Company", company) + row("Role", role) + row("Partnership type", partnershipType) + row("Proposal", message);
  } else if (intent === "client") {
    if (!company || !inquiryType || !allowedInquiryTypes.has(inquiryType)) return Response.json({ ok: false }, { status: 400 });
    subject = `[Entimema] Existing client — ${inquiryType}`;
    html = row("Type", "Existing client") + row("Name", name) + row("E-mail", email) + row("Company", company) + row("Project / service", project) + row("Inquiry type", inquiryType) + row("Description", message);
  } else {
    return Response.json({ ok: false }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return Response.json({ ok: false }, { status: 503 });

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: "Entimema Website <website@entimema.net>",
      to: "office@entimema.net",
      replyTo: email,
      subject,
      html,
    });
    if (error) return Response.json({ ok: false }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}
