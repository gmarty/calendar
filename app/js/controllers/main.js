import BaseController from './base';
import UsersController from './users';
import RemindersController from './reminders';
import SpeechController from '../lib/speech-controller';

import React from 'components/react';
import ReactDOM from 'components/react-dom';
import Microphone from '../views/microphone';

const p = Object.freeze({
  controllers: Symbol('controllers'),
  onHashChanged: Symbol('onHashChanged'),
  speechController: Symbol('speechController'),
});

export default class MainController extends BaseController {
  constructor() {
    super();

    const mountNode = document.querySelector('.app-view-container');
    const speechController = new SpeechController();
    const options = { mountNode, speechController };

    const usersController = new UsersController(options);
    const remindersController = new RemindersController(options);

    this[p.controllers] = {
      '': usersController,
      'users/(.+)': usersController,
      'reminders': remindersController,
    };

    this[p.speechController] = speechController;

    window.addEventListener('hashchange', this[p.onHashChanged].bind(this));
  }

  main() {
    if (screen && 'orientation' in screen && 'lock' in screen.orientation) {
      screen.orientation.lock('landscape')
        .catch((e) => {
          console.error(e);
        });
    }

    this[p.speechController].start()
      .then(() => {
        console.log('Speech controller started');
      });

    location.hash = '';
    setTimeout(() => {
      //location.hash = 'users/login';
      location.hash = 'reminders';
    }, 16);

    ReactDOM.render(
      React.createElement(Microphone, {
        speechController: this[p.speechController],
      }), document.querySelector('.microphone')
    );
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
  }
}
