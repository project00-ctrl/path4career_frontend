/**
 * Dummy Authentication System
 * Role-based user and mentor credentials
 */

export type UserRole = 'user' | 'mentor' | 'admin';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  mentorId?: string; // if role is 'mentor'
}

export const DUMMY_USERS: User[] = [
  {
    id: 'user1',
    email: 'student@path4career.com',
    password: 'student123',
    name: 'Rahul Kumar',
    role: 'user',
  },
  {
    id: 'user2',
    email: 'user@path4career.com',
    password: 'user123',
    name: 'Priya Sharma',
    role: 'user',
  },
  {
    id: 'mentor_user1',
    email: 'mentor.ai@path4career.com',
    password: 'mentor123',
    name: 'Arjun Mehta',
    role: 'mentor',
    mentorId: 'mentor1',
  },
  {
    id: 'mentor_user2',
    email: 'mentor.pm@path4career.com',
    password: 'mentor123',
    name: 'Priya Shah',
    role: 'mentor',
    mentorId: 'mentor2',
  },
  {
    id: 'mentor_user3',
    email: 'mentor.fullstack@path4career.com',
    password: 'mentor123',
    name: 'Rahoul Kumar',
    role: 'mentor',
    mentorId: 'mentor3',
  },
];

export const AuthService = {
  // Login
  login: (email: string, password: string): { user: User; token: string } | null => {
    const user = DUMMY_USERS.find(u => u.email === email && u.password === password);
    if (!user) return null;

    // Generate dummy JWT token
    const token = btoa(JSON.stringify({ userId: user.id, email: user.email, role: user.role }));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('current_user', JSON.stringify(user));

    return { user, token };
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('current_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },

  // Get current user role
  getUserRole: (): UserRole | null => {
    const user = AuthService.getCurrentUser();
    return user ? user.role : null;
  },

  // Get user by ID
  getUserById: (id: string): User | undefined => {
    return DUMMY_USERS.find(u => u.id === id);
  },

  // Get user by email
  getUserByEmail: (email: string): User | undefined => {
    return DUMMY_USERS.find(u => u.email === email);
  },

  // Check if user is mentor
  isMentor: (): boolean => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'mentor';
  },

  // Get mentor ID for current mentor user
  getCurrentMentorId: (): string | null => {
    const user = AuthService.getCurrentUser();
    return user?.mentorId || null;
  },
};
