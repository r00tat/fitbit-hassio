import { me as companion } from 'companion';
import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
import { Message } from '../common/messaging';

if (!companion.permissions.granted('access_internet')) {
  console.error("We're not allowed to access the internet!");
}

function initialize() {
  console.log('Hello world!');
  settingsStorage.addEventListener('change', (evt) => {
    if (evt.oldValue !== evt.newValue) {
      sendValue(evt.key, evt.newValue);
    }
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
  sendData({ ...data, type: 'settings' });
}

function sendData(data: Message) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}

initialize();
