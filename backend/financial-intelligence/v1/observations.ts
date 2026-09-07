import type {
  Analysis,
  AnalysisKpi,
  Finding,
  Kpi,
  Statement,
} from "./contract";

const fmt = (value: number) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value);

/** Templates interpret verified calculations only; no AI arithmetic or causal inference. */
export function firstAnalysis(statement: Statement, calculated: AnalysisKpi[]) {
  const candidates: { finding: Finding; rank: number }[] = [];
  const annual = statement.periods
    .filter((p) => /^\d{4}$/.test(p))
    .sort()
    .reverse();
  const latest = annual[0] ?? statement.periods[0];
  for (const kpi of calculated.filter((k) => k.currentPeriod === latest)) {
    const evidence = {
      kpiIds: [kpi.id],
      sourceConcepts: kpi.evidence
        .map((e) => e.concept)
        .filter((c, i, all) => all.indexOf(c) === i),
    };
    let text: string;
    let rank = 0;
    let severity: Finding["severity"] = "neutral";
    if (kpi.status === "sign_change") {
      const direction =
        kpi.direction === "positive_to_negative"
          ? "positive to negative"
          : "negative to positive";
      text = `${kpi.label.replace(" growth", "")} changed from ${direction} between ${kpi.priorPeriod} and ${latest}; a conventional growth percentage is not presented.`;
      rank = 1000;
      severity =
        kpi.direction === "positive_to_negative" ? "attention" : "positive";
    } else if (kpi.status !== "valid") {
      // Missing source concepts are not financial claims. Explain the limitation explicitly.
      text = `${kpi.label} for ${latest} is ${kpi.status === "not_meaningful" ? "not meaningful" : "unavailable"}: ${kpi.reason}`;
      rank = -1;
    } else if (kpi.type === "margin") {
      const previous = calculated.find(
        (k) =>
          k.label === kpi.label &&
          k.currentPeriod === String(Number(latest) - 1) &&
          k.status === "valid",
      );
      if (previous?.status === "valid") {
        evidence.kpiIds.push(previous.id);
        const delta = kpi.value - previous.value;
        text = `${kpi.label} moved from ${fmt(previous.value)}% to ${fmt(kpi.value)}% in ${latest}, indicating ${delta < 0 ? "weaker" : delta > 0 ? "stronger" : "unchanged"} ${kpi.label.replace(" margin", "").toLowerCase()} profitability.`;
        rank = Math.abs(delta);
        severity = delta < 0 ? "attention" : delta > 0 ? "positive" : "neutral";
      } else {
        text = `${kpi.label} was ${fmt(kpi.value)}% in ${latest}.`;
        severity = kpi.value < 0 ? "attention" : "neutral";
      }
    } else {
      // Do not describe a positive formula result on two losses as improving profit.
      text =
        kpi.priorValue! < 0
          ? `${kpi.label} was ${fmt(kpi.value)}% in ${latest} under the signed-prior convention; the prior period was negative, so the percentage alone does not indicate improvement.`
          : `${kpi.label.replace(" growth", "")} ${kpi.value === 0 ? "was unchanged" : `${kpi.value > 0 ? "increased" : "decreased"} by ${fmt(Math.abs(kpi.value))}%`} in ${latest} versus ${kpi.priorPeriod}.`;
      rank = Math.abs(kpi.value);
      severity =
        kpi.priorValue! < 0
          ? "neutral"
          : kpi.value < 0
            ? "attention"
            : kpi.value > 0
              ? "positive"
              : "neutral";
    }
    candidates.push({
      finding: {
        id: `finding:${kpi.id}`,
        title: kpi.label,
        statement: text,
        severity,
        evidence,
      },
      rank,
    });
  }
  const findings = candidates
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 5)
    .map((c) => c.finding);
  const executiveSummary =
    findings
      .slice(0, 3)
      .map((f) => f.statement)
      .join(" ") ||
    "Verified source values are available, but analytical inputs are unavailable.";
  const analysis: Analysis = { kpis: calculated, executiveSummary, findings };
  // Compatibility projections, not a second calculation or interpretation path.
  const kpis: Kpi[] = calculated
    .filter((k) => k.status === "valid")
    .map((k) => ({
      label: k.label,
      period: k.currentPeriod,
      value: k.value!,
      unit: "%",
    }));
  return {
    analysis,
    kpis,
    summary: executiveSummary,
    findings: findings.map((f) => f.statement),
  };
}
