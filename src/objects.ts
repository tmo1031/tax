export type Currency = {
  amount: number;
};

type System = {
  taxYear: number;
};

export type ProfileType = {
  applicant: Profile;
  spouse: Profile;
  dependent: Dependent;
  estate: Estate;
};

export type DeductionInputType = {
  loss: Loss;
  social: Social;
  insurance: Insurance;
  medical: Medical;
  housing: Housing;
  donations: Donations;
  withholding: Withholding;
  other: Other;
  taxReturn: TaxReturn;
};

export type TaxType = {
  income: ExtendedTaxDetails;
  deduction: ExtendedTaxDetails;
  taxable: ExtendedTaxDetails;
  taxPre: ExtendedTaxDetails;
  taxCredit: ExtendedTaxDetails;
  taxVar: ExtendedTaxDetails;
  taxFixed: ExtendedTaxDetails;
  taxFinal: ExtendedTaxDetails;
  paid: ExtendedTaxDetails;
  refund: ExtendedTaxDetails;
};

type Income = {
  salary: Currency;
  pension: Currency;
  other: Currency;
  total: Currency;
};

type Attributes = {
  hasSpouse: boolean;
  minors: boolean;
  disability: number;
  single: number;
  student: number;
};

export type Profile = {
  year: number;
  age: number;
  income: Income;
  taxable: Income;
  attributes: Attributes;
};

type Dependent = {
  specified: number;
  elderlyLt: number;
  elderly: number;
  child: number;
  other: number;
  disabilityLt: number;
  disabilityP: number;
  disabilityO: number;
};

export type Contract = {
  year: number;
  month: number;
  age: number;
  price: Currency;
  priceSp: Currency;
  resident: number;
  debt: number;
};

type Case = {
  quality: number;
  //長期優良住宅=4, 認定低炭素住宅=3, ZEH水準省エネ住宅=2, 省エネ基準適合住宅=1, 一般住宅=0
  salesTax: number; //消費税増税対策
  applyResidentTax: boolean; //平成11年から平成18年までに入居した住宅の特例を申請する場合
  spH19: boolean; //税源移譲で所得税が減るため対策として創設された特例選択
  spR1: boolean; //令和1年度税制改正の特別特定取得の判定
  covid19: boolean; //新型コロナウイルス感染症の影響による特例措置
  spR3: boolean; //令和3年度税制改正の特別特例取得の判定
  small: boolean; //小規模居住用家屋の判定
  parenting: boolean; //令和5年度税制での子育て世帯支援特例
  spR6: boolean; //令和6年度税制改正での一般住宅への救済措置
};

type Estate = {
  house: Contract;
  land: Contract;
  renovation: Contract;
  loan: { balance: Currency };
  case: Case;
};

type Loss = {
  casualtyLoss: Currency;
  disasterReduction: Currency;
};

type Social = {
  insurance: Currency;
  mutualAid: Currency;
};

type Insurance = {
  lifeNew: Currency;
  lifeOld: Currency;
  health: Currency;
  annuityNew: Currency;
  annuityOld: Currency;
  quakeOld: Currency;
  quakeNew: Currency;
};

type Medical = {
  expenses: Currency;
};

type Housing = {
  loans: Currency;
  improvement: Currency;
};

type Donations = {
  hometownTax: Currency;
  communityChest: Currency;
  pref: Currency;
  city: Currency;
  other: Currency;
  politics: Currency;
  applyOneStop: boolean;
  applyPolitics: boolean;
};

type Withholding = {
  salary: Currency;
  stockS: Currency;
  stockJ: Currency;
  dividendS: Currency;
  dividendJ: Currency;
  nonResidents: Currency;
};

type Other = {
  dividend: Currency;
  unlistedStocks: Currency;
  foreignTax: Currency;
};

type TaxReturn = {
  apply: boolean;
  methodS: number;
  methodJ: number;
};

type DeductionInput = {
  loss: Loss;
  social: Social;
  insurance: Insurance;
  medical: Medical;
  housing: Housing;
  donations: Donations;
  withholding: Withholding;
  other: Other;
  taxReturn: TaxReturn;
};

type TaxDetails = {
  incomeTax: Currency;
  residentTax: Currency;
};

type ExtendedTaxDetails = TaxDetails & {
  cityTax: Currency;
  prefTax: Currency;
  ecoTax: Currency;
};

const createObject = <T>(template: T): T => ({ ...template });

const createSystem = (): System => createObject<System>({ taxYear: 2024 });

const createIncome = (): Income =>
  createObject<Income>({
    salary: { amount: 0 },
    pension: { amount: 0 },
    other: { amount: 0 },
    total: { amount: 0 },
  });

const createAttributes = (): Attributes =>
  createObject<Attributes>({
    hasSpouse: false,
    minors: false,
    disability: 0,
    single: 0,
    student: 0,
  });

