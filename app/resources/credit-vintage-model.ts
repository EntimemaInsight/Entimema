export const creditVintageModel = {
  metric: "Point-in-time 30+ DPD account rate",
  mobs: [1, 2, 3, 4],
  cohorts: [
    { name: "Jan", values: [1.2, 2.1, 2.8, 3.2] },
    { name: "Feb", values: [1.3, 2.2, 3.0, 3.5] },
    { name: "Mar", values: [1.5, 2.7, 3.8, 4.6] },
    { name: "Apr", values: [1.8, 3.1, 4.5, null] },
  ],
} as const;

const expected = [[1.2,2.1,2.8,3.2],[1.3,2.2,3,3.5],[1.5,2.7,3.8,4.6],[1.8,3.1,4.5,null]] as const;
export function validateCreditVintageModel() {
  creditVintageModel.cohorts.forEach((cohort, row) => cohort.values.forEach((value, column) => {
    if (value !== expected[row][column]) throw new Error(`${cohort.name} MOB ${column + 1}: expected ${expected[row][column]}, received ${value}`);
  }));
  if (creditVintageModel.cohorts[3].values[3] !== null) throw new Error("April MOB 4 must remain missing");
  return creditVintageModel.cohorts.map((cohort) => ({ cohort: cohort.name, values: cohort.values, valid: true as const }));
}
export const creditVintageValidation = validateCreditVintageModel();
