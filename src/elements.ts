import { profile, deductionInput, incomeDeductions, personalDeductions, taxCredits, tax } from './objects.js';

const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

export const profileElements = {
  applicant: {
    birthYear: { element: getElement('birthYear'), value: profile.applicant.year },
    spouse: { element: getElement('spouse'), value: profile.applicant.attributes.hasSpouse },
    income: {
      salary: { element: getElement('incomeSalary'), value: profile.applicant.income.salary },
      other: { element: getElement('incomeOther'), value: profile.applicant.income.other },
    },
    taxable: {
      salary: { element: getElement('taxableSalary'), value: profile.applicant.taxable.salary },
      other: { element: getElement('taxableOther'), value: profile.applicant.taxable.other },
    },
    attributes: {
      minors: { element: getElement('minors'), value: profile.applicant.attributes.minors },
      disability: { element: getElement('disability'), value: profile.applicant.attributes.disability },
      singleP: { element: getElement('single'), value: profile.applicant.attributes.single },
      student: { element: getElement('student'), value: profile.applicant.attributes.student },
    },
  },
  spouse: {
    birthYear: { element: getElement('birthYearS'), value: profile.spouse.year },
    income: {
      salary: { element: getElement('incomeSalaryS'), value: profile.spouse.income.salary },
      other: { element: getElement('incomeOtherS'), value: profile.spouse.income.other },
    },
    taxable: {
      salary: { element: getElement('taxableSalaryS'), value: profile.spouse.taxable.salary },
      other: { element: getElement('taxableOtherS'), value: profile.spouse.taxable.other },
    },
  },
  dependent: {
    specified: { element: getElement('specified'), value: profile.dependent.specified },
    elderlyLt: { element: getElement('elderlyLt'), value: profile.dependent.elderlyLt },
    elderly: { element: getElement('elderly'), value: profile.dependent.elderly },
    child: { element: getElement('child'), value: profile.dependent.child },
    other: { element: getElement('other'), value: profile.dependent.other },
    disabilityLt: { element: getElement('disabilityLt'), value: profile.dependent.disabilityLt },
    disabilityP: { element: getElement('disabilityP'), value: profile.dependent.disabilityP },
    disabilityO: { element: getElement('disabilityO'), value: profile.dependent.disabilityO },
  },
  estate: {
    house: {
      year: { element: getElement('moveInYear'), value: profile.estate.house.year },
      month: { element: getElement('moveInMonth'), value: profile.estate.house.month },
      price: { element: getElement('housePrice'), value: profile.estate.house.price },
      resident: { element: getElement('houseResident'), value: profile.estate.house.resident },
      debt: { element: getElement('houseDebt'), value: profile.estate.house.debt },
    },
    land: {
      year: { element: getElement('moveInYear'), value: profile.estate.land.year },
      month: { element: getElement('moveInMonth'), value: profile.estate.land.month },
      price: { element: getElement('landPrice'), value: profile.estate.land.price },
      resident: { element: getElement('landResident'), value: profile.estate.land.resident },
      debt: { element: getElement('landDebt'), value: profile.estate.land.debt },
    },
    renovation: {
      year: { element: getElement('renovYear'), value: profile.estate.renovation.year },
      month: { element: getElement('renovMonth'), value: profile.estate.renovation.month },
      price: { element: getElement('renovPrice'), value: profile.estate.renovation.price },
      priceSp: { element: getElement('renovPriceSp'), value: profile.estate.renovation.priceSp },
      resident: { element: getElement('renovResident'), value: profile.estate.renovation.resident },
      debt: { element: getElement('renovDebt'), value: profile.estate.renovation.debt },
    },
    loan: {
      balance: { element: getElement('loanBalance'), value: profile.estate.loan.balance },
    },
    case: {
      quality: { element: getElement('quality'), value: profile.estate.case.quality },
      salesTax: { element: getElement('salesTax'), value: profile.estate.case.salesTax },
      applyResidentTax: { element: getElement('applyResidentTax'), value: profile.estate.case.applyResidentTax },
      spH19: { element: getElement('spH19'), value: profile.estate.case.spH19 },
      spR1: { element: getElement('spR1'), value: profile.estate.case.spR1 },
      covid19: { element: getElement('covid19'), value: profile.estate.case.covid19 },
      spR3: { element: getElement('spR3'), value: profile.estate.case.spR3 },
      small: { element: getElement('small'), value: profile.estate.case.small },
      parenting: { element: getElement('parenting'), value: profile.estate.case.parenting },
      spR6: { element: getElement('spR6'), value: profile.estate.case.spR6 },
    },
  },
};

