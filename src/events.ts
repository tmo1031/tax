import { updateJapaneseYear } from './display.js';

export function specialEvents(id: string) {
  if (taxYearIds.includes(id)) {
    handleTaxYearChange(id);
  }
  if (yearIds.includes(id)) {
    handleYearChange(id);
  }
  if (hasSpouseIds.includes(id)) {
    handleHasSpouseChange(id);
  }
  if (loanSelectIDs.includes(id)) {
    handleLoanSelectChange(id);
  }
  if (incomeIds.includes(id)) {
    handleIncomeChange(id);
  }
  if (dependentIds.includes(id)) {
    handleDependentChange(id);
  }
}

const taxYearIds = ['taxYear'];
function handleTaxYearChange(id: string) {
  console.log(`Tax Year changed: ${id}`);
  updateJapaneseYear();
}

const yearIds = ['taxYear', 'birthYear', 'birthYearS', 'moveInYear', 'renovYear'];
function handleYearChange(id: string) {
  console.log(`Year changed: ${id}`);
  // 年齢を更新
  // updateAge();
  // 年度によって未成年者へのチェックボックスを有効化を切り替える
  // 家の入居年度によって特例適用のチェックボックスの有効化を切り替える
}

const hasSpouseIds = ['spouseCheck'];
function handleHasSpouseChange(id: string) {
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

const loanSelectIDs = ['LoanSelect'];
function handleLoanSelectChange(id: string) {
  console.log(`Loan Select changed: ${id}`);
  // updateLoanSelect();
  // ローンの有無で表示を切り替える
}

/* const attributesIds = ['minors', 'disabilityP', 'disabilityO', 'singleP', 'singleO', 'student'];
function handleAttributesChange(id: string) {
  console.log(`Attributes changed: ${id}`);
  // updateAttributes();
}
 */

const incomeIds = ['incomeSalary', 'taxableOther'];
function handleIncomeChange(id: string) {
  console.log(`Income changed: ${id}`);
  // updateIncome();
  // 収入によって寡婦/勤労学生の有効化を切り替える
}

const dependentIds = [
  'dependentSpecified',
  'dependentElderlyLT',
  'dependentElderly',
  'dependentChild',
  'dependentOther',
  'dependentDisabilityLT',
  'dependentDisabilityP',
  'dependentDisabilityO',
];
function handleDependentChange(id: string) {
  console.log(`Dependent changed: ${id}`);
  // updateDependent();
  // 扶養家族の有無によって寡婦の有効化を切り替える
}
