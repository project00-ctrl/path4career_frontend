export interface MentorMenteeRelationship {
  id: string;
  mentorName: string;
  menteeName: string;
  startDate: string;
  active: boolean;
}

const RELATIONSHIPS_KEY = 'p4c_mentor_relationships';

export const relationshipData = {
  getRelationships: (): MentorMenteeRelationship[] => {
    const saved = localStorage.getItem(RELATIONSHIPS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  },

  saveRelationships: (relationships: MentorMenteeRelationship[]) => {
    localStorage.setItem(RELATIONSHIPS_KEY, JSON.stringify(relationships));
  },

  addRelationship: (mentorName: string, menteeName: string): MentorMenteeRelationship => {
    const relationships = relationshipData.getRelationships();
    
    // Check if exactly this active relationship exists
    const existing = relationships.find(r => r.mentorName === mentorName && r.menteeName === menteeName && r.active);
    if (existing) return existing;

    const newRelationship: MentorMenteeRelationship = {
      id: Math.random().toString(36).substring(2, 11),
      mentorName,
      menteeName,
      startDate: new Date().toISOString(),
      active: true
    };
    
    relationshipData.saveRelationships([...relationships, newRelationship]);
    return newRelationship;
  }
};
