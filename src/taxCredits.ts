import { roundBy, ceilBy, subtractCurrency /*, sumCurrency*/ } from './functions.js';
import { Estate, Currency, TaxReturn } from './objects.js';

export function getTaxAdjustment(
  personalDeductions: Record<string, Record<string, Currency>>,
  taxable: number,
  taxableDeducted: number
) {
  console.log('getTaxAdjustment');

  const delta =
    subtractCurrency(personalDeductions.basic.incomeTax, personalDeductions.basic.residentTax).amount +
    subtractCurrency(personalDeductions.personal.incomeTax, personalDeductions.personal.residentTax).amount +
    subtractCurrency(personalDeductions.dependent.incomeTax, personalDeductions.dependent.residentTax).amount +
    subtractCurrency(personalDeductions.spouse.incomeTax, personalDeductions.spouse.residentTax).amount;
  console.log('delta', delta);
  const caseLow = Math.min(delta, taxableDeducted);
  const caseHigh = Math.max(delta - (taxableDeducted - 2000000), 50000);
  const deltaAdjusted = taxable >= 25000000 ? 0 : taxableDeducted > 2000000 ? caseHigh : caseLow;

  return {
    adjustment: {
      incomeTax: { amount: 0 },
      residentTax: { amount: deltaAdjusted * 0.05 },
      cityTax: { amount: deltaAdjusted * 0.03 },
      prefTax: { amount: deltaAdjusted * 0.02 },
    },
    delta: delta,
  };
}

