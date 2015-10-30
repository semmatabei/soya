import React from 'react';

import UserSegment from '../../../segments/user/UserSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';
import { SERVER, CLIENT_PARTIAL } from 'soya/lib/data/RenderType.js';
import { NOOP, NON_BLOCKING } from 'soya/lib/data/HydrationType.js';

export default class UserProfile extends DataComponent {
  registerSegments() {
    var hydrationOption = null;
    if (this.props.loadAtClient) {
      hydrationOption = {
        SERVER: NOOP,
        CLIENT_PARTIAL: NON_BLOCKING
      };
    }

    this.register(new UserSegment());
    this.subscribe(
      UserSegment.segmentName, { username: this.props.username }, 'user',
      null, hydrationOption);
  }

  render() {
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