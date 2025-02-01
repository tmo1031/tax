import {
  profile,
  deductionInput,
  personalDeductions,
  incomeDeductions,
  taxCredits,
  paid,
  tax,
  system,
  Currency,
} from './objects.js';
import {
  getDividendCredit,
  getLoansCreditPre,
  getLoansCredit,
  getDonationCredit,
  getImprovementCredit,
  getDisasterCredit,
  getForeignTaxCredit,
  getDividendRefund,
  getStockRefund,
} from './taxCredits.js';
import { getTaxRate } from './taxSystem.js';
import { sumCurrency, subtractCurrency, multiplyCurrency, roundCurrency } from './functions.js';

export function calcTax() {
  console.log('calcTax');
  const taxYear = system.taxYear;

  function calcIncomeTax() {
    console.log('calcIncomeTax');
    console.log('profile:', profile);
    tax.income.incomeTax = profile.applicant.taxable.total;
    tax.income.residentTax = profile.applicant.taxable.total;
  }
  function calcDeduction() {
    console.log('calcDeduction');
    tax.deduction.incomeTax = sumCurrency(
      personalDeductions.personal.incomeTax,
      personalDeductions.spouse.incomeTax,
      personalDeductions.dependent.incomeTax,
      personalDeductions.basic.incomeTax,
      incomeDeductions.casualtyLoss.incomeTax,
      incomeDeductions.medical.incomeTax,
      incomeDeductions.social.incomeTax,
      incomeDeductions.pension.incomeTax,
      incomeDeductions.insuranceL.incomeTax,
      incomeDeductions.insuranceE.incomeTax,
      incomeDeductions.donations.incomeTax
    );
    tax.deduction.residentTax = sumCurrency(
      personalDeductions.personal.residentTax,
      personalDeductions.spouse.residentTax,
      personalDeductions.dependent.residentTax,
      personalDeductions.basic.residentTax,
      incomeDeductions.casualtyLoss.residentTax,
      incomeDeductions.medical.residentTax,
      incomeDeductions.social.residentTax,
      incomeDeductions.pension.residentTax,
      incomeDeductions.insuranceL.residentTax,
      incomeDeductions.insuranceE.residentTax,
      incomeDeductions.donations.residentTax
    );
  }
  function calcTaxable() {
    console.log('calcTaxable');
    tax.taxable.incomeTax = roundCurrency(subtractCurrency(tax.income.incomeTax, tax.deduction.incomeTax), 1000);
    tax.taxable.residentTax = roundCurrency(subtractCurrency(tax.income.residentTax, tax.deduction.residentTax), 1000);
  }
  function calcTaxPre() {
    console.log('calcTaxPre');
    tax.taxPre.incomeTax = roundCurrency(multiplyCurrency(tax.taxable.incomeTax, taxSystem.rate.incomeTax), 1);
    tax.taxPre.cityTax = multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.cityTax);
    tax.taxPre.prefTax = multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.prefTax);
    tax.taxPre.residentTax = sumCurrency(tax.taxPre.cityTax, tax.taxPre.prefTax);
  }
  /*
  function calcTaxPreAlt() {
    // 旧税率で計算した値 ここでは暫定
    console.log('calcTaxPreAlt');
    tax.taxPreAlt.incomeTax = roundCurrency(multiplyCurrency(tax.taxable.incomeTax, taxSystem.rate.incomeTax), 1);
    tax.taxPreAlt.cityTax = multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.cityTax);
    tax.taxPreAlt.prefTax = multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.prefTax);
    tax.taxPreAlt.residentTax = sumCurrency(tax.taxPre.cityTax, tax.taxPre.prefTax);
  }
    */

  function getTaxCredits() {
    taxCredits.Dividend = getDividendCredit(taxYear); // 配当控除の計算が難しいので保留
    const loanCredit = getLoansCreditPre(profile.estate, profile.applicant.taxable.total.amount);
    taxCredits.Loans = getLoansCredit(
      taxYear,
      profile.estate,
      profile.applicant.taxable.total.amount,
      loanCredit,
      tax.taxPre.incomeTax.amount,
      tax.taxPreAlt.incomeTax.amount
    );
    // 住宅取得と増改築の併用は保留
    taxCredits.Donations = getDonationCredit(taxYear, deductionInput.donations);
    taxCredits.ImprovementHouse = getImprovementCredit(taxYear, deductionInput.housing.improvement.amount);
    taxCredits.DisasterReduction = getDisasterCredit(taxYear, deductionInput.loss.disasterReduction.amount);
    taxCredits.ForeignTax = getForeignTaxCredit(taxYear, deductionInput.other.foreignTax.amount);
    taxCredits.Withholding_Dividend = getDividendRefund(taxYear, deductionInput.withholding.dividendJ.amount);
    taxCredits.Withholding_Stock = getStockRefund(taxYear, deductionInput.withholding.stockJ.amount);
    console.log('taxCredits:', taxCredits);
  }

  function calcTaxCredit() {
    console.log('calcTaxCredit');
    tax.taxCredit.incomeTax = sumCurrency(
      taxCredits.Dividend.incomeTax,
      taxCredits.Loans.incomeTax,
      taxCredits.Donations.incomeTax,
      taxCredits.ImprovementHouse.incomeTax,
      taxCredits.DisasterReduction.incomeTax,
      taxCredits.ForeignTax.incomeTax
    );
    tax.taxCredit.residentTax = sumCurrency(
      taxCredits.Dividend.residentTax,
      taxCredits.Loans.residentTax,
      taxCredits.Donations.residentTax,
      taxCredits.ForeignTax.residentTax,
      taxCredits.Withholding_Dividend.residentTax,
      taxCredits.Withholding_Stock.residentTax
    );

    tax.taxCredit.cityTax = multiplyCurrency(tax.taxCredit.residentTax, taxSystem.rate.cityRatio);
    tax.taxCredit.prefTax = multiplyCurrency(tax.taxCredit.residentTax, 1 - taxSystem.rate.cityRatio);
  }
  /*
  interface ExtendedTaxDetails {
    [key: string]: Currency;
  }

  interface TaxDetails {
    [key: string]: Currency;
  }
  */

  function calcTaxDetails(
    operand1: Record<string, Currency>,
    operand2: Record<string, Currency>,
    operator: (operand1: Currency, operand2: Currency) => Currency
  ): Record<string, Currency> {
    const result: Record<string, Currency> = {};
    for (const key in operand1) {
      if (Object.prototype.hasOwnProperty.call(operand1, key) && Object.prototype.hasOwnProperty.call(operand2, key)) {
        result[key] = operator(operand1[key], operand2[key]);
      }
    }
    return result;
  }

  function calcTaxVar() {
    console.log('calcTaxVar');
    tax.taxVar = calcTaxDetails(tax.taxPre, tax.taxCredit, subtractCurrency);
  }
  function calcTaxFixed() {
    console.log('calcTaxFixed');
    tax.taxFixed.cityTax = taxSystem.fixed.cityTax;
    tax.taxFixed.prefTax = taxSystem.fixed.prefTax;
    tax.taxFixed.ecoTax = taxSystem.fixed.ecoTax;
    tax.taxFixed.residentTax = sumCurrency(tax.taxFixed.cityTax, tax.taxFixed.prefTax, tax.taxFixed.ecoTax);
  }
  function calcTaxFinal() {
    console.log('calcTaxFinal');
    tax.taxFinal = calcTaxDetails(tax.taxVar, tax.taxFixed, sumCurrency);
  }
  function calcPaid() {
    console.log('calcPaid');
    tax.paid.incomeTax = sumCurrency(paid.withholdings.incomeTax, paid.nonResidents.incomeTax);
    tax.paid.residentTax = sumCurrency(paid.withholdings.residentTax, paid.nonResidents.residentTax);
  }
  function calcRefund() {
    console.log('calcRefund');
    tax.refund = calcTaxDetails(tax.taxFinal, tax.paid, subtractCurrency);
  }

  calcIncomeTax();
  calcTaxable();
  calcDeduction();

  const taxSystem = getTaxRate(taxYear, tax.taxable.incomeTax.amount, tax.taxable.residentTax.amount);
  console.log('taxSystem:', taxSystem);
  calcTaxPre();
  getTaxCredits();
  calcTaxCredit();
  calcTaxVar();
  calcTaxFixed();
  calcTaxFinal();
  calcPaid();
  calcRefund();
}

export function setTax() {
  calcTax();
  return;
}
