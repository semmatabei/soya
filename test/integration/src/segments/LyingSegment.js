import LocalSegment from 'soya/lib/data/redux/segment/local/LocalSegment';
import ActionNameUtil from 'soya/lib/data/redux/segment/ActionNameUtil';

import { LyingSegmentId } from './ids.js';

/**
 * @CLIENT_SERVER
 */
export default class LyingSegment extends LocalSegment {
  _incrementActionType;

  static id() {
    return LyingSegmentId;
  }

  static createInitialData() {
    return 0;
  }

  constructor(config, cookieJar, PromiseImpl) {
    super(config, cookieJar, PromiseImpl);
    var id = LyingSegment.id();
    this._incrementActionType = ActionNameUtil.generate(id, 'INCREMENT');
  }

  _getActionCreator() {
    var self = this;
    return {
      increment: function(number) {
        if (number == null || number == undefined) number = 1;
        return {
          type: self._incrementActionType,
          number: number
        }
      }
    }
  }

  _getReducer() {
    return (state, action) => {
      if (state == null) return LyingSegment.createInitialData();
      switch (action.type) {
        case this._incrementActionType:
          state = state + action.number;
          break;
      }
      return state;
    }
  }
}