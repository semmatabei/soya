import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from './Header';
import MainSection from './MainSection';
import DataComponent from 'soya/lib/data/redux/DataComponent';
import * as TodoActions from '../../../actions/todos';

class App extends DataComponent {
  registerStores() {
    console.log('App bwahahahaha');
  }

  render() {
    console.log('render!');
    const { todos, dispatch } = this.props;
    const actions = bindActionCreators(TodoActions, dispatch);

    return (
      <div>
        <Header addTodo={actions.addTodo} />
        <MainSection todos={todos} actions={actions} />
      </div>
    );
  }
}

App.propTypes = {
  todos: PropTypes.array.isRequired,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

export default connect(mapStateToProps)(App);