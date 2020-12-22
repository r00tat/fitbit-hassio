export interface MessagingEvent extends Event {
  data: Message;
}

export interface Message {
  type: 'settings' | 'request' | 'response';
  data: any;
}
