/**
 * Mentor Data Structure
 * Dummy dataset for mentor marketplace
 */

export interface Mentor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  expertise: string[];
  availableSlots: string[];
  rating: number;
  hourlyRate: number;
  bio: string;
  image?: string;
}

export const MENTORS: Mentor[] = [
  {
    id: 'mentor1',
    name: 'Arjun Mehta',
    specialization: 'AI / ML',
    experience: '10 years',
    expertise: ['Machine Learning', 'Data Science', 'Python', 'Deep Learning'],
    availableSlots: ['Monday 10:00 AM', 'Wednesday 3:00 PM', 'Friday 2:00 PM'],
    rating: 4.8,
    hourlyRate: 2000,
    bio: 'Senior AI/ML Engineer at leading tech company with expertise in building production ML systems.',
  },
  {
    id: 'mentor2',
    name: 'Priya Shah',
    specialization: 'Product Management',
    experience: '8 years',
    expertise: ['Product Strategy', 'Startup Growth', 'User Research', 'Analytics'],
    availableSlots: ['Tuesday 2:00 PM', 'Friday 11:00 AM', 'Saturday 10:00 AM'],
    rating: 4.6,
    hourlyRate: 1800,
    bio: 'Product Manager who has scaled multiple products from 0 to 1M users.',
  },
  {
    id: 'mentor3',
    name: 'Rahoul Kumar',
    specialization: 'Full Stack Development',
    experience: '12 years',
    expertise: ['React', 'Node.js', 'System Design', 'Cloud Architecture'],
    availableSlots: ['Monday 4:00 PM', 'Thursday 3:00 PM', 'Saturday 2:00 PM'],
    rating: 4.9,
    hourlyRate: 1500,
    bio: 'Full stack engineer focused on system design and scalable architecture.',
  },
  {
    id: 'mentor4',
    name: 'Sneha Desai',
    specialization: 'Data Science',
    experience: '7 years',
    expertise: ['Data Analysis', 'SQL', 'Python', 'Tableau', 'Statistics'],
    availableSlots: ['Wednesday 10:00 AM', 'Thursday 6:00 PM', 'Sunday 11:00 AM'],
    rating: 4.7,
    hourlyRate: 1600,
    bio: 'Data scientist specializing in business analytics and predictive modeling.',
  },
  {
    id: 'mentor5',
    name: 'Vikram Singh',
    specialization: 'Cybersecurity',
    experience: '9 years',
    expertise: ['Network Security', 'Penetration Testing', 'Cloud Security', 'Compliance'],
    availableSlots: ['Tuesday 10:00 AM', 'Friday 4:00 PM', 'Saturday 6:00 PM'],
    rating: 4.5,
    hourlyRate: 2200,
    bio: 'Cybersecurity expert with experience in enterprise infrastructure protection.',
  },
  {
    id: 'mentor6',
    name: 'Neha Verma',
    specialization: 'DevOps & Cloud',
    experience: '6 years',
    expertise: ['AWS', 'Kubernetes', 'CI/CD', 'Infrastructure as Code', 'Docker'],
    availableSlots: ['Monday 2:00 PM', 'Wednesday 4:00 PM', 'Friday 10:00 AM'],
    rating: 4.6,
    hourlyRate: 1700,
    bio: 'DevOps engineer passionate about infrastructure automation and cloud platforms.',
  },
];

export function getMentorById(id: string): Mentor | undefined {
  return MENTORS.find(mentor => mentor.id === id);
}

export function getMentorsBySpecialization(specialization: string): Mentor[] {
  return MENTORS.filter(mentor => mentor.specialization.includes(specialization));
}
