import MapActionCreator from 'soya/lib/data/redux/segment/map/MapActionCreator.js';
import request from 'superagent';

// TODO: Figure out how to do polyfill.
// TODO: Figure out how to load client-side libraries like jQuery!
import { Promise } from 'es6-promise';

export default class UserActionCreator extends MapActionCreator {
  _generateQueryId(query) {
    return query.username;
  }

  _createThunkAction(query, queryId) {
    return (dispatch) => {
      var result = new Promise((resolve, reject) => {
        request.get('http://localhost:8000/api/user.json').end((err, res) => {
          if (res.ok) {
            var payload = JSON.parse(res.text).rickchristie;
            dispatch(this._createLoadActionObject(queryId, payload));
            resolve();
          } else {
            reject(new Error('Unable to fetch user data!'));
          }
        });
      });
      return result;
    }
  }
}