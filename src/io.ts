import { system } from './objects.js';
import { getProfile, getDeductionInput /*, taxElements*/ } from './elements.js';
import { showProfile, showTax } from './elements.js';

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

export function updateProfile() {
  //setProfile();
  return;
}

export function updateTaxable() {
  return;
}

export function updateDeductions() {
  return;
}

export function updateTax() {
  return;
}

export { showProfile };

export { showTax };
