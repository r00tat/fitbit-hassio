import { initialize as initializeSettings } from './settings';
import { setupList } from './list';

let settings = {};

function settingsChanged(newSettings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
  setupList();
} catch (err) {
  console.error('Failed to initialize', err);
}
