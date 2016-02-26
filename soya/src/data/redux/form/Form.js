import FormSegment from './FormSegment.js';
import PromiseUtil from '../PromiseUtil.js';

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
    this._fields = {};
  }

  /**
   * @returns {string}
   */
  getFormId() {
    return this._formId;
  }

  /**
   * @param {string} fieldName
   * @param {Function} validateAll
   */
  regField(fieldName, validateAll) {
    this._fields[fieldName] = { validateAll: validateAll };
  }

  submit() {


    console.log(this);

    var fieldName, promises = [];
    for (fieldName in this._fields) {
      if (!this._fields.hasOwnProperty(fieldName)) continue;
      promises.push(this._fields[fieldName].validateAll());
    }
    var finalPromise = PromiseUtil.allParallel(Promise, promises);
    finalPromise.then(function() {

    });

    console.log(this);
    // First run each field's validators, sync or async.

    // Gathers the value.

    // Send submission.

  }
}