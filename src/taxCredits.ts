import { Estate, Currency } from './objects';

export function getDividendCredit(taxYear: number) {
  console.log('getDividendCredit');
  console.log('taxYear', taxYear);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
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
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getDonationCredit(taxYear: number, donation: Record<string, Currency>) {
  console.log('getDonationCredit');
  console.log('taxYear', taxYear);
  console.log('donation', donation);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getImprovementCredit(taxYear: number, improvement: number) {
  console.log('getImprovementCredit');
  console.log('taxYear', taxYear);
  console.log('improvement', improvement);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getDisasterCredit(taxYear: number, disaster: number) {
  console.log('getDisasterCredit');
  console.log('taxYear', taxYear);
  console.log('disaster', disaster);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getForeignTaxCredit(taxYear: number, foreignTax: number) {
  console.log('getForeignTaxCredit');
  console.log('taxYear', taxYear);
  console.log('foreignTax', foreignTax);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getDividendRefund(taxYear: number, dividend: number) {
  console.log('getDividendRefund');
  console.log('taxYear', taxYear);
  console.log('dividend', dividend);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
export function getStockRefund(taxYear: number, stock: number) {
  console.log('getStockRefund');
  console.log('taxYear', taxYear);
  console.log('stock', stock);
  return { incomeTax: { amount: 0 }, residentTax: { amount: 0 } };
}
