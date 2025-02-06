import { system } from './objects.js';
import {
  profiles,
  deductionInputs,
  carryOvers,
  taxReturn,
  incomeDeductions,
  personalDeductions,
  taxCredits,
  tax,
} from './objects.js';
import { Currency } from './objects.js';
import { CurrencyToString } from './functions.js';
//import { get } from 'jquery';

type Value = number | string | boolean | Currency | null;

type HtmlElement = {
  element: HTMLInputElement | null;
  value: (newValue?: Value) => Value;
  output: () => Value;
};

type HtmlElements = {
  [key: string]: HtmlElement;
};

type MappingEntry = {
  key: string;
  fullPath: string;
};

const objectMappings = {
  profiles,
  deductionInputs,
  taxReturn,
  incomeDeductions,
  personalDeductions,
  taxCredits,
  tax,
};

function setCurrency(value: string): Currency {
  return { amount: parseInt(value.replace(/,/g, ''), 10) };
}

const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

const profileMappings: MappingEntry[] = [
  { key: 'applicantBirthYear', fullPath: 'profiles.applicant.year' },
  { key: 'applicantSpouse', fullPath: 'profiles.applicant.attributes.hasSpouse' },
  { key: 'applicantIncomeSalary', fullPath: 'profiles.applicant.income.salary' },
  { key: 'applicantIncomeOther', fullPath: 'profiles.applicant.income.other' },
  { key: 'applicantTaxableSalary', fullPath: 'profiles.applicant.taxable.salary' },
  { key: 'applicantTaxableOther', fullPath: 'profiles.applicant.taxable.other' },
  { key: 'applicantAttributesMinors', fullPath: 'profiles.applicant.attributes.minors' },
  { key: 'applicantAttributesDisability', fullPath: 'profiles.applicant.attributes.disability' },
  { key: 'applicantAttributesSingleP', fullPath: 'profiles.applicant.attributes.single' },
  { key: 'applicantAttributesStudent', fullPath: 'profiles.applicant.attributes.student' },
  { key: 'spouseBirthYear', fullPath: 'profiles.spouse.year' },
  { key: 'spouseIncomeSalary', fullPath: 'profiles.spouse.income.salary' },
  { key: 'spouseIncomeOther', fullPath: 'profiles.spouse.income.other' },
  { key: 'spouseTaxableSalary', fullPath: 'profiles.spouse.taxable.salary' },
  { key: 'spouseTaxableOther', fullPath: 'profiles.spouse.taxable.other' },
  { key: 'dependentSpecified', fullPath: 'profiles.dependent.specified' },
  { key: 'dependentElderlyLt', fullPath: 'profiles.dependent.elderlyLt' },
  { key: 'dependentElderly', fullPath: 'profiles.dependent.elderly' },
  { key: 'dependentChild', fullPath: 'profiles.dependent.child' },
  { key: 'dependentOther', fullPath: 'profiles.dependent.other' },
  { key: 'dependentDisabilityLt', fullPath: 'profiles.dependent.disabilityLt' },
  { key: 'dependentDisabilityP', fullPath: 'profiles.dependent.disabilityP' },
  { key: 'dependentDisabilityO', fullPath: 'profiles.dependent.disabilityO' },
  { key: 'estateHouseYear', fullPath: 'profiles.estate.house.year' },
  { key: 'estateHouseMonth', fullPath: 'profiles.estate.house.month' },
  { key: 'estateHousePrice', fullPath: 'profiles.estate.house.price' },
  { key: 'estateHouseResident', fullPath: 'profiles.estate.house.resident' },
  { key: 'estateHouseDebt', fullPath: 'profiles.estate.house.debt' },
  { key: 'estateLandYear', fullPath: 'profiles.estate.land.year' },
  { key: 'estateLandMonth', fullPath: 'profiles.estate.land.month' },
  { key: 'estateLandPrice', fullPath: 'profiles.estate.land.price' },
  { key: 'estateLandResident', fullPath: 'profiles.estate.land.resident' },
  { key: 'estateLandDebt', fullPath: 'profiles.estate.land.debt' },
  { key: 'estateRenovationYear', fullPath: 'profiles.estate.renovation.year' },
  { key: 'estateRenovationMonth', fullPath: 'profiles.estate.renovation.month' },
  { key: 'estateRenovationPrice', fullPath: 'profiles.estate.renovation.price' },
  { key: 'estateRenovationPriceSp', fullPath: 'profiles.estate.renovation.priceSp' },
  { key: 'estateRenovationResident', fullPath: 'profiles.estate.renovation.resident' },
  { key: 'estateRenovationDebt', fullPath: 'profiles.estate.renovation.debt' },
  { key: 'estateLoanBalance', fullPath: 'profiles.estate.loan.balance' },
  { key: 'estateCaseQuality', fullPath: 'profiles.estate.case.quality' },
  { key: 'estateCaseSalesTax', fullPath: 'profiles.estate.case.salesTax' },
  { key: 'estateCaseApplyResidentTax', fullPath: 'profiles.estate.case.applyResidentTax' },
  { key: 'estateCaseSpH19', fullPath: 'profiles.estate.case.spH19' },
  { key: 'estateCaseSpR1', fullPath: 'profiles.estate.case.spR1' },
  { key: 'estateCaseCovid19', fullPath: 'profiles.estate.case.covid19' },
  { key: 'estateCaseSpR3', fullPath: 'profiles.estate.case.spR3' },
  { key: 'estateCaseSmall', fullPath: 'profiles.estate.case.small' },
  { key: 'estateCaseParenting', fullPath: 'profiles.estate.case.parenting' },
  { key: 'estateCaseSpR6', fullPath: 'profiles.estate.case.spR6' },
];
const deductionInputMappings: MappingEntry[] = [
  { key: 'lossCasualtyLoss', fullPath: 'deductionInputs.loss.casualtyLoss' },
  { key: 'lossDisasterReduction', fullPath: 'deductionInputs.loss.disasterReduction' },
  { key: 'socialInsurance', fullPath: 'deductionInputs.social.insurance' },
  { key: 'socialMutualAid', fullPath: 'deductionInputs.social.mutualAid' },
  { key: 'insuranceLifeNew', fullPath: 'deductionInputs.insurance.lifeNew' },
  { key: 'insuranceLifeOld', fullPath: 'deductionInputs.insurance.lifeOld' },
  { key: 'insuranceHealth', fullPath: 'deductionInputs.insurance.health' },
  { key: 'insuranceAnnuityNew', fullPath: 'deductionInputs.insurance.annuityNew' },
  { key: 'insuranceAnnuityOld', fullPath: 'deductionInputs.insurance.annuityOld' },
  { key: 'insuranceQuakeInsuranceOld', fullPath: 'deductionInputs.insurance.quakeOld' },
  { key: 'insuranceQuakeInsuranceNew', fullPath: 'deductionInputs.insurance.quakeNew' },
  { key: 'medicalExpenses', fullPath: 'deductionInputs.medical.expenses' },
  { key: 'housingLoan', fullPath: 'deductionInputs.housing.loans' },
  { key: 'housingImprovementHouse', fullPath: 'deductionInputs.housing.improvement' },
  { key: 'donationsHometownTax', fullPath: 'deductionInputs.donations.hometownTax' },
  { key: 'donationsCommunityChest', fullPath: 'deductionInputs.donations.communityChest' },
  { key: 'donationsByPref', fullPath: 'deductionInputs.donations.pref' },
  { key: 'donationsByCity', fullPath: 'deductionInputs.donations.city' },
  { key: 'donationsOther', fullPath: 'deductionInputs.donations.other' },
  { key: 'donationsContributions', fullPath: 'deductionInputs.donations.politics' },
  { key: 'donationsNPO', fullPath: 'deductionInputs.donations.npo' },
  { key: 'donationsPublic', fullPath: 'deductionInputs.donations.public' },
  { key: 'withholdingSalary', fullPath: 'deductionInputs.withholding.salary' },
  { key: 'withholdingStockS', fullPath: 'deductionInputs.withholding.stockS' },
  { key: 'withholdingStockJ', fullPath: 'deductionInputs.withholding.stockJ' },
  { key: 'withholdingDividendS', fullPath: 'deductionInputs.withholding.dividendS' },
  { key: 'withholdingDividendJ', fullPath: 'deductionInputs.withholding.dividendJ' },
  { key: 'withholdingNonResidents', fullPath: 'deductionInputs.withholding.nonResidents' },
  { key: 'otherDividend', fullPath: 'deductionInputs.other.dividend' },
  { key: 'otherUnlistedStocks', fullPath: 'deductionInputs.other.unlistedStocks' },
  { key: 'otherForeignTax', fullPath: 'deductionInputs.other.foreignTax' },
];
const taxReturnMappings: MappingEntry[] = [
  { key: 'donationsApplyOneStop', fullPath: 'taxReturn.applyOneStop' },
  { key: 'donationsApplyContributions', fullPath: 'taxReturn.applyPolitics' },
  { key: 'taxReturnDoTaxReturn', fullPath: 'taxReturn.apply' },
  { key: 'taxReturnMethodS', fullPath: 'taxReturn.methodS' },
  { key: 'taxReturnMethodJ', fullPath: 'taxReturn.methodJ' },
];
const personalDeductionsMappings: MappingEntry[] = [
  { key: 'personalS', fullPath: 'personalDeductions.personal.incomeTax' },
  { key: 'personalJ', fullPath: 'personalDeductions.personal.residentTax' },
  { key: 'spouseS', fullPath: 'personalDeductions.spouse.incomeTax' },
  { key: 'spouseJ', fullPath: 'personalDeductions.spouse.residentTax' },
  { key: 'dependentS', fullPath: 'personalDeductions.dependent.incomeTax' },
  { key: 'dependentJ', fullPath: 'personalDeductions.dependent.residentTax' },
  { key: 'basicS', fullPath: 'personalDeductions.basic.incomeTax' },
  { key: 'basicJ', fullPath: 'personalDeductions.basic.residentTax' },
];
const incomeDeductionsMappings: MappingEntry[] = [
  { key: 'casualtyLossS', fullPath: 'incomeDeductions.casualtyLoss.incomeTax' },
  { key: 'casualtyLossJ', fullPath: 'incomeDeductions.casualtyLoss.residentTax' },
  { key: 'medicalS', fullPath: 'incomeDeductions.medical.incomeTax' },
  { key: 'medicalJ', fullPath: 'incomeDeductions.medical.residentTax' },
  { key: 'socialS', fullPath: 'incomeDeductions.social.incomeTax' },
  { key: 'socialJ', fullPath: 'incomeDeductions.social.residentTax' },
  { key: 'pensionS', fullPath: 'incomeDeductions.pension.incomeTax' },
  { key: 'pensionJ', fullPath: 'incomeDeductions.pension.residentTax' },
  { key: 'insuranceLS', fullPath: 'incomeDeductions.insuranceL.incomeTax' },
  { key: 'insuranceLJ', fullPath: 'incomeDeductions.insuranceL.residentTax' },
  { key: 'insuranceES', fullPath: 'incomeDeductions.insuranceE.incomeTax' },
  { key: 'insuranceEJ', fullPath: 'incomeDeductions.insuranceE.residentTax' },
  { key: 'donationsS', fullPath: 'incomeDeductions.donations.incomeTax' },
  //{ key: 'donationsJ', fullPath: 'incomeDeductions.donations.residentTax' },
];
const taxCreditsMappings: MappingEntry[] = [
  { key: 'adjustJ', fullPath: 'taxCredits.adjust.residentTax' },
  { key: 'dividendS', fullPath: 'taxCredits.dividend.incomeTax' },
  { key: 'dividendJ', fullPath: 'taxCredits.dividend.residentTax' },
  { key: 'loansS', fullPath: 'taxCredits.loans.incomeTax' },
  { key: 'loansJ', fullPath: 'taxCredits.loans.residentTax' },
  { key: 'donationsCreditS', fullPath: 'taxCredits.donations.incomeTax' },
  { key: 'donationsCreditJ', fullPath: 'taxCredits.donations.residentTax' },
  { key: 'improvementHouseS', fullPath: 'taxCredits.improvementHouse.incomeTax' },
  { key: 'disasterReductionS', fullPath: 'taxCredits.disasterReduction.incomeTax' },
  { key: 'foreignTaxS', fullPath: 'taxCredits.foreignTax.incomeTax' },
  { key: 'foreignTaxJ', fullPath: 'taxCredits.foreignTax.residentTax' },
  { key: 'withholdingDividendCreditJ', fullPath: 'taxCredits.withholdingDividendCredit.residentTax' },
  { key: 'withholdingStockCreditJ', fullPath: 'taxCredits.withholdingStockCredit.residentTax' },
];
const taxMappings: MappingEntry[] = [
  { key: 'incomeIncomeTax', fullPath: 'tax.income.incomeTax' },
  { key: 'incomeResidentTax', fullPath: 'tax.income.residentTax' },
  { key: 'deductionIncomeTax', fullPath: 'tax.deduction.incomeTax' },
  { key: 'deductionResidentTax', fullPath: 'tax.deduction.residentTax' },
  { key: 'taxableIncomeTax', fullPath: 'tax.taxable.incomeTax' },
  { key: 'taxableResidentTax', fullPath: 'tax.taxable.residentTax' },
  { key: 'taxPreIncomeTax', fullPath: 'tax.taxPre.incomeTax' },
  { key: 'taxPreResidentTax', fullPath: 'tax.taxPre.residentTax' },
  { key: 'taxPreCityTax', fullPath: 'tax.taxPre.cityTax' },
  { key: 'taxPrePrefTax', fullPath: 'tax.taxPre.prefTax' },
  { key: 'taxCreditIncomeTax', fullPath: 'tax.taxCredit.incomeTax' },
  { key: 'taxCreditResidentTax', fullPath: 'tax.taxCredit.residentTax' },
  { key: 'taxCreditCityTax', fullPath: 'tax.taxCredit.cityTax' },
  { key: 'taxCreditPrefTax', fullPath: 'tax.taxCredit.prefTax' },
  { key: 'taxVarIncomeTax', fullPath: 'tax.taxVar.incomeTax' },
  { key: 'taxVarResidentTax', fullPath: 'tax.taxVar.residentTax' },
  { key: 'taxVarCityTax', fullPath: 'tax.taxVar.cityTax' },
  { key: 'taxVarPrefTax', fullPath: 'tax.taxVar.prefTax' },
  //{ key: 'taxFixedIncomeTax', fullPath: 'tax.taxFixed.incomeTax' },
  { key: 'taxFixedResidentTax', fullPath: 'tax.taxFixed.residentTax' },
  { key: 'taxFixedCityTax', fullPath: 'tax.taxFixed.cityTax' },
  { key: 'taxFixedPrefTax', fullPath: 'tax.taxFixed.prefTax' },
  { key: 'taxFixedEcoTax', fullPath: 'tax.taxFixed.ecoTax' },
  { key: 'taxFinalIncomeTax', fullPath: 'tax.taxFinal.incomeTax' },
  { key: 'taxFinalResidentTax', fullPath: 'tax.taxFinal.residentTax' },
  { key: 'paidIncomeTax', fullPath: 'tax.paid.incomeTax' },
  { key: 'paidResidentTax', fullPath: 'tax.paid.residentTax' },
  { key: 'refundIncomeTax', fullPath: 'tax.refund.incomeTax' },
  { key: 'refundResidentTax', fullPath: 'tax.refund.residentTax' },
];

