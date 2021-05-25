import document from 'document';
import { registerHandler, sendData } from '../common/messaging';
import { helloWorldScript, Script, Settings } from '../common/settings';
import { setupList } from './list';
import { initialize as initializeSettings, settingsMessage } from './settings';
import { confirm } from './confirm';
import { MyDocument } from './document';

let settings: Settings = {};

async function indexPage() {
  await (document as MyDocument).replace(`./resources/index.view`);
  if (!settings.scripts || settings.scripts.length === 0) {
    settings.scripts = [helloWorldScript];
  }
  setupList(settings.scripts, (script: Script) => {
    confirm(script, confirmScript);
  });
}

async function settingsChanged(newSettings: Settings) {
  settings = newSettings;
  console.info(`new settings: ${JSON.stringify(newSettings)}`);
  console.info(`new scripts: ${JSON.stringify(newSettings.scripts)}`);
  const {
    url: { name: url } = {},
    token: { name: token } = {},
    scripts = [],
  } = settings;
  if (!url || !token || !scripts || scripts.length === 0) {
    console.info(`settings not configured:`);
    console.info(` url: ${url}`);
    console.info(` token: ${token}`);
    console.info(` scripts: ${JSON.stringify(scripts)}`);
    await (document as MyDocument).replace(`./resources/message.view`);
    console.log(`  document replaced`);
    document.getElementById(
      'message-text'
    ).text = `Settings are not configured. Please setup Home Assistant Settings to use this app.`;
    document.getElementById('touch').addEventListener('click', () => {
      indexPage();
    });
  } else {
    indexPage();
  }
}

const confirmScript = (script: Script, yes?: boolean) => {
  console.info(`confirmed ${yes ? 'true' : 'false'} script ${script.name}`);
  if (yes) {
    sendData({
      type: 'request',
      data: script,
    });
  }
  indexPage();
};

try {
  console.log('Hello world!');

  console.log(`init`);
  initializeSettings(settingsChanged);
  console.log(`register handler settings`);
  registerHandler('settings', settingsMessage);
  console.log(`register handler response`);
  registerHandler('response', (message) => {
    console.info(`got response: ${JSON.stringify(message.data)}`);
  });
  console.log(`register handler fullsettings`);
  registerHandler('fullSettings', (message) => {
    settings = message.data;
    console.info(
      `got full settings from companion: ${JSON.stringify(message.data)}`
    );
    settingsChanged(message.data);
  });
  console.log(`settimeout`);
  setTimeout(() => {
    console.info(`sending app Startup to companion`);
    sendData({
      type: 'appStartup',
      data: {},
    });
  }, 500);
} catch (err) {
  console.error('Failed to initialize', err, err.stack);
}
