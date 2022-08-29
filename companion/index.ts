import { me as companion } from 'companion';
import { settingsStorage } from 'settings';
import { sendData, registerHandler, Message } from '../common/messaging';
import { Hassio } from './hassio';
import { Settings } from '../common/settings';

if (!companion.permissions.granted('access_internet')) {
  console.error("We're not allowed to access the internet!");
}

function initialize() {
  console.log('Starting companion!');
  settingsStorage.addEventListener('change', (evt) => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
  });
  registerHandler('request', hassioRequest);
  registerHandler('appStartup', appStartup);
  registerHandler('hello', async (message: Message) => {
    try {
      const url = JSON.parse(settingsStorage.getItem('url')).name;
      console.info(`say hello: ${JSON.stringify(url)}`);
      const token = JSON.parse(settingsStorage.getItem('token')).name;
      const hass = new Hassio(url, token);
      await hass.hello();
      sendData({
        type: 'status',
        data: { status: 'OK' },
      });
    } catch (err) {
      console.error(`failed to say hello`, err);
      sendData({
        type: 'status',
        data: { status: 'NOTOK' },
      });
    }
  });
}

async function hassioRequest(message: Message) {
  const {
    data: { name, params = '{}' },
  } = message;
  const url = JSON.parse(settingsStorage.getItem('url')).name;
  console.info(`url: ${JSON.stringify(url)}`);
  const token = JSON.parse(settingsStorage.getItem('token')).name;
  const hass = new Hassio(url, token);
  console.info(`calling hassio (${url}) script ${name} with params ${params}`);
  const response = await hass.callService('script', name, params);
  console.info(`hassio response: ${JSON.stringify(response)}`);
  sendData({
    type: response,
    data: response,
  });
}

function sendValue(key: string, val: string) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val),
    });
  }
}

function sendSettingData(data: any) {
  sendData({ data, type: 'settings' });
}

function appStartup(message: Message) {
  console.info(`app has started, sending full settings`);
  const settings: Settings = {};
  ['url', 'token', 'scripts'].forEach((key) => {
    try {
      settings[key] = JSON.parse(settingsStorage.getItem(key));
    } catch (err) {
      console.warn(`failed to parse setting ${key}`, err);
    }
  });
  sendData({
    data: settings,
    type: 'fullSettings',
  });
}

initialize();