function createGetter(fullPath: string): () => Value {
  const [dist, ...pathParts] = fullPath.split('.');
  const path = pathParts.join('.');
  return new Function('objectMappings', `return objectMappings['${dist}'].${path};`).bind(null, objectMappings);
}

function createSetter(fullPath: string): (value: Value) => void {
  const [dist, ...pathParts] = fullPath.split('.');
  const path = pathParts.join('.');
  return new Function('objectMappings', 'value', `objectMappings['${dist}'].${path} = value;`).bind(
    null,
    objectMappings
  );
}

function createObjectMapping<T>(getter: () => T, setter: (value: T) => void): (value: Value) => T {
  return (value: Value) => {
    if (value !== null && value !== undefined) {
      setter(value as T);
    }
    return getter();
  };
}

function createMapping(mappings: MappingEntry[]): { [key: string]: (value: Value) => Value } {
  return mappings.reduce(
    (acc, mapping) => {
      const getter = createGetter(mapping.fullPath);
      const setter = createSetter(mapping.fullPath);
      acc[mapping.key] = createObjectMapping(getter, setter);
      return acc;
    },
    {} as { [key: string]: (value: Value) => Value }
  );
}

const profileMapping = createMapping(profileMappings);
const deductionInputMapping = createMapping(deductionInputMappings);
const taxReturnMapping = createMapping(taxReturnMappings);
const personalDeductionsMapping = createMapping(personalDeductionsMappings);
const incomeDeductionsMapping = createMapping(incomeDeductionsMappings);
const taxCreditsMapping = createMapping(taxCreditsMappings);
const taxMapping = createMapping(taxMappings);

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
const deductionInputElements: HtmlElements = createHtmlElements(deductionInputMapping);
const taxReturnElements: HtmlElements = createHtmlElements(taxReturnMapping);
const incomeDeductionsElements: HtmlElements = createHtmlElements(incomeDeductionsMapping);
const personalDeductionsElements: HtmlElements = createHtmlElements(personalDeductionsMapping);
const taxCreditsElements: HtmlElements = createHtmlElements(taxCreditsMapping);
const taxElements: HtmlElements = createHtmlElements(taxMapping);

