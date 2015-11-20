import React from 'react';

import BookingSegment from '../../../segments/BookingSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';
import { SERVER } from 'soya/lib/data/RenderType.js';

import style from './style.css';

export default class BookingBox extends DataComponent {
  static getSegmentDependencies() {
    return [BookingSegment];
  }

  subscribeQueries(nextProps) {
    var hydrationOption = null;
    if (nextProps.loadAtClient) {
      hydrationOption = {
        SERVER: false
      };
    }

    var query = {
      bookingId: nextProps.bookingId
    };

    this.subscribe(BookingSegment.id(), query, 'booking',
      hydrationOption);
  }

  render() {
    var title = `Booking Detail (${this.props.bookingId})`;
    if (!this.state.booking.loaded) {
      var loading;
      if (this.state.booking.errors) {
        loading = <p>Error: {this.state.booking.errors[0]}</p>;
      } else {
        loading = <p>Loading...</p>;
      }
      return <div className={style.container}>
        <h3>{title}</h3>
        {loading}
      </div>
    }

    return <div className={style.container}>
      <h3>{title}</h3>
      <ul>
        <li>Type: {this.state.booking.data.type}</li>
        <li>Status: {this.state.booking.data.status}</li>
        <li>Last Updated: {new Date(this.state.booking.data.timestamp).toGMTString()}</li>
      </ul>
    </div>
  }
}