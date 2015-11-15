import MapSegment from 'soya/lib/data/redux/segment/map/MapSegment.js';
import Thunk from 'soya/lib/data/redux/Thunk.js';

// TODO: Figure out how to do polyfill.
// TODO: Figure out how to load client-side libraries like jQuery!
//import { Promise } from 'es6-promise';
import request from 'superagent';

export default class LifetimeSessionSegment extends MapSegment {
  static id() {
    return 'user';
  }

  _generateQueryId(query) {
    return 'default';
  }

  _generateThunkFunction(thunk) {
    var queryId = thunk.queryId;
    thunk.func = (dispatch) => {
      var result = new Promise((resolve, reject) => {
        request.get('http://localhost:8000/api/context').end((err, res) => {
          if (res.ok) {
            var payload = JSON.parse(res.text);
            dispatch(this._createSyncLoadActionObject(queryId, payload));
            resolve();
          } else {
            reject(new Error('Unable to fetch user data!'));
          }
        });
      });
      return result;
    };
  }
}