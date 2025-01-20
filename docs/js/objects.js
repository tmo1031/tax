const createObject = (template) => (Object.assign({}, template));
const createSystem = () => createObject({ taxYear: 2024 });
const createIncome = () => createObject({
    salary: 0,
    pension: 0,
    other: 0,
    total: 0,
});
const createAttributes = () => createObject({
    hasSpouse: false,
    minors: false,
    disability: 0,
    single: 0,
    student: 0,
});
const createProfile = () => createObject({
    year: 0,
    age: 0,
    income: createIncome(),
    taxable: createIncome(),
    attributes: createAttributes(),
});
const createDependent = () => createObject({
    specified: 0,
    elderlyLt: 0,
    elderly: 0,
    child: 0,
    other: 0,
    disabilityLt: 0,
    disabilityP: 0,
    disabilityO: 0,
});
const createContract = () => createObject({
    year: 0,
    month: 0,
    age: 0,
    price: 0,
    price_Sp: 0,
    resident: 0,
    debt: 0,
});
const createCase = () => createObject({
    quality: 0,
    salesTax: 0,
    applyResidentTax: false,
    spH19: false,
    spR1: false,
    covid19: false,
    spR3: false,
    small: false,
    parenting: false,
    spR6: false,
});
const createEstate = () => createObject({
    house: createContract(),
    land: createContract(),
    renovation: createContract(),
    loan: { balance: 0 },
    case: createCase(),
});
const createLoss = () => createObject({
    casualtyLoss: 0,
    disasterReduction: 0,
});
const createSocial = () => createObject({
    insurance: 0,
    mutualAid: 0,
});
const createInsurance = () => createObject({
    lifeNew: 0,
    lifeOld: 0,
    health: 0,
    annuityNew: 0,
    annuityOld: 0,
    quakeOld: 0,
    quakeNew: 0,
});
const createMedical = () => createObject({
    expenses: 0,
});
const createHousing = () => createObject({
    loans: 0,
    improvement: 0,
});
const createDonations = () => createObject({
    hometownTax: 0,
    communityChest: 0,
    pref: 0,
    city: 0,
    other: 0,
    politics: 0,
    applyOneStop: 0,
    applyPolitics: 0,
});
const createWithholding = () => createObject({
    salary: 0,
    stockS: 0,
    stockJ: 0,
    dividendS: 0,
    dividendJ: 0,
    nonResidents: 0,
});
const createOther = () => createObject({
    dividend: 0,
    unlistedStocks: 0,
    foreignTax: 0,
});
const createTaxReturn = () => createObject({
    apply: 0,
    methodS: 0,
    methodJ: 0,
});
const createTaxDetails = () => createObject({
    incomeTax: 0,
    residentTax: 0,
});
const createExtendedTaxDetails = () => createObject({
    incomeTax: 0,
    residentTax: 0,
    cityTax: 0,
    prefTax: 0,
    ecoTax: 0,
});
export const profile = {
    applicant: createProfile(),
    spouse: createProfile(),
    dependent: createDependent(),
    estate: createEstate(),
};
export const deductionInput = {
    loss: createLoss(),
    social: createSocial(),
    insurance: createInsurance(),
    medical: createMedical(),
    housing: createHousing(),
    donations: createDonations(),
    withholding: createWithholding(),
    other: createOther(),
    taxReturn: createTaxReturn(),
};
export const personalDeductions = {
    disability: createTaxDetails(),
    single: createTaxDetails(),
    student: createTaxDetails(),
    spouse: createTaxDetails(),
    dependent: createTaxDetails(),
    basic: createTaxDetails(),
    personal: createTaxDetails(),
};
export const incomeDeductions = {
    casualtyLoss: createTaxDetails(),
    medical: createTaxDetails(),
    social: createTaxDetails(),
    pension: createTaxDetails(),
    insuranceL: createTaxDetails(),
    insuranceE: createTaxDetails(),
    donations: createTaxDetails(),
};
export const taxCredits = {
    dividend: createTaxDetails(),
    loans: createTaxDetails(),
    donations: createTaxDetails(),
    improvementHouse: createTaxDetails(),
    disasterReduction: createTaxDetails(),
    foreignTax: createTaxDetails(),
    withholdingDividend: createTaxDetails(),
    withholdingStock: createTaxDetails(),
};
export const paid = {
    withholdings: createTaxDetails(),
    nonResidents: createTaxDetails(),
};
export const tax = {
    income: createExtendedTaxDetails(),
    deduction: createExtendedTaxDetails(),
    taxable: createExtendedTaxDetails(),
    taxPre: createExtendedTaxDetails(),
    taxCredit: createExtendedTaxDetails(),
    taxVar: createExtendedTaxDetails(),
    taxFixed: createExtendedTaxDetails(),
    taxFinal: createExtendedTaxDetails(),
    paid: createExtendedTaxDetails(),
    refund: createExtendedTaxDetails(),
};
export const system = createSystem();
//# sourceMappingURL=objects.js.map