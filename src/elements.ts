//import { get } from 'jquery';
import { profile, deductionInput, incomeDeductions, personalDeductions, taxCredits, tax } from './objects.js';
import { Currency } from './objects.js';
import { CurrencyToString } from './functions.js';
//import { ProfileType, DeductionInputType, TaxType, Currency ,} from './objects.js';

type Value = number | string | boolean | Currency | null;

type HtmlElement = {
  element: HTMLInputElement | null;
  value: (newValue?: Value) => Value;
  output: () => Value;
};

type HtmlElements = {
  [key: string]: HtmlElement;
};

const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

function setCurrency(value: string): Currency {
  return { amount: parseInt(value.replace(/,/g, ''), 10) };
}

type MappingEntry = {
  key: string;
  path: string;
  type: string;
};

const mappings: MappingEntry[] = [
  { key: 'applicantBirthYear', path: 'applicant.year', type: 'number' },
  { key: 'applicantIncomeSalary', path: 'applicant.income.salary', type: 'object' },
  { key: 'applicantHasSpouse', path: 'applicant.attributes.hasSpouse', type: 'boolean' },
  { key: 'applicantTaxableSalary', path: 'applicant.taxable.salary', type: 'object' },
  // 他のマッピングも追加可能
];

function createGetter(path: string): () => Value {
  return new Function('profile', `return profile.${path};`).bind(null, profile);
}

function createSetter(path: string, type: string): (value: Value) => void {
  return new Function(
    'profile',
    'value',
    `
    if (typeof value === '${type}') {
      profile.${path} = value;
    } else {
      throw new TypeError('Expected ${type}');
    }
  `
  ).bind(null, profile);
}

function createObjectMapping<T>(getter: () => T, setter: (value: T) => void): (value: Value) => T {
  return (value: Value) => {
    if (value !== null && value !== undefined) {
      setter(value as T);
    }
    return getter();
  };
}

const profileMapping: { [key: string]: (value: Value) => Value } = mappings.reduce(
  (acc, mapping) => {
    const getter = createGetter(mapping.path);
    const setter = createSetter(mapping.path, mapping.type);
    acc[mapping.key] = createObjectMapping(getter, setter);
    return acc;
  },
  {} as { [key: string]: (value: Value) => Value }
);

