import React from 'react';

export default class Autocomplete extends React.Component {
  static get propTypes() {
    return {
      data: React.PropTypes.array.isRequired
    };
  }

  render() {
    var preppedChildren = React.Children.map(
      this.props.children, (child) => {
        return React.cloneElement(child, {
          search: this.search.bind(this)
        });
      }
    );
    return <div>
      {preppedChildren}
    </div>;
  }

  search(val) {
    var regex = new RegExp(`${val}`, 'i');
    return this.props.data.filter(function(item) {
      return regex.test(item.searchStr);
    });
  }
}