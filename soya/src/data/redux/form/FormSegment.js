import LocalSegment from '../segment/local/LocalSegment';
import ActionNameUtil from '../segment/ActionNameUtil';
import { isStringDuckType, isEqualShallow } from '../helper';

import update from 'react-addons-update';

const DEFAULT_FIELD = {
  value: null,
  touched: false,
  errorMessages: [],
  isValidating: false
};

/**
 * Sample data structure:
 *
 * <pre>
 *   {
 *     formId: {
 *       fields: {
 *         fieldName: {
 *           touched: true,
 *           errorMessages: [],
 *           value: ?,
 *           isValidating: false
 *         },
 *         ...
 *       },
 *       ...
 *     },
 *     ...
 *   }
 * </pre>
 *
 * @CLIENT_SERVER
 */
export default class FormSegment extends LocalSegment {
  _setValueActionType;
  _setValuesActionType;
  _mergeFieldsActionType;
  _setErrorMessagesActionType;
  _addErrorMessagesActionType;
  _setIsValidatingActionType;
  _setFormEnabledStateActionType;
  _clearFormActionType;
  _actionCreator;
  _queryIdCache;
  _pieceCustomEqualComparators;

  static id() {
    return 'form';
  }

  static createInitialData() {
    return {};
  }

  /**
   * TODO: Remove the need for PromiseImpl.
   *
   * @param {Object} config
   * @param {CookieJar} cookieJar
   * @param {Promise} PromiseImpl
   */
  constructor(config, cookieJar, PromiseImpl) {
    super(config, cookieJar, PromiseImpl);
    var id = FormSegment.id();
    this._queryIdCache = {};
    this._setValueActionType = ActionNameUtil.generate(id, 'SET_VALUE');
    this._setValuesActionType = ActionNameUtil.generate(id, 'SET_VALUES');
    this._mergeFieldsActionType = ActionNameUtil.generate(id, 'MERGE_FIELDS');
    this._setIsValidatingActionType = ActionNameUtil.generate(id, 'SET_IS_VALIDATING');
    this._setErrorMessagesActionType = ActionNameUtil.generate(id, 'SET_ERRORS');
    this._addErrorMessagesActionType = ActionNameUtil.generate(id, 'ADD_ERRORS');
    this._setFormEnabledStateActionType = ActionNameUtil.generate(id, 'SET_ENABLED_STATE');
    this._clearFormActionType = ActionNameUtil.generate(id, 'CLEAR_FORM');

    this._pieceCustomEqualComparators = {
      errorMessages: function(a, b) {
        return a.length == 0 && b.length == 0;
      }
    };

    this._actionCreator = {
      setFormEnabledState: (formId, isEnabled) => {
        return {
          type: this._setFormEnabledStateActionType,
          formId: formId,
          isEnabled: isEnabled
        };
      },
      setIsValidating: (formId, map) => {
        return {
          type: this._setIsValidatingActionType,
          formId: formId,
          map: map
        };
      },
      mergeFields: (formId, fields) => {
        return {
          type: this._mergeFieldsActionType,
          formId: formId,
          fields: fields
        };
      },
      setValue: (formId, fieldName, value) => {
        return {
          type: this._setValueActionType,
          formId: formId,
          fieldName: fieldName,
          value: value
        };
      },
      setValues: (formId, map) => {
        return {
          type: this._setValuesActionType,
          formId: formId,
          map: map
        };
      },
      setErrorMessages: (formId, fieldName, errorMessages) => {
        return {
          type: this._setErrorMessagesActionType,
          formId: formId,
          fieldName: fieldName,
          errorMessages: errorMessages
        };
      },
      addErrorMessages: (formId, messages) => {
        return {
          type: this._addErrorMessagesActionType,
          formId: formId,
          messages: messages
        };
      },
      clear: (formId) => {
        return {
          type: this._clearFormActionType,
          formId: formId
        };
      }
    };
  }

  _generateQueryId(query) {
    if (!query.hasOwnProperty('formId') || !query.hasOwnProperty('type')) {
      throw new Error('Query must contain formId and type properties.');
    }
    var queryId = query.formId + '-' + query.type;
    if (query.type[0] == 'f' && query.fieldName == null) {
      throw new Error('Field query should contain fieldName property.');
    }

    if (query.fieldName) {
      var stringifiedName = this._generateFieldName(query.fieldName);
      queryId += '-' + stringifiedName;
    }
    this._queryIdCache[queryId] = query;
    return queryId;
  }

  /**
   * @param {Array<string|number>|string} fieldName
   */
  _generateFieldName(fieldName) {
    if (isStringDuckType(fieldName)) return fieldName;
    var i, stringifiedName = '';
    for (i = 0; i < fieldName.length; i++) {
      stringifiedName += fieldName[i];
      if (i < fieldName.length - 1) stringifiedName += '.';
    }
    return stringifiedName;
  }

