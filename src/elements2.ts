type Profile = {
  applicant: {
    year: number;
  };
};

const profile: Profile = {
  applicant: {
    year: 0,
  },
};

const getElement = (id: string): HTMLInputElement | null => document.getElementById(id) as HTMLInputElement | null;

const profileElements: HtmlElements = {
  birthYear: { element: getElement('birthYear'), value: () => profile.applicant.year },
};

type HtmlElement = {
  element: HTMLInputElement | null;
  value: () => number;
};

type HtmlElements = {
  [key: string]: HtmlElement;
};

function updateProfileValue(element: HtmlElement) {
  const newValue = element.element?.value || '';
  const parsedValue = parseInt(newValue, 10);
  if (!isNaN(parsedValue)) {
    profile.applicant.year = parsedValue;
  }
}

function getHtmlElements(elements: HtmlElements) {
  for (const key in elements) {
    if (elements[key] && typeof elements[key] === 'object') {
      const element = elements[key] as HtmlElement;
      if ('element' in element && 'value' in element) {
        updateProfileValue(element);
      }
    }
  }
}

// profileElements の値を更新し、profile オブジェクトに反映
getHtmlElements(profileElements);

console.log(profile);
