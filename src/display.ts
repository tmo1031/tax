import { taxElements, setProfile } from './elements.js';

export function updateJapaneseYear() {
  const taxYearInput = document.getElementById('taxYear') as HTMLInputElement | null;
  const japaneseYearLabel = document.getElementById('japaneseYear');

  if (!taxYearInput || !japaneseYearLabel) {
    console.error('TaxYear input or JapaneseYear label not found');
    return;
  }

  // 西暦から元号への変換
  const taxYear = parseInt(taxYearInput.value, 10);
  const showaStartYear = 1925; // 昭和元年の開始年
  const heiseiStartYear = 1989; // 平成元年の開始年
  const reiwaStartYear = 2019; // 令和元年の開始年

  if (taxYear >= reiwaStartYear) {
    japaneseYearLabel.textContent = '令和' + `${taxYear - reiwaStartYear + 1}`;
  } else if (taxYear >= heiseiStartYear) {
    japaneseYearLabel.textContent = '平成' + `${taxYear - heiseiStartYear + 1}`;
  } else {
    japaneseYearLabel.textContent = '昭和' + `${taxYear - showaStartYear + 1}`;
  }
}

export function updateProfile() {
  setProfile();
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
  Object.values(taxElements).forEach((category) => {
    Object.values(category).forEach(({ element, value }) => {
      if (element) {
        element.textContent = `${value}`;
      }
    });
  });

  return;
}
