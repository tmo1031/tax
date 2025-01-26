//import { get } from 'jquery';
import { profile /*, deductionInput , incomeDeductions, personalDeductions, taxCredits, tax */ } from './objects.js';
import { Currency } from './objects.js';
//import { ProfileType, DeductionInputType, TaxType, Currency ,} from './objects.js';

type Value = number | string | boolean | Currency | null;

type HtmlElement = {
  element: HTMLInputElement | null;
  value: (newValue?: number | string | boolean | Currency | null) => number | string | boolean | Currency | null;
};

type HtmlElements = {
  [key: string]: HtmlElement;
};

const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

function setCurrency(value: string): Currency {
  return { amount: parseInt(value.replace(/,/g, ''), 10) };
}

function createObjectMapping<T>(getter: () => T, setter: (value: T) => void): (value: Value) => T {
  return (value: Value) => {
    if (typeof value === typeof getter()) {
      setter(value as T);
    }
    return getter();
  };
}

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
  /*
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
  */
};

const profileElements: HtmlElements = Object.keys(profileMapping).reduce((elements, key) => {
  elements[key] = {
    element: getElement(key),
    value: (newValue?: Value) => {
      if (newValue !== undefined) {
        return profileMapping[key](newValue);
      }
      // newValue が undefined の場合、現在の値を返す
      return profileMapping[key](null);
    },
  };
  return elements;
}, {} as HtmlElements);

