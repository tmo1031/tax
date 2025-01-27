import { updateValue, setValue, getHtmlElements /*setHtmlElements */ } from '../elements';
import { profile } from '../objects';
const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

type Currency = {
  amount: number;
};
type Value = number | string | boolean | Currency | null;

const profileElements: HtmlElements = {
  applicantBirthYear: {
    element: getElement('applicantBirthYear'),
    value: (newValue?: Value) => {
      if (newValue !== undefined) {
        if (typeof newValue === 'number') {
          profile.applicant.year = newValue;
        }
      }
      return profile.applicant.year;
    },
    output: () => {
      return profile.applicant.year;
    },
  },
  spouseBirthYear: {
    element: getElement('spouseBirthYear'),
    value: (newValue?: Value) => {
      if (newValue !== undefined) {
        if (typeof newValue === 'number') {
          profile.spouse.year = newValue;
        }
      }
      return profile.spouse.year;
    },
    output: () => {
      return profile.spouse.year;
    },
  },
};

type HtmlElements = {
  [key: string]: {
    element: HTMLInputElement | null;
    value: (newValue?: number | string | boolean | Currency | null) => number | string | boolean | Currency | null;
    output: () => number | string | boolean | Currency | null;
  };
};

describe('updateValue', () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    // HTMLInputElement のモックを作成
    inputElement = document.createElement('input');
  });

  test('should update value for birth year', () => {
    inputElement.value = '2000';
    inputElement.id = 'applicantBirthYear';
    profile.applicant.year = 1990;
    profileElements.applicantBirthYear.element = inputElement;
    updateValue(profileElements.applicantBirthYear);
    expect(profile.applicant.year).toBe(2000);
  });

  test('should getHtmlElements successfully', () => {
    inputElement.value = '2000';
    inputElement.id = 'applicantBirthYear';
    profileElements.applicantBirthYear.element = inputElement;
    getHtmlElements(profileElements);
    expect(profileElements.applicantBirthYear.element).toBe(inputElement);
  });

  test('should setValue successfully', () => {
    inputElement.value = '2000';
    inputElement.id = 'applicantBirthYear';
    profileElements.applicantBirthYear.element = inputElement;
    profile.applicant.year = 1990;
    setValue(profileElements.applicantBirthYear.element, profile.applicant.year);
    expect(profileElements.applicantBirthYear.element.value).toBe('1990');
  });

  test('should update value for birth year', () => {
    inputElement.value = '2005';
    inputElement.id = 'spouseBirthYear';
    profile.spouse.year = 1990;
    profileElements.spouseBirthYear.element = inputElement;
    updateValue(profileElements.spouseBirthYear);
    expect(profile.spouse.year).toBe(2005);
  });

  test('should getHtmlElements successfully', () => {
    inputElement.value = '2005';
    inputElement.id = 'spouseBirthYear';
    profileElements.spouseBirthYear.element = inputElement;
    getHtmlElements(profileElements);
    expect(profileElements.spouseBirthYear.element).toBe(inputElement);
  });
});
