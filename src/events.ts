import { Profile, Contract, profile } from './objects.js';

export function handleTaxYearChange(id: string) {
  console.log(`Tax Year changed: ${id}`);
  updateJapaneseYear();
}

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

export function handleYearChange(id: string) {
  console.log(`Year changed: ${id}`);
  const taxYearElement = document.getElementById('taxYear') as HTMLInputElement | null;
  const birthYearElement = document.getElementById('birthYear') as HTMLInputElement | null;
  const birthYearSElement = document.getElementById('birthYearS') as HTMLInputElement | null;
  const moveInYearElement = document.getElementById('moveInYear') as HTMLInputElement | null;
  const renovYearElement = document.getElementById('renovYear') as HTMLInputElement | null;
  const minorsElement = document.getElementById('minors') as HTMLInputElement | null;
  const applyResidentTaxDivElement = document.getElementById('applyResidentTaxDiv') as HTMLDivElement | null;
  const spH19DivElement = document.getElementById('spH19Div') as HTMLDivElement | null;
  const spR1DivElement = document.getElementById('spR1Div') as HTMLDivElement | null;
  const covid19DivElement = document.getElementById('covid19Div') as HTMLDivElement | null;
  const spR3DivElement = document.getElementById('spR3Div') as HTMLDivElement | null;
  const smallDivElement = document.getElementById('smallDiv') as HTMLDivElement | null;
  const parentingDivElement = document.getElementById('parentingDiv') as HTMLDivElement | null;
  const spR6DivElement = document.getElementById('spR6Div') as HTMLDivElement | null;

  if (taxYearElement && birthYearElement && birthYearSElement && moveInYearElement && renovYearElement) {
    // 年齢を更新
    // updateAge();
    const taxYear = parseInt(taxYearElement.value, 10);
    const birthYear = parseInt(birthYearElement.value, 10);
    const birthYearS = parseInt(birthYearSElement.value, 10);
    const moveInYear = parseInt(moveInYearElement.value, 10);
    const renovYear = parseInt(renovYearElement.value, 10);
    const age = taxYear - birthYear;
    const ageS = taxYear - birthYearS;
    const moveInAge = taxYear - moveInYear;
    const renovAge = taxYear - renovYear;
    updateAge(age, profile.applicant);
    updateAge(ageS, profile.spouse);
    updateAge(moveInAge, profile.estate.house);
    updateAge(moveInAge, profile.estate.land);
    updateAge(renovAge, profile.estate.renovation);
  }
  if (taxYearElement && birthYearElement && minorsElement) {
    // 年度によって未成年者へのチェックボックスを有効化を切り替える
    const taxYear = parseInt(taxYearElement.value, 10);
    const birthYear = parseInt(birthYearElement.value, 10);
    const age = taxYear - birthYear;
    minorsElement.checked = age < 20 ? true : false;
  }
  if (
    moveInYearElement &&
    renovYearElement &&
    applyResidentTaxDivElement &&
    spH19DivElement &&
    spR1DivElement &&
    covid19DivElement &&
    spR3DivElement &&
    smallDivElement &&
    parentingDivElement &&
    spR6DivElement
  ) {
    // 家の入居年度によって特例適用のチェックボックスの有効化を切り替える
    const moveInYear = parseInt(moveInYearElement.value, 10);
    const renovYear = parseInt(renovYearElement.value, 10);
    applyResidentTaxDivElement.style.display =
      (moveInYear >= 1999 && moveInYear <= 2006) || (renovYear >= 1999 && renovYear <= 2006) ? 'block' : 'none';
    spH19DivElement.style.display =
      moveInYear === 2007 || moveInYear === 2008 || renovYear === 2007 || renovYear === 2008 ? 'block' : 'none';
    spR1DivElement.style.display =
      (moveInYear >= 2019 && moveInYear <= 2021) || (renovYear >= 2019 && renovYear <= 2021) ? 'block' : 'none';
    covid19DivElement.style.display =
      (moveInYear >= 2020 && moveInYear <= 2021) || (renovYear >= 2020 && renovYear <= 2021) ? 'block' : 'none';
    spR3DivElement.style.display =
      (moveInYear >= 2020 && moveInYear <= 2021) || (renovYear >= 2020 && renovYear <= 2021) ? 'block' : 'none';
    smallDivElement.style.display = moveInYear >= 2020 || renovYear >= 2020 ? 'block' : 'none';
    parentingDivElement.style.display = moveInYear === 2024 || renovYear === 2024 ? 'block' : 'none';
    spR6DivElement.style.display = moveInYear === 2024 || renovYear === 2024 ? 'block' : 'none';
  }
}

export function handleHasSpouseChange(id: string) {
  // 配偶者の有無によって配偶者の入力を有効化を切り替える
  console.log(`Has Spouse changed: ${id}`);
  const spouseCheckElement = document.getElementById('spouseCheck') as HTMLInputElement | null;
  const spouseElement = document.getElementById('spouse') as HTMLDivElement | null;
  if (spouseCheckElement && spouseElement) {
    const isChecked = spouseCheckElement.checked;
    spouseElement.style.display = isChecked ? 'block' : 'none';
  } else {
    console.error('Spouse check element not found');
  }
}

export function handleLoanSelectChange(id: string) {
  console.log(`Loan Select changed: ${id}`);
  // ローンの有無で表示を切り替える
  const loanSelectElement = document.getElementById('LoanSelect') as HTMLSelectElement | null;
  const houseElement = document.getElementById('house') as HTMLDivElement | null;
  const renovationElement = document.getElementById('renovation') as HTMLDivElement | null;
  const loanElement = document.getElementById('loan') as HTMLDivElement | null;
  if (loanSelectElement && houseElement && renovationElement && loanElement) {
    const loanType = loanSelectElement.value;
    houseElement.style.display = loanType === 'Purchase' || loanType === 'Both' ? 'block' : 'none';
    renovationElement.style.display = loanType === 'Renovation' || loanType === 'Both' ? 'block' : 'none';
    loanElement.style.display = loanType === 'None' || loanType === '' ? 'none' : 'block';
  } else {
    console.error('Loan select element not found');
  }
}

export function handleIncomeChange(id: string) {
  console.log(`Income changed: ${id}`);
  // updateIncome();
  // 収入によって寡婦/勤労学生の有効化を切り替える
}

export function handleDependentChange(id: string) {
  console.log(`Dependent changed: ${id}`);
  // updateDependent();
  // 扶養家族の有無によって寡婦の有効化を切り替える
}

function updateAge(age: number, profile: Profile | Contract) {
  profile.age = age;
}
