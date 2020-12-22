import { initialize as initializeSettings } from './settings';
import { setupList } from './list';
import { Settings } from '../common/settings';

let settings: Settings = {};

function settingsChanged(newSettings: Settings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
  setupList(settings.scripts, onClick);
}

function onClick(script) {
  console.info(`clicked on script ${JSON.stringify(script)}`);
}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
} catch (err) {
  console.error('Failed to initialize', err);
}
