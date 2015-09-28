/**
 * Container for objects that may contain either string or array of string as
 * values. Used to represent headers and query strings.
 *
 * @CLIENT-SERVER
 */
export default class Bucket {
  /**
   * @type {{[key: string]: string | Array<string>}}
   */
  _data;

  constructor() {
    this._data = {};
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._data.hasOwnProperty(key);
  }

  /**
   * Returns
   *
   * @returns {{[key: string]: string | Array<string>}}
   */
  getAll() {
    return this._data;
  }

  /**
   * @param {string} key
   * @returns {string | Array<string>}
   */
  get(key) {
    return this._data[key];
  }

  /**
   * Set value, overwrites the given value.
   *
   * @param {string} key
   * @param {string | Array<string>} value
   */
  set(key, value) {
    this._data[key] = value;
  }

  /**
   * @param {string} key
   * @param {string | Array<string>} value
   */
  add(key, value) {
    if (!this._data.hasOwnProperty(key)) {
      this._data[key] = value;
      return;
    }

    if (Object.prototype.toString.call(this._data[key]) != '[object Array]') {
      this._data[key] = [this._data[key]];
    }

    this._data[key] = this._data[key].concat(value);
  }

  remove(key) {
    delete this._data[key];
  }
}