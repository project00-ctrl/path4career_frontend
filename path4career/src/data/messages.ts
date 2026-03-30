export interface Message {
  id: string;
  senderName: string;
  receiverName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const MESSAGES_KEY = 'p4c_direct_messages';

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    senderName: 'System',
    receiverName: 'John User',
    content: 'Welcome to your mentorship dashboard! You can book a mentor to start collaborating.',
    timestamp: new Date().toISOString(),
    read: false
  }
];

export const messageData = {
  getMessages: (): Message[] => {
    const saved = localStorage.getItem(MESSAGES_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_MESSAGES;
      }
    }
    return INITIAL_MESSAGES;
  },

  saveMessages: (messages: Message[]) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  },
  
  addMessage: (senderName: string, receiverName: string, content: string): Message => {
    const messages = messageData.getMessages();
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      senderName,
      receiverName,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    messageData.saveMessages([...messages, newMessage]);
    return newMessage;
  }
};
