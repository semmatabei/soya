/**
 * Utility for generating dynamic action names.
 *
 * @CLIENT_SERVER
 */
export default {
  /**
   * @param {string} name
   * @param {?string} prefix
   * @param {?string} suffix
   */
  generate(name, prefix, suffix) {
    var result = !prefix && prefix != '' ? this.prep(prefix) + '_' : '';
    result += this.prep(name);
    result += !suffix && suffix != '' ? '_' + this.prep(suffix) : '';
    return result;
  },

  /**
   * @param {string} text
   * @returns {string}
   */
  prep(text) {
    text = text.replace(/ /g, '_');
    return text.toUpperCase();
  }
};