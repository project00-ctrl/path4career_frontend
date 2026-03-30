import { relationshipData, MentorMenteeRelationship } from '../data/relationships';

export const mentorEngine = {
  /**
   * Assigns a mentor to a mentee.
   * If a relationship already exists, returns the existing one.
   */
  assignMentor: (mentorName: string, menteeName: string): MentorMenteeRelationship => {
    return relationshipData.addRelationship(mentorName, menteeName);
  },

  /**
   * Gets the active mentor for a given mentee.
   */
  getMentorForUser: (menteeName: string): string | null => {
    const relationships = relationshipData.getRelationships();
    const activeRel = relationships.find(r => r.menteeName === menteeName && r.active);
    return activeRel ? activeRel.mentorName : null;
  },

  /**
   * Gets all active mentees for a given mentor.
   */
  getMenteesForMentor: (mentorName: string): string[] => {
    const relationships = relationshipData.getRelationships();
    return relationships
      .filter(r => r.mentorName === mentorName && r.active)
      .map(r => r.menteeName);
  },
  
  /**
   * Checks if two users have an active mentorship relationship.
   */
  hasActiveRelationship: (userA: string, userB: string): boolean => {
    const relationships = relationshipData.getRelationships();
    return relationships.some(r => 
      r.active && 
      ((r.mentorName === userA && r.menteeName === userB) || 
       (r.mentorName === userB && r.menteeName === userA))
    );
  }
};
