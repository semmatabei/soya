const nameRegex = /[^a-zA-Z0-9 ']/;

export function isName(string) {
  return nameRegex.test(string) ? 'Name must only contain alphanumeric characters.' : true;
}