const createProfile = (): Profile =>
  createObject<Profile>({
    year: 0,
    age: 0,
    income: createIncome(),
    taxable: createIncome(),
    attributes: createAttributes(),
  });

const createDependent = (): Dependent =>
  createObject<Dependent>({
    specified: 0,
    elderlyLt: 0,
    elderly: 0,
    child: 0,
    other: 0,
    disabilityLt: 0,
    disabilityP: 0,
    disabilityO: 0,
  });

const createContract = (): Contract =>
  createObject<Contract>({
    year: 0,
    month: 0,
    age: 0,
    price: { amount: 0 },
    priceSp: { amount: 0 },
    resident: 0,
    debt: 0,
  });

const createCase = (): Case =>
  createObject<Case>({
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

const createEstate = (): Estate =>
  createObject<Estate>({
    house: createContract(),
    land: createContract(),
    renovation: createContract(),
    loan: { balance: { amount: 0 } },
    case: createCase(),
  });

const createLoss = (): Loss =>
  createObject<Loss>({
    casualtyLoss: { amount: 0 },
    disasterReduction: { amount: 0 },
  });

const createSocial = (): Social =>
  createObject<Social>({
    insurance: { amount: 0 },
    mutualAid: { amount: 0 },
  });

const createInsurance = (): Insurance =>
  createObject<Insurance>({
    lifeNew: { amount: 0 },
    lifeOld: { amount: 0 },
    health: { amount: 0 },
    annuityNew: { amount: 0 },
    annuityOld: { amount: 0 },
    quakeOld: { amount: 0 },
    quakeNew: { amount: 0 },
  });

const createMedical = (): Medical =>
  createObject<Medical>({
    expenses: { amount: 0 },
  });

const createHousing = (): Housing =>
  createObject<Housing>({
    loans: { amount: 0 },
    improvement: { amount: 0 },
  });

const createDonations = (): Donations =>
  createObject<Donations>({
    hometownTax: { amount: 0 },
    communityChest: { amount: 0 },
    pref: { amount: 0 },
    city: { amount: 0 },
    other: { amount: 0 },
    politics: { amount: 0 },
    applyOneStop: false,
    applyPolitics: false,
  });

const createWithholding = (): Withholding =>
  createObject<Withholding>({
    salary: { amount: 0 },
    stockS: { amount: 0 },
    stockJ: { amount: 0 },
    dividendS: { amount: 0 },
    dividendJ: { amount: 0 },
    nonResidents: { amount: 0 },
  });

const createOther = (): Other =>
  createObject<Other>({
    dividend: { amount: 0 },
    unlistedStocks: { amount: 0 },
    foreignTax: { amount: 0 },
  });

const createTaxReturn = (): TaxReturn =>
  createObject<TaxReturn>({
    apply: false,
    methodS: 0,
    methodJ: 0,
  });

const createTaxDetails = (): TaxDetails =>
  createObject<TaxDetails>({
    incomeTax: { amount: 0 },
    residentTax: { amount: 0 },
  });

const createExtendedTaxDetails = (): ExtendedTaxDetails =>
  createObject<ExtendedTaxDetails>({
    incomeTax: { amount: 0 },
    residentTax: { amount: 0 },
    cityTax: { amount: 0 },
    prefTax: { amount: 0 },
    ecoTax: { amount: 0 },
  });

export const profile = {
  applicant: createProfile(),
  spouse: createProfile(),
  dependent: createDependent(),
  estate: createEstate(),
};

export const deductionInput: DeductionInput = {
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

export const personalDeductions: Record<string, TaxDetails> = {
  disability: createTaxDetails(),
  single: createTaxDetails(),
  student: createTaxDetails(),
  spouse: createTaxDetails(),
  dependent: createTaxDetails(),
  basic: createTaxDetails(),
  personal: createTaxDetails(),
};

export const incomeDeductions: Record<string, TaxDetails> = {
  casualtyLoss: createTaxDetails(),
  medical: createTaxDetails(),
  social: createTaxDetails(),
  pension: createTaxDetails(),
  insuranceL: createTaxDetails(),
  insuranceE: createTaxDetails(),
  donations: createTaxDetails(),
};

export const taxCredits: Record<string, TaxDetails> = {
  dividend: createTaxDetails(),
  loans: createTaxDetails(),
  donations: createTaxDetails(), // 政党等寄附金等は寄付金控除とマージ
  improvementHouse: createTaxDetails(),
  disasterReduction: createTaxDetails(),
  foreignTax: createTaxDetails(),
  withholdingDividendCredit: createTaxDetails(),
  withholdingStockCredit: createTaxDetails(),
};

export const paid: Record<string, TaxDetails> = {
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

export const system: System = createSystem();
