import FormSegment from './FormSegment.js';
import PromiseUtil from '../PromiseUtil.js';
import { mergeValidationResult } from '../helper.js';

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
   * @type {Object}
   */
  _fields;

  /**
   * @type {Object<Function>}
   */
  _actionCreator;

  /**
   * @param {ReduxStore} reduxStore
   * @param {string} formId
   */
  constructor(reduxStore, formId) {
    this._actionCreator = reduxStore.register(FormSegment);
    this._formId = formId;
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

  /**
   * Disables the form by setting isEnabled to false.
   */
  disable() {
    this._reduxStore.dispatch(this._actionCreator.setFormEnabledState(
      this._formId, false
    ));
  }

  /**
   * Enables the form by setting isEnabled to true.
   */
  enable() {
    this._reduxStore.dispatch(this._actionCreator.setFormEnabledState(
      this._formId, true
    ));
  }

  /**
   * @return {Promise}
   */
  validateAll() {
    var fieldName, promises = [];
    for (fieldName in this._fields) {
      if (!this._fields.hasOwnProperty(fieldName)) continue;
      promises.push(this._fields[fieldName].validateAll());
    }
    var finalPromise = PromiseUtil.allParallel(Promise, promises);
    return finalPromise.then(
      function(validationResults) {
        var isPassValidation = mergeValidationResult(validationResults);
        return isPassValidation;
      },
      function(error) {
        console.log('Error when running validation!', error);
        return false;
      }
    );
  }

  submit() {
    // TODO: Disable the form. Maybe we shouldn't have submit, just validateAll instead?
    console.log(this);
    // First run each field's validators, sync or async.

    // Gathers the value.

    // Send submission.

  }
}