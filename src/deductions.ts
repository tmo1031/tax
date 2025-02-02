import { system, profiles, deductionInputs } from './objects.js';
import { personalDeductions, incomeDeductions, taxReturn } from './objects.js';
import { Currency, Profiles, TaxReturn } from './objects.js';
import { deductionToCurrency, inputToCDeductions } from './functions.js';

export function getDisabilityDeduction(taxYear: number, disabilityLevel: number) {
  console.log('getDisabilityDeductions');
  const level = disabilityLevel;
  const DisabilityDeductionTable: { [key: number]: { incomeTax: number; residentTax: number } } =
    taxYear > 1982
      ? {
          3: { incomeTax: 750000, residentTax: 530000 },
          2: { incomeTax: 400000, residentTax: 300000 },
          1: { incomeTax: 270000, residentTax: 260000 },
          0: { incomeTax: 0, residentTax: 0 },
        }
      : {
          NaN: { incomeTax: NaN, residentTax: NaN },
        };
  return DisabilityDeductionTable[level];
}

export function getSingleDeduction(taxYear: number, singleLevel: number, taxable: Record<string, Currency>) {
  console.log('getSingleDeductions');
  const level = taxable.total.amount > 5000000 ? 0 : singleLevel;
  const SingleDeductionTable: { [key: number]: { incomeTax: number; residentTax: number } } =
    taxYear > 1951
      ? {
          2: { incomeTax: 350000, residentTax: 300000 },
          1: { incomeTax: 270000, residentTax: 260000 },
          0: { incomeTax: 0, residentTax: 0 },
        }
      : {
          NaN: { incomeTax: NaN, residentTax: NaN },
        };
  return SingleDeductionTable[level];
}

export function getStudentDeduction(taxYear: number, studentLevel: number, taxable: Record<string, Currency>) {
  console.log('getStudentDeductions');
  const level = taxable.salary.amount > 750000 || taxable.other.amount > 100000 ? 0 : studentLevel;
  const StudentDeductionTable: { [key: number]: { incomeTax: number; residentTax: number } } =
    taxYear > 1951
      ? {
          1: { incomeTax: 270000, residentTax: 260000 },
          0: { incomeTax: 0, residentTax: 0 },
        }
      : {
          NaN: { incomeTax: NaN, residentTax: NaN },
        };
  return StudentDeductionTable[level];
}

