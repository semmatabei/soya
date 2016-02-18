import LocalSegment from '../segment/local/LocalSegment';
import ActionNameUtil from '../segment/ActionNameUtil';
import { isEqualShallow } from '../helper';

import update from 'react-addons-update';

/**
 * Sample data structure:
 *
 * <pre>
 *   {
 *     formId: {
 *       fieldName: {
 *         touched: true,
 *         errorMessages: [],
 *         value: ?,
 *         isValidating: false
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
  _setErrorMessagesActionType;
  _addErrorMessagesActionType;
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

  constructor(config, cookieJar, PromiseImpl) {
    super(config, cookieJar, PromiseImpl);
    var id = FormSegment.id();
    this._queryIdCache = {};
    this._setValueActionType = ActionNameUtil.generate(id, 'SET_VALUE');
    this._setValuesActionType = ActionNameUtil.generate(id, 'SET_VALUES');
    this._setErrorMessagesActionType = ActionNameUtil.generate(id, 'SET_ERRORS');
    this._addErrorMessagesActionType = ActionNameUtil.generate(id, 'ADD_ERRORS');
    this._clearFormActionType = ActionNameUtil.generate(id, 'CLEAR_FORM');

    this._pieceCustomEqualComparators = {
      errorMessages: function(a, b) {
        return a.length == 0 && b.length == 0;
      }
    };

    this._actionCreator = {
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
      addErrorMesages: (formId, fieldName, errorMessages) => {
        return {
          type: this._addErrorMessagesActionType,
          formId: formId,
          fieldName: fieldName,
          errorMessages: errorMessages
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

    if (query.fieldName) queryId += '-' + query.fieldName;
    this._queryIdCache[queryId] = query;
    return queryId;
  }

  _comparePiece(prevSegmentState, segmentState, queryId) {
    // If state is equal, nothing has changed, since our reducer always
    // re-creates the object.
    if (this._isStateEqual(prevSegmentState, segmentState)) {
      return null;
    }

    // Otherwise, we do shallow comparison to make sure no unnecessary re-render
    // is triggered.
    var prevSegmentPiece = this._getPieceObject(prevSegmentState, queryId);
    var segmentPiece = this._getPieceObject(segmentState, queryId);
    if (isEqualShallow(prevSegmentPiece, segmentPiece, this._pieceCustomEqualComparators)) {
      return null;
    }
    return segmentPiece;
  }

  /**
   * Possible queries:
   *
   * <pre>
   *   {formId: 'formId', type: '*'} --> get all values as map, but without the error messages.
   *   {formId: 'formId', type: '**'} --> get all values as map with error messages.
   *   {formId: 'formId', type: 'hasErrors'} --> returns true if has errors, false otherwise.
   *   {formId: 'formId', type: 'field', fieldName: 'fieldName'} --> get value of fieldName, along with errors.
   *   {formId: 'formId', type: 'field*', fieldName: 'fieldName'} --> get value of fieldName, along with errors and touched.
   *   {formId: 'formId', type: 'field**', fieldName: 'fieldName'} --> get full value of field.
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
      case 'hasErrors':
        return this._hasErrors(state, query.formId);
        break;
      case 'field':
        return this._getField(state, query.formId, query.fieldName, {
          value: null,
          errorMessages: []
        });
        break;
      case 'field*':
        return this._getField(state, query.formId, query.fieldName, {
          value: null,
          errorMessages: [],
          touched: false
        });
        break;
      case 'field**':
        return this._getField(state, query.formId, query.fieldName, {
          value: null,
          errorMessages: [],
          touched: false,
          isValidating: false
        });
        break;
      default:
        throw new Error('Unable to translate query: ' + queryId);
        break;
    }
  }

  _getAllValues(state, formId) {
    var fieldName, result = {};
    for (fieldName in state[formId]) {
      if (!state[formId].hasOwnProperty(fieldName)) continue;
      result[fieldName] = state[formId][fieldName].value;
    }
    return result;
  }

  _hasErrors(state, formId) {
    var fieldName;
    for (fieldName in state[formId]) {
      if (!state[formId].hasOwnProperty(fieldName)) continue;
      if (state[formId][fieldName].errorMessages.length > 0) return true;
    }
    return false;
  }

  _getField(state, formId, fieldName, result) {
    var form = state[formId];
    if (form == null) form = {};
    var key, field = form[fieldName];
    if (field == null) {
      return result;
    }
    for (key in result) {
      if (!result.hasOwnProperty(key)) continue;
      result[key] = field[key];
    }
    return result;
  }

  _getActionCreator() {
    return this._actionCreator;
  }

  _getReducer() {
    return (state, action) => {
      if (state == null) return FormSegment.createInitialData();
      switch (action.type) {
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
        case this._clearFormActionType:
          return this._clearForm(state, action);
          break;
      }
      return state;
    }
  }

  _setValue(state, action) {
    state = this._ensureFormExistence(state, action);
    return update(state, {
      [action.formId]: {
        [action.fieldName]: {
          $set: {
            value: action.value,
            touched: true,
            errorMessages: [],
            isValidating: false
          }
        }
      }
    });
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

  _setErrorMessages(state, action) {
    state = this._ensureFormExistence(state, action);
    state = this._ensureFieldExistence(state, action);
    return update(state, {
      [action.formId]: {
        [action.fieldName]: {$merge: {
          errorMessages: action.errorMessages
        }}
      }
    });
  }

  _addErrorMessages(state, action) {
    state = this._ensureFormExistence(state, action);
    state = this._ensureFieldExistence(state, action);
    return update(state, {
      [action.formId]: {
        [action.fieldName]: {
          errorMessages: {$push: action.errorMessages}
        }
      }
    });
  }

  _clearForm(state, action) {
    return update(state, {
      [action.formId]: {
        $set: {}
      }
    })
  }

  _ensureFormExistence(state, action) {
    var form = state[action.formId];
    if (form == null) {
      state = update(state, {[action.formId]: {$set: {}}});
    }
    return state;
  }

  _ensureFieldExistence(state, action) {
    var field = state[action.formId][action.fieldName];
    if (field == null) {
      state = update(state, {
        [action.formId]: {
          [action.fieldName]: { $set: {
            value: null,
            touched: false,
            errorMessages: [],
            isValidating: false
          }}
        }
      });
    }
    return state;
  }
}