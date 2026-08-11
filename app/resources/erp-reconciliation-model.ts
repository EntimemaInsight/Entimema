export const erpReconciliationModel = { quantityTonnes:100, initialRate:500, adjustments:{ purchasePrice:2000, freight:1500, other:-500 }, finishedOutputTonnes:80 } as const;
const initialValue=erpReconciliationModel.quantityTonnes*erpReconciliationModel.initialRate;
const finalValue=initialValue+Object.values(erpReconciliationModel.adjustments).reduce((a,b)=>a+b,0);
const effectiveRate=finalValue/erpReconciliationModel.quantityTonnes;
const costPerOutputTonne=finalValue/erpReconciliationModel.finishedOutputTonnes;
export const erpReconciliationResults={initialValue,finalValue,effectiveRate,costPerOutputTonne} as const;
const checks=[[initialValue,50000,"Initial value"],[finalValue,53000,"Final value"],[effectiveRate,530,"Effective rate"],[costPerOutputTonne,662.5,"Cost per output tonne"]] as const;
export function validateErpReconciliationModel(){for(const [actual,expected,label] of checks)if(actual!==expected)throw new Error(`${label}: expected ${expected}, received ${actual}`);return checks.map(([actual,expected,label])=>({label,actual,expected,valid:true as const}));}
export const erpReconciliationValidation=validateErpReconciliationModel();
