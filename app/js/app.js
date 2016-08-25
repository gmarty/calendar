import Analytics from './lib/analytics';
import MainController from './controllers/main';

new Analytics();
const mainController = new MainController();
window.app = mainController;
mainController.main();