/*
const profileMapping: { [key: string]: (value: Value) => Value } = {
  applicantBirthYear: createObjectMapping(
    () => profile.applicant.year,
    (value: number) => {
      profile.applicant.year = value;
    }
  ),
  applicantSpouse: createObjectMapping(
    () => profile.applicant.attributes.hasSpouse,
    (value: boolean) => {
      profile.applicant.attributes.hasSpouse = value;
    }
  ),
  applicantIncomeSalary: createObjectMapping(
    () => profile.applicant.income.salary,
    (value: Currency) => {
      profile.applicant.income.salary = value;
    }
  ),
  applicantIncomeOther: createObjectMapping(
    () => profile.applicant.income.other,
    (value: Currency) => {
      profile.applicant.income.other = value;
    }
  ),
  applicantTaxableSalary: createObjectMapping(
    () => profile.applicant.taxable.salary,
    (value: Currency) => {
      profile.applicant.taxable.salary = value;
    }
  ),
  applicantTaxableOther: createObjectMapping(
    () => profile.applicant.taxable.other,
    (value: Currency) => {
      profile.applicant.taxable.other = value;
    }
  ),
  // 他のマッピングも追加可能
  applicantAttributesMinors: createObjectMapping(
    () => profile.applicant.attributes.minors,
    (value: boolean) => {
      profile.applicant.attributes.minors = value;
    }
  ),
  applicantAttributesDisability: createObjectMapping(
    () => profile.applicant.attributes.disability,
    (value: number) => {
      profile.applicant.attributes.disability = value;
    }
  ),
  applicantAttributesSingleP: createObjectMapping(
    () => profile.applicant.attributes.single,
    (value: number) => {
      profile.applicant.attributes.single = value;
    }
  ),
  applicantAttributesStudent: createObjectMapping(
    () => profile.applicant.attributes.student,
    (value: number) => {
      profile.applicant.attributes.student = value;
    }
  ),
  spouseBirthYear: createObjectMapping(
    () => profile.spouse.year,
    (value: number) => {
      profile.spouse.year = value;
    }
  ),
  spouseIncomeSalary: createObjectMapping(
    () => profile.spouse.income.salary,
    (value: Currency) => {
      profile.spouse.income.salary = value;
    }
  ),
  spouseIncomeOther: createObjectMapping(
    () => profile.spouse.income.other,
    (value: Currency) => {
      profile.spouse.income.other = value;
    }
  ),
  spouseTaxableSalary: createObjectMapping(
    () => profile.spouse.taxable.salary,
    (value: Currency) => {
      profile.spouse.taxable.salary = value;
    }
  ),
  spouseTaxableOther: createObjectMapping(
    () => profile.spouse.taxable.other,
    (value: Currency) => {
      profile.spouse.taxable.other = value;
    }
  ),
  dependentSpecified: createObjectMapping(
    () => profile.dependent.specified,
    (value: number) => {
      profile.dependent.specified = value;
    }
  ),
  dependentElderlyLt: createObjectMapping(
    () => profile.dependent.elderlyLt,
    (value: number) => {
      profile.dependent.elderlyLt = value;
    }
  ),
  dependentElderly: createObjectMapping(
    () => profile.dependent.elderly,
    (value: number) => {
      profile.dependent.elderly = value;
    }
  ),
  dependentChild: createObjectMapping(
    () => profile.dependent.child,
    (value: number) => {
      profile.dependent.child = value;
    }
  ),
  dependentOther: createObjectMapping(
    () => profile.dependent.other,
    (value: number) => {
      profile.dependent.other = value;
    }
  ),
  dependentDisabilityLt: createObjectMapping(
    () => profile.dependent.disabilityLt,
    (value: number) => {
      profile.dependent.disabilityLt = value;
    }
  ),
  dependentDisabilityP: createObjectMapping(
    () => profile.dependent.disabilityP,
    (value: number) => {
      profile.dependent.disabilityP = value;
    }
  ),
  dependentDisabilityO: createObjectMapping(
    () => profile.dependent.disabilityO,
    (value: number) => {
      profile.dependent.disabilityO = value;
    }
  ),
  estateHouseYear: createObjectMapping(
    () => profile.estate.house.year,
    (value: number) => {
      profile.estate.house.year = value;
    }
  ),
  estateHouseMonth: createObjectMapping(
    () => profile.estate.house.month,
    (value: number) => {
      profile.estate.house.month = value;
    }
  ),
  estateHousePrice: createObjectMapping(
    () => profile.estate.house.price,
    (value: Currency) => {
      profile.estate.house.price = value;
    }
  ),
  estateHouseResident: createObjectMapping(
    () => profile.estate.house.resident,
    (value: number) => {
      profile.estate.house.resident = value;
    }
  ),
  estateHouseDebt: createObjectMapping(
    () => profile.estate.house.debt,
    (value: number) => {
      profile.estate.house.debt = value;
    }
  ),
  estateLandYear: createObjectMapping(
    () => profile.estate.land.year,
    (value: number) => {
      profile.estate.land.year = value;
    }
  ),
  estateLandMonth: createObjectMapping(
    () => profile.estate.land.month,
    (value: number) => {
      profile.estate.land.month = value;
    }
  ),
  estateLandPrice: createObjectMapping(
    () => profile.estate.land.price,
    (value: Currency) => {
      profile.estate.land.price = value;
    }
  ),
  estateLandResident: createObjectMapping(
    () => profile.estate.land.resident,
    (value: number) => {
      profile.estate.land.resident = value;
    }
  ),
  estateLandDebt: createObjectMapping(
    () => profile.estate.land.debt,
    (value: number) => {
      profile.estate.land.debt = value;
    }
  ),
  estateRenovationYear: createObjectMapping(
    () => profile.estate.renovation.year,
    (value: number) => {
      profile.estate.renovation.year = value;
    }
  ),
  estateRenovationMonth: createObjectMapping(
    () => profile.estate.renovation.month,
    (value: number) => {
      profile.estate.renovation.month = value;
    }
  ),
  estateRenovationPrice: createObjectMapping(
    () => profile.estate.renovation.price,
    (value: Currency) => {
      profile.estate.renovation.price = value;
    }
  ),
  estateRenovationPriceSp: createObjectMapping(
    () => profile.estate.renovation.priceSp,
    (value: Currency) => {
      profile.estate.renovation.priceSp = value;
    }
  ),
  estateRenovationResident: createObjectMapping(
    () => profile.estate.renovation.resident,
    (value: number) => {
      profile.estate.renovation.resident = value;
    }
  ),
  estateRenovationDebt: createObjectMapping(
    () => profile.estate.renovation.debt,
    (value: number) => {
      profile.estate.renovation.debt = value;
    }
  ),
  estateLoanBalance: createObjectMapping(
    () => profile.estate.loan.balance,
    (value: Currency) => {
      profile.estate.loan.balance = value;
    }
  ),
  estateCaseQuality: createObjectMapping(
    () => profile.estate.case.quality,
    (value: number) => {
      profile.estate.case.quality = value;
    }
  ),
  estateCaseSalesTax: createObjectMapping(
    () => profile.estate.case.salesTax,
    (value: number) => {
      profile.estate.case.salesTax = value;
    }
  ),
  estateCaseApplyResidentTax: createObjectMapping(
    () => profile.estate.case.applyResidentTax,
    (value: boolean) => {
      profile.estate.case.applyResidentTax = value;
    }
  ),
  estateCaseSpH19: createObjectMapping(
    () => profile.estate.case.spH19,
    (value: boolean) => {
      profile.estate.case.spH19 = value;
    }
  ),
  estateCaseSpR1: createObjectMapping(
    () => profile.estate.case.spR1,
    (value: boolean) => {
      profile.estate.case.spR1 = value;
    }
  ),
  estateCaseCovid19: createObjectMapping(
    () => profile.estate.case.covid19,
    (value: boolean) => {
      profile.estate.case.covid19 = value;
    }
  ),
  estateCaseSpR3: createObjectMapping(
    () => profile.estate.case.spR3,
    (value: boolean) => {
      profile.estate.case.spR3 = value;
    }
  ),
  estateCaseSmall: createObjectMapping(
    () => profile.estate.case.small,
    (value: boolean) => {
      profile.estate.case.small = value;
    }
  ),
  estateCaseParenting: createObjectMapping(
    () => profile.estate.case.parenting,
    (value: boolean) => {
      profile.estate.case.parenting = value;
    }
  ),
  estateCaseSpR6: createObjectMapping(
    () => profile.estate.case.spR6,
    (value: boolean) => {
      profile.estate.case.spR6 = value;
    }
  ),
};
*/

