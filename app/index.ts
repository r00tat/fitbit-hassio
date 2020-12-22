import { Script, Settings } from '../common/settings';
import { setupList } from './list';
import { registerHandler } from '../common/messaging';
import { initialize as initializeSettings, settingsMessage } from './settings';

let settings: Settings = {};

function settingsChanged(newSettings: Settings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
  console.info(`new scripts: ${JSON.stringify(newSettings.scripts)}`);
  setupList(settings.scripts, onClick);
}

function onClick(script: Script) {
  console.info(`clicked on script ${JSON.stringify(script)}`);
}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
  registerHandler('settings', settingsMessage);
  registerHandler('response', (message) => {
    console.info(`got response: ${JSON.stringify(message.data)}`);
  });
} catch (err) {
  console.error('Failed to initialize', err);
}
