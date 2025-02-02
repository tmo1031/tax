import { profiles, system, carryOvers } from './objects.js';
import { Currency, Profiles } from './objects.js';
import { roundBy, sumTaxable } from './functions.js';

type TaxValue = {
  year: number;
  max10Per: number;
  max5Per: number;
};

type MaxTable = {
  fortyPer: number;
  thirtyPer: number;
  twentyPer: number;
  tenPer: number;
  fivePer: number;
  zeroPer: number;
};

type Threshold = {
  limit: number;
  discountRate: number;
};

type TaxRateResult = {
  rate: number;
  deduction: number;
  offset: number;
};

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

function getCarryover(taxable: number, carryOvers: Record<string, Currency>): number {
  function sumCarryovers(carryOvers: Record<string, Currency>): number {
    return Object.values(carryOvers).reduce((sum, currency) => sum + currency.amount, 0);
  }
  const carryOversSum = sumCarryovers(carryOvers);
  return Math.max(taxable - carryOversSum, 0);
}

function setNonTaxable(profiles: Profiles, system: Record<string, number>): Profiles {
  const taxYear = system.taxYear;
  const taxableTotal = profiles.applicant.taxable.total.amount;
  const carryOver = profiles.applicant.taxable.carryOver.amount;
  const nonTaxableAttr =
    profiles.applicant.attributes.disability > 0 ||
    profiles.applicant.attributes.minors ||
    profiles.applicant.attributes.single > 0;
  const familyMembersNum =
    1 +
    (profiles.applicant.attributes.hasSpouse ? 1 : 0) +
    Object.values(profiles.dependent).reduce((sum, value) => sum + value, 0);
  function getNonTaxableAmount(taxYear: number, members: number): Record<string, number> {
    const nonTaxableTable =
      taxYear < 1999
        ? { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 0 }
        : taxYear < 2020
          ? { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 0 }
          : { rate: 350000, baseFixed: 210000, baseVar: 320000, adjustment: 100000 };
    const nonTaxableFixed =
      members > 1 ? nonTaxableTable.baseFixed : 0 + nonTaxableTable.rate * members + nonTaxableTable.adjustment;
    const nonTaxableVar =
      members > 1 ? nonTaxableTable.baseVar : 0 + nonTaxableTable.rate * members + nonTaxableTable.adjustment;
    return { nonTaxableFixed: nonTaxableFixed, nonTaxableVar: nonTaxableVar };
  }
  const threshold = getNonTaxableAmount(taxYear, familyMembersNum);
  const nonTaxableFinal = nonTaxableAttr && taxableTotal <= 1350000;
  const nonTaxableFixed = taxableTotal <= threshold.nonTaxableFixed;
  const nonTaxableVar = carryOver <= threshold.nonTaxableVar;
  profiles.nonTaxable = { var: nonTaxableVar, fixed: nonTaxableFixed, final: nonTaxableFinal };
  return profiles;
}

export function setTaxable() {
  console.log('setTaxable');
  profiles.applicant.taxable.salary.amount = calcTaxable(system.taxYear, profiles.applicant.income.salary.amount);
  profiles.applicant.taxable.total = sumTaxable(profiles.applicant.taxable);
  profiles.applicant.taxable.carryOver.amount = getCarryover(profiles.applicant.taxable.total.amount, carryOvers);
  profiles.spouse.taxable.salary.amount = calcTaxable(system.taxYear, profiles.spouse.income.salary.amount);
  profiles.spouse.taxable.total = sumTaxable(profiles.spouse.taxable);
  setNonTaxable(profiles, system);
}
