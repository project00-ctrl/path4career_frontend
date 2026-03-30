/**
 * path4career — Quiz Engine (Integrated with Backend)
 * 
 * Loads questions from local JSON files in assets/data/quiz/.
 * Submits results to the backend API for tracking.
 * Requires AUTH_TOKEN in localStorage to take a quiz.
 * 
 * URL Parameters:
 *   ?tutorialId=html      → 20 random HTML questions
 *   ?tutorialId=css       → 20 random CSS questions
 *   ?tutorialId=frontend  → mixed weighted questions
 */

// ──────────────────────────────────────────
// API CONFIG
// ──────────────────────────────────────────
const API_BASE_URL = "https://path4career-backend.onrender.com";

// ──────────────────────────────────────────
// CONFIGURATION
// ──────────────────────────────────────────
const QUIZ_CONFIG = {
    questionsPerAttempt: 20,
    moduleQuestionsPerAttempt: 30,
    timeLimitMinutes: 30,
    moduleTimeLimitMinutes: 40,
    passingPercentage: 60,
    moduleCompletionRequired: 80
};

// ──────────────────────────────────────────
// MODULE REGISTRY
// ──────────────────────────────────────────
const MODULE_REGISTRY = {
    'html': { name: 'HTML Foundations', sources: [{ file: 'html_quiz', count: 20 }] },
    'css': { name: 'CSS Styling', sources: [{ file: 'css_quiz', count: 20 }] },
    'js': { name: 'JavaScript', sources: [{ file: 'js_quiz', count: 20 }] },
    'bootstrap': { name: 'Bootstrap', sources: [{ file: 'bootstrap_quiz', count: 20 }] },
    'csharp': { name: 'C# Programming', sources: [{ file: 'csharp_quiz', count: 20 }] },
    'django': { name: 'Django Framework', sources: [{ file: 'django_quiz', count: 20 }] },
    'dsa': { name: 'Data Structures & Algorithms', sources: [{ file: 'dsa_quiz', count: 20 }] },
    'excel': { name: 'Microsoft Excel', sources: [{ file: 'excel_quiz', count: 20 }] },
    'git': { name: 'Version Control (Git)', sources: [{ file: 'git_quiz', count: 20 }] },
    'jquery': { name: 'jQuery Library', sources: [{ file: 'jquery_quiz', count: 20 }] },
    'mongodb': { name: 'MongoDB Database', sources: [{ file: 'mongodb_quiz', count: 20 }] },
    'mysql': { name: 'MySQL Database', sources: [{ file: 'mysql_quiz', count: 20 }] },
    'numpy': { name: 'NumPy Library', sources: [{ file: 'numpy_quiz', count: 20 }] },
    'pandas': { name: 'Pandas Library', sources: [{ file: 'pandas_quiz', count: 20 }] },
    'python': { name: 'Python Basics', sources: [{ file: 'python_quiz', count: 20 }] },
    'react': { name: 'React Library', sources: [{ file: 'react_quiz', count: 20 }] },
    'xml': { name: 'XML Basics', sources: [{ file: 'xml_quiz', count: 20 }] },
    'java': { name: 'Java Programming', sources: [{ file: 'java_quiz', count: 20 }] },
    'c': { name: 'C Language', sources: [{ file: 'c_quiz', count: 20 }] },
    'cpp': { name: 'C++ Programming', sources: [{ file: 'cpp_quiz', count: 20 }] },
    'nodejs': { name: 'Node.js', sources: [{ file: 'nodejs_quiz', count: 20 }] },
    'php': { name: 'PHP Development', sources: [{ file: 'php_quiz', count: 20 }] },
    'sql': { name: 'SQL Fundamentals', sources: [{ file: 'sql_quiz', count: 20 }] },

    // Combined quizzes removed — module-level quizzes now handled dynamically via backend
};

// ──────────────────────────────────────────
// TUTORIAL FILE MAP (tutorialId → course JSON file)
// ──────────────────────────────────────────
const TUTORIAL_FILE_MAP = {
    'html': 'htmlPages.json',
    'css': 'cssPages.json',
    'js': 'jsPages.json',
    'bootstrap': 'bootstrapPages.json',
    'react': 'reactPages.json',
    'jquery': 'jqueryPages.json',
    'xml': 'xmlPages.json',
    'python': 'pythonPages.json',
    'java': 'javaPages.json',
    'php': 'phpPages.json',
    'c': 'cPages.json',
    'cpp': 'cInc.json',
    'csharp': 'cSharpPages.json',
    'nodejs': 'nodejsPages.json',
    'django': 'djangoPages.json',
    'sql': 'sqlPages.json',
    'mysql': 'mysqlPages.json',
    'mongodb': 'mongodbPages.json',
    'excel': 'excelPages.json',
    'git': 'gitPages.json',
    'numpy': 'numpyPages.json',
    'pandas': 'pandasPages.json',
    'dsa': 'dsaPages.json'
};

