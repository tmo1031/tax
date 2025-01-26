import { updateValue } from '../elements';
import { profile } from '../objects';
const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

type Currency = {
  amount: number;
};
type Value = number | string | boolean | Currency | null;

const profileElements: HtmlElements = {
  birthYear: {
    element: getElement('birthYear'),
    value: (newValue?: Value) => {
      if (newValue !== undefined) {
        if (typeof newValue === 'number') {
          profile.applicant.year = newValue;
        }
      }
      return profile.applicant.year;
    },
  },
  birthYearS: {
    element: getElement('birthYearS'),
    value: (newValue?: Value) => {
      if (newValue !== undefined) {
        if (typeof newValue === 'number') {
          profile.spouse.year = newValue;
        }
      }
      return profile.spouse.year;
    },
  },
};

type HtmlElements = {
  [key: string]: {
    element: HTMLInputElement | null;
    value: (newValue?: number | string | boolean | Currency | null) => number | string | boolean | Currency | null;
  };
};

describe('updateValue', () => {
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    // HTMLInputElement のモックを作成
    inputElement = document.createElement('input');
  });

  test('should update number value', () => {
    inputElement.value = '2000';
    inputElement.id = 'birthYear';
    profile.applicant.year = 1990;
    profileElements.birthYear.element = inputElement;
    updateValue(profileElements.birthYear);
    expect(profile.applicant.year).toBe(2000);

    inputElement.value = '2005';
    inputElement.id = 'birthYearS';
    profile.spouse.year = 1990;
    profileElements.birthYearS.element = inputElement;
    updateValue(profileElements.birthYearS);
    expect(profile.spouse.year).toBe(2005);
  });
});
