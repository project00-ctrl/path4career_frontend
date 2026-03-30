import { messageData, Message } from '../data/messages';

export const messageEngine = {
  /**
   * Sends a message from sender to receiver.
   */
  sendMessage: (senderName: string, receiverName: string, content: string): Message => {
    return messageData.addMessage(senderName, receiverName, content);
  },

  /**
   * Gets the entire conversation history between two users, sorted chronologically.
   */
  getConversation: (userA: string, userB: string): Message[] => {
    const messages = messageData.getMessages();
    return messages
      .filter(m => 
        (m.senderName === userA && m.receiverName === userB) ||
        (m.senderName === userB && m.receiverName === userA)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  },

  /**
   * Gets all distinct contacts a user has conversed with, along with their latest message.
   */
  getUserInbox: (userName: string) => {
    const messages = messageData.getMessages();
    const conversations = new Map<string, Message>();
    
    messages.forEach(m => {
      if (m.senderName === userName || m.receiverName === userName) {
        const contact = m.senderName === userName ? m.receiverName : m.senderName;
        // Keep the latest message
        const existing = conversations.get(contact);
        if (!existing || new Date(m.timestamp) > new Date(existing.timestamp)) {
          conversations.set(contact, m);
        }
      }
    });

    return Array.from(conversations.entries()).map(([contact, latestMessage]) => ({
      contact,
      latestMessage,
      unreadCount: messageEngine.getUnreadCount(userName, contact)
    })).sort((a, b) => new Date(b.latestMessage.timestamp).getTime() - new Date(a.latestMessage.timestamp).getTime());
  },

  /**
   * Marks all messages from a specific sender as read for the current user.
   */
  markConversationRead: (currentUser: string, senderToMark: string) => {
    const messages = messageData.getMessages();
    let updated = false;
    
    messages.forEach(m => {
      if (m.receiverName === currentUser && m.senderName === senderToMark && !m.read) {
        m.read = true;
        updated = true;
      }
    });

    if (updated) {
      messageData.saveMessages(messages);
    }
  },

  /**
   * Utility to get unread count from a specific contact.
   */
  getUnreadCount: (currentUser: string, senderName: string): number => {
    const messages = messageData.getMessages();
    return messages.filter(m => m.receiverName === currentUser && m.senderName === senderName && !m.read).length;
  },
  
  /**
   * Gets total unread messages across all conversations.
   */
  getTotalUnreadCount: (currentUser: string): number => {
    const messages = messageData.getMessages();
    return messages.filter(m => m.receiverName === currentUser && !m.read).length;
  }
};