// ──────────────────────────────────────────
// MODULE KEY → DB TUTORIAL_ID MAP
// DB stores lowercase config names (e.g. "c++", "javascript")
// Quiz uses shorthand module keys (e.g. "cpp", "js")
// ──────────────────────────────────────────
const MODULE_TO_DB_TUTORIAL = {
    'js': 'javascript',
    'cpp': 'c++',
    'csharp': 'c#',
    'nodejs': 'node.js'
};
function getDbTutorialId(moduleId) {
    return MODULE_TO_DB_TUTORIAL[moduleId] || moduleId;
}

// ──────────────────────────────────────────
// QUESTION BANK CACHE
// ──────────────────────────────────────────
const questionBankCache = {};

// ──────────────────────────────────────────
// STATE
// ──────────────────────────────────────────
let quizState = {
    moduleId: null,        // tutorialId for single-skill quiz
    moduleName: "Module Quiz",
    isModuleQuiz: false,   // true when using ?moduleId=<dbId>
    dbModuleId: null,      // numeric module ID from DB
    skillTutorialIds: [],  // list of skill tutorialIds for module quiz
    tutorialCompleted: false,
    previousScore: null,
    previousAttemptDate: null,
    questions: [],
    currentIndex: 0,
    answers: {},
    startTime: null,
    endTime: null,
    timeRemaining: 0,
    timerInterval: null,
    isSubmitted: false,
    isLoading: false,
    lastResults: null
};

// ──────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────
const views = {
    start: document.getElementById('startView'),
    quiz: document.getElementById('quizView'),
    result: document.getElementById('resultView'),
    review: document.getElementById('reviewView')
};

// ──────────────────────────────────────────
// AUTH CHECK
// ──────────────────────────────────────────
function checkAuth() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
        // Redirect to login
        const currentUrl = encodeURIComponent(window.location.href);
        window.location.href = `./auth/login.html?redirect=${currentUrl}`;
        return false;
    }
    return true;
}

function getUserEmail() {
    // Try to get email from stored user data
    const userData = localStorage.getItem('path4careerUser');
    if (userData) {
        try {
            const parsed = JSON.parse(userData);
            return parsed.email || parsed.Email || null;
        } catch (e) { }
    }
    return null;
}

// ──────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Auth gate — must be logged in
    if (!checkAuth()) return;
    initQuiz();
});

async function initQuiz() {
    const params = new URLSearchParams(window.location.search);
    const dbModuleIdParam = params.get('moduleId');
    const tutorialIdParam = params.get('tutorialId');

    // Determine quiz mode: module quiz (numeric DB moduleId) vs single-skill quiz (tutorialId)
    if (dbModuleIdParam && !isNaN(Number(dbModuleIdParam))) {
        // ── MODULE QUIZ MODE ──
        quizState.isModuleQuiz = true;
        quizState.dbModuleId = Number(dbModuleIdParam);
        quizState.moduleId = null;

        showLoadingState(true);
        try {
            await initModuleQuiz();
            showLoadingState(false);
            renderStartView();
            showView('start');
        } catch (error) {
            console.error('Failed to load module quiz data:', error);
            showLoadingState(false);
            showErrorState('Failed to load module quiz. Please check your connection and try again.');
        }
        return;
    }

    // ── SINGLE-SKILL QUIZ MODE ──
    quizState.moduleId = tutorialIdParam || 'html';
    quizState.isModuleQuiz = false;

    const moduleConfig = MODULE_REGISTRY[quizState.moduleId];
    if (!moduleConfig) {
        showToast(`❌ Unknown module: "${quizState.moduleId}". Defaulting to HTML.`);
        quizState.moduleId = 'html';
        quizState.moduleName = MODULE_REGISTRY['html'].name;
    } else {
        quizState.moduleName = moduleConfig.name;
    }

    document.title = `${quizState.moduleName} Quiz | path4career`;

    showLoadingState(true);
    try {
        await Promise.all([
            preloadQuestionBanks(),
            checkTutorialCompletionAndHistory()
        ]);
        showLoadingState(false);
        renderStartView();
        showView('start');
    } catch (error) {
        console.error('Failed to load quiz data:', error);
        showLoadingState(false);
        showErrorState('Failed to load quiz questions. Please check your connection and try again.');
    }
}

/**
 * Initialize module quiz mode — fetch eligibility from backend, load question banks.
 */
