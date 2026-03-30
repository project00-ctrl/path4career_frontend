/**
 * EmailService – simulates email dispatch in the browser.
 * In production, integrate with an email API (e.g. EmailJS, Resend, SendGrid).
 */

export interface Email {
  to: string;
  subject: string;
  body: string;
  type: 'mentor_session' | 'task_reminder' | 'deadline' | 'welcome';
}

// Holds all pending/sent emails for the in-app notification center
const emailLog: Email[] = [];

function formatEmail(email: Email): string {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 To: ${email.to}
📌 Subject: ${email.subject}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${email.body}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim();
}

export function sendEmail(email: Email): void {
  emailLog.push(email);
  // In a real app: call EmailJS.send() or POST to your API
  console.log('[EmailService] Sending email:\n', formatEmail(email));
}

export function getEmailLog(): Email[] {
  return [...emailLog];
}

// ── Convenience senders ────────────────────────────────────────────────────

export function sendMentorSessionConfirmation(
  userEmail: string,
  mentorName: string,
  sessionDate: string,
  sessionTime: string
): void {
  sendEmail({
    to: userEmail,
    subject: `📅 Mentor Session Confirmed – ${mentorName}`,
    body: `Hi there!\n\nYour 1:1 session with ${mentorName} has been confirmed.\n\n📅 Date: ${sessionDate}\n⏰ Time: ${sessionTime}\n\nPlease be on time and come prepared with your questions.\n\nBest,\nPath4Career Team`,
    type: 'mentor_session',
  });
}

export function sendMentorSessionReminder(
  userEmail: string,
  mentorName: string,
  sessionDate: string
): void {
  sendEmail({
    to: userEmail,
    subject: `⏰ Reminder: Session with ${mentorName} tomorrow`,
    body: `Hi there!\n\nThis is a friendly reminder that your session with ${mentorName} is scheduled for tomorrow (${sessionDate}).\n\nMake sure you\'ve prepared your questions and goals for the session!\n\nBest,\nPath4Career Team`,
    type: 'mentor_session',
  });
}

export function sendTaskDeadlineReminder(
  userEmail: string,
  taskName: string,
  stepName: string,
  daysLeft: number
): void {
  const urgency = daysLeft <= 1 ? '🚨 URGENT' : daysLeft <= 3 ? '⚠️ Soon' : '📋';
  sendEmail({
    to: userEmail,
    subject: `${urgency}: Task Deadline – "${taskName}"`,
    body: `Hi there!\n\nYou have ${daysLeft} day(s) left to complete the task:\n\n📋 Task: ${taskName}\n📁 Step: ${stepName}\n⏰ Deadline: ${daysLeft} day(s) remaining\n\nKeep up the great work! Complete your tasks to unlock the next steps.\n\nBest,\nPath4Career Team`,
    type: 'task_reminder',
  });
}

export function sendDeadlineAlert(
  userEmail: string,
  featureName: string,
  deadline: string
): void {
  sendEmail({
    to: userEmail,
    subject: `🔔 Deadline Alert – ${featureName}`,
    body: `Hi there!\n\nThis is a deadline alert for:\n\n🎯 Feature: ${featureName}\n⏰ Deadline: ${deadline}\n\nLog into Path4Career to stay on track!\n\nBest,\nPath4Career Team`,
    type: 'deadline',
  });
}
