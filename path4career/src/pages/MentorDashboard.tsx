import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { AuthService } from '../auth/dummyUsers';
import { BookingService } from '../data/bookings';
import { ConversationService } from '../data/bookings';
import { getMentorById } from '../data/mentors';
import { Modal } from '../components/ui/Modal';
import { cn } from '../utils/cn';

interface RejectionFormState {
  bookingId: string | null;
  reason: string;
}

export function MentorDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'mentees' | 'messages'>('pending');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionForm, setRejectionForm] = useState<RejectionFormState>({ bookingId: null, reason: '' });
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<{ [key: string]: string }>({});
  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);

  const currentUser = AuthService.getCurrentUser();
  const currentMentorId = AuthService.getCurrentMentorId();
  const mentorData = currentMentorId ? getMentorById(currentMentorId) : null;

  // Redirect if not logged in as mentor
  useEffect(() => {
    if (!AuthService.isAuthenticated() || !AuthService.isMentor()) {
      window.location.href = '/';
    }
  }, []);

  const allBookings = currentMentorId ? BookingService.getMentorBookings(currentMentorId) : [];
  const pendingBookings = allBookings.filter(b => b.status === 'pending');
  const approvedBookings = allBookings.filter(b => b.status === 'approved');
  const conversations = currentMentorId ? ConversationService.getAllConversations().filter(
    c => c.mentorId === currentMentorId
  ) : [];

  // Get unique mentees from conversations
  const mentees = [...new Set(conversations.map(c => ({ id: c.userId, name: c.userName })))];

  const handleApprove = async (bookingId: string) => {
    setApprovingId(bookingId);
    setTimeout(() => {
      BookingService.approveBooking(bookingId);
      setApprovingId(null);
    }, 600);
  };

  const handleRejectClick = (bookingId: string) => {
    setRejectionForm({ bookingId, reason: '' });
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = () => {
    if (rejectionForm.bookingId) {
      setRejectingId(rejectionForm.bookingId);
      setTimeout(() => {
        BookingService.rejectBooking(rejectionForm.bookingId!, rejectionForm.reason || 'Not specified');
        setRejectingId(null);
        setShowRejectionModal(false);
        setRejectionForm({ bookingId: null, reason: '' });
      }, 600);
    }
  };

  const handleSendMessage = (conversationId: string) => {
    const text = messageText[conversationId]?.trim();
    if (!text) return;

    setSendingMessageId(conversationId);
    setTimeout(() => {
      ConversationService.sendMessage(conversationId, currentUser?.id || 'mentor', currentUser?.name || 'Mentor', 'mentor', text);
      setMessageText({ ...messageText, [conversationId]: '' });
      setSendingMessageId(null);
    }, 300);
  };

  const stats = [
    { label: 'Pending Requests', value: pendingBookings.length.toString(), color: 'text-amber-400' },
    { label: 'Approved Sessions', value: approvedBookings.length.toString(), color: 'text-emerald-400' },
    { label: 'Total Mentees', value: mentees.length.toString(), color: 'text-primary' },
    { label: 'Messages', value: conversations.length.toString(), color: 'text-secondary' },
  ];

  const tabButtons = [
    { id: 'pending' as const, label: 'Pending Requests', count: pendingBookings.length },
    { id: 'approved' as const, label: 'Approved Sessions', count: approvedBookings.length },
    { id: 'mentees' as const, label: 'Mentees', count: mentees.length },
    { id: 'messages' as const, label: 'Messages', count: conversations.length },
  ];

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-2">
              Mentor <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Welcome back, {currentUser?.name}</p>
          </div>
          {mentorData && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20">
              <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
                ⭐
              </div>
              <div>
                <div className="text-sm font-bold text-secondary">{mentorData.rating} Rating</div>
                <div className="text-xs text-muted-foreground">{mentees.length}+ mentees</div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-4 animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {tabButtons.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-3 font-bold whitespace-nowrap transition-all border-b-2 -mb-[2px]',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label} {tab.count > 0 && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{tab.count}</span>}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {/* Pending Requests Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingBookings.length > 0 ? (
                pendingBookings.map(booking => (
                  <div key={booking.id} className="glass-card rounded-2xl p-6 space-y-4 animate-slide-up">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-bold text-lg">{booking.userName}</h3>
                        <p className="text-sm text-muted-foreground">Topic: {booking.topic}</p>
                        <p className="text-sm text-muted-foreground mt-2">Slot: {booking.slot}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(booking.id)}
                          disabled={approvingId === booking.id}
                          className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-bold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          {approvingId === booking.id ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                            </span>
                          ) : (
                            'Approve'
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectClick(booking.id)}
                          disabled={rejectingId === booking.id}
                          className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-500 text-sm font-bold hover:bg-rose-500/20 transition-all disabled:opacity-50"
                        >
                          {rejectingId === booking.id ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                            </span>
                          ) : (
                            'Reject'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No pending requests</p>
                </div>
              )}
            </div>
          )}

          {/* Approved Sessions Tab */}
          {activeTab === 'approved' && (
            <div className="space-y-4">
              {approvedBookings.length > 0 ? (
                approvedBookings.map(booking => (
                  <div key={booking.id} className="glass-card rounded-2xl p-6 space-y-3 animate-slide-up">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <CheckCircle2 size={20} />
                          </div>
                          <h3 className="font-bold text-lg">{booking.userName}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">Topic: {booking.topic}</p>
                        <p className="text-sm text-muted-foreground">Slot: {booking.slot}</p>
                        <p className="text-xs text-emerald-500 font-bold mt-2">Approved {new Date(booking.approvedAt || '').toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <CheckCircle2 size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No approved sessions yet</p>
                </div>
              )}
            </div>
          )}

          {/* Mentees Tab */}
          {activeTab === 'mentees' && (
            <div className="space-y-4">
              {mentees.length > 0 ? (
                mentees.map(mentee => (
                  <div key={mentee.id} className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4 animate-slide-up hover:scale-[1.01] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {mentee.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{mentee.name}</h3>
                        <p className="text-xs text-muted-foreground">Active mentee</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                      Send Message
                    </button>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No mentees yet</p>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {conversations.length > 0 ? (
                conversations.map(conv => (
                  <div key={conv.id} className="glass-card rounded-2xl p-6 space-y-4 animate-slide-up">
                    <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {conv.userName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold">{conv.userName}</h3>
                          <p className="text-xs text-muted-foreground">
                            Last message: {new Date(conv.lastMessageAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Messages Preview */}
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {conv.messages.slice(-3).map(msg => (
                        <div
                          key={msg.id}
                          className={cn(
                            'p-3 rounded-lg text-sm',
                            msg.senderRole === 'mentor'
                              ? 'bg-primary/10 text-primary ml-8'
                              : 'bg-muted text-foreground mr-8'
                          )}
                        >
                          <p className="font-bold text-xs mb-1">{msg.senderName}</p>
                          <p>{msg.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageText[conv.id] || ''}
                        onChange={e => setMessageText({ ...messageText, [conv.id]: e.target.value })}
                        onKeyPress={e => e.key === 'Enter' && handleSendMessage(conv.id)}
                        className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        onClick={() => handleSendMessage(conv.id)}
                        disabled={sendingMessageId === conv.id}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
                      >
                        {sendingMessageId === conv.id ? (
                          <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="glass-card rounded-3xl p-12 text-center">
                  <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-muted-foreground font-medium">No conversations yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectionModal}
        title="Reject Booking Request"
        onClose={() => setShowRejectionModal(false)}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Reason for Rejection</label>
            <textarea
              value={rejectionForm.reason}
              onChange={e => setRejectionForm({ ...rejectionForm, reason: e.target.value })}
              placeholder="Explain why you're rejecting this booking (optional)"
              className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={4}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowRejectionModal(false)}
              className="px-4 py-2 rounded-lg bg-muted text-foreground font-bold hover:bg-muted/80 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleRejectSubmit}
              className="px-4 py-2 rounded-lg bg-rose-500 text-white font-bold hover:bg-rose-600 transition-all"
            >
              Confirm Rejection
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
