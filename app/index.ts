import { Script, Settings } from '../common/settings';
import { setupList } from './list';
import { registerHandler, sendData } from '../common/messaging';
import { initialize as initializeSettings, settingsMessage } from './settings';
import document from 'document';

let settings: Settings = {};
let scriptToCall: Script;

function settingsChanged(newSettings: Settings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
  console.info(`new scripts: ${JSON.stringify(newSettings.scripts)}`);
  setupList(settings.scripts, onScriptClick);
}

const confirmScript = (yes?: boolean) => () => {
  console.info(
    `confirmed ${yes ? 'true' : 'false'} script ${scriptToCall.name}`
  );
  (document as any).replaceSync(`./resources/index.gui`);
  if (yes) {
    sendData({
      type: 'request',
      data: scriptToCall,
    });
  }
  setupList(settings.scripts, onScriptClick);
};

function onScriptClick(script: Script) {
  try {
    console.info(`clicked on script ${JSON.stringify(script)}`);
    scriptToCall = script;

    (document as any).replaceSync(`./resources/confirm.gui`);
    // const buttonYes = document.getElementById('button-yes');
    // console.info(`button yes: ${buttonYes.getAttribute('id')}`);
    document.getElementById('confirm-text').text = `run ${
      scriptToCall.title || scriptToCall.name
    }?`.substr(0, 40);
    document
      .getElementById('button-yes')
      .getElementById('touch')
      .addEventListener('click', confirmScript(true));
    document
      .getElementById('button-no')
      .getElementById('touch')
      .addEventListener('click', confirmScript(false));
  } catch (err) {
    console.error(`failed to click on script ${err}\n${err.stack}`);
  }
}

try {
  console.log('Hello world!');

  initializeSettings(settingsChanged);
  registerHandler('settings', settingsMessage);
  registerHandler('response', (message) => {
    console.info(`got response: ${JSON.stringify(message.data)}`);
  });
} catch (err) {
  console.error('Failed to initialize', err, err.stack);
}