async function initModuleQuiz() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) throw new Error('Not authenticated');

    // 1. Call eligibility endpoint
    const eligRes = await fetch(`${API_BASE_URL}/api/v1/modules/${quizState.dbModuleId}/quiz-eligibility`, {
        headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!eligRes.ok) throw new Error(`Eligibility check failed: HTTP ${eligRes.status}`);
    const eligData = await eligRes.json();

    quizState.moduleName = eligData.moduleName || 'Module Quiz';
    quizState.tutorialCompleted = eligData.eligible;
    quizState.skillTutorialIds = eligData.skillTutorialIds || [];

    if (eligData.bestScore !== undefined) {
        quizState.previousScore = eligData.bestScore;
    }

    document.title = `${quizState.moduleName} Certification Quiz | path4career`;

    // 2. Build dynamic MODULE_REGISTRY-like config from skill tutorialIds
    //    Distribute 30 questions across all skills
    const totalQuestions = QUIZ_CONFIG.moduleQuestionsPerAttempt;
    const skillCount = quizState.skillTutorialIds.length;
    if (skillCount === 0) throw new Error('No skills found for this module');

    const perSkill = Math.floor(totalQuestions / skillCount);
    let remainder = totalQuestions % skillCount;

    const dynamicSources = quizState.skillTutorialIds.map(tid => {
        // Map tutorialId to quiz file name (same as MODULE_REGISTRY convention)
        const quizFileName = tid + '_quiz';
        let count = perSkill;
        if (remainder > 0) { count++; remainder--; }
        return { file: quizFileName, count };
    });

    // 3. Load all quiz JSON files for these skills
    const filesToLoad = [...new Set(dynamicSources.map(s => s.file))];
    const loadPromises = filesToLoad.map(async (fileName) => {
        if (questionBankCache[fileName]) return;
        const response = await fetch(`../assets/data/quiz/${fileName}.json`);
        if (!response.ok) {
            console.warn(`Quiz file ${fileName}.json not found, skipping`);
            return;
        }
        const data = await response.json();
        questionBankCache[fileName] = Array.isArray(data) ? data : data.questions;
    });
    await Promise.all(loadPromises);

    // Store dynamic sources for question selection
    quizState._dynamicSources = dynamicSources;
}

// ──────────────────────────────────────────
// BACKEND DATA FETCHING
// ──────────────────────────────────────────
async function checkTutorialCompletionAndHistory() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) return;

    try {
        // 1. Check if tutorial is completed using the string-based endpoint
        const combinedModules = ['frontend', 'backend', 'database'];
        let isCompleted = false;

        if (combinedModules.includes(quizState.moduleId)) {
            // For combined quizzes, unlock by default
            isCompleted = true;
        } else {
            const dbTutorialId = getDbTutorialId(quizState.moduleId);
            const compRes = await fetch(`${API_BASE_URL}/api/v1/tutorials/completed-tutorial/${encodeURIComponent(dbTutorialId)}`, {
                headers: { 'Authorization': 'Bearer ' + token }
            });

            if (compRes.ok) {
                const data = await compRes.json();
                isCompleted = data.completed === true;
            }
        }

        quizState.tutorialCompleted = isCompleted;

        // 2. Fetch Quiz History for this module
        const histRes = await fetch(`${API_BASE_URL}/api/quiz/history`, {
            headers: { 'Authorization': 'Bearer ' + token }
        });

        if (histRes.ok) {
            const history = await histRes.json();
            // Match by tutorialId field if available, fallback to name match
            const myPrevAttempts = history.filter(h => {
                if (h.tutorialId) return h.tutorialId === quizState.moduleId;
                if (h.quizTitle) return h.quizTitle.toLowerCase().includes(quizState.moduleName.toLowerCase());
                return false;
            });

            if (myPrevAttempts.length > 0) {
                // Sort by attemptedAt descending to get latest
                myPrevAttempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));
                quizState.previousScore = myPrevAttempts[0].percentage;
                quizState.previousAttemptDate = myPrevAttempts[0].attemptedAt;
            } else {
                quizState.previousScore = null;
            }
        }
    } catch (err) {
        console.error("Failed to fetch completion or history from backend:", err);
        // Fallback gracefully — allow attempt if backend check fails
        quizState.tutorialCompleted = true;
    }
}

// ──────────────────────────────────────────
// DATA LOADING — from local JSON files
// ──────────────────────────────────────────
async function preloadQuestionBanks() {
    const moduleConfig = MODULE_REGISTRY[quizState.moduleId];
    const filesToLoad = moduleConfig.sources.map(s => s.file);
    const uniqueFiles = [...new Set(filesToLoad)];

    const loadPromises = uniqueFiles.map(async (fileName) => {
        if (questionBankCache[fileName]) return;

        // Load from project-local data folder
        const response = await fetch(`../assets/data/quiz/${fileName}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${fileName}.json (HTTP ${response.status})`);
        }
        const data = await response.json();
        questionBankCache[fileName] = Array.isArray(data) ? data : data.questions;
    });

    await Promise.all(loadPromises);
}

function selectWeightedQuestions() {
    const moduleConfig = MODULE_REGISTRY[quizState.moduleId];
    let allSelected = [];
    let globalId = 1;

    for (const source of moduleConfig.sources) {
        const bank = questionBankCache[source.file];
        if (!bank || bank.length === 0) {
            console.warn(`No questions found for ${source.file}`);
            continue;
        }

        const shuffled = [...bank].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, Math.min(source.count, bank.length));

        picked.forEach(q => {
            allSelected.push({
                ...q,
                id: globalId++,
                sourceModule: source.file
            });
        });
    }

    return allSelected.sort(() => Math.random() - 0.5);
}