const deductionInputMapping: { [key: string]: (value: Value) => Value } = {
  lossCasualtyLoss: createObjectMapping(
    () => deductionInput.loss.casualtyLoss,
    (value: Currency) => {
      deductionInput.loss.casualtyLoss = value;
    }
  ),
  lossDisasterReduction: createObjectMapping(
    () => deductionInput.loss.disasterReduction,
    (value: Currency) => {
      deductionInput.loss.disasterReduction = value;
    }
  ),
  socialInsurance: createObjectMapping(
    () => deductionInput.social.insurance,
    (value: Currency) => {
      deductionInput.social.insurance = value;
    }
  ),
  socialMutualAid: createObjectMapping(
    () => deductionInput.social.mutualAid,
    (value: Currency) => {
      deductionInput.social.mutualAid = value;
    }
  ),
  insuranceLifeNew: createObjectMapping(
    () => deductionInput.insurance.lifeNew,
    (value: Currency) => {
      deductionInput.insurance.lifeNew = value;
    }
  ),
  insuranceLifeOld: createObjectMapping(
    () => deductionInput.insurance.lifeOld,
    (value: Currency) => {
      deductionInput.insurance.lifeOld = value;
    }
  ),
  insuranceHealth: createObjectMapping(
    () => deductionInput.insurance.health,
    (value: Currency) => {
      deductionInput.insurance.health = value;
    }
  ),
  insuranceAnnuityNew: createObjectMapping(
    () => deductionInput.insurance.annuityNew,
    (value: Currency) => {
      deductionInput.insurance.annuityNew = value;
    }
  ),
  insuranceAnnuityOld: createObjectMapping(
    () => deductionInput.insurance.annuityOld,
    (value: Currency) => {
      deductionInput.insurance.annuityOld = value;
    }
  ),
  insuranceQuakeInsuranceOld: createObjectMapping(
    () => deductionInput.insurance.quakeOld,
    (value: Currency) => {
      deductionInput.insurance.quakeOld = value;
    }
  ),
  insuranceQuakeInsuranceNew: createObjectMapping(
    () => deductionInput.insurance.quakeNew,
    (value: Currency) => {
      deductionInput.insurance.quakeNew = value;
    }
  ),
  medicalExpenses: createObjectMapping(
    () => deductionInput.medical.expenses,
    (value: Currency) => {
      deductionInput.medical.expenses = value;
    }
  ),
  housingLoan: createObjectMapping(
    () => deductionInput.housing.loans,
    (value: Currency) => {
      deductionInput.housing.loans = value;
    }
  ),
  housingImprovementHouse: createObjectMapping(
    () => deductionInput.housing.improvement,
    (value: Currency) => {
      deductionInput.housing.improvement = value;
    }
  ),
  donationsHometownTax: createObjectMapping(
    () => deductionInput.donations.hometownTax,
    (value: Currency) => {
      deductionInput.donations.hometownTax = value;
    }
  ),
  donationsCommunityChest: createObjectMapping(
    () => deductionInput.donations.communityChest,
    (value: Currency) => {
      deductionInput.donations.communityChest = value;
    }
  ),
  donationsDonationByPref: createObjectMapping(
    () => deductionInput.donations.pref,
    (value: Currency) => {
      deductionInput.donations.pref = value;
    }
  ),
  donationsDonationByCity: createObjectMapping(
    () => deductionInput.donations.city,
    (value: Currency) => {
      deductionInput.donations.city = value;
    }
  ),
  donationsDonationOther: createObjectMapping(
    () => deductionInput.donations.other,
    (value: Currency) => {
      deductionInput.donations.other = value;
    }
  ),
  donationsContributions: createObjectMapping(
    () => deductionInput.donations.politics,
    (value: Currency) => {
      deductionInput.donations.politics = value;
    }
  ),
  donationsApplyOneStop: createObjectMapping(
    () => deductionInput.donations.applyOneStop,
    (value: boolean) => {
      deductionInput.donations.applyOneStop = value;
    }
  ),
  donationsApplyContributions: createObjectMapping(
    () => deductionInput.donations.applyPolitics,
    (value: boolean) => {
      deductionInput.donations.applyPolitics = value;
    }
  ),
  withholdingSalary: createObjectMapping(
    () => deductionInput.withholding.salary,
    (value: Currency) => {
      deductionInput.withholding.salary = value;
    }
  ),
  withholdingStockS: createObjectMapping(
    () => deductionInput.withholding.stockS,
    (value: Currency) => {
      deductionInput.withholding.stockS = value;
    }
  ),
  withholdingStockJ: createObjectMapping(
    () => deductionInput.withholding.stockJ,
    (value: Currency) => {
      deductionInput.withholding.stockJ = value;
    }
  ),
  withholdingDividendS: createObjectMapping(
    () => deductionInput.withholding.dividendS,
    (value: Currency) => {
      deductionInput.withholding.dividendS = value;
    }
  ),
  withholdingDividendJ: createObjectMapping(
    () => deductionInput.withholding.dividendJ,
    (value: Currency) => {
      deductionInput.withholding.dividendJ = value;
    }
  ),
  withholdingNonResidents: createObjectMapping(
    () => deductionInput.withholding.nonResidents,
    (value: Currency) => {
      deductionInput.withholding.nonResidents = value;
    }
  ),
  otherDividend: createObjectMapping(
    () => deductionInput.other.dividend,
    (value: Currency) => {
      deductionInput.other.dividend = value;
    }
  ),
  otherUnlistedStocks: createObjectMapping(
    () => deductionInput.other.unlistedStocks,
    (value: Currency) => {
      deductionInput.other.unlistedStocks = value;
    }
  ),
  otherForeignTax: createObjectMapping(
    () => deductionInput.other.foreignTax,
    (value: Currency) => {
      deductionInput.other.foreignTax = value;
    }
  ),
  taxReturnDoTaxReturn: createObjectMapping(
    () => deductionInput.taxReturn.apply,
    (value: boolean) => {
      deductionInput.taxReturn.apply = value;
    }
  ),
  taxReturnMethodS: createObjectMapping(
    () => deductionInput.taxReturn.methodS,
    (value: number) => {
      deductionInput.taxReturn.methodS = value;
    }
  ),
  taxReturnMethodJ: createObjectMapping(
    () => deductionInput.taxReturn.methodJ,
    (value: number) => {
      deductionInput.taxReturn.methodJ = value;
    }
  ),
};

