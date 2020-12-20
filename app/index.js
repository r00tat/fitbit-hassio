import * as settings from './settings';

console.log('Hello world!');

let settings = {};

function settingsChanged(settings) {
  settings = settings;
  console.info(`new settings: ${JSON.stringify(settings)}`);
}

settings.initialize(settingsChanged);
