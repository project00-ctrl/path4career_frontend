/**
 * Unified Auth System
 * Merges old dummyAuth API with the extended DUMMY_USERS dataset.
 * All credentials from dummyUsers.ts are now supported here.
 */



export type UserRole = 'user' | 'mentor' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isAuthenticated: boolean;
  mentorId?: string; 
}

const AUTH_KEY = 'AUTH_TOKEN'; 
const SESSION_KEY = 'p4c_auth_session'; 


export const dummyAuth = {
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): AuthUser | null => {
    const token = localStorage.getItem(AUTH_KEY);
    const session = localStorage.getItem(SESSION_KEY);
    
    if (!token) {
      if (session) localStorage.removeItem(SESSION_KEY);
      return null;
    }

    if (session) {
      try {
        return JSON.parse(session);
      } catch {
        return null;
      }
    }
    return null;
  },

  syncWithGlobalToken: async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem(AUTH_KEY);
    if (!token) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    try {
      const resp = await fetch('https://path4career-backend.onrender.com/api/v1/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resp.ok) {
        const profile = await resp.json();
        const user: AuthUser = {
          id: profile.id || 'usr_' + Math.random().toString(36).slice(2),
          email: profile.email || '',
          name: profile.fullName || profile.username || 'User',
          role: (profile.role === 'mentor' ? 'mentor' : 'user') as UserRole,
          isAuthenticated: true
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
      } else {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
    } catch (err) {
      console.warn('Auth sync failed:', err);
      return null;
    }
  },

  checkIsAuthenticated: (): boolean => {
    const user = dummyAuth.getCurrentUser();
    return !!user && user.isAuthenticated;
  },
};