const incomeDeductionsMapping: { [key: string]: (value: Value) => Value } = {
  casualtyLossS: createObjectMapping(
    () => incomeDeductions.casualtyLoss.incomeTax,
    (value: Currency) => {
      incomeDeductions.casualtyLoss.incomeTax = value;
    }
  ),
  casualtyLossJ: createObjectMapping(
    () => incomeDeductions.casualtyLoss.residentTax,
    (value: Currency) => {
      incomeDeductions.casualtyLoss.residentTax = value;
    }
  ),
  medicalS: createObjectMapping(
    () => incomeDeductions.medical.incomeTax,
    (value: Currency) => {
      incomeDeductions.medical.incomeTax = value;
    }
  ),
  medicalJ: createObjectMapping(
    () => incomeDeductions.medical.residentTax,
    (value: Currency) => {
      incomeDeductions.medical.residentTax = value;
    }
  ),
  socialS: createObjectMapping(
    () => incomeDeductions.social.incomeTax,
    (value: Currency) => {
      incomeDeductions.social.incomeTax = value;
    }
  ),
  socialJ: createObjectMapping(
    () => incomeDeductions.social.residentTax,
    (value: Currency) => {
      incomeDeductions.social.residentTax = value;
    }
  ),
  pensionS: createObjectMapping(
    () => incomeDeductions.pension.incomeTax,
    (value: Currency) => {
      incomeDeductions.pension.incomeTax = value;
    }
  ),
  pensionJ: createObjectMapping(
    () => incomeDeductions.pension.residentTax,
    (value: Currency) => {
      incomeDeductions.pension.residentTax = value;
    }
  ),
  insuranceLS: createObjectMapping(
    () => incomeDeductions.insuranceL.incomeTax,
    (value: Currency) => {
      incomeDeductions.insuranceL.incomeTax = value;
    }
  ),
  insuranceLJ: createObjectMapping(
    () => incomeDeductions.insuranceL.residentTax,
    (value: Currency) => {
      incomeDeductions.insuranceL.residentTax = value;
    }
  ),
  insuranceES: createObjectMapping(
    () => incomeDeductions.insuranceE.incomeTax,
    (value: Currency) => {
      incomeDeductions.insuranceE.incomeTax = value;
    }
  ),
  insuranceEJ: createObjectMapping(
    () => incomeDeductions.insuranceE.residentTax,
    (value: Currency) => {
      incomeDeductions.insuranceE.residentTax = value;
    }
  ),
  donationsS: createObjectMapping(
    () => incomeDeductions.donations.incomeTax,
    (value: Currency) => {
      incomeDeductions.donations.incomeTax = value;
    }
  ),
};