export const deductionInputElements = {
  loss: {
    casualtyLoss: { element: getElement('casualtyLoss'), value: deductionInput.loss.casualtyLoss },
    disasterReduction: { element: getElement('disasterReduction'), value: deductionInput.loss.disasterReduction },
  },
  social: {
    insurance: { element: getElement('socialInsurance'), value: deductionInput.social.insurance },
    mutualAid: { element: getElement('mutualAid'), value: deductionInput.social.mutualAid },
  },
  insurance: {
    lifeNew: { element: getElement('lifeInsuranceNew'), value: deductionInput.insurance.lifeNew },
    lifeOld: { element: getElement('healthInsurance'), value: deductionInput.insurance.lifeOld },
    health: { element: getElement('healthInsurance'), value: deductionInput.insurance.health },
    annuityNew: { element: getElement('annuityNew'), value: deductionInput.insurance.annuityNew },
    annuityOld: { element: getElement('annuityOld'), value: deductionInput.insurance.annuityOld },
    quakeInsuranceOld: { element: getElement('quakeInsuranceOld'), value: deductionInput.insurance.quakeOld },
    quakeInsuranceNew: { element: getElement('quakeInsuranceNew'), value: deductionInput.insurance.quakeNew },
  },
  medical: {
    medical: { element: getElement('medicalExpenses'), value: deductionInput.medical.expenses },
  },
  housing: {
    loan: { element: getElement('loans'), value: deductionInput.housing.loans },
    improvementHouse: { element: getElement('improvementHouse'), value: deductionInput.housing.improvement },
  },
  donations: {
    hometownTax: { element: getElement('hometownTax'), value: deductionInput.donations.hometownTax },
    communityChest: { element: getElement('communityChest'), value: deductionInput.donations.communityChest },
    donationByPref: { element: getElement('donationByPref'), value: deductionInput.donations.pref },
    donationByCity: { element: getElement('donationByCity'), value: deductionInput.donations.city },
    donationOther: { element: getElement('donationOther'), value: deductionInput.donations.other },
    contributions: { element: getElement('contributions'), value: deductionInput.donations.politics },
    applyOneStop: { element: getElement('applyOneStop'), value: deductionInput.donations.applyOneStop },
    applyContributions: { element: getElement('applyContributions'), value: deductionInput.donations.applyPolitics },
  },
  withholding: {
    withholdingSalary: { element: getElement('withholdingSalary'), value: deductionInput.withholding.salary },
    withholdingStockS: { element: getElement('withholdingStockS'), value: deductionInput.withholding.stockS },
    withholdingStockJ: { element: getElement('withholdingStockJ'), value: deductionInput.withholding.stockJ },
    withholdingDividendS: { element: getElement('withholdingDividendS'), value: deductionInput.withholding.dividendS },
    withholdingDividendJ: { element: getElement('withholdingDividendJ'), value: deductionInput.withholding.dividendJ },
    nonResidents: { element: getElement('nonResidents'), value: deductionInput.withholding.nonResidents },
  },
  other: {
    dividend: { element: getElement('dividend'), value: deductionInput.other.dividend },
    unlistedStocks: { element: getElement('unlistedStocks'), value: deductionInput.other.unlistedStocks },
    foreignTax: { element: getElement('foreignTax'), value: deductionInput.other.foreignTax },
  },
  taxReturn: {
    doTaxReturn: { element: getElement('doTaxReturn'), value: deductionInput.taxReturn.apply },
    methodS: { element: getElement('methodS'), value: deductionInput.taxReturn.methodS },
    methodJ: { element: getElement('methodJ'), value: deductionInput.taxReturn.methodJ },
  },
};

