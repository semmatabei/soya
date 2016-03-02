import React from 'react';
import at from 'soya/lib/scope';

import style from './style.css';

export default class AutocompleteDisplay extends React.Component {
  static get propTypes() {
    return {
      placeholder: React.PropTypes.string
    };
  }

  componentWillMount() {
    this.onDocClick = this.handleDocClick.bind(this);
    if (at.client) document.addEventListener('click', this.onDocClick);
    this.setState({
      results: [],
      selectedIndex: 0
    });
  }

  componentWillUnmount() {
    if (at.client) document.removeEventListener('click', this.onDocClick);
  }

  render() {
    var i, item, selected, resultView, resultItemViews = [];
    if (this.state.results && this.state.results.length > 0) {
      for (i = 0; i < this.state.results.length; i++) {
        item = this.state.results[i];
        selected = this.state.selectedIndex == i ? style.selected : '';
        resultItemViews.push(
          <li key={item.value} className={selected}
              onMouseOver={this.handleMouseOver.bind(this, i)}
              onClick={this.select.bind(this, item)}>{item.label}</li>);
      }
    }

    if (resultItemViews.length > 0) {
      resultView = <ul className={style.results}>{resultItemViews}</ul>;
    }

    return <div className={style.inputContainer} ref={(ref) => this.container = ref}>
        <label>{this.props.label}</label>
        <input className={style.input} type="text" value={this.props.value}
          placeholder={this.props.placeholder}
          onKeyDown={this.handleListNav.bind(this)}
          onChange={this.handleType.bind(this)}
          ref={(ref) => this.input = ref}/>
        {resultView}
        {this.props.errorMessages.length > 0 ? <span>{this.props.errorMessages[0]}</span> : null}
      </div>;
  }

  search(val) {
    if (this.props.search) {
      return this.props.search(val, this.props.options);
    }
    var regex = new RegExp(`${val}`, 'i');
    return this.props.options.filter(function(item) {
      return regex.test(item.searchStr);
    });
  }

  handleListNav(event) {
    if (event.key == 'Tab') {
      this.closeResults();
    }
  }

  handleDocClick(event) {
    var i, isClickingInput = false, node = event.target;
    for (i = 0; i < 5; i++) {
      if (node.parentNode == this.container) {
        isClickingInput = true;
        break;
      }
      node = node.parentNode;
    }

    if (!isClickingInput) {
      this.closeResults();
    }
  }

  closeResults() {
    this.setState({
      results: []
    });
    var value = this.props.value;
    if (value == null) value = '';
    if (!this.props.valueList.hasOwnProperty(this.props.value) && value != '') {
      this.props.handleChange(null);
    }
  }

  handleType(event) {
    var value = this.input.value;
    this.props.handleChange(value);

    // Update autocomplete box.
    if (value == '') {
      this.setState({
        results: []
      });
      return;
    }
    var results = this.search(value);
    this.setState({
      results: results
    });
  }

  handleMouseOver(index) {
    this.setState({
      selectedIndex: index
    });
  }

  select(item) {
    this.props.handleChange(item.value);
    this.setState({
      results: []
    });
  }
}