/*
  applicantSpouse: { element: getElement('spouseCheck'), value: () => profile.applicant.attributes.hasSpouse },
  applicantIncomeSalary: { element: getElement('incomeSalary'), value: () => profile.applicant.income.salary },
  applicantIncomeOther: { element: getElement('incomeOther'), value: () => profile.applicant.income.other },
  applicantTaxableSalary: { element: getElement('taxableSalary'), value: () => profile.applicant.taxable.salary },
  applicantTaxableOther: { element: getElement('taxableOther'), value: () => profile.applicant.taxable.other },
  applicantAttributesMinors: { element: getElement('minors'), value: () => profile.applicant.attributes.minors },
  applicantAttributesDisability: {
    element: getElement('disability'),
    value: () => profile.applicant.attributes.disability,
  },
  applicantAttributesSingleP: { element: getElement('single'), value: () => profile.applicant.attributes.single },
  applicantAttributesStudent: { element: getElement('student'), value: () => profile.applicant.attributes.student },
  spouseBirthYear: { element: getElement('birthYearS'), value: () => profile.spouse.year },
  spouseIncomeSalary: { element: getElement('incomeSalaryS'), value: () => profile.spouse.income.salary },
  spouseIncomeOther: { element: getElement('incomeOtherS'), value: () => profile.spouse.income.other },
  spouseTaxableSalary: { element: getElement('taxableSalaryS'), value: () => profile.spouse.taxable.salary },
  spouseTaxableOther: { element: getElement('taxableOtherS'), value: () => profile.spouse.taxable.other },
  dependentSpecified: { element: getElement('dependentSpecified'), value: () => profile.dependent.specified },
  dependentElderlyLt: { element: getElement('dependentElderlyLT'), value: () => profile.dependent.elderlyLt },
  dependentElderly: { element: getElement('dependentElderly'), value: () => profile.dependent.elderly },
  dependentChild: { element: getElement('dependentChild'), value: () => profile.dependent.child },
  dependentOther: { element: getElement('dependentOther'), value: () => profile.dependent.other },
  dependentDisabilityLt: { element: getElement('dependentDisabilityLT'), value: () => profile.dependent.disabilityLt },
  dependentDisabilityP: { element: getElement('dependentDisabilityP'), value: () => profile.dependent.disabilityP },
  dependentDisabilityO: { element: getElement('dependentDisabilityO'), value: () => profile.dependent.disabilityO },
  estateHouseYear: { element: getElement('moveInYear'), value: () => profile.estate.house.year },
  estateHouseMonth: { element: getElement('moveInMonth'), value: () => profile.estate.house.month },
  estateHousePrice: { element: getElement('housePrice'), value: () => profile.estate.house.price },
  estateHouseResident: { element: getElement('houseResident'), value: () => profile.estate.house.resident },
  estateHouseDebt: { element: getElement('houseDebt'), value: () => profile.estate.house.debt },
  estateLandYear: { element: getElement('moveInYear'), value: () => profile.estate.land.year },
  estateLandMonth: { element: getElement('moveInMonth'), value: () => profile.estate.land.month },
  estateLandPrice: { element: getElement('landPrice'), value: () => profile.estate.land.price },
  estateLandResident: { element: getElement('landResident'), value: () => profile.estate.land.resident },
  estateLandDebt: { element: getElement('landDebt'), value: () => profile.estate.land.debt },
  estateRenovationYear: { element: getElement('renovYear'), value: () => profile.estate.renovation.year },
  estateRenovationMonth: { element: getElement('renovMonth'), value: () => profile.estate.renovation.month },
  estateRenovationPrice: { element: getElement('renovPrice'), value: () => profile.estate.renovation.price },
  estateRenovationPriceSp: { element: getElement('renovPriceSp'), value: () => profile.estate.renovation.priceSp },
  estateRenovationResident: { element: getElement('renovResident'), value: () => profile.estate.renovation.resident },
  estateRenovationDebt: { element: getElement('renovDebt'), value: () => profile.estate.renovation.debt },
  estateLoanBalance: { element: getElement('loanBalance'), value: () => profile.estate.loan.balance },
  estateCaseQuality: { element: getElement('quality'), value: () => profile.estate.case.quality },
  estateCaseSalesTax: { element: getElement('salesTax'), value: () => profile.estate.case.salesTax },
  estateCaseApplyResidentTax: {
    element: getElement('applyResidentTax'),
    value: () => profile.estate.case.applyResidentTax,
  },
  estateCaseSpH19: { element: getElement('spH19'), value: () => profile.estate.case.spH19 },
  estateCaseSpR1: { element: getElement('spR1'), value: () => profile.estate.case.spR1 },
  estateCaseCovid19: { element: getElement('covid19'), value: () => profile.estate.case.covid19 },
  estateCaseSpR3: { element: getElement('spR3'), value: () => profile.estate.case.spR3 },
  estateCaseSmall: { element: getElement('small'), value: () => profile.estate.case.small },
  estateCaseParenting: { element: getElement('parenting'), value: () => profile.estate.case.parenting },
  estateCaseSpR6: { element: getElement('spR6'), value: () => profile.estate.case.spR6 },
};

export const deductionInputElements = {
  lossCasualtyLoss: { element: getElement('casualtyLoss'), value: () => deductionInput.loss.casualtyLoss },
  lossDisasterReduction: {
    element: getElement('disasterReduction'),
    value: () => deductionInput.loss.disasterReduction,
  },
  socialInsurance: { element: getElement('socialInsurance'), value: () => deductionInput.social.insurance },
  socialMutualAid: { element: getElement('mutualAid'), value: () => deductionInput.social.mutualAid },
  insuranceLifeNew: { element: getElement('lifeInsuranceNew'), value: () => deductionInput.insurance.lifeNew },
  insuranceLifeOld: { element: getElement('healthInsurance'), value: () => deductionInput.insurance.lifeOld },
  insuranceHealth: { element: getElement('healthInsurance'), value: () => deductionInput.insurance.health },
  insuranceAnnuityNew: { element: getElement('annuityNew'), value: () => deductionInput.insurance.annuityNew },
  insuranceAnnuityOld: { element: getElement('annuityOld'), value: () => deductionInput.insurance.annuityOld },
  insuranceQuakeInsuranceOld: {
    element: getElement('quakeInsuranceOld'),
    value: () => deductionInput.insurance.quakeOld,
  },
  insuranceQuakeInsuranceNew: {
    element: getElement('quakeInsuranceNew'),
    value: () => deductionInput.insurance.quakeNew,
  },
  medicalExpenses: { element: getElement('medicalExpenses'), value: () => deductionInput.medical.expenses },
  housingLoan: { element: getElement('loans'), value: () => deductionInput.housing.loans },
  housingImprovementHouse: { element: getElement('improvementHouse'), value: () => deductionInput.housing.improvement },
  donationsHometownTax: { element: getElement('hometownTax'), value: () => deductionInput.donations.hometownTax },
  donationsCommunityChest: {
    element: getElement('communityChest'),
    value: () => deductionInput.donations.communityChest,
  },
  donationsDonationByPref: { element: getElement('donationByPref'), value: () => deductionInput.donations.pref },
  donationsDonationByCity: { element: getElement('donationByCity'), value: () => deductionInput.donations.city },
  donationsDonationOther: { element: getElement('donationOther'), value: () => deductionInput.donations.other },
  donationsContributions: { element: getElement('contributions'), value: () => deductionInput.donations.politics },
  donationsApplyOneStop: { element: getElement('applyOneStop'), value: () => deductionInput.donations.applyOneStop },
  donationsApplyContributions: {
    element: getElement('applyContributions'),
    value: () => deductionInput.donations.applyPolitics,
  },
  withholdingSalary: { element: getElement('withholdingSalary'), value: () => deductionInput.withholding.salary },
  withholdingStockS: { element: getElement('withholdingStockS'), value: () => deductionInput.withholding.stockS },
  withholdingStockJ: { element: getElement('withholdingStockJ'), value: () => deductionInput.withholding.stockJ },
  withholdingDividendS: {
    element: getElement('withholdingDividendS'),
    value: () => deductionInput.withholding.dividendS,
  },
  withholdingDividendJ: {
    element: getElement('withholdingDividendJ'),
    value: () => deductionInput.withholding.dividendJ,
  },
  withholdingNonResidents: {
    element: getElement('nonResidents'),
    value: () => deductionInput.withholding.nonResidents,
  },
  otherDividend: { element: getElement('dividend'), value: () => deductionInput.other.dividend },
  otherUnlistedStocks: { element: getElement('unlistedStocks'), value: () => deductionInput.other.unlistedStocks },
  otherForeignTax: { element: getElement('foreignTax'), value: () => deductionInput.other.foreignTax },
  taxReturnDoTaxReturn: { element: getElement('doTaxReturn'), value: () => deductionInput.taxReturn.apply },
  taxReturnMethodS: { element: getElement('methodS'), value: () => deductionInput.taxReturn.methodS },
  taxReturnMethodJ: { element: getElement('methodJ'), value: () => deductionInput.taxReturn.methodJ },
};

export const taxElements = {
  incomeDeductionsCasualtyLossS: {
    element: getElement('casualtyLossS'),
    value: () => incomeDeductions.casualtyLoss.incomeTax,
  },
  incomeDeductionsCasualtyLossJ: {
    element: getElement('casualtyLossJ'),
    value: () => incomeDeductions.casualtyLoss.residentTax,
  },
  incomeDeductionsMedicalS: { element: getElement('medicalS'), value: () => incomeDeductions.medical.incomeTax },
  incomeDeductionsMedicalJ: { element: getElement('medicalJ'), value: () => incomeDeductions.medical.residentTax },
  incomeDeductionsSocialS: { element: getElement('socialS'), value: () => incomeDeductions.social.incomeTax },
  incomeDeductionsSocialJ: { element: getElement('socialJ'), value: () => incomeDeductions.social.residentTax },
  incomeDeductionsPensionS: { element: getElement('pensionS'), value: () => incomeDeductions.pension.incomeTax },
  incomeDeductionsPensionJ: { element: getElement('pensionJ'), value: () => incomeDeductions.pension.residentTax },
  incomeDeductionsInsuranceLS: {
    element: getElement('insuranceLS'),
    value: () => incomeDeductions.insuranceL.incomeTax,
  },
  incomeDeductionsInsuranceLJ: {
    element: getElement('insuranceLJ'),
    value: () => incomeDeductions.insuranceL.residentTax,
  },
  incomeDeductionsInsuranceES: {
    element: getElement('insuranceES'),
    value: () => incomeDeductions.insuranceE.incomeTax,
  },
  incomeDeductionsInsuranceEJ: {
    element: getElement('insuranceEJ'),
    value: () => incomeDeductions.insuranceE.residentTax,
  },
  incomeDeductionsDonationsS: { element: getElement('donationsS'), value: () => incomeDeductions.donations.incomeTax },
  // incomeDeductionsDonationsJ: { element: getElement('donationsJ'), value: () => tax.donations },

  personalDeductionsPersonalS: { element: getElement('personalS'), value: () => personalDeductions.personal.incomeTax },
  personalDeductionsPersonalJ: {
    element: getElement('personalJ'),
    value: () => personalDeductions.personal.residentTax,
  },
  personalDeductionsSpouseS: { element: getElement('spouseS'), value: () => personalDeductions.spouse.incomeTax },
  personalDeductionsSpouseJ: { element: getElement('spouseJ'), value: () => personalDeductions.spouse.residentTax },
  personalDeductionsDependentS: {
    element: getElement('dependentS'),
    value: () => personalDeductions.dependent.incomeTax,
  },
  personalDeductionsDependentJ: {
    element: getElement('dependentJ'),
    value: () => personalDeductions.dependent.residentTax,
  },
  personalDeductionsBasicS: { element: getElement('basicS'), value: () => personalDeductions.basic.incomeTax },
  personalDeductionsBasicJ: { element: getElement('basicJ'), value: () => personalDeductions.basic.residentTax },

  taxCreditsDividendS: { element: getElement('dividendS'), value: () => taxCredits.dividend.incomeTax },
  taxCreditsDividendJ: { element: getElement('dividendJ'), value: () => taxCredits.dividend.residentTax },
  taxCreditsLoansS: { element: getElement('loansS'), value: () => taxCredits.loans.incomeTax },
  taxCreditsLoansJ: { element: getElement('loansJ'), value: () => taxCredits.loans.residentTax },
  taxCreditsDonationsS: { element: getElement('donationsCreditS'), value: () => taxCredits.donations.incomeTax },
  taxCreditsDonationsJ: { element: getElement('donationsCreditJ'), value: () => taxCredits.donations.residentTax },
  taxCreditsImprovementHouseS: {
    element: getElement('improvementHouseS'),
    value: () => taxCredits.improvementHouse.incomeTax,
  },
  // taxCreditsImprovementHouseJ: { element: getElement('improvementHouseJ'), value: () => },
  taxCreditsDisasterReductionS: {
    element: getElement('disasterReductionS'),
    value: () => taxCredits.disasterReduction.incomeTax,
  },
  // taxCreditsDisasterReductionJ: { element: getElement('disasterReductionJ'), value: () => },
  taxCreditsForeignTaxS: { element: getElement('foreignTaxS'), value: () => taxCredits.foreignTax.incomeTax },
  taxCreditsForeignTaxJ: { element: getElement('foreignTaxJ'), value: () => taxCredits.foreignTax.residentTax },
  taxCreditsWithholdingDividend: {
    element: getElement('withholdingDividendCreditJ'),
    value: () => taxCredits.withholdingDividend.residentTax,
  },
  taxCreditsWithholdingStock: {
    element: getElement('withholdingStockCreditJ'),
    value: () => taxCredits.withholdingStock.residentTax,
  },

  taxIncomeS: { element: getElement('incomeS'), value: () => tax.income.incomeTax },
  taxIncomeJ: { element: getElement('incomeJ'), value: () => tax.income.residentTax },
  taxDeductionS: { element: getElement('deductionS'), value: () => tax.deduction.incomeTax },
  taxDeductionJ: { element: getElement('deductionJ'), value: () => tax.deduction.residentTax },
  taxTaxableS: { element: getElement('taxableS'), value: () => tax.taxable.incomeTax },
  taxTaxableJ: { element: getElement('taxableJ'), value: () => tax.taxable.residentTax },
  taxTaxPreS: { element: getElement('taxPreS'), value: () => tax.taxPre.incomeTax },
  taxTaxPreJ: { element: getElement('taxPreJ'), value: () => tax.taxPre.residentTax },
  taxTaxPreCity: { element: getElement('taxPreCity'), value: () => tax.taxPre.cityTax },
  taxTaxPrePref: { element: getElement('taxPrePref'), value: () => tax.taxPre.prefTax },
  taxTaxCreditS: { element: getElement('taxCreditS'), value: () => tax.taxCredit.incomeTax },
  taxTaxCreditJ: { element: getElement('taxCreditJ'), value: () => tax.taxCredit.residentTax },
  taxTaxCreditCity: { element: getElement('taxCreditCity'), value: () => tax.taxCredit.cityTax },
  taxTaxCreditPref: { element: getElement('taxCreditPref'), value: () => tax.taxCredit.prefTax },
  taxTaxVarS: { element: getElement('taxVarS'), value: () => tax.taxVar.incomeTax },
  taxTaxVarJ: { element: getElement('taxVarJ'), value: () => tax.taxVar.residentTax },
  taxTaxVarCity: { element: getElement('taxVarCity'), value: () => tax.taxVar.cityTax },
  taxTaxVarPref: { element: getElement('taxVarPref'), value: () => tax.taxVar.prefTax },
  taxTaxFixedJ: { element: getElement('taxFixedJ'), value: () => tax.taxFixed.residentTax },
  taxTaxFixedCity: { element: getElement('taxFixedCity'), value: () => tax.taxFixed.cityTax },
  taxTaxFixedPref: { element: getElement('taxFixedPref'), value: () => tax.taxFixed.prefTax },
  taxTaxFixedEco: { element: getElement('taxFixedEco'), value: () => tax.taxFixed.ecoTax },
  taxTaxFinalS: { element: getElement('taxFinalS'), value: () => tax.taxFinal.incomeTax },
  taxTaxFinalJ: { element: getElement('taxFinalJ'), value: () => tax.taxFinal.residentTax },
  taxPaidS: { element: getElement('paidS'), value: () => tax.paid.incomeTax },
  taxPaidJ: { element: getElement('paidJ'), value: () => tax.paid.residentTax },
  taxRefundS: { element: getElement('refundS'), value: () => tax.refund.incomeTax },
  taxRefundJ: { element: getElement('refundJ'), value: () => tax.refund.residentTax },
};

const profileMapping: { [key: string]: (value: Value) => void } = {
  birthYear: (value) => {
    if (typeof value === 'number') {
      profile.applicant.year = value;
    }
  },
  birthYearS: (value) => {
    if (typeof value === 'number') {
      profile.spouse.year = value;
    }
  },
};
*/

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
  console.log('value:', value);
  console.log(typeof value);

  if (typeof value === 'number' && typeof newValue === 'string') {
    console.log('update number');
    const parsedValue = parseInt(newValue, 10);
    if (!isNaN(parsedValue)) {
      element.value(parsedValue);
    }
  } else if (typeof value === 'object' && typeof newValue === 'string') {
    console.log('update Currency');
    const parsedValue = setCurrency(newValue);
    element.value(parsedValue);
  } else if (typeof value === 'boolean' && typeof newValue === 'boolean') {
    console.log('update boolean');
    element.value(newValue === true);
  } else if (typeof value === 'string') {
    console.log('update string');
    element.value(newValue || '');
  }
}

export function getHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        let newValue: Value = element.element?.value || '';
        if (element.element?.type === 'checkbox') {
          newValue = element.element.checked;
        }
        console.log('key:', key);
        console.log('value:', element.value());
        console.log('newValue:', newValue);
        console.log('element:', element);
        updateValue(element);
      }
    }
  }
}

export function setHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        const value = element.value();
        if (element.element) {
          if (typeof value === 'object' && value !== null && 'amount' in value) {
            element.element.value = value.amount.toString();
          } else {
            element.element.value = value?.toString() || '';
          }
        }
      } else {
        setHtmlElements(element as HtmlElements);
      }
    }
  }
}

export function getProfile() {
  getHtmlElements(profileElements);
  console.log('profile:', profile);
}

/* 
export function getDeductionInput() {
  getHtmlElements(deductionInputElements);
  console.log('deductionInput:', deductionInput);
}

export function getTax() {
  getHtmlElements(taxElements);
}
export function setProfile() {
  setHtmlElements(profileElements);
}

export function setDeductionInput() {
  setHtmlElements(deductionInputElements);
}

export function setTax() {
  setHtmlElements(taxElements);
}
 */
