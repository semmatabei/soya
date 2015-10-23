import DataComponent from './DataComponent.js';

/**
 * Replaces ContextualComponent if hotReload configuration is true.
 *
 * @CLIENT_SERVER
 */
export default class DataComponentHot extends DataComponent {
  componentWillUpdate() {
    this.registerSegments();
  }
}