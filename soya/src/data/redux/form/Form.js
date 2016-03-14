import FormSegment from './FormSegment.js';
import PromiseUtil from '../PromiseUtil.js';
import { isStringDuckType } from '../helper.js';

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
   * Returns a promise that resolves to the following object:
   *
   * <pre>
   *   {
   *     isValid: true/false,
   *     values: {
   *       fieldName: (value),
   *       ...
   *     }
   *   }
   * </pre>
   *
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
        var i, j, result, values = {}, isValid = true;
        for (i = 0; i < validationResults.length; i++) {
          result = validationResults[i];
          isValid = isValid && result.isValid;
          if (isStringDuckType(result.name)) {
            values[result.name] = result.value;
            continue;
          }
          var ref = values, namePiece, finalPieceIdx = result.name.length - 1;
          for (j = 0; j < result.name.length; j++) {
            namePiece = result.name[j];
            if (j == finalPieceIdx) {
              ref[namePiece] = result.value;
            } else if (ref.hasOwnProperty(namePiece)) {
              // no-op.
            } else if (result.name[j+1].substring) {
              ref[namePiece] = {};
            } else {
              ref[namePiece] = [];
            }
            ref = ref[namePiece];
          }
        }
        return {values: values, isValid: isValid};
      }
    ).catch(PromiseUtil.throwError);
  }

  submit(submitFunc, validationFunc) {
    this.disable();
    var validateAllPromise = this.validateAll();
    validateAllPromise.then((result) => {
      if (!result.isValid || validationFunc == null) {
        submitFunc(result);
        this.enable();
        return;
      }
      // Result is valid and validation function is not null. Do form-wide validation.
      var formWideValidationPromise = Promise.resolve(validationFunc(result.values));
      formWideValidationPromise.then((formWideValidationResult) => {
        if (typeof formWideValidationResult == 'object' && !formWideValidationResult.isValid) {
          // Render error messages.
          this._reduxStore.dispatch(this._actionCreator.addErrorMessages(
            this._formId, formWideValidationResult.errorMessages
          ));
          result.isValid = false;
        }
        submitFunc(result);
        this.enable();
      }).catch((error) => {
        result.isValid = false;
        submitFunc(result);
        this.enable();
        PromiseUtil.throwError(error);
      });
    }).catch((error) => {
      this.enable();
      PromiseUtil.throwError(error);
    });
  }
}