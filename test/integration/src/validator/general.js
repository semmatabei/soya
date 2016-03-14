export function required(value) {
  if (value == null || value == '') return 'This field is required.';
  return true;
}

export function requiredCheckbox(value) {
  var key, isValid = false;
  if (value) {
    isValid = false;
    for (key in value) {
      if (!value.hasOwnProperty(key)) continue;
      if (value[key] === true) {
        isValid = true;
        break;
      }
    }
  }
  return !isValid ? 'This field is required.' : true;
}

export function optional(value) {
  if (value == null || value == '') return null;
  return true;
}

export function minSelected(minLength, lengthContainer) {
  return lengthContainer == null || lengthContainer.length < minLength ? 'You must choose at least ' + minLength + ' option(s).' : true;
}