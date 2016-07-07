import React from 'components/react';
import ReactDOM from 'components/react-dom';

import BaseController from './base';

import Reminders from '../views/reminders';
import Microphone from '../views/microphone';

export default class RemindersController extends BaseController {
  main() {
    ReactDOM.render(
      React.createElement(Reminders, {
        speechController: this.speechController,
        server: this.server,
      }), this.mountNode
    );

    ReactDOM.render(
      React.createElement(Microphone, {
        speechController: this.speechController,
        server: this.server,
      }), document.querySelector('.microphone')
    );
  }
}
