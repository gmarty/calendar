import BaseController from './base';
import UsersController from './users';

const p = Object.freeze({
  controllers: Symbol('controllers'),
  onHashChanged: Symbol('onHashChanged'),
});

export default class MainController extends BaseController {
  constructor() {
    super();

    const mountNode = document.querySelector('.app-view-container');
    const options = { mountNode };

    const usersController = new UsersController(options);

    this[p.controllers] = {
      '': usersController,
      'users/(.+)': usersController,
    };

    window.addEventListener('hashchange', this[p.onHashChanged].bind(this));
  }

  main() {
    if (screen && 'orientation' in screen && 'lock' in screen.orientation) {
      screen.orientation.lock('landscape')
        .catch((e) => {
          console.error(e);
        });
    }

    location.hash = '';
    location.hash = 'users/login';
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
