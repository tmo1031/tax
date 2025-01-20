//import { system, profile, deductionInput } from './objects.js';
import { system } from './objects.js';

export function getTaxYear() {
  const taxYearInput = document.getElementById('taxYear') as HTMLInputElement | null;
  if (!taxYearInput) {
    console.error('TaxYear input not found');
    return;
  }
  system.taxYear = parseInt(taxYearInput.value, 10);
  return;
}

export function getProfile() {
  const profileInput = document.getElementById('profile') as HTMLInputElement | null;
  if (!profileInput) {
    console.error('Profile input not found');
    return;
  }
  return parseInt(profileInput.value, 10);
}

export function getTaxable() {
  const taxableInput = document.getElementById('taxable') as HTMLInputElement | null;
  if (!taxableInput) {
    console.error('Taxable input not found');
    return;
  }
  return parseInt(taxableInput.value, 10);
}

export function getDeductions() {
  const deductionsInput = document.getElementById('deductions') as HTMLInputElement | null;
  if (!deductionsInput) {
    console.error('Deductions input not found');
    return;
  }
  return parseInt(deductionsInput.value, 10);
}