  /**
   * Possible queries:
   *
   * <pre>
   *   {formId: 'formId', type: 'isEnabled'} --> true if form is enabled, false otherwise.
   *   {formId: 'formId', type: '*'} --> get all values as map, but without the error messages.
   *   {formId: 'formId', type: '**'} --> get all values as map with error messages.
   *   {formId: 'formId', type: 'hasErrors'} --> returns true if has errors, false otherwise.
   *   {formId: 'formId', type: 'field', fieldName: 'fieldName'} --> get all values of field.
   * </pre>
   */
  _getPieceObject(state, queryId) {
    var query = this._queryIdCache[queryId];
    switch (query.type) {
      case '*':
        return this._getAllValues(state, query.formId);
        break;
      case '**':
        return state[query.formId] ? state[query.formId] : {};
        break;
      case 'isEnabled':
        return state[query.formId] ? state[query.formId].isEnabled : true;
        break;
      case 'hasErrors':
        return this._hasErrors(state, query.formId);
        break;
      case 'field':
        return this._getField(state, query.formId, query.fieldName);
        break;
      default:
        throw new Error('Unable to translate query: ' + queryId);
        break;
    }
  }

  _getAllValues(state, formId) {
    var fieldName, result = {};
    if (state[formId] == null || state[formId].fields == null) return result;
    for (fieldName in state[formId].fields) {
      if (!state[formId].fields.hasOwnProperty(fieldName)) continue;
      result[fieldName] = state[formId].fields[fieldName].value;
    }
    return result;
  }

  _hasErrors(state, formId) {
    var fieldName;
    if (state[formId] == null || state[formId].fields == null) return false;
    for (fieldName in state[formId].fields) {
      if (!state[formId].fields.hasOwnProperty(fieldName)) continue;
      if (state[formId].fields[fieldName].errorMessages.length > 0) return true;
    }
    return false;
  }

  _getField(state, formId, fieldName) {
    if (state[formId] == null || state[formId].fields == null) {
      return null;
    }
    if (isStringDuckType(fieldName)) {
      return state[formId].fields[fieldName];
    }
    var i, ref = state[formId].fields;
    for (i = 0; i < fieldName.length; i++) {
      ref = ref[fieldName[i]];
    }
    return ref;
  }

  _getActionCreator() {
    return this._actionCreator;
  }

  _getReducer() {
    return (state, action) => {
      if (state == null) return FormSegment.createInitialData();
      switch (action.type) {
        case this._setFormEnabledStateActionType:
          return this._setFormEnabledState(state, action);
          break;
        case this._setIsValidatingActionType:
          return this._setIsValidating(state, action);
          break;
        case this._setValueActionType:
          return this._setValue(state, action);
          break;
        case this._setValuesActionType:
          return this._setValues(state, action);
          break;
        case this._setErrorMessagesActionType:
          return this._setErrorMessages(state, action);
          break;
        case this._addErrorMessagesActionType:
          return this._addErrorMessages(state, action);
          break;
        case this._mergeFieldsActionType:
          return this._mergeFields(state, action);
          break;
        case this._clearFormActionType:
          return this._clearForm(state, action);
          break;
      }
      return state;
    }
  }

  _setFormEnabledState(state, action) {
    state = this._ensureFormExistence(state, action);
    state = update(state, {
      [action.formId]: {
        isEnabled: {$set: action.isEnabled}
      }
    });
    return state;
  }

  _setIsValidating(state, action) {
    state = this._ensureFormExistence(state, action);
    var fieldName, updateObject, tempAction;
    for (fieldName in action.map) {
      if (!action.map.hasOwnProperty(fieldName)) continue;
      tempAction = {formId: action.formId, fieldName: fieldName};
      state = this._extractField(state, tempAction).state;
      updateObject = this._createFieldUpdateObject(tempAction, {
        isValidating: {$set: action.map[fieldName]},
        touched: {$set: true}
      });
      state = update(state, updateObject);
    }
    return state;
  }

  _setValue(state, action) {
    state = this._ensureFormExistence(state, action);
    var result = this._extractField(state, action);
    if (result.field != null && result.field.value === action.value) {
      // If we are setting the same value, no need to update the state.
      return state;
    }
    state = result.state;
    var updateObject = this._createFieldUpdateObject(action, {
      $set: {
        value: action.value,
        touched: true,
        errorMessages: [],
        isValidating: false
      }
    });
    return update(state, updateObject);
  }

  _setValues(state, action) {
    state = this._ensureFormExistence(state, action);
    var fieldName;
    for (fieldName in action.map) {
      if (!action.map.hasOwnProperty(fieldName)) continue;
      state = this._setValue(state, this._actionCreator.setValue(
        action.formId, fieldName, action.map[fieldName]));
    }
    return state;
  }

  _mergeFields(state, action) {
    state = this._ensureFormExistence(state, action);
    var i, updateObject, tempAction = {formId: action.formId};
    for (i = 0; i < action.fields.length; i++) {
      tempAction.fieldName = action.fields[i].fieldName;
      state = this._extractField(state, tempAction).state;
      updateObject = this._createFieldUpdateObject(tempAction, {
        $merge: action.fields[i].object
      });
      state = update(state, updateObject);
    }
    return state;
  }