const personalDeductionsMapping: { [key: string]: (value: Value) => Value } = {
  personalS: createObjectMapping(
    () => personalDeductions.personal.incomeTax,
    (value: Currency) => {
      personalDeductions.personal.incomeTax = value;
    }
  ),
  personalJ: createObjectMapping(
    () => personalDeductions.personal.residentTax,
    (value: Currency) => {
      personalDeductions.personal.residentTax = value;
    }
  ),
  spouseS: createObjectMapping(
    () => personalDeductions.spouse.incomeTax,
    (value: Currency) => {
      personalDeductions.spouse.incomeTax = value;
    }
  ),
  spouseJ: createObjectMapping(
    () => personalDeductions.spouse.residentTax,
    (value: Currency) => {
      personalDeductions.spouse.residentTax = value;
    }
  ),
  dependentS: createObjectMapping(
    () => personalDeductions.dependent.incomeTax,
    (value: Currency) => {
      personalDeductions.dependent.incomeTax = value;
    }
  ),
  dependentJ: createObjectMapping(
    () => personalDeductions.dependent.residentTax,
    (value: Currency) => {
      personalDeductions.dependent.residentTax = value;
    }
  ),
  basicS: createObjectMapping(
    () => personalDeductions.basic.incomeTax,
    (value: Currency) => {
      personalDeductions.basic.incomeTax = value;
    }
  ),
  basicJ: createObjectMapping(
    () => personalDeductions.basic.residentTax,
    (value: Currency) => {
      personalDeductions.basic.residentTax = value;
    }
  ),
};

