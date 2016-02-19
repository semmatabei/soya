import React from 'react';

import FibonacciSegment from '../../../segments/FibonacciSegment.js';
import convert from 'soya/lib/data/redux/convert';
import { SERVER } from 'soya/lib/data/RenderType';

import style from './style.css';

class FibonacciSequence {
  static getSegmentDependencies() {
    return [FibonacciSegment];
  }

  static subscribeQueries(nextProps, subscribe) {
    var hydrationOption = null;
    if (nextProps.loadAtClient) {
      hydrationOption = {
        SERVER: false
      };
    }

    var query = {
      number: nextProps.number
    };

    subscribe(FibonacciSegment.id(), query, 'fib', hydrationOption);
  }

  render() {
    var title = `Fibonacci Sequence (${this.props.number})`;
    if (!this.props.result.fib.loaded) {
      return <div className={style.container}>
        <h3>{title}</h3>
        <p>Loading...</p>
      </div>
    }
    return <div className={style.container}>
      <h3>{title}</h3>
      <p>{this.props.result.fib.data}</p>
    </div>
  }
}

export default convert(FibonacciSequence);