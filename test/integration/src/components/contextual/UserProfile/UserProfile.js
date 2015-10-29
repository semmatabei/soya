import React from 'react';

import UserSegment from '../../../segments/user/UserSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';

var count = 1;

export default class UserProfile extends DataComponent {
  registerSegments() {
    this.register(new UserSegment());
    this.subscribe(UserSegment.segmentName, { username: this.props.username }, 'user');
  }

  render() {
    console.log('render', count++, this.state);
    if (!this.state.user.loaded) {
      return <div>
        User data is loading....
      </div>
    }

    return <div>
      <ul>
        <li>User name: {this.state.user.data.username}</li>
        <li>First name: {this.state.user.data.firstName}</li>
        <li>Last name: {this.state.user.data.lastName}</li>
        <li>Email: {this.state.user.data.email}</li>
      </ul>
    </div>
  }
}