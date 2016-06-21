import React from 'components/react';
import ReactDOM from 'components/react-dom';

import BaseController from './base';
import Reminders from '../views/reminders';

export default class RemindersController extends BaseController {
  main() {
    ReactDOM.render(
      React.createElement(Reminders, {}), this.mountNode
    );
  }
}
