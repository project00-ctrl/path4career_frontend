export interface FAQ {
  id: number;
  question: string;
  answer: string;
  keywords: string[];
}

export const faqData: FAQ[] = [
  {
    id: 1,
    question: "What is Path4Career?",
    answer: "Path4Career is a platform that helps users explore career paths and startup journeys through structured steps, tasks, and AI guidance.",
    keywords: ["path4career", "platform", "about", "what"]
  },
  {
    id: 2,
    question: "What can I do on this platform?",
    answer: "You can explore career paths, follow a startup roadmap, complete tasks, track progress, and interact with the AI assistant.",
    keywords: ["can do", "features", "functionality", "capabilities"]
  },
  {
    id: 3,
    question: "Who is this platform designed for?",
    answer: "Path4Career is designed for students, aspiring entrepreneurs, and professionals looking for structured career guidance.",
    keywords: ["designed for", "target", "audience", "who", "students", "entrepreneurs"]
  },
  {
    id: 4,
    question: "How does Path4Career help with career planning?",
    answer: "The platform provides guided steps, tasks, and AI assistance to help users make informed career decisions.",
    keywords: ["career planning", "help", "guidance", "decisions"]
  },
  {
    id: 5,
    question: "Is Path4Career free to use?",
    answer: "Some features may be available for free, while advanced features may require account access.",
    keywords: ["free", "cost", "pricing", "paid", "fee"]
  },
  {
    id: 6,
    question: "Do I need an account to use the platform?",
    answer: "Yes, certain core features require you to log in before accessing them.",
    keywords: ["account", "login", "sign up", "registration"]
  },
  {
    id: 7,
    question: "Why do I need to log in?",
    answer: "Logging in allows the platform to track your progress and unlock personalized features.",
    keywords: ["login", "sign in", "why login", "authentication"]
  },
  {
    id: 8,
    question: "Can I use the platform on mobile devices?",
    answer: "Yes, the platform is fully responsive and works on mobile phones, tablets, and desktops.",
    keywords: ["mobile", "responsive", "phone", "tablet", "device"]
  },
  {
    id: 9,
    question: "What should I do if I cannot log in?",
    answer: "Try refreshing the page or checking your login details. If the problem persists, contact support.",
    keywords: ["cannot login", "login problem", "login issue", "troubleshooting", "login error"]
  },
  {
    id: 10,
    question: "What is the Startup Path feature?",
    answer: "Startup Path provides a structured roadmap that guides users through the process of building a startup idea.",
    keywords: ["startup path", "startup", "roadmap", "feature"]
  },
  {
    id: 11,
    question: "How does the startup roadmap work?",
    answer: "The roadmap divides the startup journey into multiple steps, each containing tasks that must be completed before moving forward.",
    keywords: ["startup roadmap", "how works", "steps", "stages"]
  },
  {
    id: 12,
    question: "Why are some steps locked?",
    answer: "Steps are locked to ensure users complete earlier tasks before progressing to advanced stages.",
    keywords: ["locked steps", "unlock", "lock", "why locked"]
  },
  {
    id: 13,
    question: "How do I unlock the next step?",
    answer: "Complete all tasks in the current step and the next step will unlock automatically.",
    keywords: ["unlock step", "unlock next", "how unlock", "complete tasks"]
  },
  {
    id: 14,
    question: "Do startup steps have deadlines?",
    answer: "Yes, some steps include suggested deadlines to help users stay on track.",
    keywords: ["deadlines", "deadline", "time limit", "due date"]
  },
  {
    id: 15,
    question: "How do I complete tasks in the platform?",
    answer: "Tasks can be completed by selecting or checking the task checkbox.",
    keywords: ["complete tasks", "how complete", "mark complete", "checkbox"]
  },
  {
    id: 16,
    question: "How does the platform track my progress?",
    answer: "Progress is tracked automatically through completed tasks and visual progress bars.",
    keywords: ["track progress", "progress tracking", "monitor", "statistics"]
  },
  {
    id: 17,
    question: "Can I undo a completed task?",
    answer: "Yes, tasks can usually be toggled on and off if you want to update your progress.",
    keywords: ["undo task", "uncomplete", "toggle", "revert"]
  },
  {
    id: 18,
    question: "What happens after completing all tasks in a step?",
    answer: "The next step in the roadmap will automatically unlock.",
    keywords: ["after completion", "next step", "what happens after"]
  },
  {
    id: 19,
    question: "What do the progress bars represent?",
    answer: "Progress bars visually show how much of a particular stage or task group you have completed.",
    keywords: ["progress bars", "progress indicator", "visual progress"]
  },
  {
    id: 20,
    question: "What is the AI assistant?",
    answer: "The AI assistant is a chatbot that answers questions about careers, startups, and platform features.",
    keywords: ["ai assistant", "chatbot", "ai", "bot"]
  },
  {
    id: 21,
    question: "Can I ask career-related questions to the AI assistant?",
    answer: "Yes, the AI assistant can provide guidance and information related to careers.",
    keywords: ["career questions", "ask ai", "career guidance", "advice"]
  },
  {
    id: 22,
    question: "Can the AI assistant help with startup ideas?",
    answer: "Yes, you can discuss startup ideas and receive general suggestions from the AI assistant.",
    keywords: ["startup ideas", "startup help", "business ideas", "suggestions"]
  },
  {
    id: 23,
    question: "Does the AI assistant respond instantly?",
    answer: "Responses are generated automatically and may appear with a short delay.",
    keywords: ["instant response", "response time", "delay", "how fast"]
  },
  {
    id: 24,
    question: "What is Mentor Chat?",
    answer: "Mentor Chat allows users to interact with mentors for guidance and discussions.",
    keywords: ["mentor chat", "mentor messaging", "dm", "direct message"]
  },
  {
    id: 25,
    question: "Can I ask mentors for career advice?",
    answer: "Yes, mentors can provide insights and advice based on their experience.",
    keywords: ["mentor advice", "ask mentor", "mentor guidance"]
  },
  {
    id: 26,
    question: "How do mentor conversations work?",
    answer: "Users can send messages and receive responses through the mentor chat interface.",
    keywords: ["mentor conversation", "mentor chat", "how messaging works"]
  },
  {
    id: 27,
    question: "What notifications will I receive?",
    answer: "You may receive notifications for completed tasks, unlocked steps, deadlines, and mentor sessions.",
    keywords: ["notifications", "alerts", "notification types"]
  },
  {
    id: 28,
    question: "Why did I receive a task completion notification?",
    answer: "The system sends notifications when tasks are completed to confirm your progress.",
    keywords: ["task notification", "completion notification", "why notification"]
  },
  {
    id: 29,
    question: "Why did a new step unlock?",
    answer: "A new step unlocks when all required tasks in the previous step are completed.",
    keywords: ["step unlocked", "unlock notification", "step unlock reason"]
  },
  {
    id: 30,
    question: "What should I do if a feature is not working properly?",
    answer: "Try refreshing the page or restarting the session. If the issue continues, contact platform support.",
    keywords: ["feature not working", "bug", "issue", "problem", "troubleshooting"]
  }
];
