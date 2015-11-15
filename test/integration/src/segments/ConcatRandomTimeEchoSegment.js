import MapSegment from 'soya/lib/data/redux/segment/map/MapSegment.js';
import Thunk from 'soya/lib/data/redux/Thunk.js';
import QueryDependencies from 'soya/lib/data/redux/QueryDependencies.js';

// TODO: Figure out how to do polyfill.
// TODO: Figure out how to load client-side libraries like jQuery!
//import { Promise } from 'es6-promise';
import request from 'superagent';

import RandomTimeEchoSegment from './RandomTimeEchoSegment.js';

export default class ConcatRandomTimeEchoSegment extends MapSegment {
  static id() {
    return 'concatRandomTimeEcho';
  }

  static getSegmentDependencies() {
    return [RandomTimeEchoSegment];
  }

  _generateQueryId(query) {
    return query.value + (query.isParallel ? '$p' : '$s');
  }

  _generateThunkFunction(thunk) {
    var query = thunk.query;
    var queryId = thunk.queryId;
    var dependencies, i;

    if (query.isParallel) {
      dependencies = QueryDependencies.parallel(Promise);
    } else {
      dependencies = QueryDependencies.serial(Promise);
    }

    for (i = 0; i < query.value.length; i++) {
      // Always do force load so that response time is always random.
      dependencies.add(i + '', RandomTimeEchoSegment.id(), {value: query.value[i]}, true);
    }

    thunk.dependencies = dependencies;
    thunk.func = (dispatch) => {
      // Join fetched target, parallel fetch should have inconsistencies while
      // serial fetch should have no inconsistencies.
      var resultStr = '', segmentPiece;
      for (i = 0; i < query.value.length; i++) {
        segmentPiece = dependencies.getResult(i + '');
        resultStr += segmentPiece.loaded ? segmentPiece.data : '?';
      }
      dispatch(this._createSyncLoadActionObject(queryId, resultStr));
      return Promise.resolve(null);
    };
  }
}