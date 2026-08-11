const round = (value: number, decimals = 2) => Number(value.toFixed(decimals));

export const operationalForecastModel = {
  base: { volume: 100_000, price: 100, materialRate: 40, conversionRate: 15, fixedCost: 3_000_000 },
  forecast: { volume: 108_000, price: 102, materialRate: 42, conversionRate: 15.5, fixedCost: 3_120_000 },
} as const;

const calculate = (input: typeof operationalForecastModel.base | typeof operationalForecastModel.forecast) => {
  const revenue = round(input.volume * input.price);
  const material = round(input.volume * input.materialRate);
  const conversion = round(input.volume * input.conversionRate);
  const variableCost = round(material + conversion);
  const contribution = round(revenue - variableCost);
  const ebitda = round(contribution - input.fixedCost);
  return { revenue, material, conversion, variableCost, contribution, ebitda };
};

export const baseForecastResults = calculate(operationalForecastModel.base);
export const driverForecastResults = calculate(operationalForecastModel.forecast);
export const ebitdaBridge = {
  base: baseForecastResults.ebitda,
  volume: (operationalForecastModel.forecast.volume - operationalForecastModel.base.volume) * (operationalForecastModel.base.price - operationalForecastModel.base.materialRate - operationalForecastModel.base.conversionRate),
  price: operationalForecastModel.forecast.volume * (operationalForecastModel.forecast.price - operationalForecastModel.base.price),
  material: -operationalForecastModel.forecast.volume * (operationalForecastModel.forecast.materialRate - operationalForecastModel.base.materialRate),
  conversion: -operationalForecastModel.forecast.volume * (operationalForecastModel.forecast.conversionRate - operationalForecastModel.base.conversionRate),
  fixed: -(operationalForecastModel.forecast.fixedCost - operationalForecastModel.base.fixedCost),
} as const;

const bridgeTotal = Object.values(ebitdaBridge).reduce((sum, value) => sum + value, 0);
const checks = [
  [baseForecastResults.revenue, 10_000_000, "Base revenue"], [baseForecastResults.variableCost, 5_500_000, "Base variable cost"],
  [baseForecastResults.contribution, 4_500_000, "Base contribution"], [baseForecastResults.ebitda, 1_500_000, "Base EBITDA"],
  [driverForecastResults.revenue, 11_016_000, "Forecast revenue"], [driverForecastResults.material, 4_536_000, "Forecast material"],
  [driverForecastResults.conversion, 1_674_000, "Forecast conversion"], [driverForecastResults.variableCost, 6_210_000, "Forecast variable cost"],
  [driverForecastResults.contribution, 4_806_000, "Forecast contribution"], [driverForecastResults.ebitda, 1_686_000, "Forecast EBITDA"],
  [bridgeTotal, 1_686_000, "EBITDA bridge reconciliation"],
] as const;

export function validateOperationalForecastModel() {
  for (const [actual, expected, label] of checks) if (actual !== expected) throw new Error(`${label}: expected ${expected}, received ${actual}`);
  return checks.map(([actual, expected, label]) => ({ label, actual, expected, valid: true as const }));
}
export const operationalForecastValidation = validateOperationalForecastModel();
