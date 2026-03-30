/**
 * Mentor Marketplace — Full Featured Page
 * Browse & book mentors; integrates with BookingService + dummyAuth + toast notifications.
 */

import { useState } from 'react';
import {
  Star, Clock, Zap, Calendar, Search, Filter, BookOpen,
  Users, CheckCircle2, ChevronRight, X, Award
} from 'lucide-react';
import { MENTORS } from '../data/mentors';
import { BookingService } from '../data/bookings';
import { dummyAuth } from '../auth/dummyAuth';
import { showToast } from '../components/NotificationToast';
import { Modal } from '../components/ui/Modal';
import type { Mentor } from '../data/mentors';
import type { ModuleId } from '../components/Sidebar';

// Session type labels per specialization
const SESSION_TYPE_MAP: Record<string, string> = {
  'AI / ML': 'Tech Guidance',
  'Product Management': 'Career Advice',
  'Full Stack Development': 'Tech Guidance',
  'Data Science': 'Tech Guidance',
  'Cybersecurity': 'Tech Guidance',
  'DevOps & Cloud': 'Tech Guidance',
};

const SPECIALIZATION_COLORS: Record<string, string> = {
  'AI / ML': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  'Product Management': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'Full Stack Development': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  'Data Science': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'Cybersecurity': 'text-rose-400 bg-rose-400/10 border-rose-400/20',
  'DevOps & Cloud': 'text-orange-400 bg-orange-400/10 border-orange-400/20',
};

const AVATAR_EMOJIS: Record<string, string> = {
  mentor1: '🧑‍💻',
  mentor2: '👩‍💼',
  mentor3: '👨‍💻',
  mentor4: '👩‍🔬',
  mentor5: '🧑‍🔒',
  mentor6: '👩‍☁️',
};

interface MentorMarketplaceProps {
  requireAuth?: (cb: () => void) => void;
  bookedMentorIds?: string[];
  onBookMentor?: (mentorId: string) => void;
  onNavigate?: (id: ModuleId) => void;
}

