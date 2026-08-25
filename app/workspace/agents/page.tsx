import Link from "next/link";
import { WorkspaceFrame } from "../components/WorkspaceFrame";
export default function AgentsPage(){return <WorkspaceFrame title="Agents" active="agents"><div className="indexView"><p className="eyebrow">Agent library</p><h1>Operational agents</h1><Link className="agentRow" href="/workspace/agents/document-classifier"><span className="agentGlyph">DC</span><span><strong>Document Classifier</strong><small>Classify and route financial documents</small></span><b>Production</b><i>Open →</i></Link></div></WorkspaceFrame>}
