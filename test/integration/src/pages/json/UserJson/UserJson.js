import Page from 'soya/lib/page/Page';
import RenderResult from 'soya/lib/page/RenderResult';
import JsonRenderer from 'soya/lib/page/json/JsonRenderer.js';
import register from 'soya/lib/client/Register';

var userJson = {
  rickchristie: {
    username: 'rickchristie',
    firstName: 'Ricky',
    lastName: 'Christie',
    email: 'ricky@traveloka.com'
  }
};

class UserJson extends Page {
  static get pageName() {
    return 'UserJson';
  }

  render(httpRequest, routeArgs, store, callback) {
    var jsonRenderer = new JsonRenderer(userJson);
    var renderResult = new RenderResult(jsonRenderer);
    // Simulate network delay of 5 seconds.
    setTimeout(callback.bind({}, renderResult), 5000);
  }
}

register(UserJson);
export default UserJson;