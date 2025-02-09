import {
  profiles,
  deductionInputs,
  personalDeductions,
  incomeDeductions,
  taxCredits,
  paid,
  tax,
  taxReturn,
  system,
  Currency,
} from './objects.js';
import {
  getTaxAdjustment,
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
import { getTaxRate, getIncomeTaxRate } from './taxSystem.js';
import { sumCurrency, subtractCurrency, multiplyCurrency, roundCurrency } from './functions.js';

export function calcTax() {
  console.log('calcTax');
  const taxYear = system.taxYear;

  function calcIncomeTax() {
    console.log('calcIncomeTax');
    console.log('profile:', profiles);
    tax.income.incomeTax = profiles.applicant.taxable.total;
    tax.income.residentTax = profiles.applicant.taxable.total;
  }
  function calcDeduction() {
    console.log('calcDeduction');
    tax.deduction.incomeTax = sumCurrency(
      personalDeductions.personal.incomeTax,
      personalDeductions.spouse.incomeTax,
      personalDeductions.dependent.incomeTax,
      personalDeductions.elderly.incomeTax,
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
      personalDeductions.elderly.residentTax,
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
    const nonTaxable = profiles.nonTaxable.final;
    console.log('incomeTax:', tax.taxable.incomeTax.amount);
    console.log('incomeTaxRate:', taxSystem.rate.incomeTax);
    console.log('incomeTaxAdjustment:', taxSystem.adjustment.incomeTax);
    const incomeTaxPre = subtractCurrency(
      multiplyCurrency(tax.taxable.incomeTax, taxSystem.rate.incomeTax),
      taxSystem.adjustment.incomeTax
    );
    const cityTaxPre = subtractCurrency(
      multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.cityTax),
      taxSystem.adjustment.cityTax
    );
    const prefTaxPre = subtractCurrency(
      multiplyCurrency(tax.taxable.residentTax, taxSystem.rate.prefTax),
      taxSystem.adjustment.prefTax
    );
    tax.taxPre.incomeTax = roundCurrency(incomeTaxPre, 100);
    tax.taxPre.cityTax = nonTaxable ? { amount: 0 } : cityTaxPre;
    tax.taxPre.prefTax = nonTaxable ? { amount: 0 } : prefTaxPre;
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
  function calcTaxAdjusted() {
    console.log('calcAdjusted');
    console.log('personalDeductions:', personalDeductions);
    console.log('profiles.applicant.taxable.total.amount:', profiles.applicant.taxable.total.amount);
    console.log('tax.taxable.residentTax.amount:', tax.taxable.residentTax.amount);
    const taxAdjustment = getTaxAdjustment(
      personalDeductions,
      profiles.applicant.taxable.total.amount,
      tax.taxable.residentTax.amount
    );
    taxCredits.adjust = taxAdjustment.adjustment;
    taxSystem.delta = taxAdjustment.delta;
    console.log('taxAdjustment:', taxAdjustment);
    tax.taxAdjusted = calcTaxDetails(tax.taxPre, taxAdjustment.adjustment, subtractCurrency);
    console.log('tax.taxAdjusted:', tax.taxAdjusted);
  }

  function getTaxCredits() {
    const taxable = tax.taxable.incomeTax.amount;
    const taxableEstimated = Math.max(tax.taxable.residentTax.amount - taxSystem.delta, 0);
    const taxRate = getIncomeTaxRate(taxYear, taxable).incomeTaxRate;
    const taxRateEstimated = getIncomeTaxRate(taxYear, taxableEstimated).incomeTaxRate;
    const cityRatio = taxSystem.rate.cityRatio;

    console.log('taxable:', taxable, taxableEstimated);
    console.log('taxRate:', taxRate, taxRateEstimated);

    taxCredits.dividend = getDividendCredit(taxYear); // 配当控除の計算が難しいので保留
    const loanCredit = getLoansCreditPre(profiles.estate, profiles.applicant.taxable.total.amount);
    console.log('loanCredit:', loanCredit);
    taxCredits.loans = getLoansCredit(
      taxYear,
      profiles.estate,
      profiles.applicant.taxable.total.amount,
      loanCredit,
      tax.taxPre.incomeTax.amount,
      tax.taxPreAlt.incomeTax.amount
    );
    // 住宅取得と増改築の併用は保留
    taxCredits.donations = getDonationCredit(
      taxYear,
      deductionInputs.donations,
      taxReturn,
      profiles.applicant.taxable.carryOver.amount, //総所得金額等
      tax.taxAdjusted, //個人住民税所得割額（調整控除額控除後の額）
      taxRateEstimated
    );
    taxCredits.improvementHouse = getImprovementCredit(taxYear, deductionInputs.housing.improvement.amount);
    taxCredits.disasterReduction = getDisasterCredit(taxYear, deductionInputs.loss.disasterReduction.amount);
    taxCredits.foreignTax = getForeignTaxCredit(deductionInputs.other.foreignTax.amount, cityRatio);
    taxCredits.withholdingDividendCredit = getDividendRefund(deductionInputs.withholding.dividendJ.amount, cityRatio);
    taxCredits.withholdingStockCredit = getStockRefund(deductionInputs.withholding.stockJ.amount, cityRatio);
    console.log('taxCredits:', taxCredits);
  }

  function getPaid() {
    console.log('getPaid');
    paid.withholdings.incomeTax = sumCurrency(
      deductionInputs.withholding.salary,
      deductionInputs.withholding.stockS,
      deductionInputs.withholding.dividendS
    );
    paid.withholdings.residentTax = { amount: 0 };
    paid.nonResidents.incomeTax = { amount: 0 };
    paid.nonResidents.residentTax = deductionInputs.withholding.nonResidents;
  }

  function calcTaxCredit() {
    console.log('calcTaxCredit');
    tax.taxCredit.incomeTax = sumCurrency(
      taxCredits.dividend.incomeTax,
      taxCredits.loans.incomeTax,
      taxCredits.donations.incomeTax,
      taxCredits.improvementHouse.incomeTax,
      taxCredits.disasterReduction.incomeTax,
      taxCredits.foreignTax.incomeTax
    );
    /*
    tax.taxCredit.residentTax = sumCurrency(
      taxCredits.adjust.residentTax,
      taxCredits.dividend.residentTax,
      taxCredits.loans.residentTax,
      taxCredits.donations.residentTax,
      taxCredits.foreignTax.residentTax,
      taxCredits.withholdingDividendCredit.residentTax,
      taxCredits.withholdingStockCredit.residentTax
    );
    */
    tax.taxCredit.cityTax = sumCurrency(
      taxCredits.adjust.cityTax,
      taxCredits.dividend.cityTax,
      taxCredits.loans.cityTax,
      taxCredits.donations.cityTax,
      taxCredits.foreignTax.cityTax,
      taxCredits.withholdingDividendCredit.cityTax,
      taxCredits.withholdingStockCredit.cityTax
    );
    tax.taxCredit.prefTax = sumCurrency(
      taxCredits.adjust.prefTax,
      taxCredits.dividend.prefTax,
      taxCredits.loans.prefTax,
      taxCredits.donations.prefTax,
      taxCredits.foreignTax.prefTax,
      taxCredits.withholdingDividendCredit.prefTax,
      taxCredits.withholdingStockCredit.prefTax
    );
    tax.taxCredit.residentTax = sumCurrency(tax.taxCredit.cityTax, tax.taxCredit.prefTax);
  }

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
    const nonTaxable = profiles.nonTaxable.final || profiles.nonTaxable.var;
    tax.taxVar = calcTaxDetails(tax.taxPre, tax.taxCredit, subtractCurrency);
    if (nonTaxable) {
      tax.taxVar.cityTax = { amount: 0 };
      tax.taxVar.prefTax = { amount: 0 };
      tax.taxVar.ecoTax = { amount: 0 };
      tax.taxVar.residentTax = { amount: 0 };
    }
    tax.taxVar.incomeTax = roundCurrency(tax.taxVar.incomeTax, 100);
    tax.taxVar.cityTax = roundCurrency(tax.taxVar.cityTax, 100);
    tax.taxVar.prefTax = roundCurrency(tax.taxVar.prefTax, 100);
    tax.taxVar.residentTax = sumCurrency(tax.taxVar.cityTax, tax.taxVar.prefTax);
  }
  function calcTaxFixed() {
    console.log('calcTaxFixed');
    const nonTaxable = profiles.nonTaxable.final || profiles.nonTaxable.fixed;
    tax.taxFixed.incomeTax = roundCurrency(multiplyCurrency(tax.taxVar.incomeTax, taxSystem.additionalRate - 1), 1);
    tax.taxFixed.cityTax = nonTaxable ? { amount: 0 } : taxSystem.fixed.cityTax;
    tax.taxFixed.prefTax = nonTaxable ? { amount: 0 } : taxSystem.fixed.prefTax;
    tax.taxFixed.ecoTax = nonTaxable ? { amount: 0 } : taxSystem.fixed.ecoTax;
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
    const refundIncomeTax = { amount: tax.taxFinal.incomeTax.amount - tax.paid.incomeTax.amount };
    tax.refund.incomeTax = roundCurrency(refundIncomeTax, 10);
    tax.refund.residentTax.amount = tax.taxFinal.residentTax.amount - tax.paid.residentTax.amount;
  }

  calcIncomeTax();
  calcTaxable();
  calcDeduction();

  const taxSystem = getTaxRate(taxYear, tax.taxable.incomeTax.amount, tax.taxable.residentTax.amount);
  console.log('taxSystem:', taxSystem);
  calcTaxPre();
  calcTaxAdjusted();
  getTaxCredits();
  calcTaxCredit();
  calcTaxVar();
  calcTaxFixed();
  calcTaxFinal();
  getPaid();
  calcPaid();
  calcRefund();
}

export function setTax() {
  calcTax();
  console.log('tax:', tax);
  return;
}
