import Settings from './lib/common/settings';
import Analytics from './lib/analytics';
import MainController from './controllers/main';

const settings = new Settings();
const analytics = new Analytics({ settings });
const mainController = new MainController({ settings, analytics });

mainController.main();

window.app = mainController;
