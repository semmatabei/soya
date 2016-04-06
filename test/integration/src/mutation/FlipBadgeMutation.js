import request from 'superagent';

import { UserSegmentId, BadgeSegmentId } from '../segments/ids.js';

export default class FlipBadgeMutation {
  execute() {
    return new Promise((resolve, reject) => {
      request.get('http://localhost:8000/api/user/badge/flip').end((err, res) => {
        if (res.ok) {
          resolve({
            [UserSegmentId]: '*',
            [BadgeSegmentId]: '*'
          });
        } else {
          reject(new Error('Unable to fetch increment API.'));
        }
      });
    });
  }
}