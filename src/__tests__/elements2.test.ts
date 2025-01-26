import { updateProfileValue } from '../elements2';

type ProfileType = {
  applicant: {
    year: number;
  };
};

const profile: ProfileType = {
  applicant: {
    year: 1990,
  },
};

type HtmlElement = {
  element: HTMLInputElement | null;
  value: () => number;
};

describe('updateProfileValue', () => {
  let birthYearElement: HTMLInputElement;
  let htmlElement: HtmlElement;

  beforeEach(() => {
    // テスト前に profile オブジェクトを初期化
    profile.applicant.year = 1990;

    // HTMLInputElement のモックを作成
    birthYearElement = document.createElement('input');
    birthYearElement.value = '2000';

    // HtmlElement のモックを作成
    htmlElement = {
      element: birthYearElement,
      value: () => profile.applicant.year,
    };
  });

  test('should update number value', () => {
    updateProfileValue(htmlElement);
    expect(htmlElement.value()).toBe(2000);
  });

  test('should not update with invalid number', () => {
    birthYearElement.value = 'invalid';
    updateProfileValue(htmlElement);
    expect(htmlElement.value()).toBe(1990);
  });
});