// ──────────────────────────────────────────
// LOADING & ERROR STATES
// ──────────────────────────────────────────
function showLoadingState(show) {
    quizState.isLoading = show;
    const container = document.querySelector('.quiz-container');
    let loader = document.getElementById('quizLoader');

    if (show) {
        Object.values(views).forEach(v => v.classList.remove('active'));

        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'quizLoader';
            loader.className = 'view active';
            loader.innerHTML = `
                <div class="quiz-hero" style="padding: 80px 0;">
                    <div class="quiz-hero-icon">⏳</div>
                    <h1>Loading Quiz...</h1>
                    <p style="color: var(--text-muted); margin-top: 12px;">
                        Fetching questions for <strong>${quizState.moduleName}</strong>
                    </p>
                </div>
            `;
            container.appendChild(loader);
        }
        loader.style.display = 'block';
        loader.classList.add('active');
    } else {
        if (loader) {
            loader.style.display = 'none';
            loader.classList.remove('active');
        }
    }
}

function showErrorState(message) {
    const container = document.querySelector('.quiz-container');
    Object.values(views).forEach(v => v.classList.remove('active'));

    let errorEl = document.getElementById('quizError');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.id = 'quizError';
        errorEl.className = 'view active';
        container.appendChild(errorEl);
    }

    errorEl.innerHTML = `
        <div class="quiz-hero" style="padding: 80px 0;">
            <div class="quiz-hero-icon" style="background: linear-gradient(135deg, #FF4D6A, #FF8A65);">❌</div>
            <h1 style="background: linear-gradient(135deg, #FF4D6A, #FF8A65); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                Oops! Something went wrong
            </h1>
            <p style="color: var(--text-muted); margin-top: 12px; max-width: 500px; margin-left: auto; margin-right: auto;">
                ${message}
            </p>
            <div class="start-actions" style="margin-top: 28px;">
                <button class="btn-start unlocked" onclick="location.reload()">🔄 Retry</button>
            </div>
        </div>
    `;
    errorEl.style.display = 'block';
    errorEl.classList.add('active');
}

// ──────────────────────────────────────────
// VIEW MANAGEMENT
// ──────────────────────────────────────────
function showView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────
// START VIEW
// ──────────────────────────────────────────
function renderStartView() {
    const isUnlocked = quizState.tutorialCompleted;
    const quizLabel = quizState.isModuleQuiz ? 'Module Certification Quiz' : 'Module Quiz';

    document.getElementById('startModuleName').textContent = quizState.moduleName;
    document.getElementById('startModuleLabel').textContent = quizLabel;
    document.getElementById('quizModuleBadge').textContent = quizState.moduleName;

    // Dynamically update rules card for module quiz
    const ruleQCount = document.getElementById('ruleQuestionCount');
    const ruleTime = document.getElementById('ruleTimeLimit');
    if (ruleQCount) ruleQCount.textContent = quizState.isModuleQuiz ? '30 MCQs' : '20 MCQs';
    if (ruleTime) ruleTime.textContent = quizState.isModuleQuiz ? '40 Minutes' : '30 Minutes';

    const gateContainer = document.getElementById('quizAccessGate');
    const gateLabel = document.getElementById('gateLabel');
    const pctEl = document.getElementById('gatePercentage');
    const msgEl = document.getElementById('gateMessage');

    gateContainer.style.display = 'block';

    if (!isUnlocked) {
        let tutorialLink;
        if (quizState.isModuleQuiz) {
            tutorialLink = `roadmaps/skills.html?courseId=${quizState.dbModuleId}`;
        } else {
            const tutorialFile = TUTORIAL_FILE_MAP[quizState.moduleId];
            tutorialLink = tutorialFile
                ? `tutorial.html?course=${tutorialFile}`
                : `roadmaps/skills.html?courseId=${quizState.moduleId}`;
        }
        gateLabel.textContent = quizState.isModuleQuiz ? "Skill Completion" : "Tutorial Completion";
        pctEl.textContent = "Locked";
        pctEl.className = "percentage locked";
        msgEl.className = "gate-message locked";
        msgEl.innerHTML = `🔒 You must complete all skills in <strong>${quizState.moduleName}</strong> before taking this quiz.
                <div style="text-align:center; margin-top:16px;">
                    <a href="${tutorialLink}" style="
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        padding: 12px 28px;
                        background: linear-gradient(135deg, var(--primary, #214EA5) 0%, #4f6fd9 100%);
                        color: #fff;
                        text-decoration: none;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 0.9rem;
                        font-family: 'Inter', sans-serif;
                        box-shadow: 0 4px 14px rgba(33, 78, 165, 0.3);
                        transition: all 0.25s ease;
                    " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(33,78,165,0.4)'"
                       onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 14px rgba(33,78,165,0.3)'"
                    >📖 Go to Skills →</a>
                </div>`;
    } else {
        if (quizState.previousScore !== null && quizState.previousScore !== undefined) {
            gateLabel.textContent = "Previous Best Score";
            pctEl.textContent = `${quizState.previousScore}%`;
            pctEl.className = `percentage ${quizState.previousScore >= QUIZ_CONFIG.passingPercentage ? 'unlocked' : 'locked'}`;
            msgEl.className = "gate-message unlocked";
            msgEl.innerHTML = `✅ You have previously attempted this quiz. Want to try again?`;
        } else {
            gateLabel.textContent = "Status";
            pctEl.textContent = "Ready";
            pctEl.className = "percentage unlocked";
            msgEl.className = "gate-message unlocked";
            msgEl.innerHTML = `✅ Tutorial completed. You are ready to start the quiz!`;
        }
    }

    const startBtn = document.getElementById('btnStartQuiz');
    startBtn.className = `btn-start ${isUnlocked ? 'unlocked' : 'locked'}`;
    startBtn.textContent = (isUnlocked && quizState.previousScore !== null) ? '🔄 Retake Quiz' : (isUnlocked ? '🚀 Start Quiz' : '🔒 Quiz Locked');
    startBtn.disabled = !isUnlocked;
    startBtn.onclick = isUnlocked ? startQuiz : null;
}

