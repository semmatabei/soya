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

import ContactForm from '../../../components/contextual/ContactForm/ContactForm.js'

// TODO: Figure out how to do promise polyfill.
import style from '../../../shared/sitewide.css';

const FORM_ID = 'contact';

class Component extends React.Component {
  componentWillMount() {
    this.actions = this.props.reduxStore.register(FormSegment);
  }

  render() {
    return <div>
      <h1>Simple Form</h1>
      <h3>Basic Use Cases</h3>
      <ul>
        <li>Two way data binding. Data from each field should bind to redux state, and vice-versa.</li>
        <li><a href="javascript:void(0)" onClick={this.replaceValues.bind(this)}>Click here</a> to set values to the redux store, form inputs should also update.</li>
        <li><a href="javascript:void(0)" onClick={this.clearValues.bind(this)}>Click here</a> to clear values in redux store, form inputs should also update.</li>
        <li>Validation </li>
      </ul>
      <ContactForm formId={FORM_ID} formName="Contact Us" reduxStore={this.props.reduxStore} config={this.props.config} />
      <DebugPanel top right bottom>
        <DevTools store={this.props.reduxStore._store} monitor={LogMonitor} />
      </DebugPanel>
    </div>
  }

  replaceValues() {
    this.props.reduxStore.dispatch(this.actions.setValues(FORM_ID, {
      name: 'Rick Christie',
      phoneNumber: '123 456 789',
      message: 'Bring me back that Meteora LP that you borrowed!',
      type: 'borrowing'
    }));
  }

  clearValues() {
    this.props.reduxStore.dispatch(this.actions.clear(FORM_ID));
  }
}

class SimpleForm extends Page {
  static get pageName() {
    return 'SimpleForm';
  }

  createStore(initialState) {
    var reduxStore = new ReduxStore(Promise, initialState, this.config, this.cookieJar);
    return reduxStore;
  }

  render(httpRequest, routeArgs, store, callback) {
    var reactRenderer = new ReactRenderer();
    reactRenderer.head = '<title>Simple Form Test</title>';
    reactRenderer.body = React.createElement(Component, {
      reduxStore: store,
      config: this.config
    });
    var renderResult = new RenderResult(reactRenderer);
    callback(renderResult);
  }
}

register(SimpleForm);
export default SimpleForm;