export function getSpouseDeduction(
  taxYear: number,
  hasSpouse: boolean,
  applicantTotal: number,
  spouseTotal: number,
  spouseAge: number
): { incomeTax: number; residentTax: number } {
  console.log('getSpouseDeduction');
  if (hasSpouse === false) return { incomeTax: 0, residentTax: 0 };
  const deductions = { incomeTax: 380000, residentTax: 380000 };

  function setDeductions(
    deductions: { incomeTax: number; residentTax: number },
    incomeTaxDeduction: number,
    adjust: number
  ): { incomeTax: number; residentTax: number } {
    deductions.incomeTax = incomeTaxDeduction;
    deductions.residentTax = incomeTaxDeduction - adjust;
    return deductions;
  }
  function shrinkDeductions(deduction: number, rate: number, mode: string) {
    const shrinkValue =
      mode === 'ceil'
        ? Math.ceil((deduction / 30000) * rate) * 10000
        : mode === 'round'
          ? Math.round((deduction / 30000) * rate) * 10000
          : deduction;
    return shrinkValue;
  }

  if (taxYear >= 1994) {
    // 1994年以降の税制改正, 2004年以降の税制改正
    const offset1 = taxYear >= 2018 ? 450000 : -1;
    const offset2 = taxYear >= 2020 ? 100000 : 0;
    const seniorDeduction = 100000;
    const minThreshold = 380000 + offset2; //380000 + 650000(基礎控除) が103万の壁
    const maxThreshold = taxYear >= 2018 ? 1230000 - offset1 : 760000; // 2018年以降は78万が上限
    const shrinkRate =
      taxYear < 2018
        ? 3
        : applicantTotal <= 9000000
          ? 3
          : applicantTotal <= 9500000
            ? 2
            : applicantTotal <= 10000000
              ? 1
              : 0; // 2018年以降は所得が1000万を超えると配偶者控除もなくなる

    const thresholds =
      taxYear < 1994
        ? [{ limit: NaN, deductionI: NaN, adjust: NaN }]
        : taxYear < 2004
          ? [
              { limit: 50000, deductionI: 760000, adjust: 100000 }, //50000 + 50000
              { limit: 100000, deductionI: 710000, adjust: 80000 }, //50000 + 30000
              { limit: 150000, deductionI: 660000, adjust: 80000 }, //50000 + 30000
              { limit: 200000, deductionI: 610000, adjust: 80000 }, //50000 + 30000
              { limit: 250000, deductionI: 560000, adjust: 80000 }, //50000 + 30000
              { limit: 300000, deductionI: 510000, adjust: 80000 }, //50000 + 30000
              { limit: 350000, deductionI: 460000, adjust: 80000 }, //50000 + 30000
              { limit: 380000, deductionI: 410000, adjust: 80000 }, //50000 + 30000
              { limit: 400000, deductionI: 380000, adjust: 50000 },
              { limit: 450000, deductionI: 360000, adjust: 30000 },
              { limit: 500000, deductionI: 310000, adjust: 10000 },
              { limit: 550000, deductionI: 260000, adjust: 10000 },
              { limit: 600000, deductionI: 210000, adjust: 10000 },
              { limit: 650000, deductionI: 160000, adjust: 10000 },
              { limit: 700000, deductionI: 110000, adjust: 10000 },
              { limit: 750000, deductionI: 60000, adjust: 10000 },
              { limit: maxThreshold, deductionI: 30000, adjust: 0 },
            ]
          : [
              { limit: 400000, deductionI: 380000, adjust: 50000 },
              { limit: 450000, deductionI: 360000, adjust: 30000 },
              { limit: 500000, deductionI: 310000, adjust: 0 },
              { limit: 550000, deductionI: 260000, adjust: 0 },
              { limit: 600000, deductionI: 210000, adjust: 0 },
              { limit: 650000, deductionI: 160000, adjust: 0 },
              { limit: 700000, deductionI: 110000, adjust: 0 },
              { limit: 750000, deductionI: 60000, adjust: 0 },
              { limit: maxThreshold, deductionI: 30000, adjust: 0 },
            ];

    let deductionIncome = 0;
    let adjust = 0;

    for (let i = 0; i < thresholds.length; i++) {
      if (spouseTotal <= thresholds[i].limit + offset1 + offset2) {
        deductionIncome = thresholds[i].deductionI;
        adjust = thresholds[i].adjust;
        break;
      }
    }
    if (spouseTotal <= minThreshold) {
      adjust = taxYear < 2004 ? adjust : 50000;
      if (spouseAge >= 70) {
        deductionIncome += seniorDeduction;
        adjust = taxYear < 2004 ? adjust + seniorDeduction : seniorDeduction;
      }
    }

    if (shrinkRate < 3) {
      deductionIncome = shrinkDeductions(deductionIncome, shrinkRate, 'ceil');
      adjust = shrinkDeductions(adjust, shrinkRate, 'ceil');
    }
    setDeductions(deductions, deductionIncome, adjust);
  }
  return deductions;
}

export function getDependentDeduction(taxYear: number, dependent: Record<string, number>) {
  console.log('getDependentDeductions');
  const deductionTypes = [
    'Specified',
    'Elderly_LT',
    'Elderly',
    'Child',
    'Other',
    'Disability_LT',
    'Disability_P',
    'Disability_O',
  ];
  const deductionTable: { [key: string]: { incomeTax: number; residentTax: number } } =
    taxYear < 1999
      ? {
          // 平成11年分から特定扶養親族の控除が拡大
          Specified: { incomeTax: NaN, residentTax: NaN },
        }
      : taxYear < 2011
        ? {
            // 平成23年分から年少扶養親族（～15歳）に対する扶養控除が廃止
            Specified: { incomeTax: 630000, residentTax: 450000 }, // 特定扶養親族(16～22歳)
            Elderly_LT: { incomeTax: 580000, residentTax: 450000 },
            Elderly: { incomeTax: 480000, residentTax: 380000 },
            Child: { incomeTax: 380000, residentTax: 330000 },
            Other: { incomeTax: 380000, residentTax: 330000 },
            Disability_LT: { incomeTax: 750000, residentTax: 530000 },
            Disability_P: { incomeTax: 400000, residentTax: 300000 },
            Disability_O: { incomeTax: 270000, residentTax: 260000 },
          }
        : {
            Specified: { incomeTax: 630000, residentTax: 450000 }, // 特定扶養親族(19～22歳)
            Elderly_LT: { incomeTax: 580000, residentTax: 450000 },
            Elderly: { incomeTax: 480000, residentTax: 380000 },
            Child: { incomeTax: 0, residentTax: 0 },
            Other: { incomeTax: 380000, residentTax: 330000 },
            Disability_LT: { incomeTax: 750000, residentTax: 530000 },
            Disability_P: { incomeTax: 400000, residentTax: 300000 },
            Disability_O: { incomeTax: 270000, residentTax: 260000 },
          };

  function sumDeductions(
    deductions: { incomeTax: number; residentTax: number },
    dependent: { incomeTax: number; residentTax: number }
  ) {
    deductions.incomeTax += dependent.incomeTax;
    deductions.residentTax += dependent.residentTax;
  }

  const deductions: { incomeTax: number; residentTax: number } = { incomeTax: 0, residentTax: 0 };
  deductionTypes.forEach((type) => {
    for (let i = 0; i < dependent[type]; i++) {
      sumDeductions(deductions, deductionTable[type]);
    }
  });
  return deductions;
}