const taxCreditsMapping: { [key: string]: (value: Value) => Value } = {
  dividendS: createObjectMapping(
    () => taxCredits.dividend.incomeTax,
    (value: Currency) => {
      taxCredits.dividend.incomeTax = value;
    }
  ),
  dividendJ: createObjectMapping(
    () => taxCredits.dividend.residentTax,
    (value: Currency) => {
      taxCredits.dividend.residentTax = value;
    }
  ),
  loansS: createObjectMapping(
    () => taxCredits.loans.incomeTax,
    (value: Currency) => {
      taxCredits.loans.incomeTax = value;
    }
  ),
  loansJ: createObjectMapping(
    () => taxCredits.loans.residentTax,
    (value: Currency) => {
      taxCredits.loans.residentTax = value;
    }
  ),
  donationsCreditS: createObjectMapping(
    () => taxCredits.donations.incomeTax,
    (value: Currency) => {
      taxCredits.donations.incomeTax = value;
    }
  ),
  donationsCreditJ: createObjectMapping(
    () => taxCredits.donations.residentTax,
    (value: Currency) => {
      taxCredits.donations.residentTax = value;
    }
  ),
  improvementHouseS: createObjectMapping(
    () => taxCredits.improvementHouse.incomeTax,
    (value: Currency) => {
      taxCredits.improvementHouse.incomeTax = value;
    }
  ),
  disasterReductionS: createObjectMapping(
    () => taxCredits.disasterReduction.incomeTax,
    (value: Currency) => {
      taxCredits.disasterReduction.incomeTax = value;
    }
  ),
  foreignTaxS: createObjectMapping(
    () => taxCredits.foreignTax.incomeTax,
    (value: Currency) => {
      taxCredits.foreignTax.incomeTax = value;
    }
  ),
  foreignTaxJ: createObjectMapping(
    () => taxCredits.foreignTax.residentTax,
    (value: Currency) => {
      taxCredits.foreignTax.residentTax = value;
    }
  ),
  withholdingDividendCreditJ: createObjectMapping(
    () => taxCredits.withholdingDividendCredit.residentTax,
    (value: Currency) => {
      taxCredits.withholdingDividendCredit.residentTax = value;
    }
  ),
  withholdingStockCreditJ: createObjectMapping(
    () => taxCredits.withholdingStockCredit.residentTax,
    (value: Currency) => {
      taxCredits.withholdingStockCredit.residentTax = value;
    }
  ),
};