function updateValue(element: HtmlElement) {
  let newValue: Value = element.element?.value || '';
  if (element.element?.type === 'checkbox') {
    newValue = element.element.checked;
  }
  const value = element.value();

  if (typeof value === 'number' && typeof newValue === 'string') {
    const parsedValue = parseInt(newValue, 10);
    if (!isNaN(parsedValue)) {
      element.value(parsedValue);
    }
  } else if (typeof value === 'object' && typeof newValue === 'string') {
    const parsedValue = setCurrency(newValue);
    element.value(parsedValue);
  } else if (typeof value === 'boolean' && typeof newValue === 'boolean') {
    element.value(newValue === true);
  } else if (typeof value === 'string') {
    element.value(newValue || '');
  }
}

function setValue(element: HTMLInputElement | HTMLLabelElement | null, value: Value) {
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

function getHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        updateValue(element);
      }
    }
  }
}

function setHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'output' in element) {
        setValue(element.element, element.output());
      }
    }
  }
}

export function getTaxYear() {
  const taxYearInput = document.getElementById('taxYear') as HTMLInputElement | null;
  if (!taxYearInput) {
    console.error('TaxYear input not found');
    return;
  }
  system.taxYear = parseInt(taxYearInput.value, 10);
  return;
}

export function getProfiles() {
  getHtmlElements(profileElements);
}

export function setProfiles() {
  return setHtmlElements(profileElements);
}

export function getDeductionInputs() {
  getHtmlElements(deductionInputElements);
  getHtmlElements(taxReturnElements);
  //console.log('deductionInput:', deductionInput);
}

export function setDeductionInputs() {
  return setHtmlElements(deductionInputElements);
}

export function getCarryovers() {
  carryOvers.loss = deductionInputs.loss.casualtyLoss;
}

export function getInputs() {
  getTaxYear();
  getProfiles();
  getDeductionInputs();
  getCarryovers();
}

export function showTax() {
  setHtmlElements(incomeDeductionsElements);
  setHtmlElements(personalDeductionsElements);
  setHtmlElements(taxCreditsElements);
  setHtmlElements(taxElements);
}
