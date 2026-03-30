/**
 * Booking Data Structure
 * Manages mentor booking requests, approvals, conversations, and user notifications.
 */

export type BookingStatus = 'pending' | 'approved' | 'rejected' | 'completed';

export interface Booking {
  id: string;
  mentorId: string;
  userId: string;
  userName: string;
  slot: string;
  topic: string;
  status: BookingStatus;
  createdAt: Date;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface Conversation {
  id: string;
  mentorId: string;
  userId: string;
  mentorName: string;
  userName: string;
  bookingId: string;
  messages: Message[];
  createdAt: Date;
  lastMessageAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'mentor';
  text: string;
  timestamp: Date;
}

export interface UserNotification {
  id: string;
  userId: string;
  type: 'approved' | 'rejected';
  mentorName: string;
  slot: string;
  rejectionReason?: string;
  read: boolean;
  createdAt: Date;
}

// In-memory storage (in production this would be a database)
let bookings: Booking[] = [];
let conversations: Conversation[] = [];
let notifications: UserNotification[] = [];

// ── Booking Service ─────────────────────────────────────────────────────────

export const BookingService = {
  createBooking: (
    mentorId: string,
    userId: string,
    userName: string,
    slot: string,
    topic: string
  ): Booking => {
    const booking: Booking = {
      id: `booking_${Date.now()}`,
      mentorId,
      userId,
      userName,
      slot,
      topic,
      status: 'pending',
      createdAt: new Date(),
    };
    bookings.push(booking);
    return booking;
  },

  getBooking: (id: string): Booking | undefined => bookings.find(b => b.id === id),

  getMentorBookings: (mentorId: string): Booking[] =>
    bookings.filter(b => b.mentorId === mentorId),

  getUserBookings: (userId: string): Booking[] =>
    bookings.filter(b => b.userId === userId),

  /** Approve a booking, create a conversation, and queue a user notification.  */
  approveBooking: (bookingId: string, mentorName: string = 'Your Mentor'): Booking | null => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'approved';
      booking.approvedAt = new Date();

      // Open the DM channel
      ConversationService.createConversation(
        booking.mentorId,
        booking.userId,
        mentorName,
        booking.userName,
        bookingId
      );

      // Notify user
      notifications.push({
        id: `notif_${Date.now()}`,
        userId: booking.userId,
        type: 'approved',
        mentorName,
        slot: booking.slot,
        read: false,
        createdAt: new Date(),
      });

      return booking;
    }
    return null;
  },

  /** Reject a booking and queue a rejection notification for the user. */
  rejectBooking: (
    bookingId: string,
    reason: string,
    mentorName: string = 'Your Mentor'
  ): Booking | null => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'rejected';
      booking.rejectionReason = reason;

      notifications.push({
        id: `notif_${Date.now()}`,
        userId: booking.userId,
        type: 'rejected',
        mentorName,
        slot: booking.slot,
        rejectionReason: reason || 'Not specified',
        read: false,
        createdAt: new Date(),
      });

      return booking;
    }
    return null;
  },

  getAllBookings: (): Booking[] => bookings,
  reset: () => { bookings = []; },
};

// ── Conversation Service ────────────────────────────────────────────────────

export const ConversationService = {
  createConversation: (
    mentorId: string,
    userId: string,
    mentorName: string,
    userName: string,
    bookingId: string
  ): Conversation => {
    const existingConv = conversations.find(
      c => c.mentorId === mentorId && c.userId === userId
    );
    if (existingConv) return existingConv;

    const conversation: Conversation = {
      id: `conv_${Date.now()}`,
      mentorId,
      userId,
      mentorName,
      userName,
      bookingId,
      messages: [],
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };
    conversations.push(conversation);
    return conversation;
  },

  getConversation: (id: string): Conversation | undefined =>
    conversations.find(c => c.id === id),

  getUserConversations: (userId: string): Conversation[] =>
    conversations.filter(c => c.userId === userId),

  getMentorConversations: (mentorId: string): Conversation[] =>
    conversations.filter(c => c.mentorId === mentorId),

  getConversationBetween: (mentorId: string, userId: string): Conversation | undefined =>
    conversations.find(c => c.mentorId === mentorId && c.userId === userId),

  sendMessage: (
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'user' | 'mentor',
    text: string
  ): Message | null => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return null;

    const message: Message = {
      id: `msg_${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      text,
      timestamp: new Date(),
    };
    conversation.messages.push(message);
    conversation.lastMessageAt = new Date();
    return message;
  },

  getAllConversations: (): Conversation[] => conversations,
  reset: () => { conversations = []; },
};

// ── Notification Service ────────────────────────────────────────────────────

export const NotificationService = {
  /** Return all unread notifications for this user (does NOT mark them read). */
  getUnreadForUser: (userId: string): UserNotification[] =>
    notifications.filter(n => n.userId === userId && !n.read),

  markAsRead: (notifId: string): void => {
    const n = notifications.find(n => n.id === notifId);
    if (n) n.read = true;
  },

  markAllReadForUser: (userId: string): void => {
    notifications.filter(n => n.userId === userId).forEach(n => { n.read = true; });
  },

  reset: () => { notifications = []; },
};
