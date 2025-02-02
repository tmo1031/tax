export type Currency = {
  amount: number;
};

export type TaxSystem = {
  rate: Record<string, number>;
  adjustment: Record<string, Currency>;
  fixed: Record<string, Currency>;
};

export type Profiles = {
  applicant: Profile;
  spouse: Profile;
  dependent: Dependent;
  estate: Estate;
  nonTaxable: Record<string, boolean>;
};

type Attributes = {
  hasSpouse: boolean;
  minors: boolean;
  disability: number;
  single: number;
  student: boolean;
};

export type Profile = {
  year: number;
  age: number;
  income: Record<string, Currency>;
  taxable: Record<string, Currency>;
  attributes: Attributes;
};

type Dependent = Record<string, number>;

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

export type Estate = {
  house: Contract;
  land: Contract;
  renovation: Contract;
  loan: { balance: Currency };
  case: Case;
};

export type TaxReturn = {
  applyOneStop: boolean;
  applyPolitics: boolean;
  apply: boolean;
  methodS: number;
  methodJ: number;
};

const createObject = <T>(template: T): T => ({ ...template });

const createIncome = () =>
  createObject({
    interest: { amount: 0 },
    dividend: { amount: 0 },
    realProperty: { amount: 0 },
    business: { amount: 0 },
    salary: { amount: 0 },
    misc: { amount: 0 },
    occasional: { amount: 0 },
    capitalGains: { amount: 0 },
    capitalGainsEstate: { amount: 0 },
    dividendStock: { amount: 0 },
    capitalGainsStock: { amount: 0 },
    futures: { amount: 0 },
    timber: { amount: 0 },
    retirement: { amount: 0 },
    other: { amount: 0 },
    total: { amount: 0 },
    carryOver: { amount: 0 },
  });

const createAttributes = (): Attributes =>
  createObject<Attributes>({
    hasSpouse: false,
    minors: false,
    disability: 0,
    single: 0,
    student: false,
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

const createTaxReturn = (): TaxReturn =>
  createObject<TaxReturn>({
    applyOneStop: false,
    applyPolitics: false,
    apply: false,
    methodS: 0,
    methodJ: 0,
  });

const createTaxDetails = (): Record<string, Currency> => {
  return {
    incomeTax: { amount: 0 },
    residentTax: { amount: 0 },
  };
};

const createExtendedTaxDetails = (): Record<string, Currency> => {
  return {
    incomeTax: { amount: 0 },
    residentTax: { amount: 0 },
    cityTax: { amount: 0 },
    prefTax: { amount: 0 },
    ecoTax: { amount: 0 },
  };
};

export const profiles = {
  applicant: createProfile(),
  spouse: createProfile(),
  dependent: createDependent(),
  estate: createEstate(),
  nonTaxable: {
    var: false,
    fixed: false,
    final: false,
  },
};

export const carryOvers: Record<string, Currency> = {
  interest: { amount: 0 },
  dividend: { amount: 0 },
  realProperty: { amount: 0 },
  business: { amount: 0 },
  misc: { amount: 0 },
  capitalGains: { amount: 0 },
  capitalGainsEstate: { amount: 0 },
  dividendStock: { amount: 0 },
  capitalGainsStock: { amount: 0 },
  futures: { amount: 0 },
  timber: { amount: 0 },
  loss: { amount: 0 },
};

export const deductionInputs: Record<string, Record<string, Currency>> = {
  loss: {
    casualtyLoss: { amount: 0 },
    disasterReduction: { amount: 0 },
  },
  social: {
    insurance: { amount: 0 },
    mutualAid: { amount: 0 },
  },
  insurance: {
    lifeNew: { amount: 0 },
    lifeOld: { amount: 0 },
    health: { amount: 0 },
    annuityNew: { amount: 0 },
    annuityOld: { amount: 0 },
    quakeOld: { amount: 0 },
    quakeNew: { amount: 0 },
  },
  medical: {
    expenses: { amount: 0 },
  },
  housing: {
    loans: { amount: 0 },
    improvement: { amount: 0 },
  },
  donations: {
    hometownTax: { amount: 0 },
    communityChest: { amount: 0 },
    pref: { amount: 0 },
    city: { amount: 0 },
    other: { amount: 0 },
    politics: { amount: 0 },
  },
  withholding: {
    salary: { amount: 0 },
    stockS: { amount: 0 },
    stockJ: { amount: 0 },
    dividendS: { amount: 0 },
    dividendJ: { amount: 0 },
    nonResidents: { amount: 0 },
  },
  other: {
    dividend: { amount: 0 },
    unlistedStocks: { amount: 0 },
    foreignTax: { amount: 0 },
  },
};

export const taxReturn: TaxReturn = createTaxReturn();

export const personalDeductions: Record<string, Record<string, Currency>> = {
  disability: createTaxDetails(),
  single: createTaxDetails(),
  student: createTaxDetails(),
  spouse: createTaxDetails(),
  dependent: createTaxDetails(),
  basic: createTaxDetails(),
  personal: createTaxDetails(),
};

export const incomeDeductions: Record<string, Record<string, Currency>> = {
  casualtyLoss: createTaxDetails(),
  medical: createTaxDetails(),
  social: createTaxDetails(),
  pension: createTaxDetails(),
  insuranceL: createTaxDetails(),
  insuranceE: createTaxDetails(),
  donations: createTaxDetails(),
};

export const taxCredits: Record<string, Record<string, Currency>> = {
  dividend: createTaxDetails(),
  loans: createTaxDetails(),
  donations: createTaxDetails(), // 政党等寄附金等は寄付金控除とマージ
  improvementHouse: createTaxDetails(),
  disasterReduction: createTaxDetails(),
  foreignTax: createTaxDetails(),
  withholdingDividendCredit: createTaxDetails(),
  withholdingStockCredit: createTaxDetails(),
};

export const paid: Record<string, Record<string, Currency>> = {
  withholdings: createTaxDetails(),
  nonResidents: createTaxDetails(),
};

export const tax: Record<string, Record<string, Currency>> = {
  income: createExtendedTaxDetails(),
  deduction: createExtendedTaxDetails(),
  taxable: createExtendedTaxDetails(),
  taxPre: createExtendedTaxDetails(),
  taxPreAlt: createExtendedTaxDetails(),
  taxCredit: createExtendedTaxDetails(),
  taxVar: createExtendedTaxDetails(),
  taxFixed: createExtendedTaxDetails(),
  taxFinal: createExtendedTaxDetails(),
  paid: createExtendedTaxDetails(),
  refund: createExtendedTaxDetails(),
};

export const system = createObject({ taxYear: 2024 });
