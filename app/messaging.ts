import * as messaging from 'messaging';
import { Message, MessagingEvent } from '../common/messaging';

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
