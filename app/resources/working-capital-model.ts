const round = (value: number, decimals = 2) => Number(value.toFixed(decimals));

export const workingCapitalModel = {
  annualRevenue: 36_000_000,
  annualCogs: 25_200_000,
  current: { dso: 60, dio: 75, dpo: 45 },
  scenario: { dso: 52, dio: 65, dpo: 45 },
  financingRate: 0.06,
  days: 365,
} as const;

const receivables = round(workingCapitalModel.annualRevenue * workingCapitalModel.current.dso / workingCapitalModel.days);
const inventory = round(workingCapitalModel.annualCogs * workingCapitalModel.current.dio / workingCapitalModel.days);
const payables = round(workingCapitalModel.annualCogs * workingCapitalModel.current.dpo / workingCapitalModel.days);
const operatingWorkingCapital = round(receivables + inventory - payables);
const currentCcc = workingCapitalModel.current.dso + workingCapitalModel.current.dio - workingCapitalModel.current.dpo;
const scenarioCcc = workingCapitalModel.scenario.dso + workingCapitalModel.scenario.dio - workingCapitalModel.scenario.dpo;
const receivablesRelease = round(workingCapitalModel.annualRevenue * (workingCapitalModel.current.dso - workingCapitalModel.scenario.dso) / workingCapitalModel.days);
const inventoryRelease = round(workingCapitalModel.annualCogs * (workingCapitalModel.current.dio - workingCapitalModel.scenario.dio) / workingCapitalModel.days);
const totalCashRelease = round(receivablesRelease + inventoryRelease);
const financingEffect = round(totalCashRelease * workingCapitalModel.financingRate);

export const workingCapitalResults = { receivables, inventory, payables, operatingWorkingCapital, currentCcc, scenarioCcc, cccImprovement: currentCcc - scenarioCcc, receivablesRelease, inventoryRelease, totalCashRelease, financingEffect } as const;

const checks = [
  [currentCcc, 90, "Current CCC"], [receivables, 5_917_808.22, "Receivables"],
  [inventory, 5_178_082.19, "Inventory"], [payables, 3_106_849.32, "Payables"],
  [operatingWorkingCapital, 7_989_041.09, "Operating working capital"],
  [receivablesRelease, 789_041.1, "Receivables release"], [inventoryRelease, 690_410.96, "Inventory release"],
  [totalCashRelease, 1_479_452.06, "Total cash release"], [scenarioCcc, 72, "Scenario CCC"],
  [currentCcc - scenarioCcc, 18, "CCC improvement"], [financingEffect, 88_767.12, "Financing effect"],
] as const;

export function validateWorkingCapitalModel() {
  for (const [actual, expected, label] of checks) if (actual !== expected) throw new Error(`${label}: expected ${expected}, received ${actual}`);
  return checks.map(([actual, expected, label]) => ({ label, actual, expected, valid: true as const }));
}

export const workingCapitalValidation = validateWorkingCapitalModel();