// ──────────────────────────────────────────
// START QUIZ
// ──────────────────────────────────────────
function startQuiz() {
    if (quizState.isModuleQuiz) {
        quizState.questions = selectModuleQuestions();
    } else {
        quizState.questions = selectWeightedQuestions();
    }
    const timeLimit = quizState.isModuleQuiz ? QUIZ_CONFIG.moduleTimeLimitMinutes : QUIZ_CONFIG.timeLimitMinutes;
    quizState.currentIndex = 0;
    quizState.answers = {};
    quizState.startTime = new Date().toISOString();
    quizState.isSubmitted = false;
    quizState.timeRemaining = timeLimit * 60;

    renderQuestionTracker();
    renderQuestion();
    startTimer();
    showView('quiz');
}

/**
 * Select questions for module quiz from dynamically loaded banks.
 */
function selectModuleQuestions() {
    const sources = quizState._dynamicSources || [];
    let allSelected = [];
    let globalId = 1;

    for (const source of sources) {
        const bank = questionBankCache[source.file];
        if (!bank || bank.length === 0) {
            console.warn(`No questions in ${source.file}`);
            continue;
        }
        const shuffled = [...bank].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, Math.min(source.count, bank.length));
        picked.forEach(q => {
            allSelected.push({ ...q, id: globalId++, sourceModule: source.file });
        });
    }

    return allSelected.sort(() => Math.random() - 0.5);
}

