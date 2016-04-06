import request from 'superagent';

import { UserSegmentId } from '../segments/ids.js';

export default class ResetUserPostMutation {
  _number;

  constructor(number) {
    this._number = number;
  }

  execute() {
    return new Promise((resolve, reject) => {
      request.get('http://localhost:8000/api/user/reset-post/' + encodeURIComponent(this._number)).end((err, res) => {
        if (res.ok) {
          resolve({
            [UserSegmentId]: '*'
          });
        } else {
          reject(new Error('Unable to reset '));
        }
      });
    });
  }
}