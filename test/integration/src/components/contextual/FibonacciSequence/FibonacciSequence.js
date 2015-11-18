import React from 'react';

import FibonacciSegment from '../../../segments/FibonacciSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';
import { SERVER } from 'soya/lib/data/RenderType.js';

import style from './style.css';

export default class FibonacciSequence extends DataComponent {
  static getSegmentDependencies() {
    return [FibonacciSegment];
  }

  subscribeQueries(nextProps) {
    var hydrationOption = null;
    if (nextProps.loadAtClient) {
      hydrationOption = {
        SERVER: false
      };
    }

    var query = {
      number: nextProps.number
    };

    this.subscribe(FibonacciSegment.id(), query, 'fib',
      hydrationOption);
  }

  render() {
    var title = `Fibonacci Sequence (${this.props.number})`;
    if (!this.state.fib.loaded) {
      return <div className={style.container}>
        <h3>{title}</h3>
        <p>Loading...</p>
      </div>
    }
    return <div className={style.container}>
      <h3>{title}</h3>
      <p>{this.state.fib.data}</p>
    </div>
  }
}