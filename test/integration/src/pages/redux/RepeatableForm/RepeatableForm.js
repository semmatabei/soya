import React from 'react';
import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import ReactRenderer from 'soya/lib/page/react/ReactRenderer';
import register from 'soya/lib/client/Register';
import ReduxStore from 'soya/lib/data/redux/ReduxStore';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import smokesignals from 'soya/lib/event/smokesignals';
import Form from 'soya/lib/data/redux/form/Form';
import FormSegment from 'soya/lib/data/redux/form/FormSegment';

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

const FORM_ID = 'contact';

class Component extends React.Component {
  componentWillMount() {
    this.actions = this.props.reduxStore.register(FormSegment);
    this._form = new Form(this.props.reduxStore, FORM_ID);
  }

  render() {
    return <div>
      <h1>Repeatable Form</h1>
      <h3>Complex Form Data Structure</h3>
      <ul>
        <li>We can have maps, and map inside of map.</li>
        <li>We can have lists, and list inside of list.</li>
        <li>We can have maps inside of lists.</li>
        <li>We can have lists inside of maps.</li>
      </ul>
      <h3>Repeatable Fields</h3>
      <ul>
        <li>Forms are able to easily create custom object hierarchies.</li>
        <li>Forms are able to easily repeat a set of fields to create a <code>List&lt;T&gt;</code> structure.</li>
      </ul>
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }
}

class RepeatableForm extends Page {
  static get pageName() {
    return 'RepeatableForm';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Repeatable Form Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(RepeatableForm);
export default RepeatableForm;