export function getDividendCredit(taxYear: number) {
  console.log('getDividendCredit');
  console.log('taxYear', taxYear);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getLoansCreditPre(estate: Estate, taxable: number): number {
  console.log('getLoansCreditPre');
  console.log('estate', estate);
  console.log('taxable', taxable);
  return 0;
}
export function getLoansCredit(
  taxYear: number,
  estate: Estate,
  taxable: number,
  loanCredit: number,
  incomeTax: number,
  incomeTaxOld: number
) {
  console.log('getLoansCredit');
  console.log('taxYear', taxYear);
  console.log('estate', estate);
  console.log('taxable', taxable);
  console.log('loanCredit', loanCredit);
  console.log('incomeTax', incomeTax);
  console.log('incomeTaxOld', incomeTaxOld);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getDonationCredit(
  taxYear: number,
  donation: Record<string, Currency>,
  taxReturn: TaxReturn,
  taxableTotal: number,
  taxPre: Record<string, Currency>,
  taxRate: number
) {
  console.log('getDonationCredit');
  console.log('taxYear', taxYear);
  console.log('donation', donation);
  console.log('taxReturn', taxReturn);
  const hometownTax = donation.hometownTax.amount;
  const communityChest = donation.communityChest.amount;
  //const both = donation.both.amount;
  const pref = Math.max(donation.pref.amount, 0);
  const city = Math.max(donation.city.amount, 0);
  const applyOneStop = taxReturn.applyOneStop;
  const politics = donation.politics.amount;
  const npo = donation.npo.amount;
  const publicInterest = donation.public.amount;
  const other = donation.other.amount + (applyOneStop ? 0 : donation.hometownTax.amount);
  const donationForIncomeTax = { politics: politics, npo: npo, public: publicInterest, other: other };
  const applyPolitics = taxReturn.applyPolitics;

  const limitByTaxable = taxableTotal * 0.3;
  const cityTotal = Math.min(hometownTax + communityChest + city, limitByTaxable);
  const prefTotal = Math.min(hometownTax + communityChest + pref, limitByTaxable);
  const deductible = { city: cityTotal - 2000, pref: prefTotal - 2000 };
  const base = { city: ceilBy(deductible.city * 0.1 * 0.6, 1), pref: ceilBy(deductible.pref * 0.1 * 0.4, 1) };

  function getHomeTownCredit(hometownTax: number, taxRate: number, taxPre: number, applyOneStop: boolean) {
    const deductible = Math.max(hometownTax - 2000, 0);
    const specialLimit = { city: ceilBy(taxPre * 0.2 * 0.6, 1), pref: ceilBy(taxPre * 0.2 * 0.4, 1) };
    //const base = { city: ceilBy(deductible * 0.1 * 0.6, 1), pref: ceilBy(deductible * 0.1 * 0.4, 1) };
    const specialPre = {
      city: ceilBy(deductible * (1 - (0.1 + taxRate)) * 0.6, 1),
      pref: ceilBy(deductible * (1 - (0.1 + taxRate)) * 0.4, 1),
    };
    const oneStop = { city: ceilBy(deductible * taxRate * 0.6, 1), pref: ceilBy(deductible * taxRate * 0.4, 1) };
    const special = {
      city: Math.min(specialPre.city, specialLimit.city),
      pref: Math.min(specialPre.pref, specialLimit.pref),
    };
    const total = {
      city: special.city + (applyOneStop ? oneStop.city : 0),
      pref: special.pref + (applyOneStop ? oneStop.pref : 0),
    };
    return total;
  }
  function getPolitics(donation: Record<string, number>, taxableTotal: number, taxPre: number) {
    const selfPay = 2000;
    const limitByTaxable = ceilBy(taxableTotal * 0.4, 1);
    let other = donation.other;
    const publicInterest = donation.public;
    const npo = donation.npo;
    const politics = donation.politics;

    function getPoliticsDetail(donation: number, deductionRate: number, shared: number, other: number) {
      const limit = Math.max(limitByTaxable - other, 0);
      const limitedDonation = Math.min(donation, limit);
      const basePay = Math.max(selfPay - other, 0);
      const limitByTaxPre = Math.max(roundBy(taxPre * 0.25, 1) - shared, 0);
      const deductible = Math.max(limitedDonation - basePay, 0);
      const credit = Math.min(roundBy(deductible * deductionRate, 100), limitByTaxPre);
      console.log('credit', credit);
      return credit;
    }

    const publicCredit = getPoliticsDetail(publicInterest, 0.4, 0, other);
    other += publicInterest;
    const npoCredit = getPoliticsDetail(npo, 0.4, publicCredit, other);
    other += npo;
    const politicsCredit = getPoliticsDetail(politics, 0.3, 0, other);
    const total = publicCredit + npoCredit + politicsCredit;
    return total;
  }

  const politicsCredit = applyPolitics ? getPolitics(donationForIncomeTax, taxableTotal, taxPre.incomeTax.amount) : 0;
  const hometownTaxCredit = getHomeTownCredit(hometownTax, taxRate, taxPre.residentTax.amount, applyOneStop);
  const cityTaxCredit = base.city + hometownTaxCredit.city;
  const prefTaxCredit = base.pref + hometownTaxCredit.pref;
  const residentTaxCredit = cityTaxCredit + prefTaxCredit;
  return {
    incomeTax: { amount: politicsCredit },
    residentTax: { amount: residentTaxCredit },
    cityTax: { amount: cityTaxCredit },
    prefTax: { amount: prefTaxCredit },
  };
}
export function getImprovementCredit(taxYear: number, improvement: number) {
  console.log('getImprovementCredit');
  console.log('taxYear', taxYear);
  console.log('improvement', improvement);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getDisasterCredit(taxYear: number, disaster: number) {
  console.log('getDisasterCredit');
  console.log('taxYear', taxYear);
  console.log('disaster', disaster);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getForeignTaxCredit(taxYear: number, foreignTax: number) {
  console.log('getForeignTaxCredit');
  console.log('taxYear', taxYear);
  console.log('foreignTax', foreignTax);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getDividendRefund(taxYear: number, dividend: number) {
  console.log('getDividendRefund');
  console.log('taxYear', taxYear);
  console.log('dividend', dividend);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
export function getStockRefund(taxYear: number, stock: number) {
  console.log('getStockRefund');
  console.log('taxYear', taxYear);
  console.log('stock', stock);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 }, cityTax: { amount: 0 }, prefTax: { amount: 0 } };
}
