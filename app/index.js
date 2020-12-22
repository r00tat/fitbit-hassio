import { initialize as initializeSettings } from './settings';
import { setupList } from './list';

let settings = {};

function settingsChanged(newSettings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
  setupList(settings.scripts, onClick);
}

function onClick(script) {}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
} catch (err) {
  console.error('Failed to initialize', err);
}
