const nameRegex = /[^a-zA-Z0-9 ']/;
const phoneRegex = /[^0-9\- ]/;

export function name(string) {
  return nameRegex.test(string) ? 'Name must only contain alphanumeric characters.' : true;
}

export function phone(string) {
  return phoneRegex.test(string) ? 'Phone numbers must only contain numbers.' : true;
}

export function maxLength(maxLength, lengthContainer) {
  return lengthContainer.length > maxLength ? 'Maximum length is ' + maxLength + ' character(s).' : true;
}

export function minLength(minLength, lengthContainer) {
  return lengthContainer.length < minLength ? 'Minimum length is ' + minLength + ' character(s).' : true;
}