export const taxElements = {
  incomeDeductions: {
    casualtyLoss: {
      S: { element: getElement('casualtyLossS'), value: incomeDeductions.casualtyLoss.incomeTax },
      J: { element: getElement('casualtyLossJ'), value: incomeDeductions.casualtyLoss.residentTax },
    },
    medical: {
      S: { element: getElement('medicalS'), value: incomeDeductions.medical.incomeTax },
      J: { element: getElement('medicalJ'), value: incomeDeductions.medical.residentTax },
    },
    social: {
      S: { element: getElement('socialS'), value: incomeDeductions.social.incomeTax },
      J: { element: getElement('socialJ'), value: incomeDeductions.social.residentTax },
    },
    pension: {
      S: { element: getElement('pensionS'), value: incomeDeductions.pension.incomeTax },
      J: { element: getElement('pensionJ'), value: incomeDeductions.pension.residentTax },
    },
    insuranceL: {
      S: { element: getElement('insuranceLS'), value: incomeDeductions.insuranceL.incomeTax },
      J: { element: getElement('insuranceLJ'), value: incomeDeductions.insuranceL.residentTax },
    },
    insuranceE: {
      S: { element: getElement('insuranceES'), value: incomeDeductions.insuranceE.incomeTax },
      J: { element: getElement('insuranceEJ'), value: incomeDeductions.insuranceE.residentTax },
    },
    donations: {
      S: { element: getElement('donationsS'), value: incomeDeductions.donations.incomeTax },
      //J: { element: getElement('donationsJ'), value: tax.donations },
    },
  },
  personalDeductions: {
    personal: {
      S: { element: getElement('personalS'), value: personalDeductions.personal.incomeTax },
      J: { element: getElement('personalJ'), value: personalDeductions.personal.residentTax },
    },
    spouse: {
      S: { element: getElement('spouseS'), value: personalDeductions.spouse.incomeTax },
      J: { element: getElement('spouseJ'), value: personalDeductions.spouse.residentTax },
    },
    dependent: {
      S: { element: getElement('dependentS'), value: personalDeductions.dependent.incomeTax },
      J: { element: getElement('dependentJ'), value: personalDeductions.dependent.residentTax },
    },
    basic: {
      S: { element: getElement('basicS'), value: personalDeductions.basic.incomeTax },
      J: { element: getElement('basicJ'), value: personalDeductions.basic.residentTax },
    },
  },
  taxCredits: {
    dividend: {
      S: { element: getElement('dividendS'), value: taxCredits.dividend.incomeTax },
      J: { element: getElement('dividendJ'), value: taxCredits.dividend.residentTax },
    },
    loans: {
      S: { element: getElement('loansS'), value: taxCredits.loans.incomeTax },
      J: { element: getElement('loansJ'), value: taxCredits.loans.residentTax },
    },
    donations: {
      S: { element: getElement('donationsCreditS'), value: taxCredits.donations.incomeTax },
      J: { element: getElement('donationsCreditJ'), value: taxCredits.donations.residentTax },
    },
    improvementHouse: {
      S: { element: getElement('improvementHouseS'), value: taxCredits.improvementHouse.incomeTax },
      //J: { element: getElement('improvementHouseJ'), value: },
    },
    disasterReduction: {
      S: { element: getElement('disasterReductionS'), value: taxCredits.disasterReduction.incomeTax },
      //J: { element: getElement('disasterReductionJ'), value: },
    },
    foreignTax: {
      S: { element: getElement('foreignTaxS'), value: taxCredits.foreignTax.incomeTax },
      J: { element: getElement('foreignTaxJ'), value: taxCredits.foreignTax.residentTax },
    },
    withholding: {
      Dividend: {
        element: getElement('withholdingDividendCreditJ'),
        value: taxCredits.withholdingDividend.residentTax,
      },
      Stock: { element: getElement('withholdingStockCreditJ'), value: taxCredits.withholdingStock.residentTax },
    },
  },
  tax: {
    income: {
      S: { element: getElement('incomeS'), value: tax.income.incomeTax },
      J: { element: getElement('incomeJ'), value: tax.income.residentTax },
    },
    deduction: {
      S: { element: getElement('deductionS'), value: tax.deduction.incomeTax },
      J: { element: getElement('deductionJ'), value: tax.deduction.residentTax },
    },
    taxable: {
      S: { element: getElement('taxableS'), value: tax.taxable.incomeTax },
      J: { element: getElement('taxableJ'), value: tax.taxable.residentTax },
    },
    taxPre: {
      S: { element: getElement('taxPreS'), value: tax.taxPre.incomeTax },
      J: { element: getElement('taxPreJ'), value: tax.taxPre.residentTax },
      City: { element: getElement('taxPreCity'), value: tax.taxPre.cityTax },
      Pref: { element: getElement('taxPrePref'), value: tax.taxPre.prefTax },
    },
    taxCredit: {
      S: { element: getElement('taxCreditS'), value: tax.taxCredit.incomeTax },
      J: { element: getElement('taxCreditJ'), value: tax.taxCredit.residentTax },
      City: { element: getElement('taxCreditCity'), value: tax.taxCredit.cityTax },
      Pref: { element: getElement('taxCreditPref'), value: tax.taxCredit.prefTax },
    },
    taxVar: {
      S: { element: getElement('taxVarS'), value: tax.taxVar.incomeTax },
      J: { element: getElement('taxVarJ'), value: tax.taxVar.residentTax },
      City: { element: getElement('taxVarCity'), value: tax.taxVar.cityTax },
      Pref: { element: getElement('taxVarPref'), value: tax.taxVar.prefTax },
    },
    taxFixed: {
      J: { element: getElement('taxFixedJ'), value: tax.taxFixed.residentTax },
      City: { element: getElement('taxFixedCity'), value: tax.taxFixed.cityTax },
      Pref: { element: getElement('taxFixedPref'), value: tax.taxFixed.prefTax },
      Eco: { element: getElement('taxFixedEco'), value: tax.taxFixed.ecoTax },
    },
    taxFinal: {
      S: { element: getElement('taxFinalS'), value: tax.taxFinal.incomeTax },
      J: { element: getElement('taxFinalJ'), value: tax.taxFinal.residentTax },
    },
    paid: {
      S: { element: getElement('paidS'), value: tax.paid.incomeTax },
      J: { element: getElement('paidJ'), value: tax.paid.residentTax },
    },
    refund: {
      S: { element: getElement('refundS'), value: tax.refund.incomeTax },
      J: { element: getElement('refundJ'), value: tax.refund.residentTax },
    },
  },
};

type HtmlElement = {
  element: HTMLInputElement | null;
  value: number | string | boolean | null;
};

type HtmlElements = {
  [key: string]: HtmlElement | HtmlElements;
};

export function getHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        element.value = element.element?.value || null;
      } else {
        getHtmlElements(element as HtmlElements);
      }
    }
  }
}

export function setHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElements;
      if ('element' in element && 'value' in element) {
        if (element.element) {
          element.element.value = element.value?.toString() || '';
        }
      } else {
        setHtmlElements(element as HtmlElements);
      }
    }
  }
}

export function getProfile() {
  getHtmlElements(profileElements);
}

export function getDeductionInput() {
  getHtmlElements(deductionInputElements);
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
