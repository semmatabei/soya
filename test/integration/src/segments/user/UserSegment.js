import MapSegment from 'soya/lib/data/redux/segment/map/MapSegment.js';
import UserActionCreator from './UserActionCreator.js';

export default class UserSegment extends MapSegment {
  _getName() {
    return 'user';
  }

  _createActionCreator() {
    return new UserActionCreator(this._getName());
  }
}