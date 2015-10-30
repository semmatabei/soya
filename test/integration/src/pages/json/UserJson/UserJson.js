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
  },
  willywonka: {
    username: 'willywonka',
    firstName: 'Willy',
    lastName: 'Wonka',
    email: 'willy@wonka.com'
  },
  captainjack: {
    username: 'captainjack',
    firstName: 'Captain',
    lastName: 'Jack Sparrow',
    email: 'captain@blackpearl.com'
  },
  jedikiller: {
    username: 'jedikiller',
    firstName: 'Anakin',
    lastName: 'Skywalker',
    email: 'jedikiller@deathstar.com'
  },
  meesa: {
    username: 'meesa',
    firstName: 'Jar',
    lastName: 'Jar Binks',
    email: 'meesa@jarjar.com'
  }
};

var notFound = {
  error: 'Username does not exist.'
};

class UserJson extends Page {
  static get pageName() {
    return 'UserJson';
  }

  render(httpRequest, routeArgs, store, callback) {
    var username = routeArgs.username;
    var jsonRenderer, renderResult;
    if (userJson.hasOwnProperty(username)) {
      jsonRenderer = new JsonRenderer(userJson[username]);
      renderResult = new RenderResult(jsonRenderer);
    } else {
      jsonRenderer = new JsonRenderer(notFound);
      renderResult = new RenderResult(jsonRenderer);
      renderResult.setStatusCode(404);
    }

    // Simulate network delay of 3 seconds.
    setTimeout(callback.bind({}, renderResult), 3000);
  }
}

register(UserJson);
export default UserJson;