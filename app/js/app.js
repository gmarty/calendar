import Settings from './lib/common/settings';
import Analytics from './controllers/analytics';
import MainController from './controllers/main';

const options = { settings: new Settings() };

new Analytics(options);
const mainController = new MainController(options);
mainController.main();

window.app = mainController;