// ──────────────────────────────────────────
// TIMER
// ──────────────────────────────────────────
function startTimer() {
    updateTimerDisplay();
    quizState.timerInterval = setInterval(() => {
        quizState.timeRemaining--;

        if (quizState.timeRemaining <= 0) {
            clearInterval(quizState.timerInterval);
            showToast('⏰ Time is up! Auto-submitting your quiz...');
            setTimeout(() => submitQuiz(true), 1500);
            return;
        }

        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const mins = Math.floor(quizState.timeRemaining / 60);
    const secs = quizState.timeRemaining % 60;
    const timerEl = document.getElementById('timerDisplay');
    timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const timerWrap = document.getElementById('timer');
    timerWrap.classList.remove('warning', 'danger');

    if (quizState.timeRemaining <= 60) {
        timerWrap.classList.add('danger');
    } else if (quizState.timeRemaining <= 300) {
        timerWrap.classList.add('warning');
    }
}

// ──────────────────────────────────────────
// QUESTION RENDERING
// ──────────────────────────────────────────
function renderQuestion() {
    const q = quizState.questions[quizState.currentIndex];
    const idx = quizState.currentIndex;
    const total = quizState.questions.length;

    document.getElementById('questionCounter').innerHTML =
        `Question ${idx + 1} <span>of ${total}</span>`;

    document.getElementById('questionNumber').textContent = `Question ${idx + 1}`;
    document.getElementById('questionText').textContent = q.question;

    const optionsEl = document.getElementById('optionsList');
    const letters = ['A', 'B', 'C', 'D'];
    optionsEl.innerHTML = q.options.map((opt, i) => `
        <button class="option-btn ${quizState.answers[q.id] === i ? 'selected' : ''}"
                onclick="selectOption(${q.id}, ${i})" id="option-${i}">
            <span class="option-letter">${letters[i]}</span>
            <span class="option-content">${escapeHtml(opt)}</span>
        </button>
    `).join('');

    document.getElementById('btnPrev').disabled = idx === 0;
    document.getElementById('btnNext').disabled = idx === total - 1;

    updateTracker();
}

function selectOption(questionId, optionIndex) {
    quizState.answers[questionId] = optionIndex;
    renderQuestion();
}

function nextQuestion() {
    if (quizState.currentIndex < quizState.questions.length - 1) {
        quizState.currentIndex++;
        renderQuestion();
    }
}

function prevQuestion() {
    if (quizState.currentIndex > 0) {
        quizState.currentIndex--;
        renderQuestion();
    }
}

function goToQuestion(index) {
    quizState.currentIndex = index;
    renderQuestion();
}

// ──────────────────────────────────────────
// QUESTION TRACKER
// ──────────────────────────────────────────
function renderQuestionTracker() {
    const grid = document.getElementById('trackerGrid');
    grid.innerHTML = quizState.questions.map((q, i) => `
        <div class="tracker-dot" id="tracker-${i}" onclick="goToQuestion(${i})">${i + 1}</div>
    `).join('');
}

function updateTracker() {
    quizState.questions.forEach((q, i) => {
        const dot = document.getElementById(`tracker-${i}`);
        if (!dot) return;
        dot.className = 'tracker-dot';

        if (i === quizState.currentIndex) {
            dot.classList.add('current');
        } else if (quizState.answers[q.id] !== undefined) {
            dot.classList.add('answered');
        }
    });
}

// ──────────────────────────────────────────
// SUBMIT QUIZ
// ──────────────────────────────────────────
function confirmSubmit() {
    const answered = Object.keys(quizState.answers).length;
    const total = quizState.questions.length;
    const unanswered = total - answered;

    const modal = document.getElementById('submitModal');
    document.getElementById('modalMessage').innerHTML = unanswered > 0
        ? `You have <strong>${unanswered}</strong> unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`
        : `You have answered all <strong>${total}</strong> questions. Ready to submit?`;

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('submitModal').classList.remove('active');
}

function submitQuiz(autoSubmit = false) {
    if (quizState.isSubmitted) return;
    quizState.isSubmitted = true;

    closeModal();
    clearInterval(quizState.timerInterval);
    quizState.endTime = new Date().toISOString();

    const results = calculateResults();

    // Submit to backend
    submitToBackend(results);

    // Render results
    renderResults(results);
    showView('result');

    if (autoSubmit) {
        showToast('⏰ Quiz auto-submitted due to time expiry');
    }
}

/**
 * Submit quiz results to the backend API using JWT auth
 */
async function submitToBackend(results) {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
        console.warn('No AUTH_TOKEN found — cannot save quiz result to backend');
        return;
    }

    if (quizState.isModuleQuiz) {
        // Submit to module quiz endpoint
        const payload = {
            moduleId: quizState.dbModuleId,
            score: results.correct,
            totalQuestions: results.total,
            percentage: results.percentage,
            passed: results.passed,
            timeTakenSeconds: results.timeTaken
        };

        try {
            const res = await fetch(`${API_BASE_URL}/api/v1/modules/${quizState.dbModuleId}/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                console.log('✅ Module quiz result saved to backend');
            } else {
                console.warn('⚠️ Failed to save module quiz result:', await res.text());
            }
        } catch (err) {
            console.warn('⚠️ Could not reach backend to save module quiz result:', err);
        }
        return;
    }

    // Single-skill quiz submit
    const payload = {
        tutorialId: quizState.moduleId,
        score: results.correct,
        totalQuestions: results.total,
        percentage: results.percentage,
        passed: results.passed,
        timeTakenSeconds: results.timeTaken
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/quiz/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            console.log('✅ Quiz result saved to backend');
        } else {
            console.warn('⚠️ Failed to save quiz result:', await res.text());
        }
    } catch (err) {
        console.warn('⚠️ Could not reach backend to save quiz result:', err);
    }
}

// ──────────────────────────────────────────
// SCORING
// ──────────────────────────────────────────
function calculateResults() {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const breakdown = quizState.questions.map(q => {
        const selected = quizState.answers[q.id];
        const isCorrect = selected === q.correctAnswer;
        const isAnswered = selected !== undefined;

        if (isAnswered && isCorrect) correct++;
        else if (isAnswered) wrong++;
        else unanswered++;

        return {
            questionId: q.id,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            selectedAnswer: selected !== undefined ? selected : null,
            isCorrect: isAnswered && isCorrect,
            explanation: q.explanation,
            sourceModule: q.sourceModule || quizState.moduleId
        };
    });

    const total = quizState.questions.length;
    const percentage = Math.round((correct / total) * 100);
    const passed = percentage >= QUIZ_CONFIG.passingPercentage;
    const timeTaken = (QUIZ_CONFIG.timeLimitMinutes * 60) - quizState.timeRemaining;

    return { correct, wrong, unanswered, total, percentage, passed, timeTaken, breakdown };
}

// ──────────────────────────────────────────
// RESULT VIEW RENDERING
// ──────────────────────────────────────────
function renderResults(results) {
    const status = results.passed ? 'pass' : 'fail';

    const icon = document.getElementById('resultIcon');
    icon.className = `result-icon ${status}`;
    icon.textContent = results.passed ? '🎉' : '😞';

    const title = document.getElementById('resultTitle');
    title.className = status;
    title.textContent = results.passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time';

    document.getElementById('resultSubtitle').textContent = results.passed
        ? `You've demonstrated strong knowledge in ${quizState.moduleName}`
        : `Keep studying ${quizState.moduleName} and try again`;

    renderRing(results.percentage, status);

    quizState.lastResults = results;

    document.getElementById('scoreCorrect').textContent = results.correct;
    document.getElementById('scoreWrong').textContent = results.wrong;
    document.getElementById('scoreUnanswered').textContent = results.unanswered;
    document.getElementById('scoreTime').textContent = formatTime(results.timeTaken);

    // Show certificate button if passed a module quiz
    const certWrap = document.getElementById('certActionWrap');
    if (certWrap) {
        if (results.passed && quizState.isModuleQuiz && quizState.dbModuleId) {
            certWrap.style.display = 'flex';
        } else {
            certWrap.style.display = 'none';
        }
    }
}

function renderRing(percentage, status) {
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (percentage / 100) * circumference;

    const ringFill = document.getElementById('ringFill');
    ringFill.setAttribute('stroke-dasharray', circumference);
    ringFill.className.baseVal = `ring-fill ${status}`;

    setTimeout(() => {
        ringFill.setAttribute('stroke-dashoffset', offset);
    }, 200);

    document.getElementById('ringPercent').textContent = `${percentage}%`;
}

function renderReview(breakdown) {
    const container = document.getElementById('reviewContainer');
    const letters = ['A', 'B', 'C', 'D'];

    const reviewModuleEl = document.getElementById('reviewModuleName');
    if (reviewModuleEl) {
        reviewModuleEl.textContent = quizState.moduleName;
    }

    container.innerHTML = breakdown.map((item, idx) => {
        const isCorrect = item.isCorrect;
        const isSkipped = item.selectedAnswer === null;
        const status = isCorrect ? 'correct' : 'wrong';
        const statusLabel = isCorrect ? '✓ Correct' : (isSkipped ? '— Skipped' : '✗ Wrong');

        const moduleTag = MODULE_REGISTRY[quizState.moduleId].sources.length > 1
            ? `<span class="review-module-tag">${item.sourceModule}</span>`
            : '';

        const optionsHtml = item.options.map((opt, i) => {
            let optClass = 'review-option';
            let indicator = '';

            if (i === item.correctAnswer) {
                optClass += ' correct-option';
                indicator = '<span class="option-indicator correct-indicator">✓</span>';
            }
            if (i === item.selectedAnswer && !isCorrect) {
                optClass += ' wrong-option';
                indicator = '<span class="option-indicator wrong-indicator">✗</span>';
            }
            if (i === item.selectedAnswer && isCorrect) {
                optClass += ' correct-option user-correct';
                indicator = '<span class="option-indicator correct-indicator">✓</span>';
            }

            return `
                <div class="${optClass}">
                    <span class="review-opt-letter">${letters[i]}</span>
                    <span class="review-opt-text">${escapeHtml(opt)}</span>
                    ${indicator}
                </div>
            `;
        }).join('');

        let feedbackHtml = '';
        if (isCorrect) {
            feedbackHtml = `<div class="review-feedback correct-feedback">✅ You answered correctly!</div>`;
        } else if (isSkipped) {
            feedbackHtml = `<div class="review-feedback skipped-feedback">⚠️ You skipped this question. Correct answer: <strong>${letters[item.correctAnswer]}</strong></div>`;
        } else {
            feedbackHtml = `<div class="review-feedback wrong-feedback">❌ Your answer: <strong>${letters[item.selectedAnswer]}</strong> — Correct answer: <strong>${letters[item.correctAnswer]}</strong></div>`;
        }

        return `
            <div class="review-item ${status}">
                <div class="review-q-header">
                    <span class="review-q-num">Question ${idx + 1}${moduleTag}</span>
                    <span class="review-q-status ${status}">${statusLabel}</span>
                </div>
                <div class="review-question">${escapeHtml(item.question)}</div>
                <div class="review-options-grid">${optionsHtml}</div>
                ${feedbackHtml}
                <div class="review-explanation">💡 ${escapeHtml(item.explanation)}</div>
            </div>
        `;
    }).join('');
}

function showReviewView() {
    if (quizState.lastResults) {
        renderReview(quizState.lastResults.breakdown);
    }
    showView('review');
}

function backToResults() {
    showView('result');
}

// ──────────────────────────────────────────
// RESULT ACTIONS
// ──────────────────────────────────────────
function retakeQuiz() {
    quizState.isSubmitted = false;
    quizState.answers = {};
    quizState.currentIndex = 0;
    startQuiz();
}

function goBackToQuizzes() {
    if (quizState.isModuleQuiz && quizState.dbModuleId) {
        window.location.href = `roadmaps/skills.html?courseId=${quizState.dbModuleId}`;
    } else {
        window.location.href = 'quizzes.html';
    }
}

function goToCertificate() {
    if (quizState.isModuleQuiz && quizState.dbModuleId) {
        window.location.href = `certificate.html?moduleId=${quizState.dbModuleId}`;
    } else {
        window.location.href = 'certificate.html';
    }
}

// ──────────────────────────────────────────
// UTILITY FUNCTIONS
// ──────────────────────────────────────────
function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ──────────────────────────────────────────
// KEYBOARD SHORTCUTS
// ──────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (quizState.isSubmitted || quizState.isLoading || !views.quiz.classList.contains('active')) return;

    switch (e.key) {
        case 'ArrowRight':
        case 'n':
            nextQuestion();
            break;
        case 'ArrowLeft':
        case 'p':
            prevQuestion();
            break;
        case '1': selectOptionByKey(0); break;
        case '2': selectOptionByKey(1); break;
        case '3': selectOptionByKey(2); break;
        case '4': selectOptionByKey(3); break;
    }
});

function selectOptionByKey(index) {
    const q = quizState.questions[quizState.currentIndex];
    if (q && q.options[index]) {
        selectOption(q.id, index);
    }
}

// ──────────────────────────────────────────
// PREVENT TAB CLOSE DURING QUIZ
// ──────────────────────────────────────────
window.addEventListener('beforeunload', (e) => {
    if (views.quiz.classList.contains('active') && !quizState.isSubmitted) {
        e.preventDefault();
        e.returnValue = '';
    }
});

// ══════════════════════════════════════════
// FAQ CHATBOT
// ══════════════════════════════════════════

const quizFaqData = [
    {
        question: "How many questions are in the quiz?",
        answer: "Each quiz attempt has 20 multiple-choice questions. For single-module quizzes, questions are randomly selected from a bank of 30. For combined quizzes (like Frontend), questions are drawn from multiple modules with weighted distribution."
    },
    {
        question: "What is the time limit?",
        answer: "You have 30 minutes to complete the quiz. A timer in the top bar will show your remaining time. When 5 minutes remain it turns yellow, and in the last minute it turns red."
    },
    {
        question: "Can I go back to previous questions?",
        answer: "Yes! Use the 'Previous' and 'Next' buttons to navigate between questions. You can also click any number in the Question Navigator to jump directly to that question."
    },
    {
        question: "What happens if time runs out?",
        answer: "If the timer reaches zero, your quiz is automatically submitted with whatever answers you've selected so far. Unanswered questions will be marked as skipped."
    },
    {
        question: "How is my score calculated?",
        answer: "Your score is calculated as (correct answers ÷ total questions) × 100%. Only questions you answered correctly count toward your score. There is no negative marking for wrong answers."
    },
    {
        question: "Can I retake the quiz?",
        answer: "Yes! After viewing your results, click the 'Retake Quiz' button. A new set of 20 questions will be randomly selected, so you'll get a different quiz each time."
    },
    {
        question: "What score do I need to pass?",
        answer: "You need at least 60% to pass the quiz. That means getting 12 or more questions correct out of 20. Your result page will show whether you passed or need to try again."
    },
    {
        question: "Are there keyboard shortcuts?",
        answer: "Yes! Press 1-4 to select options A-D. Use the Left/Right arrow keys (or P/N) to navigate between questions. These shortcuts only work while the quiz is active."
    },
    {
        question: "How does the module certification quiz work?",
        answer: "When you complete all skills in a module, you unlock the certification quiz. It draws 30 random questions from all the skills in that module, distributed proportionally. Pass with 60% or higher to earn your certificate."
    }
];

let chatbotOpen = false;

function toggleChatbot() {
    chatbotOpen = !chatbotOpen;
    const widget = document.getElementById('chatbotWidget');
    const toggle = document.getElementById('chatbotToggle');

    if (chatbotOpen) {
        widget.classList.add('open');
        toggle.classList.add('active');
        renderFaqList();
    } else {
        widget.classList.remove('open');
        toggle.classList.remove('active');
    }
}

function renderFaqList() {
    const container = document.getElementById('chatbotMessages');
    container.innerHTML = `
        <div class="chat-row chat-row-bot">
            <div class="chat-bubble chat-bubble-bot">
                👋 Hi! I'm your <strong>Quiz Helper</strong>. I can answer common questions about how the quiz works. Pick a question below!
            </div>
        </div>
        <div class="faq-list">
            ${quizFaqData.map((faq, i) => `
                <button class="faq-btn" onclick="handleFaqClick(${i})">
                    <span class="faq-icon">❓</span>
                    <span>${faq.question}</span>
                </button>
            `).join('')}
        </div>
    `;
    container.scrollTop = 0;
}

function handleFaqClick(index) {
    const faq = quizFaqData[index];
    const container = document.getElementById('chatbotMessages');

    container.innerHTML = `
        <div class="chat-row chat-row-user">
            <div class="chat-bubble chat-bubble-user">${faq.question}</div>
        </div>
        <div class="chat-row chat-row-bot">
            <div class="chat-bubble chat-bubble-bot">${faq.answer}</div>
        </div>
        <button class="chatbot-back-btn" onclick="renderFaqList()">
            ← Back to questions
        </button>
    `;
    container.scrollTop = 0;
}