export function getBasicDeduction(taxYear: number, taxable: number) {
  console.log('getBasicDeduction');
  const level =
    taxYear < 2020
      ? 3 // 2019年以前は一律控除
      : taxable <= 24000000
        ? 3
        : taxable <= 24500000
          ? 2
          : taxable <= 25000000
            ? 1
            : 0; // 2020年の基礎控除で段階分けができた
  const BasicDeductionTable: { [key: number]: { incomeTax: number; residentTax: number } } =
    taxYear >= 2020
      ? {
          3: { incomeTax: 480000, residentTax: 430000 },
          2: { incomeTax: 320000, residentTax: 270000 },
          1: { incomeTax: 160000, residentTax: 110000 },
          0: { incomeTax: 0, residentTax: 0 },
        }
      : taxYear >= 1994
        ? {
            3: { incomeTax: 380000, residentTax: 330000 },
          }
        : {
            NaN: { incomeTax: NaN, residentTax: NaN },
          };
  return BasicDeductionTable[level];
}

export function getCasualtyLoss(taxYear: number, loss: number) {
  //繰越などがあるので、あらかじめ計算した控除額を入力する
  return { incomeTax: loss, residentTax: loss };
}

export function getMedialDeduction(taxYear: number, expenses: number, taxable: number) {
  //セルフメディケーション税制（医療費控除の特例）は無視する
  const threshold = taxable < 2000000 ? taxable * 0.05 : 100000;
  const deduction = Math.min(Math.max(expenses - threshold, 0), 2000000);
  return { incomeTax: deduction, residentTax: deduction };
}

export function getSocialDeduction(taxYear: number, socialInsurance: number) {
  const deduction = socialInsurance; //全額控除
  return { incomeTax: deduction, residentTax: deduction };
}

export function getMutualAidDeduction(taxYear: number, mutualAid: number) {
  const deduction = mutualAid; //全額控除
  return { incomeTax: deduction, residentTax: deduction };
}

export function getLifeInsuranceDeduction(taxYear: number, insurance: Record<string, number>) {
  const InsuranceDeductionTable = {
    NewIncome: [
      { limit: 20000, rate: 1, adjustment: 0 },
      { limit: 40000, rate: 0.5, adjustment: 10000 },
      { limit: 80000, rate: 0.25, adjustment: 20000 },
      { limit: Infinity, rate: 0, adjustment: 40000 },
    ],
    OldIncome: [
      { limit: 25000, rate: 1, adjustment: 0 },
      { limit: 50000, rate: 0.5, adjustment: 12500 },
      { limit: 100000, rate: 0.25, adjustment: 25000 },
      { limit: Infinity, rate: 0, adjustment: 50000 },
    ],
    NewResident: [
      { limit: 12000, rate: 1, adjustment: 0 },
      { limit: 32000, rate: 0.5, adjustment: 6000 },
      { limit: 56000, rate: 0.25, adjustment: 14000 },
      { limit: Infinity, rate: 0, adjustment: 28000 },
    ],
    OldResident: [
      { limit: 15000, rate: 1, adjustment: 0 },
      { limit: 40000, rate: 0.5, adjustment: 7500 },
      { limit: 70000, rate: 0.25, adjustment: 17500 },
      { limit: Infinity, rate: 0, adjustment: 35000 },
    ],
  };
  const maxDeduction = {
    Income: 40000,
    Resident: 28000,
  };

  type DeductionType = 'NewIncome' | 'OldIncome' | 'NewResident' | 'OldResident';
  function getInsuranceDeduction(deductionType: DeductionType, amount: number) {
    const table = InsuranceDeductionTable[deductionType];
    if (!table) {
      throw new Error(`Deduction type ${deductionType} not found`);
    }
    for (const entry of table) {
      if (amount <= entry.limit) {
        return Math.ceil(amount * entry.rate + entry.adjustment);
      }
    }
    return 0; // デフォルトの控除額（該当する範囲がない場合）
  }

  type TaxType = 'Income' | 'Resident';
  function getBoth(type: TaxType, newInsurance: number, oldInsurance: number) {
    const oldDeduction =
      type === 'Income'
        ? getInsuranceDeduction('OldIncome', oldInsurance)
        : getInsuranceDeduction('OldResident', oldInsurance);
    const newDeduction =
      type === 'Income'
        ? getInsuranceDeduction('NewIncome', newInsurance)
        : getInsuranceDeduction('NewResident', newInsurance);
    const bothDeduction = newDeduction + oldDeduction;

    if (newInsurance > 0 && oldInsurance > 0) {
      return Math.min(Math.max(oldDeduction, bothDeduction), maxDeduction[type]);
    } else if (newInsurance > 0) return newDeduction;
    else return oldDeduction;
  }

  const lifeIncome = getBoth('Income', insurance.lifeNew, insurance.lifeOld);
  const annuityIncome = getBoth('Income', insurance.annuityNew, insurance.annuityOld);
  const healthIncome = getInsuranceDeduction('NewIncome', insurance.health);
  const incomeTaxDeduction = Math.min(lifeIncome + annuityIncome + healthIncome, 120000);
  const lifeResident = getBoth('Resident', insurance.lifeNew, insurance.lifeOld);
  const annuityResident = getBoth('Resident', insurance.annuityNew, insurance.annuityOld);
  const healthResident = getInsuranceDeduction('NewResident', insurance.health);
  const residentTaxDeduction = Math.min(lifeResident + annuityResident + healthResident, 70000);
  return { incomeTax: incomeTaxDeduction, residentTax: residentTaxDeduction };
}