  _setErrorMessages(state, action) {
    state = this._ensureFormExistence(state, action);
    state = this._extractField(state, action).state;
    var updateObject = this._createFieldUpdateObject(action, {
      errorMessages: {$set: action.errorMessages}
    });
    return update(state, updateObject);
  }

  _addErrorMessages(state, action) {
    state = this._ensureFormExistence(state, action);
    var i, updateObject, tempAction = {formId: action.formId};
    for (i = 0; i < action.messages.length; i++) {
      tempAction.fieldName = action.messages[i].fieldName;
      state = this._extractField(state, tempAction).state;
      updateObject = this._createFieldUpdateObject(tempAction, {
        errorMessages: {$push: action.messages[i].messages}
      });
      state = update(state, updateObject);
    }
    return state;
  }

  _clearForm(state, action) {
    return update(state, {
      [action.formId]: {
        $set: {
          fields: {},
          isEnabled: true
        }
      }
    })
  }

  /**
   * Ensures that the given form exists in the state. Returns the new state
   * object with the initialized form.
   *
   * @param {Object} state
   * @param {Object} action
   * @returns {Object}
   */
  _ensureFormExistence(state, action) {
    var form = state[action.formId];
    if (form == null) {
      state = update(state, {[action.formId]: {$set: {
        fields: {},
        isEnabled: true
      }}});
    }
    return state;
  }

  /**
   * Extract field from state, while also initializing the field. Returns the
   * newly initialized state and the extracted field (may be null).
   *
   * IMPORTANT NOTE: It is assumed that this method is only called for fields,
   * not arrays/objects containing fields.
   *
   * @param {Object} state
   * @param {Object} action
   * @returns {{state: state, field: ?Object}}
   */
  _extractField(state, action) {
    var fieldName = action.fieldName, result = state[action.formId].fields;
    if (isStringDuckType(fieldName)) {
      // Field name is string, piece of cake.
      if (result[action.fieldName] == null) {
        state = update(state, {
          [action.formId]: {
            fields: {
              [action.fieldName]: {
                $set: DEFAULT_FIELD
              }
            }
          }
        });
      }
      return {
        state: state,
        field: result[action.fieldName]
      };
    }

    // Field name is array, now we need to loop.
    var i, j, namePiece, finalPieceIdx = fieldName.length - 1;
    var updateObject = {[action.formId]: {fields: {}}}, fieldExists = true;
    var updateObjectFields = updateObject[action.formId].fields, hasUpdated = false;
    for (i = 0; i < fieldName.length; i++) {
      namePiece = fieldName[i];
      fieldExists = fieldExists && result.hasOwnProperty(namePiece);
      if (fieldExists) {
        // If name piece still exists, just continue looping.
        result = result[namePiece];
        continue;
      }

      // If name piece does not exist, we'll need to initialize default values.
      // This would be empty object/array or the default field value.
      if (!hasUpdated) {
        // If we haven't run update(), run it first to replace this state with
        // a new one.
        if (i == finalPieceIdx) {
          updateObjectFields[namePiece] = {$set: DEFAULT_FIELD};
        } else if (isStringDuckType(fieldName[i+1])) {
          // The next name piece is a string, so this name piece is an object.
          updateObjectFields[namePiece] = {$set: {}};
        } else {
          // The next name piece is an number, so this name piece is an array.
          updateObjectFields[namePiece] = {$set: []};
        }
        state = update(state, updateObject);
        updateObjectFields[namePiece] = {};
        updateObjectFields = updateObjectFields[namePiece];

        // Create a new result reference.
        result = state[action.formId].fields;
        for (j = 0; j <= i; j++) {
          result = result[fieldName[j]];
        }
      } else {
        // If we have run update() once, we don't need to do it again.
        // We can assign values directly.
        if (i == finalPieceIdx) {
          result[namePiece] = DEFAULT_FIELD;
        } else if (isStringDuckType(fieldName[i+1])) {
          result[namePiece] = {};
        } else {
          result[namePiece] = [];
        }
        result = result[namePiece];
      }
    }
    return {
      state: state,
      field: fieldExists ? result : null
    };
  }

  /**
   * Accepts an action object and a react-addons-update object, creating a ready
   * to use object for the update() method.
   *
   * Example output:
   *
   * <pre>
   *   {
   *     formId: {
   *       fields: {
   *         a: {
   *           b: {
   *             3: {
   *               $set: {...}
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * </pre>
   *
   * @param {Object} action
   * @param {Object} updateObject
   * @returns {Object}
   */
  _createFieldUpdateObject(action, updateObject) {
    var i, result = {}, ref = result, fieldName = action.fieldName;
    if (isStringDuckType(fieldName)) {
      return {[action.formId]: {fields: {[fieldName]: updateObject}}};
    }
    var finalLength = fieldName.length - 1;
    for (i = 0; i < fieldName.length; i++) {
      if (i == finalLength) {
        ref[fieldName[i]] = updateObject;
      } else {
        ref[fieldName[i]] = {};
        ref = ref[fieldName[i]];
      }
    }
    result = {[action.formId]: {fields: result}};
    return result;
  }
}