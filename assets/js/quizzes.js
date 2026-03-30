/**
 * path4career — Quizzes Listing Page Logic
 * Fetches quiz list from backend API and renders interactive cards.
 * Auth-gates quiz start: requires AUTH_TOKEN in localStorage.
 */

const API_BASE = 'https://path4career-backend.onrender.com';

// Quiz icon mapping based on tutorialId
const QUIZ_ICONS = {
    'html': '🌐', 'css': '🎨', 'js': '⚡', 'javascript': '⚡',
    'python': '🐍', 'java': '☕', 'c': '💻', 'cpp': '⚙️',
    'csharp': '🔷', 'php': '🐘', 'react': '⚛️', 'nodejs': '🟢',
    'bootstrap': '🅱️', 'django': '🎯', 'jquery': '📦', 'git': '🔀',
    'sql': '🗃️', 'mysql': '🐬', 'mongodb': '🍃', 'numpy': '🔢',
    'pandas': '🐼', 'excel': '📊', 'dsa': '🧮', 'xml': '📄',
    'frontend': '🖥️', 'backend': '⚙️', 'database': '💾'
};

// Color schemes per tutorialId
const QUIZ_COLORS = {
    'html': 'rgba(227, 76, 38, 0.15)', 'css': 'rgba(38, 77, 228, 0.15)',
    'js': 'rgba(247, 223, 30, 0.15)', 'python': 'rgba(55, 118, 171, 0.15)',
    'java': 'rgba(176, 114, 25, 0.15)', 'react': 'rgba(97, 218, 251, 0.15)',
    'default': 'rgba(99, 102, 241, 0.15)'
};

let allQuizzes = [];

document.addEventListener('DOMContentLoaded', () => {
    loadQuizzes();
});

/**
 * Fetch quizzes from the backend API
 */
async function loadQuizzes() {
    const loadingEl = document.getElementById('quizzesLoading');
    const errorEl = document.getElementById('quizzesError');
    const gridEl = document.getElementById('quizzesGrid');

    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    gridEl.innerHTML = '';

    try {
        const res = await fetch(`${API_BASE}/api/quiz/list`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        allQuizzes = await res.json();

        loadingEl.style.display = 'none';

        if (allQuizzes.length === 0) {
            gridEl.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding: 60px 0;">
                    <div style="font-size:3rem; margin-bottom:12px;">📭</div>
                    <h3 style="color: var(--text-secondary); font-weight: 500;">No quizzes available yet</h3>
                    <p style="color: var(--text-muted); margin-top: 8px;">Quizzes will appear here once they are added.</p>
                </div>`;
            return;
        }

        renderQuizCards(allQuizzes);
    } catch (err) {
        console.error('Failed to load quizzes:', err);
        loadingEl.style.display = 'none';
        errorEl.style.display = 'block';
    }
}

/**
 * Render quiz cards in the grid
 */
function renderQuizCards(quizzes) {
    const grid = document.getElementById('quizzesGrid');

    grid.innerHTML = quizzes.map(quiz => {
        const icon = QUIZ_ICONS[quiz.tutorialId] || '📝';
        const bgColor = QUIZ_COLORS[quiz.tutorialId] || QUIZ_COLORS['default'];

        return `
        <div class="quiz-card" data-tutorial-id="${quiz.tutorialId}">
            <div class="quiz-card-header">
                <div class="quiz-card-icon" style="background: ${bgColor};">
                    ${icon}
                </div>
                <div class="quiz-card-info">
                    <h3>${escapeHtml(quiz.title)}</h3>
                    <span class="tutorial-badge">${quiz.tutorialId.toUpperCase()}</span>
                </div>
            </div>
            <p class="quiz-card-desc">${escapeHtml(quiz.description || 'Test your knowledge with this quiz.')}</p>
            <div class="quiz-card-stats">
                <div class="stat-item">
                    <span class="stat-icon">📝</span>
                    <span class="stat-value">${quiz.totalQuestions}</span>
                    <span class="stat-label">Questions</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">⏱️</span>
                    <span class="stat-value">${quiz.timeLimitMinutes}m</span>
                    <span class="stat-label">Time</span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">🎯</span>
                    <span class="stat-value">${quiz.passingPercentage}%</span>
                    <span class="stat-label">Pass</span>
                </div>
            </div>
            <button class="btn-start-quiz" onclick="handleStartQuiz('${quiz.tutorialId}')">
                🚀 Start Quiz
            </button>
        </div>`;
    }).join('');
}

/**
 * Handle "Start Quiz" click — check auth first
 */
function handleStartQuiz(tutorialId) {
    const token = localStorage.getItem('AUTH_TOKEN');

    if (!token) {
        // Not logged in — show login modal
        window._pendingQuizTutorialId = tutorialId;
        document.getElementById('loginModal').classList.add('active');
        return;
    }

    // Logged in — navigate to quiz page
    window.location.href = `quiz.html?tutorialId=${tutorialId}`;
}

/**
 * Go to login page with redirect back
 */
function goToLogin() {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `./auth/login.html?redirect=${currentUrl}`;
}

/**
 * Close login modal
 */
function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('active');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