export function MentorMarketplace({
  requireAuth,
  bookedMentorIds = [],
  onBookMentor,
}: MentorMarketplaceProps = {}) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookedIds, setBookedIds] = useState<string[]>(bookedMentorIds);

  const currentUser = dummyAuth.getCurrentUser();
  const isAuthenticated = !!currentUser && currentUser.isAuthenticated;

  const filters = ['All', 'AI/ML', 'Product', 'Full Stack', 'Data Science', 'Cybersecurity', 'DevOps'];

  const filteredMentors = MENTORS.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.specialization.toLowerCase().includes(search.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (activeFilter === 'All') return true;
    return m.specialization.toLowerCase().includes(activeFilter.toLowerCase()) ||
      m.expertise.some(e => e.toLowerCase().includes(activeFilter.toLowerCase()));
  });

  const handleBookClick = (mentor: Mentor) => {
    const doOpen = () => {
      setSelectedMentor(mentor);
      setSelectedSlot(null);
      setTopic('');
    };
    if (!isAuthenticated && requireAuth) {
      requireAuth(doOpen);
    } else {
      doOpen();
    }
  };

  const handleConfirmBooking = () => {
    if (!selectedMentor || !selectedSlot || !topic.trim() || !currentUser) return;

    setIsBooking(true);
    setTimeout(() => {
      BookingService.createBooking(
        selectedMentor.id,
        currentUser.id,
        currentUser.name,
        selectedSlot,
        topic
      );

      const newBookedIds = [...bookedIds, selectedMentor.id];
      setBookedIds(newBookedIds);
      onBookMentor?.(selectedMentor.id);

      showToast({
        type: 'success',
        title: '📅 Booking Request Sent!',
        message: `Your request to ${selectedMentor.name} for "${selectedSlot}" is pending approval.`,
        duration: 6000,
      });

      setIsBooking(false);
      setSelectedMentor(null);
      setSelectedSlot(null);
      setTopic('');
    }, 1000);
  };

  const closeModal = () => {
    setSelectedMentor(null);
    setSelectedSlot(null);
    setTopic('');
  };

  const ratingStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={i < full ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}
      />
    ));
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
            <Users size={14} />
            Mentor Marketplace
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-3">
            Find Your <span className="gradient-text">Perfect Mentor</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Connect with industry professionals for 1:1 career guidance, startup mentoring, and technical expertise.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          {[
            { label: 'Expert Mentors', value: MENTORS.length },
            { label: 'Specializations', value: '6+' },
            { label: 'Sessions Done', value: '1200+' },
          ].map(s => (
            <div key={s.label} className="glass-card rounded-2xl p-3 text-center">
              <div className="text-xl font-black gradient-text">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Search & Filter ──────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, skill, or specialization..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl glass text-foreground placeholder-slate-500 outline-none focus:ring-2 focus:ring-secondary/30 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Filter size={15} className="text-muted-foreground flex-shrink-0" />
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f === activeFilter ? 'All' : f)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-secondary text-white shadow-md shadow-secondary/20'
                    : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Mentor Grid ──────────────────────────────────────── */}
        {filteredMentors.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">No mentors match your search.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredMentors.map((mentor, i) => {
              const isBooked = bookedIds.includes(mentor.id);
              const colorClass = SPECIALIZATION_COLORS[mentor.specialization] ?? 'text-primary bg-primary/10 border-primary/20';
              const sessionType = SESSION_TYPE_MAP[mentor.specialization] ?? 'Career Advice';

              return (
                <div
                  key={mentor.id}
                  className="glass-card rounded-2xl p-6 relative flex flex-col animate-slide-up"
                  style={{ animationDelay: `${0.05 * i}s` }}
                >
                  {/* Booked badge */}
                  {isBooked && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 size={11} />
                      Requested
                    </div>
                  )}

                  {/* Mentor Info */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center text-2xl flex-shrink-0">
                      {AVATAR_EMOJIS[mentor.id] ?? '👤'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground">{mentor.name}</h3>
                      <div className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-lg border text-xs font-semibold ${colorClass}`}>
                        {mentor.specialization}
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">{mentor.bio}</p>

                  {/* Expertise tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {mentor.expertise.slice(0, 3).map(skill => (
                      <span
                        key={skill}
                        className="px-2.5 py-0.5 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground font-medium">
                        +{mentor.expertise.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between py-3 border-t border-border mb-4">
                    <div className="flex items-center gap-1">
                      {ratingStars(mentor.rating)}
                      <span className="text-xs font-bold text-foreground ml-1">{mentor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {mentor.experience}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Zap size={12} />
                      ₹{mentor.hourlyRate}/hr
                    </div>
                  </div>

                  {/* Session type tag */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen size={12} />
                      {sessionType}
                    </span>
                  </div>

                  {/* Book button */}
                  <button
                    onClick={() => handleBookClick(mentor)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isBooked
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-secondary text-white hover:bg-secondary/90 shadow-md shadow-secondary/20 hover:shadow-secondary/30'
                    }`}
                  >
                    {isBooked ? (
                      <>
                        <CheckCircle2 size={15} />
                        Booking Sent
                      </>
                    ) : (
                      <>
                        <Calendar size={15} />
                        Book Session
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Booking Modal ─────────────────────────────────────── */}
      <Modal
        isOpen={!!selectedMentor}
        title={selectedMentor ? `Book Session — ${selectedMentor.name}` : ''}
        onClose={closeModal}
        size="md"
        closeButton
      >
        {selectedMentor && (
          <div className="space-y-5">
            {/* Mentor summary */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/10 flex items-center justify-center text-xl">
                {AVATAR_EMOJIS[selectedMentor.id] ?? '👤'}
              </div>
              <div>
                <p className="font-bold text-foreground">{selectedMentor.name}</p>
                <p className="text-xs text-muted-foreground">{selectedMentor.specialization} · {selectedMentor.experience}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {ratingStars(selectedMentor.rating)}
                  <span className="text-xs text-muted-foreground ml-1">{selectedMentor.rating}</span>
                </div>
              </div>
            </div>

            {/* Slot selection */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Calendar size={15} className="text-secondary" />
                Select Time Slot
              </label>
              <div className="space-y-2">
                {selectedMentor.availableSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full p-3 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer flex items-center justify-between ${
                      selectedSlot === slot
                        ? 'bg-secondary text-white border-secondary shadow-md shadow-secondary/20'
                        : 'bg-muted/30 border-border text-foreground hover:border-secondary/40 hover:bg-muted/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Clock size={14} />
                      {slot}
                    </span>
                    {selectedSlot === slot && <CheckCircle2 size={15} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <BookOpen size={15} className="text-secondary" />
                What would you like to discuss?
              </label>
              <textarea
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Career switch to AI/ML, interview prep, startup advice..."
                className="w-full p-3 rounded-xl bg-muted/30 border border-border text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-secondary/30 transition-all text-sm"
                rows={3}
              />
            </div>

            {/* Rate */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-muted-foreground">
              <Award size={13} className="text-amber-400 flex-shrink-0" />
              Session rate: ₹{selectedMentor.hourlyRate}/hr · Platform fee: 15% commission
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <X size={15} />
                Cancel
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={!selectedSlot || !topic.trim() || isBooking}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-white font-semibold hover:bg-secondary/90 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-secondary/20"
              >
                {isBooking ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Calendar size={15} />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
