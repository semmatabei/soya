import FormSegment from './FormSegment.js';

/**
 * Represents a form. Instance of this class may be passed to each Field
 * component. It can later be used to orchestrate various actions between
 * fields.
 *
 * @CLIENT_SERVER
 */
export default class Form {
  /**
   * @type {ReduxStore}
   */
  _reduxStore;

  /**
   * @type {string}
   */
  _formId;

  /**
   * @type {Function}
   */
  _handleSubmit;

  /**
   * @type {Object}
   */
  _fields;

  /**
   * @param {ReduxStore} reduxStore
   * @param {string} formId
   * @param {Function} handleSubmit
   */
  constructor(reduxStore, formId, handleSubmit) {
    this._formId = formId;
    this._handleSubmit = handleSubmit;
    this._reduxStore = reduxStore;
  }

  /**
   * @param {string} fieldId
   * @param {Function} validateSync
   * @param {Function} validateAsync
   */
  regField(fieldId, validateSync, validateAsync) {
    this._fields[fieldId] = {
      validateSync: validateSync,
      validateAsync: validateAsync
    };
  }

  submit() {
    console.log(this);
    // First run each field's validators, sync or async.

    // Gathers the value.

    // Send submission.

  }
}