export function getQuakeInsuranceDeduction(taxYear: number, insurance: Record<string, number>) {
  const EInsuranceDeductionTable = {
    NewIncome: [
      { limit: 50000, rate: 1, adjustment: 0 },
      { limit: Infinity, rate: 0, adjustment: 50000 },
    ],
    OldIncome: [
      { limit: 10000, rate: 1, adjustment: 0 },
      { limit: 20000, rate: 0.5, adjustment: 5000 },
      { limit: Infinity, rate: 0, adjustment: 15000 },
    ],
    NewResident: [
      { limit: 50000, rate: 0.5, adjustment: 0 },
      { limit: Infinity, rate: 0, adjustment: 25000 },
    ],
    OldResident: [
      { limit: 5000, rate: 1, adjustment: 0 },
      { limit: 15000, rate: 0.5, adjustment: 2500 },
      { limit: Infinity, rate: 0, adjustment: 10000 },
    ],
  };
  const maxDeduction = {
    Income: 50000,
    Resident: 25000,
  };

  type DeductionType = 'NewIncome' | 'OldIncome' | 'NewResident' | 'OldResident';
  function getEInsuranceDeduction(deductionType: DeductionType, amount: number) {
    const table = EInsuranceDeductionTable[deductionType];
    if (!table) {
      throw new Error(`Deduction type ${deductionType} not found`);
    }
    for (const entry of table) {
      if (amount <= entry.limit) {
        return Math.ceil(amount * entry.rate + entry.adjustment);
      }
    }
    return 0; // デフォルトの控除額（該当する範囲がない場合）
  }

  type TaxType = 'Income' | 'Resident';
  function getBoth(type: TaxType, newInsurance: number, oldInsurance: number) {
    const oldDeduction =
      type === 'Income'
        ? getEInsuranceDeduction('OldIncome', oldInsurance)
        : getEInsuranceDeduction('OldResident', oldInsurance);
    const newDeduction =
      type === 'Income'
        ? getEInsuranceDeduction('NewIncome', newInsurance)
        : getEInsuranceDeduction('NewResident', newInsurance);
    const bothDeduction = newDeduction + oldDeduction;

    if (newInsurance > 0 && oldInsurance > 0) {
      return Math.min(Math.max(oldDeduction, bothDeduction), maxDeduction[type]);
    } else if (newInsurance > 0) return newDeduction;
    else return oldDeduction;
  }

  const EarthquakeIncome = getBoth('Income', insurance.quakeNew, insurance.quakeOld);
  const incomeTaxDeduction = Math.min(EarthquakeIncome, 50000);
  const EarthquakeResident = getBoth('Resident', insurance.quakeNew, insurance.quakeOld);
  const residentTaxDeduction = Math.min(EarthquakeResident, 25000);
  return { incomeTax: incomeTaxDeduction, residentTax: residentTaxDeduction };
}

