import BaseController from './base';
import UsersController from './users';
import RemindersController from './reminders';

import SpeechController from '../lib/speech-controller';
import Server from '../lib/server/index';
import Settings from '../lib/common/settings';

const p = Object.freeze({
  controllers: Symbol('controllers'),
  speechController: Symbol('speechController'),
  server: Symbol('server'),
  subscribeToNotifications: Symbol('subscribeToNotifications'),
  settings: Symbol('settings'),
  initHub: Symbol('initHub'),

  onHashChanged: Symbol('onHashChanged'),
});

export default class MainController extends BaseController {
  constructor() {
    super();

    const mountNode = document.querySelector('.app-view-container');
    const speechController = new SpeechController();
    const settings = new Settings();
    const server = new Server({ settings });
    const options = { mountNode, speechController, server, settings };

    const usersController = new UsersController(options);
    const remindersController = new RemindersController(options);

    this[p.controllers] = {
      '': usersController,
      'users/(.+)': usersController,
      'reminders': remindersController,
    };

    this[p.speechController] = speechController;
    this[p.server] = server;
    this[p.settings] = settings;
    this[p.initHub]();

    window.addEventListener('hashchange', this[p.onHashChanged].bind(this));
  }

  main() {
    this[p.speechController].start()
      .then(() => {
        console.log('Speech controller started');
      });

    this[p.server].on('login', () => this[p.subscribeToNotifications]());
    this[p.server].on('push-message', (message) => {
      if (this[p.settings].isHub) {
        this[p.speechController].speak(`${message.title}: ${message.body}`);
      }
    });

    location.hash = '';

    setTimeout(() => {
      if (this[p.server].isLoggedIn) {
        this[p.subscribeToNotifications]();
        location.hash = 'reminders';
      } else {
        location.hash = 'users/login';
      }
    });
  }

  /**
   * Clear all data/settings stored on the browser. Use with caution.
   *
   * @param {boolean} ignoreServiceWorker
   * @return {Promise}
   */
  clear(ignoreServiceWorker = true) {
    const promises = [this[p.settings].clear()];

    if (!ignoreServiceWorker) {
      promises.push(this[p.server].clearServiceWorker());
    }

    return Promise.all(promises);
  }

  /**
   * Handles hash change event and routes to the right controller.
   *
   * @private
   */
  [p.onHashChanged]() {
    const route = window.location.hash.slice(1);

    for (const routeName of Object.keys(this[p.controllers])) {
      const match = route.match(new RegExp(`^${routeName}$`));
      if (match) {
        this[p.controllers][routeName].main(...match.slice(1));
        break;
      }
    }

    this[p.initHub]();
  }

  [p.subscribeToNotifications]() {
    this[p.server].subscribeToNotifications()
      .catch((err) => {
        console.error('Error while subscribing to notifications:', err);
      });
  }

  /**
   * Will init the `isHub` property, which controls whether the device is
   * a group/family device or a member's personal device.
   *
   * This works by using a specific hash while loading or running the
   * application.
   * Recognised syntaxes are: #hub=1/true/0/false
   */
  [p.initHub]() {
    const match = location.hash.match(/\bhub=(.+)(&|$)/);

    if (match) {
      const matchedValue = match[1];
      const isHub = matchedValue === '1' || matchedValue === 'true';

      console.log('Setting the `isHub` property to ', isHub);
      this[p.settings].isHub = isHub;

      // Redirect to the root of the application.
      location.hash = '';
      location.reload();
    }
  }
}
