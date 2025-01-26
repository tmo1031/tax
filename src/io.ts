import { system } from './objects.js';
//import { getProfile, getDeductionInput, taxElements, setProfile } from './elements.js';
import { getProfile /*getDeductionInput, taxElements*/ } from './elements.js';

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
//export { getDeductionInput };

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

export function showTax() {
  /*
  Object.values(taxElements).forEach((category) => {
    Object.values(category).forEach(({ element, value }) => {
      if (element) {
        element.textContent = `${value}`;
      }
    });
  });
  */
  return;
}
