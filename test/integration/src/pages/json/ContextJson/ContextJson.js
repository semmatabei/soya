import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import JsonRenderer from 'soya/lib/page/json/JsonRenderer.js';
import register from 'soya/lib/client/Register';

class ContextJson extends Page {
  static get pageName() {
    return 'ContextJson';
  }

  render(httpRequest, routeArgs, store, callback) {
    var jsonRenderer = new JsonRenderer({
      context: 'abcdefghijklmnopqrstuvwxyz',
      session: '1234567890'
    });
    var renderResult = new RenderResult(jsonRenderer);

    // Randomly decide when to return a response.
    setTimeout(callback.bind({}, renderResult), this.getRandomInt(10, 1500));
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

register(ContextJson);
export default ContextJson;