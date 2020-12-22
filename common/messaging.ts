import * as messaging from 'messaging';

export interface MessagingEvent extends Event {
  data: Message;
}

export interface Message {
  type: 'settings' | 'request' | 'response';
  data: any;
}

messaging.peerSocket.addEventListener('open', () => {
  console.log('Ready to send or receive messages');
});

messaging.peerSocket.addEventListener('error', (err: any) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

const handlers: { [key: string]: (message: Message) => void } = {};

// Received message containing settings data
messaging.peerSocket.addEventListener('message', (evt: MessagingEvent) => {
  const message: Message = evt.data;
  console.info(`got message: ${JSON.stringify(message)}`);
  if (handlers[message.type]) {
    handlers[message.type](message);
  }
});

export const registerHandler = (
  type: string,
  handler: (message: Message) => void
): void => {
  handlers[type] = handler;
};

export function sendData(data: Message) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    console.info(`sending to peer: ${JSON.stringify(data)}`);
    messaging.peerSocket.send(data);
  } else {
    console.log('No peerSocket connection');
  }
}
