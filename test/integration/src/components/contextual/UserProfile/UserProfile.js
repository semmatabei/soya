import React from 'react';

import UserSegment from '../../../segments/user/UserSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';
import { SERVER } from 'soya/lib/data/RenderType.js';

export default class UserProfile extends DataComponent {
  static getSegmentDependencies(config) {
    return [UserSegment];
  }

  /**
   * @param nextProps
   */
  subscribeQueries(nextProps) {
    var hydrationOption = null;
    if (nextProps.loadAtClient) {
      hydrationOption = {
        SERVER: false
      };
    }

    this.subscribe(
      UserSegment.id(), { username: nextProps.username }, 'user',
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