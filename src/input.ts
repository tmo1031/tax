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
