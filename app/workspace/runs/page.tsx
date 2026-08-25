import { WorkspaceFrame } from "../components/WorkspaceFrame";
import { RunsTable } from "../components/RunsTable";
export default function RunsPage(){return <WorkspaceFrame title="Runs" active="runs"><div className="indexView"><p className="eyebrow">Execution record</p><h1>Runs</h1><RunsTable /></div></WorkspaceFrame>}
