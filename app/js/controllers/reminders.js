import React from 'components/react';
import ReactDOM from 'components/react-dom';

import BaseController from './base';

import Reminders from '../views/reminders';
import FullScreen from '../views/full-screen';

export default class RemindersController extends BaseController {
  main() {
    ReactDOM.render(
      React.createElement(Reminders, {
        speechController: this.speechController,
        server: this.server,
        analytics: this.analytics,
      }), this.mountNode
    );

    ReactDOM.render(
      React.createElement(FullScreen), document.querySelector('.full-screen')
    );
  }
}
