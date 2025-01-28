import { profile, system } from './objects.js';
import { roundBy, sumTaxable } from './functions.js';

interface TaxValue {
  year: number;
  max10Per: number;
  max5Per: number;
}

interface MaxTable {
  fortyPer: number;
  thirtyPer: number;
  twentyPer: number;
  tenPer: number;
  fivePer: number;
  zeroPer: number;
}

interface Threshold {
  limit: number;
  discountRate: number;
}

interface TaxRateResult {
  rate: number;
  deduction: number;
  offset: number;
}

function calcTaxable(taxYear: number, income: number): number {
  function getValuesForYear(values: TaxValue[], year: number, keys: (keyof TaxValue)[]): Partial<TaxValue> {
    const result: Partial<TaxValue> = {};
    for (const item of values) {
      if (year >= item.year) {
        keys.forEach((key) => {
          result[key] = item[key] === null ? undefined : item[key];
        });
        break;
      }
    }
    return result;
  }

  function getIncomeTaxRate(taxYear: number, income: number): TaxRateResult {
    const taxValues: TaxValue[] = [
      { year: 2020, max10Per: 8500000, max5Per: Infinity },
      { year: 2017, max10Per: 10000000, max5Per: Infinity },
      { year: 2016, max10Per: 10000000, max5Per: 12000000 },
      { year: 2013, max10Per: 10000000, max5Per: 15000000 },
      { year: 1995, max10Per: 10000000, max5Per: Infinity },
    ];

    const values = getValuesForYear(taxValues, taxYear, ['max10Per', 'max5Per']);
    const maxTable: MaxTable = {
      fortyPer: 1800000,
      thirtyPer: 3600000,
      twentyPer: 6600000,
      tenPer: values.max10Per ?? 0,
      fivePer: values.max5Per ?? 0,
      zeroPer: Infinity,
    };

    const thresholds: Threshold[] = [
      { limit: 0, discountRate: 0.5 },
      { limit: maxTable.fortyPer, discountRate: 0.4 },
      { limit: maxTable.thirtyPer, discountRate: 0.3 },
      { limit: maxTable.twentyPer, discountRate: 0.2 },
      { limit: maxTable.tenPer, discountRate: 0.1 },
      { limit: maxTable.zeroPer, discountRate: 0 },
    ];

    if (maxTable.fivePer !== null) {
      thresholds.splice(5, 0, { limit: maxTable.fivePer, discountRate: 0.05 });
    }

    let deductionSum = 0;
    let rate = 0;
    for (let i = 1; i < thresholds.length; i++) {
      const limit = thresholds[i].limit;
      rate = 1 - thresholds[i].discountRate;
      if (income < limit) {
        for (let j = 0; j < i; j++) {
          deductionSum += (thresholds[j].discountRate - thresholds[j + 1].discountRate) * thresholds[j].limit;
        }
        return { rate: 1 - thresholds[i].discountRate, deduction: deductionSum, offset: taxYear >= 2020 ? -100000 : 0 };
      }
    }
    return { rate: rate, deduction: deductionSum, offset: taxYear >= 2020 ? -100000 : 0 };
  }

  const incomeTaxSystem = getIncomeTaxRate(taxYear, income);

  let taxable;
  if (taxYear >= 1995) {
    taxable =
      income < 1619000
        ? income - 650000
        : income < 1620000
          ? 969000
          : income < 1622000
            ? 970000
            : income < 1624000
              ? 972000
              : income < 1628000
                ? 974000
                : incomeTaxSystem.rate < 0.9
                  ? roundBy(income, 4000) * incomeTaxSystem.rate - incomeTaxSystem.deduction
                  : incomeTaxSystem.rate < 0.99
                    ? roundBy(income * incomeTaxSystem.rate, 1) - incomeTaxSystem.deduction
                    : income - incomeTaxSystem.deduction;
  } else taxable = 0;

  return Math.max(taxable - incomeTaxSystem.offset, 0);
}

export function setTaxable() {
  console.log('setTaxable');
  profile.applicant.taxable.salary.amount = calcTaxable(system.taxYear, profile.applicant.income.salary.amount);
  profile.applicant.taxable.total = sumTaxable(profile.applicant.taxable);
  profile.spouse.taxable.salary.amount = calcTaxable(system.taxYear, profile.spouse.income.salary.amount);
  profile.spouse.taxable.total = sumTaxable(profile.spouse.taxable);
}
