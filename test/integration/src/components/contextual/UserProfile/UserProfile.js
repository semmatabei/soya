import React from 'react';

import UserSegment from '../../../segments/user/UserSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';

export default class UserProfile extends DataComponent {
  registerSegments() {
    this.register(new UserSegment(), { username: this.props.username }, 'user');
  }

  render() {
    return <div>
        <ul>
          <li>User name: {this.state.user.username}</li>
          <li>First name: {this.state.user.firstName}</li>
          <li>Last name: {this.state.user.lastName}</li>
          <li>Email: {this.state.user.email}</li>
        </ul>
      </div>
  }
}