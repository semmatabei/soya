import React from 'react';

import ConcatRandomTimeEchoSegment from '../../../segments/ConcatRandomTimeEchoSegment.js';
import DataComponent from 'soya/lib/data/redux/DataComponent.js';
import { SERVER } from 'soya/lib/data/RenderType.js';

import style from './style.css';

export default class RandomTimeEchoString extends DataComponent {
  static getSegmentDependencies() {
    return [ConcatRandomTimeEchoSegment];
  }

  subscribeQueries(nextProps) {
    var hydrationOption = null;
    if (nextProps.loadAtClient) {
      hydrationOption = {
        SERVER: false
      };
    }

    var query = {
      value: nextProps.value,
      isParallel: nextProps.isParallel,
      shouldReplace: nextProps.shouldReplace,
      isReplaceParallel: nextProps.isReplaceParallel
    };

    this.subscribe(ConcatRandomTimeEchoSegment.id(), query, 'concatVal',
      hydrationOption);
  }

  render() {
    var title = 'String: \'' + this.props.value + '\'';
    title += this.props.isParallel ? ', Parallel' : ', Serial' ;

    if (!this.state.concatVal.loaded) {
      return <div className={style.container}>
        <h3>{title}</h3>
        <p>Loading...</p>
      </div>
    }

    return <div className={style.container}>
      <h3>{title}</h3>
      <p>Result: {this.state.concatVal.data}</p>
    </div>
  }
}