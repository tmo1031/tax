import { deductionInput, tax } from './objects.js';

export function calcTax() {
  tax.deduction.incomeTax.amount = deductionInput.loss.casualtyLoss.amount;
  console.log('casualtyLoss:', deductionInput.loss.casualtyLoss.amount);
  console.log('Tax:', tax);
  return;
}
