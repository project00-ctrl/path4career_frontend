import { faqData, type FAQ } from './faqData';

/**
 * Find the best matching FAQ answer for a user query
 * Uses keyword matching and string similarity to find the most relevant FAQ
 */
export function findBestFAQMatch(userQuery: string): FAQ | null {
  if (!userQuery.trim()) return null;

  const queryLower = userQuery.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2); // Filter out small words

  let bestMatch: FAQ | null = null;
  let bestScore = 0;

  for (const faq of faqData) {
    let score = 0;

    // Check keywords match
    const faqKeywords = faq.keywords.map(k => k.toLowerCase());
    for (const keyword of faqKeywords) {
      if (queryLower.includes(keyword)) {
        score += 3; // Heavy weight for keyword match
      }
    }

    // Check word overlap in question
    const questionWords = faq.question.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    for (const qWord of questionWords) {
      if (queryWords.includes(qWord)) {
        score += 1;
      }
    }

    // Penalty for short matches (less specific)
    if (score > 0) {
      const similarity = calculateStringSimilarity(queryLower, faq.question.toLowerCase());
      score += similarity * 2; // Add similarity score
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }

  // Only return a match if we have a reasonable confidence (score > 0)
  return bestScore > 0 ? bestMatch : null;
}

/**
 * Calculate string similarity using Levenshtein-like approach
 * Returns a score between 0 and 1
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1;

  const editDistance = getEditDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate edit distance between two strings (Levenshtein distance)
 */
function getEditDistance(s1: string, s2: string): number {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Get a fallback response when no good FAQ match is found
 */
export function getFallbackResponse(): string {
  return "I'm not sure about that specific question, but I can help with general information about Path4Career, the startup roadmap, career planning, mentors, and platform features. What would you like to know?";
}

/**
 * Get predefined sample questions for the chatbot UI
 * Returns a curated list of common questions from all 30 FAQs
 */
export function getPredefinedQuestions(): Array<{ id: number; question: string }> {
  return [
    { id: 1, question: "What is Path4Career?" },
    { id: 2, question: "What can I do on this platform?" },
    { id: 3, question: "Who is this platform designed for?" },
    { id: 4, question: "How does Path4Career help with career planning?" },
    { id: 5, question: "Is Path4Career free to use?" },
    { id: 6, question: "Do I need an account to use the platform?" },
    { id: 7, question: "Why do I need to log in?" },
    { id: 8, question: "Can I use the platform on mobile devices?" },
    { id: 9, question: "What should I do if I cannot log in?" },
    { id: 10, question: "What is the Startup Path feature?" },
    { id: 11, question: "How does the startup roadmap work?" },
    { id: 12, question: "Why are some steps locked?" },
    { id: 13, question: "How do I unlock the next step?" },
    { id: 14, question: "Do startup steps have deadlines?" },
    { id: 15, question: "How do I complete tasks in the platform?" },
    { id: 16, question: "How does the platform track my progress?" },
    { id: 17, question: "Can I undo a completed task?" },
    { id: 18, question: "What happens after completing all tasks in a step?" },
    { id: 19, question: "What do the progress bars represent?" },
    { id: 20, question: "What is the AI assistant?" },
    { id: 21, question: "Can I ask career-related questions to the AI assistant?" },
    { id: 22, question: "Can the AI assistant help with startup ideas?" },
    { id: 23, question: "Does the AI assistant respond instantly?" },
    { id: 24, question: "What is Mentor Chat?" },
    { id: 25, question: "Can I ask mentors for career advice?" },
    { id: 26, question: "How do mentor conversations work?" },
    { id: 27, question: "What notifications will I receive?" },
    { id: 28, question: "Why did I receive a task completion notification?" },
    { id: 29, question: "Why did a new step unlock?" },
    { id: 30, question: "What should I do if a feature is not working properly?" },
  ];
}
