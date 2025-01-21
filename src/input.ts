//import { system, profile, deductionInput } from './objects.js';
import { system } from './objects.js';
import { getProfile, getDeductionInput } from './elements.js';

export function getTaxYear() {
  const taxYearInput = document.getElementById('taxYear') as HTMLInputElement | null;
  if (!taxYearInput) {
    console.error('TaxYear input not found');
    return;
  }
  system.taxYear = parseInt(taxYearInput.value, 10);
  return;
}

export { getProfile };
export { getDeductionInput };

export function getTaxable() {
  const taxableInput = document.getElementById('taxable') as HTMLInputElement | null;
  if (!taxableInput) {
    console.error('Taxable input not found');
    return;
  }
  return parseInt(taxableInput.value, 10);
}
