import { initialize as initializeSettings } from './settings';

let settings = {};

function settingsChanged(settings) {
  settings = settings;
  console.info(`new settings: ${JSON.stringify(settings)}`);
}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
} catch (err) {
  console.error('Failed to initialize', err);
}
