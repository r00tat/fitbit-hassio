/*
  Responsible for loading, applying and saving settings.
  Requires companion/simple/companion-settings.js
  Callback should be used to update your UI.
*/
import { me } from 'appbit';
import { me as device } from 'device';
import * as fs from 'fs';
import * as messaging from 'messaging';
import { Settings } from '../common/settings';

const SETTINGS_TYPE = 'cbor';
const SETTINGS_FILE = 'settings.cbor';

let settings: Settings, onsettingschange: (settings: Settings) => void;

export function initialize(callback: (settings: Settings) => void): void {
  settings = loadSettings();
  onsettingschange = callback;
  onsettingschange(settings);
}

// Received message containing settings data
messaging.peerSocket.addEventListener('message', (evt: MessageEvent) => {
  settings[evt.data.key] = evt.data.value;
  onsettingschange(settings);
});

// Register for the unload event
me.addEventListener('unload', saveSettings);

// Load settings from filesystem
function loadSettings() {
  try {
    return fs.readFileSync(SETTINGS_FILE, SETTINGS_TYPE);
  } catch (ex) {
    return {};
  }
}

// Save settings to the filesystem
function saveSettings() {
  fs.writeFileSync(SETTINGS_FILE, settings, SETTINGS_TYPE);
}
