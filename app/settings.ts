/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from 'appbit';
import * as fs from 'fs';
import { Message } from '../common/messaging';
import { Settings } from '../common/settings';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings: Settings, onsettingschange: (settings: Settings) => void;

export function initialize(callback: (settings: Settings) => void): void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

export function settingsMessage(message: Message): void {
  console.info(`settings message: ${JSON.stringify(message)}`);
  settings[message.data.key] = message.data.value;
  onsettingschange(settings);
}

// Register for the unload event
me.addEventListener('unload', saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    console.info(`settings could not be loaded`, ex, ex.stack);
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