const taxMapping: { [key: string]: (value: Value) => Value } = {
  incomeIncomeTax: createObjectMapping(
    () => tax.income.incomeTax,
    (value: Currency) => {
      tax.income.incomeTax = value;
    }
  ),
  incomeResidentTax: createObjectMapping(
    () => tax.income.residentTax,
    (value: Currency) => {
      tax.income.residentTax = value;
    }
  ),
  deductionIncomeTax: createObjectMapping(
    () => tax.deduction.incomeTax,
    (value: Currency) => {
      tax.deduction.incomeTax = value;
    }
  ),
  deductionResidentTax: createObjectMapping(
    () => tax.deduction.residentTax,
    (value: Currency) => {
      tax.deduction.residentTax = value;
    }
  ),
  taxableIncomeTax: createObjectMapping(
    () => tax.taxable.incomeTax,
    (value: Currency) => {
      tax.taxable.incomeTax = value;
    }
  ),
  taxableResidentTax: createObjectMapping(
    () => tax.taxable.residentTax,
    (value: Currency) => {
      tax.taxable.residentTax = value;
    }
  ),
  taxPreIncomeTax: createObjectMapping(
    () => tax.taxPre.incomeTax,
    (value: Currency) => {
      tax.taxPre.incomeTax = value;
    }
  ),
  taxPreResidentTax: createObjectMapping(
    () => tax.taxPre.residentTax,
    (value: Currency) => {
      tax.taxPre.residentTax = value;
    }
  ),
  taxPreCityTax: createObjectMapping(
    () => tax.taxPre.cityTax,
    (value: Currency) => {
      tax.taxPre.cityTax = value;
    }
  ),
  taxPrePrefTax: createObjectMapping(
    () => tax.taxPre.prefTax,
    (value: Currency) => {
      tax.taxPre.prefTax = value;
    }
  ),
  taxCreditIncomeTax: createObjectMapping(
    () => tax.taxCredit.incomeTax,
    (value: Currency) => {
      tax.taxCredit.incomeTax = value;
    }
  ),
  taxCreditResidentTax: createObjectMapping(
    () => tax.taxCredit.residentTax,
    (value: Currency) => {
      tax.taxCredit.residentTax = value;
    }
  ),
  taxCreditCityTax: createObjectMapping(
    () => tax.taxCredit.cityTax,
    (value: Currency) => {
      tax.taxCredit.cityTax = value;
    }
  ),
  taxCreditPrefTax: createObjectMapping(
    () => tax.taxCredit.prefTax,
    (value: Currency) => {
      tax.taxCredit.prefTax = value;
    }
  ),
  taxVarIncomeTax: createObjectMapping(
    () => tax.taxVar.incomeTax,
    (value: Currency) => {
      tax.taxVar.incomeTax = value;
    }
  ),
  taxVarResidentTax: createObjectMapping(
    () => tax.taxVar.residentTax,
    (value: Currency) => {
      tax.taxVar.residentTax = value;
    }
  ),
  taxVarCityTax: createObjectMapping(
    () => tax.taxVar.cityTax,
    (value: Currency) => {
      tax.taxVar.cityTax = value;
    }
  ),
  taxVarPrefTax: createObjectMapping(
    () => tax.taxVar.prefTax,
    (value: Currency) => {
      tax.taxVar.prefTax = value;
    }
  ),
  taxFixedResidentTax: createObjectMapping(
    () => tax.taxFixed.residentTax,
    (value: Currency) => {
      tax.taxFixed.residentTax = value;
    }
  ),
  taxFixedCityTax: createObjectMapping(
    () => tax.taxFixed.cityTax,
    (value: Currency) => {
      tax.taxFixed.cityTax = value;
    }
  ),
  taxFixedPrefTax: createObjectMapping(
    () => tax.taxFixed.prefTax,
    (value: Currency) => {
      tax.taxFixed.prefTax = value;
    }
  ),
  taxFixedEcoTax: createObjectMapping(
    () => tax.taxFixed.ecoTax,
    (value: Currency) => {
      tax.taxFixed.ecoTax = value;
    }
  ),
  taxFinalIncomeTax: createObjectMapping(
    () => tax.taxFinal.incomeTax,
    (value: Currency) => {
      tax.taxFinal.incomeTax = value;
    }
  ),
  taxFinalResidentTax: createObjectMapping(
    () => tax.taxFinal.residentTax,
    (value: Currency) => {
      tax.taxFinal.residentTax = value;
    }
  ),
  paidIncomeTax: createObjectMapping(
    () => tax.paid.incomeTax,
    (value: Currency) => {
      tax.paid.incomeTax = value;
    }
  ),
  paidResidentTax: createObjectMapping(
    () => tax.paid.residentTax,
    (value: Currency) => {
      tax.paid.residentTax = value;
    }
  ),
  refundIncomeTax: createObjectMapping(
    () => tax.refund.incomeTax,
    (value: Currency) => {
      tax.refund.incomeTax = value;
    }
  ),
  refundResidentTax: createObjectMapping(
    () => tax.refund.residentTax,
    (value: Currency) => {
      tax.refund.residentTax = value;
    }
  ),
};

