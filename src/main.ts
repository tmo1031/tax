import {
  updateJapaneseYear,
  handleYearChange,
  handleHasSpouseChange,
  handleLoanSelectChange,
  handleIncomeChange,
  handleDependentChange,
} from './events.js';
import { getTaxYear, getProfile, getDeductionInput, showTax } from './io.js';
import { getTaxable } from './taxable.js';
import { calcDeductions } from './deductions.js';
import { calcTax } from './tax.js';

export function initialize() {
  console.log('initialize');
  updateJapaneseYear();
  getTaxYear();
  getProfile();
  getDeductionInput();
  getTaxable();
  calcDeductions();
  calcTax();
  showTax();
}

export function refresh() {
  console.log('refresh');
  updateJapaneseYear();
  getTaxYear();
  getProfile();
  getDeductionInput();
  getTaxable();
  calcDeductions();
  calcTax();
  showTax();
}

const taxYearIds = ['taxYear'];
const yearIds = ['taxYear', 'birthYear', 'birthYearS', 'moveInYear', 'renovYear'];
const hasSpouseIds = ['spouseCheck'];
const loanSelectIDs = ['LoanSelect'];
const incomeIds = ['incomeSalary', 'taxableOther'];
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

export function specialEvents(id: string) {
  if (taxYearIds.includes(id)) {
    updateJapaneseYear();
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
