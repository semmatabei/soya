import React from 'react';
import connect from 'soya/lib/data/redux/connect';
import createField from 'soya/lib/data/redux/form/createField';
import { SERVER } from 'soya/lib/data/RenderType';

import Autocomplete from '../../common/Autocomplete/Autocomplete';
import AutocompleteDisplay from '../../common/Autocomplete/AutocompleteDisplay';
import AirportListSegment from '../../../segments/AirportListSegment';

class AirportInputBase extends React.Component {
  static connectId() {
    return 'AirportField';
  }

  static getSegmentDependencies() {
    return [AirportListSegment];
  }

  static subscribeQueries(nextProps, subscribe) {
    var hydrationOption = { SERVER: false };
    subscribe(AirportListSegment.id(), '*', 'airports', hydrationOption);
  }

  componentWillMount() {
    this.generateItemList(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.generateItemList(nextProps);
  }

  generateItemList(props) {
    var itemList = [], valueList = {};
    if (props.result.airports.loaded) {
      if (props.result.airports.loaded) {
        var key, airport;
        for (key in props.result.airports.data) {
          if (!props.result.airports.data.hasOwnProperty(key)) continue;
          airport = props.result.airports.data[key];
          itemList.push({
            label: `${airport.name} (${airport.code}) - ${airport.location}`,
            inputLabel: `${airport.location} (${airport.code})`,
            searchStr: `${airport.name} ${airport.location} ${airport.code}`,
            value: `${airport.location} (${airport.code})`
          });
          valueList[`${airport.location} (${airport.code})`] = null;
        }
      }
    }
    this.setState({
      itemList: itemList,
      valueList: valueList
    });
  }

  render() {
    return <div>
      <AutocompleteDisplay options={this.state.itemList}
                           label={this.props.label} errorMessages={this.props.errorMessages}
                           value={this.props.value} valueList={this.state.valueList}
                           placeholder={this.props.label}
                           handleChange={this.props.handleChange} />
    </div>;
  }
}

export var AirportInput = connect(AirportInputBase);
export default createField(AirportInput);