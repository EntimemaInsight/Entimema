const round = (value: number, decimals = 2) => Number(value.toFixed(decimals));

export const manufacturingCostModel = {
  stage1: {
    primaryMaterial: 420,
    reagents: 55,
    utilities: 60,
    conversion: 45,
  },
  stage2: {
    additionalMaterials: 40,
    utilities: 65,
    directConversion: 35,
    productionOverhead: 95,
  },
  sellingPrice: 910,
  fixedProductionOverhead: 61_750,
  normalProductionTonnes: 1_000,
  actualProductionTonnes: 650,
  utilitiesVariance: {
    price: 7,
    consumptionEfficiency: 5,
    volumeCapacity: 8,
  },
} as const;

const stage1Total = Object.values(manufacturingCostModel.stage1).reduce((sum, value) => sum + value, 0);
const stage2Total = stage1Total + Object.values(manufacturingCostModel.stage2).reduce((sum, value) => sum + value, 0);
const reportedMargin = manufacturingCostModel.sellingPrice - stage2Total;
const reportedMarginPercent = round((reportedMargin / manufacturingCostModel.sellingPrice) * 100, 1);
const normalCapacityOverhead = round(manufacturingCostModel.fixedProductionOverhead / manufacturingCostModel.normalProductionTonnes);
const actualAbsorbedOverhead = round(manufacturingCostModel.fixedProductionOverhead / manufacturingCostModel.actualProductionTonnes);
const underutilisationEffect = round(actualAbsorbedOverhead - normalCapacityOverhead);
const normalisedManufacturingEconomics = round(stage2Total - underutilisationEffect);
const normalisedEconomicMargin = round(manufacturingCostModel.sellingPrice - normalisedManufacturingEconomics);
const totalUtilitiesVariance = Object.values(manufacturingCostModel.utilitiesVariance).reduce((sum, value) => sum + value, 0);

export const manufacturingCostResults = {
  stage1Total,
  reportedManufacturingCost: stage2Total,
  reportedMargin,
  reportedMarginPercent,
  normalCapacityOverhead,
  actualAbsorbedOverhead,
  underutilisationEffect,
  normalisedManufacturingEconomics,
  normalisedEconomicMargin,
  totalUtilitiesVariance,
} as const;

const validationChecks = [
  [stage1Total, 580, "Stage 1 total"],
  [stage2Total, 815, "Reported manufacturing cost"],
  [reportedMargin, 95, "Reported margin"],
  [reportedMarginPercent, 10.4, "Reported margin percentage"],
  [normalCapacityOverhead, 61.75, "Normal-capacity overhead"],
  [actualAbsorbedOverhead, 95, "Actual absorbed overhead"],
  [underutilisationEffect, 33.25, "Underutilisation effect"],
  [normalisedManufacturingEconomics, 781.75, "Normalised manufacturing economics"],
  [normalisedEconomicMargin, 128.25, "Normalised economic margin"],
  [totalUtilitiesVariance, 20, "Utilities variance"],
] as const;

export function validateManufacturingCostModel() {
  for (const [actual, expected, label] of validationChecks) {
    if (actual !== expected) throw new Error(`${label} validation failed: expected ${expected}, received ${actual}`);
  }
  return validationChecks.map(([actual, expected, label]) => ({ label, actual, expected, valid: true as const }));
}

export const manufacturingCostValidation = validateManufacturingCostModel();
