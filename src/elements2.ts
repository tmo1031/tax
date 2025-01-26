//import { get } from 'jquery';
//import { ProfileType, DeductionInputType, TaxType, Currency } from './objects.js';
import { profile } from './objects';

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

export function updateProfileValue(element: HtmlElement) {
  const newValue = element.element?.value || '';
  const parsedValue = parseInt(newValue, 10);
  if (!isNaN(parsedValue)) {
    element.value = () => parsedValue;
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

export function getProfile() {
  getHtmlElements(profileElements);
  console.log(profile);
  return profile;
}
