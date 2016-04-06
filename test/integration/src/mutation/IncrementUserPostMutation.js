import request from 'superagent';

import { UserSegmentId } from '../segments/ids.js';

export default class IncrementUserPostMutation {
  _userId;

  constructor(userId) {
    this._userId = userId;
  }

  execute() {
    return new Promise((resolve, reject) => {
      request.get('http://localhost:8000/api/user/inc-post/' + encodeURIComponent(this._userId)).end((err, res) => {
        if (res.ok) {
          resolve({
            [UserSegmentId]: [this._userId]
          });
        } else {
          reject(new Error('Unable to fetch increment API.'));
        }
      });
    });
  }
}