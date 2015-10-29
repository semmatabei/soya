import MapSegment from 'soya/lib/data/redux/segment/map/MapSegment.js';
import UserActionCreator from './UserActionCreator.js';

export default class UserSegment extends MapSegment {
  static get segmentName() {
    return 'user';
  }

  _getName() {
    return UserSegment.segmentName;
  }

  _createActionCreator() {
    return new UserActionCreator(this._getName());
  }
}