type System = {
  taxYear: number;
};

type Income = {
  salary: number;
  pension: number;
  other: number;
  total: number;
};

type Attributes = {
  hasSpouse: boolean;
  minors: boolean;
  disability: number;
  single: number;
  student: number;
};

type Profile = {
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

type Contract = {
  year: number;
  month: number;
  age: number;
  price: number;
  price_Sp: number;
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
  loan: { balance: number };
  case: Case;
};

type Loss = {
  casualtyLoss: number;
  disasterReduction: number;
};

type Social = {
  insurance: number;
  mutualAid: number;
};

type Insurance = {
  lifeNew: number;
  lifeOld: number;
  health: number;
  annuityNew: number;
  annuityOld: number;
  quakeOld: number;
  quakeNew: number;
};

type Medical = {
  expenses: number;
};

type Housing = {
  loans: number;
  improvement: number;
};

type Donations = {
  hometownTax: number;
  communityChest: number;
  pref: number;
  city: number;
  other: number;
  politics: number;
  applyOneStop: number;
  applyPolitics: number;
};

type Withholding = {
  salary: number;
  stockS: number;
  stockJ: number;
  dividendS: number;
  dividendJ: number;
  nonResidents: number;
};

type Other = {
  dividend: number;
  unlistedStocks: number;
  foreignTax: number;
};

type TaxReturn = {
  apply: number;
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
  incomeTax: number;
  residentTax: number;
};

type ExtendedTaxDetails = TaxDetails & {
  cityTax: number;
  prefTax: number;
  ecoTax: number;
};

const createObject = <T>(template: T): T => ({ ...template });

const createSystem = (): System => createObject<System>({ taxYear: 2024 });

const createIncome = (): Income =>
  createObject<Income>({
    salary: 0,
    pension: 0,
    other: 0,
    total: 0,
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
    price: 0,
    price_Sp: 0,
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
    loan: { balance: 0 },
    case: createCase(),
  });

const createLoss = (): Loss =>
  createObject<Loss>({
    casualtyLoss: 0,
    disasterReduction: 0,
  });

const createSocial = (): Social =>
  createObject<Social>({
    insurance: 0,
    mutualAid: 0,
  });

const createInsurance = (): Insurance =>
  createObject<Insurance>({
    lifeNew: 0,
    lifeOld: 0,
    health: 0,
    annuityNew: 0,
    annuityOld: 0,
    quakeOld: 0,
    quakeNew: 0,
  });

const createMedical = (): Medical =>
  createObject<Medical>({
    expenses: 0,
  });

const createHousing = (): Housing =>
  createObject<Housing>({
    loans: 0,
    improvement: 0,
  });

const createDonations = (): Donations =>
  createObject<Donations>({
    hometownTax: 0,
    communityChest: 0,
    pref: 0,
    city: 0,
    other: 0,
    politics: 0,
    applyOneStop: 0,
    applyPolitics: 0,
  });

const createWithholding = (): Withholding =>
  createObject<Withholding>({
    salary: 0,
    stockS: 0,
    stockJ: 0,
    dividendS: 0,
    dividendJ: 0,
    nonResidents: 0,
  });

const createOther = (): Other =>
  createObject<Other>({
    dividend: 0,
    unlistedStocks: 0,
    foreignTax: 0,
  });

const createTaxReturn = (): TaxReturn =>
  createObject<TaxReturn>({
    apply: 0,
    methodS: 0,
    methodJ: 0,
  });

const createTaxDetails = (): TaxDetails =>
  createObject<TaxDetails>({
    incomeTax: 0,
    residentTax: 0,
  });

const createExtendedTaxDetails = (): ExtendedTaxDetails =>
  createObject<ExtendedTaxDetails>({
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
  withholdingDividend: createTaxDetails(),
  withholdingStock: createTaxDetails(),
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
