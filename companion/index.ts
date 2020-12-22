import { me as companion } from 'companion';
import { settingsStorage } from 'settings';
import { sendData, registerHandler, Message } from '../common/messaging';
import { Hassio } from './hassio';

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

initialize();
