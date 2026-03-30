export interface MentorSession {
  id: string;
  mentor: string;
  student: string;
  topic: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const SESSIONS_KEY = 'p4c_mentor_sessions';

const INITIAL_SESSIONS: MentorSession[] = [
  {
    id: '1',
    mentor: 'AI Career Mentor',
    student: 'John User',
    topic: 'AI Career Path Strategy',
    date: '2026-04-10',
    time: '10:00 AM',
    status: 'scheduled'
  },
  {
    id: '2',
    mentor: 'Tech Lead Pro',
    student: 'John User',
    topic: 'System Design Interview',
    date: '2026-04-12',
    time: '02:00 PM',
    status: 'scheduled'
  }
];

export const mentorSessions = {
  getSessions: (): MentorSession[] => {
    const saved = localStorage.getItem(SESSIONS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_SESSIONS;
      }
    }
    return INITIAL_SESSIONS;
  },

  bookSession: (session: Omit<MentorSession, 'id' | 'status'>) => {
    const sessions = mentorSessions.getSessions();
    const newSession: MentorSession = {
      ...session,
      id: Math.random().toString(36).substring(2, 11),
      status: 'scheduled'
    };
    const updated = [newSession, ...sessions];
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updated));
    return newSession;
  },

  getMentorSessions: (mentorName: string): MentorSession[] => {
    return mentorSessions.getSessions().filter(s => s.mentor === mentorName);
  },

  getStudentSessions: (studentName: string): MentorSession[] => {
    return mentorSessions.getSessions().filter(s => s.student === studentName);
  },

  updateSessionStatus: (id: string, status: MentorSession['status']) => {
    const sessions = mentorSessions.getSessions();
    const index = sessions.findIndex(s => s.id === id);
    if (index !== -1) {
      sessions[index].status = status;
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
      return true;
    }
    return false;
  }
};
