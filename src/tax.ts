import { deductionInput, tax } from './objects.js';

export function setTax() {
  tax.deduction.incomeTax.amount = deductionInput.loss.casualtyLoss.amount;
  console.log('casualtyLoss:', deductionInput.loss.casualtyLoss.amount);
  console.log('Tax:', tax);
  return;
}
