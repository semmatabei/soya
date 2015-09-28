/**
 * @CLIENT-SERVER
 */
export default {
  prop(value, propName) {
    return value && value[propName] ? value[propName] : value;
  }
};