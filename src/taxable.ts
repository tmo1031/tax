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

function calcTaxable(taxYear: number, income: number): { total: number; taxable: number; deduction: number } {
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

  taxable = Math.max(taxable - incomeTaxSystem.offset, 0);
  return {
    total: income,
    taxable: taxable,
    deduction: income - taxable,
  };
}

function getSalaryExpensesSp(
  taxYear: number,
  salaryExpensesSpRaw: number,
  deduction: number,
  salaryIncome: number
): number {
  const thresholds = (() => {
    if (taxYear < 2013) return [{ limit: Infinity, rate: 1, maxDeduction: Infinity }];
    else
      return [
        { limit: 15000000, rate: 0.5, maxDeduction: Infinity },
        { limit: Infinity, rate: Infinity, maxDeduction: 1250000 },
      ];
  })();

  let rate = 1;
  let maxDeduction = Infinity;

  for (const threshold of thresholds) {
    if (salaryIncome <= threshold.limit) {
      rate = threshold.rate;
      maxDeduction = threshold.maxDeduction;
      break;
    }
  }
  const base = Math.min(deduction * rate, maxDeduction);

  return Math.max(salaryExpensesSpRaw - base, 0);
}

function calcTaxablePension(
  taxYear: number,
  pensionIncome: number,
  age: number,
  totalIncome: number
): { taxable: number; deduction: number } {
  const thresholds = (() => {
    if (taxYear < 2005) {
      if (age < 65) {
        return [
          { limit: 700000, floor: 0, rate: 1, max: Infinity },
          { limit: 1300000, floor: 700000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      } else {
        return [
          { limit: 1400000, floor: 0, rate: 1, max: Infinity },
          { limit: 2600000, floor: 1400000, rate: 0, max: Infinity },
          { limit: 4600000, floor: 2600000, rate: 0.25, max: Infinity },
          { limit: 8200000, floor: 4600000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 8200000, rate: 0.05, max: Infinity },
        ];
      }
    } else if (taxYear < 2020) {
      if (age < 65) {
        return [
          { limit: 700000, floor: 0, rate: 1, max: Infinity },
          { limit: 1300000, floor: 700000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      } else {
        return [
          { limit: 1200000, floor: 0, rate: 1, max: Infinity },
          { limit: 3300000, floor: 1200000, rate: 0, max: Infinity },
          { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
          { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
          { limit: Infinity, floor: 7700000, rate: 0.05, max: Infinity },
        ];
      }
    } else {
      if (age < 65) {
        if (totalIncome <= 10000000) {
          return [
            { limit: 600000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 600000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else if (totalIncome <= 20000000) {
          return [
            { limit: 500000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 500000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else {
          return [
            { limit: 400000, floor: 0, rate: 1, max: Infinity },
            { limit: 1300000, floor: 400000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 1300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        }
      } else {
        if (totalIncome <= 10000000) {
          return [
            { limit: 1100000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 1100000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else if (totalIncome <= 20000000) {
          return [
            { limit: 1000000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 1000000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        } else {
          return [
            { limit: 900000, floor: 0, rate: 1, max: Infinity },
            { limit: 3300000, floor: 900000, rate: 0, max: Infinity },
            { limit: 4100000, floor: 3300000, rate: 0.25, max: Infinity },
            { limit: 7700000, floor: 4100000, rate: 0.15, max: Infinity },
            { limit: 10000000, floor: 7700000, rate: 0.05, max: Infinity },
            { limit: Infinity, floor: 10000000, rate: 0, max: Infinity },
          ];
        }
      }
    }
  })();

  let deduction = 0;
  for (const threshold of thresholds) {
    deduction += (Math.min(pensionIncome, threshold.limit) - threshold.floor) * threshold.rate;
    if (pensionIncome <= threshold.limit) {
      break;
    }
  }
  console.log('deduction:', deduction);

  return { taxable: pensionIncome - deduction, deduction: deduction };
}

function getSalaryAdjustment(
  taxYear: number,
  salaryRevenue: number,
  salaryTaxable: number,
  pensionTaxable: number,
  disability: number,
  minors: number
): number {
  let adjustment = 0;
  if (taxYear < 2020) return 0;
  if (disability > 0 || minors > 0) adjustment = Math.max(Math.min(salaryRevenue, 10000000) - 8500000, 0) * 0.1;
  if (salaryTaxable > 0 && pensionTaxable > 0) {
    const salaryTaxableAdjusted = salaryTaxable - adjustment;
    const adjustmentSalary = Math.min(100000, salaryTaxableAdjusted);
    const adjustmentPension = Math.min(100000, pensionTaxable);
    adjustment = Math.max(0, adjustmentSalary + adjustmentPension - 100000);
  }
  return adjustment;
}

function aggregationPL(mode: string, detail: Record<string, Record<string, Currency>>) {
  let total = 0;
  Object.entries(detail).forEach(([key, value]) => {
    console.log(`Processing ${key}:`, value);
    const keys = ['longSeparate', 'longAggregate', 'occasional', 'retirementLong', 'retirementShort'];
    const rate = keys.includes(key) ? 0.5 : 1;

    value.income.amount =
      (value.revenue.amount -
        (isNaN(value.expenses.amount) ? 0 : value.expenses.amount) -
        (isNaN(value.deductions.amount) ? 0 : value.deductions.amount)) *
      rate;

    total += mode === 'exceptPension' && key === 'pension' ? 0 : value.income.amount;
  });
  return total;
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
  const applicantSalary = calcTaxable(system.taxYear, profiles.applicant.income.salary.amount);
  const spouseSalary = calcTaxable(system.taxYear, profiles.spouse.income.salary.amount);

  //以前の機能との互換性
  profiles.applicant.taxable.salary.amount = applicantSalary.taxable;
  profiles.applicant.taxable.total = sumTaxable(profiles.applicant.taxable);
  profiles.applicant.taxable.carryOver.amount = getCarryover(profiles.applicant.taxable.total.amount, carryOvers);
  profiles.spouse.taxable.salary.amount = spouseSalary.taxable;
  profiles.spouse.taxable.total = sumTaxable(profiles.spouse.taxable);

  //非課税の設定
  setNonTaxable(profiles, system);

  //所得控除の計算
  const salaryExpensesSp = getSalaryExpensesSp(
    system.taxYear,
    profiles.other.salaryExpensesSp.amount,
    applicantSalary.deduction,
    applicantSalary.total
  );
  profiles.detail.salary.expenses.amount = applicantSalary.deduction + salaryExpensesSp;

  //退職所得控除の計算
  const serviceYears = profiles.other.serviceYears;
  const retirementDeduction = (() => {
    if (serviceYears === 0) {
      return 0;
    } else if (serviceYears <= 20) {
      return Math.max(400000 * serviceYears, 800000);
    } else {
      return (serviceYears - 20) * 700000 + 8000000;
    }
  })();
  if (profiles.other.multiRetirement === false) {
    function setRetirementExpenses(detail: Record<string, Record<string, Currency>>, key: string, deduction: number) {
      if (detail[key].revenue.amount > 0) {
        detail[key].expenses.amount = deduction;
      } else {
        detail[key].expenses.amount = 0;
      }
    }
    ['retirementLong', 'retirementShort', 'retirementOfficer'].forEach((key) => {
      setRetirementExpenses(profiles.detail, key, retirementDeduction);
    });
  }

  //公的年金等に係る雑所得以外の所得金額の計算
  const exceptPension = aggregationPL('exceptPension', profiles.detail);
  console.log('exceptPension:', exceptPension);

  //公的年金等控除の計算
  const pension = calcTaxablePension(
    system.taxYear,
    profiles.detail.pension.income.amount,
    profiles.applicant.age,
    exceptPension
  );
  profiles.detail.pension.expenses.amount = pension.deduction;
  profiles.detail.pension.income.amount = pension.taxable;

  //所得金額調整控除の計算
  const salaryAdjustment = getSalaryAdjustment(
    system.taxYear,
    profiles.detail.salary.revenue.amount,
    applicantSalary.taxable - salaryExpensesSp,
    pension.taxable,
    (profiles.applicant.attributes.disability >= 2 ? 1 : 0) +
      (profiles.spouse.attributes.disability >= 2 ? 1 : 0) +
      profiles.dependent.disabilityP +
      profiles.dependent.disabilityLt,
    profiles.dependent.minors + profiles.dependent.specified
  );
  console.log('salaryAdjustment:', salaryAdjustment);
  profiles.detail.salary.expenses.amount = applicantSalary.deduction + salaryExpensesSp + salaryAdjustment;
}
