import { useState, useEffect, useRef } from 'react';
import { Send, Bot, MessageSquare, Sparkles, X, Search, User as UserIcon } from 'lucide-react';
import { findBestFAQMatch, getFallbackResponse, getPredefinedQuestions } from '../utils/faqMatcher';
import { dummyAuth } from '../auth/dummyAuth';
import { messageEngine } from '../engine/messageEngine';
import { Message } from '../data/messages';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface MessagesProps {
  requireAuth?: (cb: () => void) => void;
  isFloatingMode?: boolean;
  bookedMentorIds?: string[];
  onClose?: () => void;
}

export function Messages({ requireAuth, isFloatingMode = false, onClose }: MessagesProps = {}) {
  const currentUser = dummyAuth.getCurrentUser();
  const userName = currentUser?.name || 'Anonymous';
  
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(!isFloatingMode);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- AI Chat State (Floating Mode) ---
  const [aiChat, setAiChat] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hi! I am your Career AI Assistant. You can ask me quick queries about resumes, career paths, or general advice.', timestamp: new Date() }
  ]);
  
  // --- Real DM State (Full Page Mode) ---
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [inbox, setInbox] = useState(messageEngine.getUserInbox(userName));
  const [currentConversation, setCurrentConversation] = useState<Message[]>([]);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requireAuth) {
      requireAuth(() => {});
    }
  }, []);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChat, currentConversation]);

  // Refresh Inbox
  useEffect(() => {
    if (isFloatingMode) return;
    const interval = setInterval(() => {
      setInbox(messageEngine.getUserInbox(userName));
      if (selectedContact) {
        setCurrentConversation(messageEngine.getConversation(userName, selectedContact));
        messageEngine.markConversationRead(userName, selectedContact);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [userName, isFloatingMode, selectedContact]);

  // Initial load conversation
  useEffect(() => {
    if (selectedContact) {
      setCurrentConversation(messageEngine.getConversation(userName, selectedContact));
      messageEngine.markConversationRead(userName, selectedContact);
    }
  }, [selectedContact, userName]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const executeSend = () => {
      if (isFloatingMode) {
        // Floating mode - always send to AI
        const newMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text: inputValue, timestamp: new Date() };
        setAiChat(prev => [...prev, newMsg]);
        setInputValue('');
        
        setTimeout(() => {
          const faqMatch = findBestFAQMatch(inputValue);
          const aiResponse = faqMatch ? faqMatch.answer : getFallbackResponse();
          setAiChat(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: aiResponse, timestamp: new Date() }]);
        }, 800);
      } else {
        // Full page mode - send real DM
        if (!selectedContact) return;
        messageEngine.sendMessage(userName, selectedContact, inputValue);
        setCurrentConversation(messageEngine.getConversation(userName, selectedContact));
        setInbox(messageEngine.getUserInbox(userName));
        setInputValue('');
      }
    };

    if (requireAuth) {
      requireAuth(executeSend);
    } else {
      executeSend();
    }
  };

  const handlePredefinedQuestion = (question: string) => {
    const userMessage: ChatMessage = { id: Date.now().toString(), sender: 'user', text: question, timestamp: new Date() };
    setAiChat(prev => [...prev, userMessage]);

    setTimeout(() => {
      const faqMatch = findBestFAQMatch(question);
      const aiResponse = faqMatch ? faqMatch.answer : getFallbackResponse();
      setAiChat(prev => [...prev, { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse, timestamp: new Date() }]);
    }, 600);
  };

  if (isFloatingMode) {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform animate-bounce flex items-center justify-center cursor-pointer"
          aria-label="Open AI chat"
        >
          <Bot size={24} />
        </button>

        {isOpen && (
          <div className="fixed bottom-24 right-6 z-40 w-96 h-[600px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-violet-500/20 text-violet-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">Career AI Chatbot</h3>
                  <p className="text-xs text-muted-foreground">Online • Always ready</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiChat.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-xl px-4 py-2 text-sm ${
                      isUser 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-muted border border-border text-foreground rounded-tl-none'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <div className={`text-[10px] mt-1 text-right opacity-60`}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={endOfMessagesRef} />
            </div>

            <div className="p-4 border-t border-border bg-background/50 max-h-72 overflow-y-auto">
              <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                {aiChat.length === 1 ? '📚 Browse FAQ Questions' : '📚 Ask Another Question'}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {getPredefinedQuestions().map((q) => (
                  <button
                    key={q.id}
                    onClick={() => handlePredefinedQuestion(q.question)}
                    className="w-full text-left px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted border border-border text-foreground text-xs leading-snug transition-all hover:border-primary/50 hover:shadow-md cursor-pointer hover:translate-x-1"
                  >
                    <span className="font-medium text-primary/80">Q{q.id}:</span> {q.question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full page mode - DM interface
  const filteredInbox = inbox.filter(item => 
    item.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32 pb-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {onClose && (
          <div className="flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)] animate-slide-up">
          
          {/* Left Sidebar - Inbox */}
          <div className="lg:col-span-1 glass-card rounded-3xl border border-border shadow-xl flex flex-col overflow-hidden">
            <div className="p-5 border-b border-border bg-muted/20 sticky top-0">
              <h2 className="text-xl font-black text-foreground mb-4">Messages</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-background border border-border text-foreground text-sm outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 p-2">
              {filteredInbox.length > 0 ? (
                filteredInbox.map(({ contact, latestMessage, unreadCount }) => {
                  const isSelected = selectedContact === contact;
                  return (
                    <button
                      key={contact}
                      onClick={() => setSelectedContact(contact)}
                      className={`w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl transition-all cursor-pointer ${
                        isSelected ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted/80 text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="relative w-12 h-12 rounded-full bg-secondary/20 flex flex-shrink-0 items-center justify-center text-secondary">
                          <UserIcon size={20} />
                          {unreadCount > 0 && !isSelected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 border-2 border-background" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <h3 className="font-bold truncate text-sm">{contact}</h3>
                          <p className={`text-xs truncate ${isSelected ? 'opacity-90' : 'text-muted-foreground font-medium'} ${unreadCount > 0 && !isSelected ? 'text-foreground font-bold' : ''}`}>
                            {latestMessage.content}
                          </p>
                        </div>
                      </div>
                      <div className={`text-[10px] whitespace-nowrap opacity-60 font-bold ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {new Date(latestMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-12 px-4">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={24} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Book a mentor to start chatting!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Chat Window */}
          <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden shadow-xl border border-border flex flex-col relative bg-card/50">
            {selectedContact ? (
              <>
                <div className="p-4 border-b border-border bg-background/80 backdrop-blur-md flex items-center gap-4 sticky top-0 z-10">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <UserIcon size={18} />
                  </div>
                  <div>
                    <h3 className="font-black text-foreground text-sm">{selectedContact}</h3>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Connection</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
                  {currentConversation.map((msg, index) => {
                    const isUser = msg.senderName === userName;
                    const showDate = index === 0 || new Date(msg.timestamp).toDateString() !== new Date(currentConversation[index - 1].timestamp).toDateString();
                    
                    return (
                      <div key={msg.id} className="flex flex-col">
                        {showDate && (
                          <div className="flex justify-center mb-6 mt-2">
                            <span className="px-3 py-1 bg-muted/50 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest backdrop-blur-md border border-border">
                              {new Date(msg.timestamp).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] group flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                            <div className={`relative px-5 py-3 text-sm leading-relaxed shadow-sm ${
                              isUser 
                                ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' 
                                : 'bg-muted border border-border text-foreground rounded-2xl rounded-tl-sm'
                            }`}>
                              <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            <div className={`text-[10px] font-bold mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {isUser && msg.read && <span className="ml-1 text-emerald-500">✓✓</span>}
                              {isUser && !msg.read && <span className="ml-1 opacity-50">✓</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={endOfMessagesRef} />
                </div>

                <div className="p-4 border-t border-border bg-background/80 backdrop-blur-md">
                  <div className="relative flex items-end gap-2 bg-muted/40 p-2 rounded-2xl border border-border focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type your message..."
                      className="flex-1 max-h-32 min-h-10 bg-transparent resize-none text-sm text-foreground placeholder:text-muted-foreground outline-none py-2 px-3"
                      rows={1}
                    />
                    <button 
                      onClick={handleSend}
                      disabled={!inputValue.trim()}
                      className="p-3 mb-0.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:scale-95 transition-all shadow-md cursor-pointer flex-shrink-0"
                    >
                      <Send size={16} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-60">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
                  <MessageSquare size={48} className="text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-black text-foreground mb-2">Your Messages</h3>
                <p className="text-sm font-medium text-muted-foreground text-center max-w-sm">
                  Select a conversation from the sidebar to view your message history and continue chatting.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
