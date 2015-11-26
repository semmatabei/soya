import LocalSegment from 'soya/lib/data/redux/segment/local/LocalSegment.js';
import ActionNameUtil from 'soya/lib/data/redux/segment/ActionNameUtil.js';
import update from 'react-addons-update';

/**
 * @CLIENT_SERVER
 */
export default class ModalSegment extends LocalSegment {
  _addActionType;
  _updateActionType;
  _removeActionType;
  _removeAllActionType;

  static id() {
    return 'modal';
  }

  static createInitialData() {
    return {
      modals: []
    };
  }

  constructor(config, cookieJar, PromiseImpl) {
    super(config, cookieJar, PromiseImpl);
    var id = ModalSegment.id();
    this._addActionType = ActionNameUtil.generate(id, 'ADD');
    this._updateActionType = ActionNameUtil.generate(id, 'UPDATE');
    this._removeActionType = ActionNameUtil.generate(id, 'REMOVE');
    this._removeAllActionType = ActionNameUtil.generate(id, 'REMOVE_ALL');
  }

  _getActionCreator() {
    var self = this;
    return {
      add(modalType, modalId, data) {
        return {
          type: self._addActionType,
          modalType: modalType,
          modalId: modalId,
          data: data
        }
      },
      update(modalId, commands) {
        return {
          type: self._updateActionType,
          modalId: modalId,
          commands: commands
        }
      },
      remove(modalId) {
        return {
          type: self._removeActionType,
          modalId: modalId
        };
      },
      removeAll() {
        return {
          type: self._removeAllActionType
        };
      }
    }
  }

  _getReducer() {
    var self = this;
    return function(state, action) {
      if (state == null) return ModalSegment.createInitialData();
      switch (action.type) {
        case self._addActionType:
          return self._addModal(state, action);
          break;
        case self._updateActionType:
          return self._updateModal(state, action);
          break;
        case self._removeActionType:
          return self._removeModal(state, action);
          break;
        case self._removeAllActionType:
          return [];
          break;
      }
      return state;
    };
  }

  _addModal(state, action) {
    state = this._removeModal(state, action);
    return update(state, {modals: { $push: [{
      modalId: action.modalId,
      modalType: action.modalType,
      data: action.data
    }]}});
  }

  _updateModal(state, action) {
    var index = this._find(state, action.modalId);
    if (index <= -1) {
      return state;
    }
    return update(state, {modals: { [index]: { data: { $set:
      action.data
    }}}});
  }

  _removeModal(state, action) {
    var index = this._find(state, action.modalId);
    if (index > -1) {
      state = update(state, {modals: { $splice: [[index, 1]] }});
    }
    return state;
  }

  /**
   * @param {Object} state
   * @param {string} modalId
   * @returns {number}
   */
  _find(state, modalId) {
    // Assuming that in a normal application, your modal window count won't
    // be more than 10, we need no indexes.
    var i, modal;
    for (i = 0; i < state.modals.length; i++) {
      modal = state.modals[i];
      if (modal.modalId == modalId) {
        return i;
      }
    }
    return -1;
  }
}