export function getDonationDeduction(
  taxYear: number,
  Donations: Record<string, number>,
  taxReturn: TaxReturn,
  taxableTotal: number
) {
  function sumDonations(Donations: Record<string, number>) {
    let sum = 0;
    for (const key in Donations) {
      const element = Donations[key];
      sum += element;
    }
    return sum;
  }
  Math.min(taxableTotal * 0.4, sumDonations(Donations));
  return { incomeTax: 0, residentTax: 0 };
}

/* ここから集計処理 */
export function setPersonalDeductions(personalDeductions: Record<string, Record<string, Currency>>) {
  console.log('setDeductions');
  function updatePersonalTotal(deductions: Record<string, { incomeTax: number; residentTax: number }>) {
    deductions.personal.incomeTax =
      deductions.disability.incomeTax + deductions.single.incomeTax + deductions.student.incomeTax;
    deductions.personal.residentTax =
      deductions.disability.residentTax + deductions.single.residentTax + deductions.student.residentTax;
  }
  const getDeduction = (system: Record<string, number>, profiles: Profiles) => {
    const taxYear = system.taxYear;
    const taxable = profiles.applicant.taxable;
    const attributes = profiles.applicant.attributes;
    const dependent = profiles.dependent;
    const spouse = profiles.spouse.taxable;
    const spouseAge = profiles.spouse.age;
    const hasSpouse = profiles.applicant.attributes.hasSpouse;

    const deductions: Record<string, { incomeTax: number; residentTax: number }> = {
      disability: getDisabilityDeduction(taxYear, attributes.disability),
      single: getSingleDeduction(taxYear, attributes.single, taxable),
      student: getStudentDeduction(taxYear, attributes.student === true ? 1 : 0, taxable),
      spouse: getSpouseDeduction(taxYear, hasSpouse, taxable.total.amount, spouse.total.amount, spouseAge),
      dependent: getDependentDeduction(taxYear, dependent),
      basic: getBasicDeduction(taxYear, taxable.total.amount),
      personal: { incomeTax: 0, residentTax: 0 },
    };
    updatePersonalTotal(deductions);

    return Object.keys(deductions).reduce(
      (acc, key) => {
        acc[key] = deductionToCurrency(deductions[key]);
        return acc;
      },
      {} as Record<string, Record<string, Currency>>
    );
  };
  const deductions = getDeduction(system, profiles);
  Object.keys(deductions).forEach((key) => {
    personalDeductions[key] = deductions[key];
  });
  return personalDeductions;
}

export function setIncomeDeductions(incomeDeductions: Record<string, Record<string, Currency>>) {
  console.log('setIncomeDeductions');
  const getDeduction = (
    system: Record<string, number>,
    deductionInput: Record<string, Record<string, Currency>>,
    taxable: Currency
  ) => {
    const taxYear = system.taxYear;
    const casualtyLoss = inputToCDeductions(deductionInput.loss).casualtyLoss;
    const expenses = inputToCDeductions(deductionInput.medical).expenses;
    const socialInsurance = inputToCDeductions(deductionInput.social).insurance;
    const mutualAid = inputToCDeductions(deductionInput.social).mutualAid;
    const insurance = inputToCDeductions(deductionInput.insurance);
    const donations = inputToCDeductions(deductionInput.donations);

    const deductions: Record<string, { incomeTax: number; residentTax: number }> = {
      casualtyLoss: getCasualtyLoss(taxYear, casualtyLoss),
      medical: getMedialDeduction(taxYear, expenses, taxable.amount),
      social: getSocialDeduction(taxYear, socialInsurance),
      pension: getMutualAidDeduction(taxYear, mutualAid),
      insuranceL: getLifeInsuranceDeduction(taxYear, insurance),
      insuranceE: getQuakeInsuranceDeduction(taxYear, insurance),
      donations: getDonationDeduction(taxYear, donations, taxReturn, taxable.amount),
    };

    return Object.keys(deductions).reduce(
      (acc, key) => {
        acc[key] = deductionToCurrency(deductions[key]);
        return acc;
      },
      {} as Record<string, Record<string, Currency>>
    );
  };
  const deductions = getDeduction(system, deductionInputs, profiles.applicant.taxable.carryOver);
  Object.keys(deductions).forEach((key) => {
    incomeDeductions[key] = deductions[key];
  });

  return incomeDeductions;
}

export function setDeductions() {
  setPersonalDeductions(personalDeductions);
  setIncomeDeductions(incomeDeductions);
}