type Mapping = { [key: string]: (value: Value) => Value };

function createHtmlElements(mapping: Mapping): HtmlElements {
  return Object.keys(mapping).reduce((elements, key) => {
    elements[key] = {
      element: getElement(key),
      value: (newValue?: Value) => {
        if (newValue !== undefined) {
          return mapping[key](newValue);
        }
        // newValue が undefined の場合、現在の値を返す
        return mapping[key](null);
      },
      output: () => {
        return mapping[key](null);
      },
    };
    return elements;
  }, {} as HtmlElements);
}

const profileElements: HtmlElements = createHtmlElements(profileMapping);
export const deductionInputElements: HtmlElements = createHtmlElements(deductionInputMapping);
export const incomeDeductionsElements: HtmlElements = createHtmlElements(incomeDeductionsMapping);
export const personalDeductionsElements: HtmlElements = createHtmlElements(personalDeductionsMapping);
export const taxCreditsElements: HtmlElements = createHtmlElements(taxCreditsMapping);
export const taxElements: HtmlElements = createHtmlElements(taxMapping);
/*
function isCurrency(value: Value): value is Currency {
  return typeof value === 'object' && value !== null && 'amount' in value;
}
  */

export function updateValue(element: HtmlElement) {
  let newValue: Value = element.element?.value || '';
  if (element.element?.type === 'checkbox') {
    newValue = element.element.checked;
  }
  const value = element.value();
  //console.log('value:', value);
  //console.log(typeof value);

  if (typeof value === 'number' && typeof newValue === 'string') {
    //console.log('update number');
    const parsedValue = parseInt(newValue, 10);
    if (!isNaN(parsedValue)) {
      element.value(parsedValue);
    }
  } else if (typeof value === 'object' && typeof newValue === 'string') {
    //console.log('update Currency');
    const parsedValue = setCurrency(newValue);
    element.value(parsedValue);
  } else if (typeof value === 'boolean' && typeof newValue === 'boolean') {
    //console.log('update boolean');
    element.value(newValue === true);
  } else if (typeof value === 'string') {
    //console.log('update string');
    element.value(newValue || '');
  }
}

export function setValue(element: HTMLInputElement | HTMLLabelElement | null, value: Value) {
  if (element instanceof HTMLLabelElement) {
    if (element && typeof value === 'object' && value !== null && 'amount' in value) {
      return (element.textContent = CurrencyToString(value) || '');
    } else if (element) {
      return (element.textContent = value?.toString() || '');
    }
  } else if (element instanceof HTMLInputElement) {
    if (element?.type === 'checkbox' && typeof value === 'boolean') {
      return (element.checked = value);
    } else if (element && typeof value === 'object' && value !== null && 'amount' in value) {
      return (element.value = CurrencyToString(value) || '');
    } else if (element) {
      return (element.value = value?.toString() || '');
    }
  }
}

export function getHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        updateValue(element);
      }
    }
  }
}

export function setHtmlElements(elements: HtmlElements) {
  //const keysToProcess = ['applicantTaxableSalary'];
  //console.log('keysToProcess:', keysToProcess);
  //keysToProcess.forEach((key) => {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'output' in element) {
        setValue(element.element, element.output());
      }
    }
  }
}

export function getProfile() {
  getHtmlElements(profileElements);
  console.log('profile:', profile);
}

export function showProfile() {
  console.log('profile:', profile);
  profile.applicant.taxable.salary = profile.applicant.income.salary;
  profile.spouse.taxable.salary = profile.spouse.income.salary;
  setProfile();
}

export function setProfile() {
  return setHtmlElements(profileElements);
}

export function getDeductionInput() {
  getHtmlElements(deductionInputElements);
  console.log('deductionInput:', deductionInput);
}

/*
export function getTax() {
  getHtmlElements(taxElements);
}
*/

export function setDeductionInput() {
  return setHtmlElements(deductionInputElements);
}

export function showTax() {
  setHtmlElements(incomeDeductionsElements);
  setHtmlElements(personalDeductionsElements);
  setHtmlElements(taxCreditsElements);
  setHtmlElements(taxElements);
}
