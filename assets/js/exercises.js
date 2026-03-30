/* ═══════════════════════════════════════════════
   path4career — Exercise Module Logic
   Code execution, validation, progressive unlock
   ═══════════════════════════════════════════════ */

// ─── LANGUAGE CONFIG ────────────────────────
const LANGUAGES = [
    { key: 'html', name: 'HTML', icon: '</>', color: '#E44D26', file: '../assets/data/exercises/html_exercises.json', paneLabel: 'index.html', editorType: 'html', editorUrl: 'editors/html-editor.html' },
    { key: 'css', name: 'CSS', icon: '{ }', color: '#264DE4', file: '../assets/data/exercises/css_exercises.json', paneLabel: 'styles.css', editorType: 'css', editorUrl: 'editors/css-editor.html' },
    { key: 'javascript', name: 'JavaScript', icon: 'JS', color: '#F7DF1E', file: '../assets/data/exercises/js_exercises.json', paneLabel: 'script.js', editorType: 'js', editorUrl: 'editors/javascript-editor.html' },
    { key: 'python', name: 'Python', icon: '🐍', color: '#3776AB', file: '../assets/data/exercises/python_exercises.json', paneLabel: 'main.py', editorType: 'python', editorUrl: 'editors/python-editor.html' },
    { key: 'java', name: 'Java', icon: '☕', color: '#ED8B00', file: '../assets/data/exercises/java_exercises.json', paneLabel: 'Main.java', editorType: 'java', pistonLang: 'java', pistonVer: '15.0.2', editorUrl: 'editors/java-editor.html' },
    { key: 'sql', name: 'SQL', icon: '🗄️', color: '#336791', file: '../assets/data/exercises/sql_exercises.json', paneLabel: 'query.sql', editorType: 'sql', editorUrl: 'editors/sql-editor.html' },
    { key: 'react', name: 'React', icon: '⚛️', color: '#61DAFB', file: '../assets/data/exercises/react_exercises.json', paneLabel: 'App.jsx', editorType: 'react', editorUrl: 'editors/react-editor.html' },
    { key: 'bootstrap', name: 'Bootstrap', icon: 'B', color: '#7952B3', file: '../assets/data/exercises/bootstrap_exercises.json', paneLabel: 'index.html', editorType: 'html', editorUrl: 'editors/bootstrap-editor.html' },
    { key: 'c', name: 'C', icon: 'C', color: '#A8B9CC', file: '../assets/data/exercises/c_exercises.json', paneLabel: 'main.c', editorType: 'piston', pistonLang: 'c', pistonVer: '10.2.0', editorUrl: 'editors/c-editor.html' },
    { key: 'cpp', name: 'C++', icon: 'C++', color: '#00599C', file: '../assets/data/exercises/cpp_exercises.json', paneLabel: 'main.cpp', editorType: 'piston', pistonLang: 'c++', pistonVer: '10.2.0', editorUrl: 'editors/cpp-editor.html' },
    { key: 'csharp', name: 'C#', icon: 'C#', color: '#239120', file: '../assets/data/exercises/csharp_exercises.json', paneLabel: 'Program.cs', editorType: 'piston', pistonLang: 'csharp', pistonVer: '6.12.0', editorUrl: 'editors/csharp-editor.html' },
    { key: 'django', name: 'Django', icon: 'dj', color: '#092E20', file: '../assets/data/exercises/django_exercises.json', paneLabel: 'views.py', editorType: 'python', editorUrl: 'editors/django-editor.html' },
    { key: 'dsa', name: 'DSA', icon: '🔄', color: '#FF9900', file: '../assets/data/exercises/dsa_exercises.json', paneLabel: 'algorithm.py', editorType: 'python', editorUrl: 'editors/dsa-editor.html' },
    { key: 'excel', name: 'Excel', icon: '📊', color: '#217346', file: '../assets/data/exercises/excel_exercises.json', paneLabel: 'formula.txt', editorType: 'text', editorUrl: 'editors/excel-editor.html' },
    { key: 'git', name: 'Git', icon: 'git', color: '#F05032', file: '../assets/data/exercises/git_exercises.json', paneLabel: 'terminal', editorType: 'text', editorUrl: 'editors/git-editor.html' },
    { key: 'jquery', name: 'jQuery', icon: 'jQ', color: '#0769AD', file: '../assets/data/exercises/jquery_exercises.json', paneLabel: 'index.html', editorType: 'html', editorUrl: 'editors/jquery-editor.html' },
    { key: 'mongodb', name: 'MongoDB', icon: '🍃', color: '#47A248', file: '../assets/data/exercises/mongodb_exercises.json', paneLabel: 'query.js', editorType: 'text', editorUrl: 'editors/mongodb-editor.html' },
    { key: 'mysql', name: 'MySQL', icon: '🐬', color: '#4479A1', file: '../assets/data/exercises/mysql_exercises.json', paneLabel: 'query.sql', editorType: 'sql', editorUrl: 'editors/mysql-editor.html' },
    { key: 'nodejs', name: 'Node.js', icon: 'Node', color: '#339933', file: '../assets/data/exercises/nodejs_exercises.json', paneLabel: 'app.js', editorType: 'js', editorUrl: 'editors/nodejs-editor.html' },
    { key: 'numpy', name: 'NumPy', icon: 'Nu', color: '#013243', file: '../assets/data/exercises/numpy_exercises.json', paneLabel: 'script.py', editorType: 'python', editorUrl: 'editors/numpy-editor.html' },
    { key: 'pandas', name: 'Pandas', icon: 'Pa', color: '#150458', file: '../assets/data/exercises/pandas_exercises.json', paneLabel: 'script.py', editorType: 'python', editorUrl: 'editors/pandas-editor.html' },
    { key: 'php', name: 'PHP', icon: 'PHP', color: '#777BB4', file: '../assets/data/exercises/php_exercises.json', paneLabel: 'index.php', editorType: 'piston', pistonLang: 'php', pistonVer: '8.2.3', editorUrl: 'editors/php-editor.html' },
    { key: 'xml', name: 'XML', icon: '</>', color: '#F9A825', file: '../assets/data/exercises/xml_exercises.json', paneLabel: 'data.xml', editorType: 'text', editorUrl: 'editors/xml-editor.html' }
];

// ─── STATE ──────────────────────────────────
let currentLanguage = null;
let currentExercises = [];
let currentExerciseIndex = 0;
let pyodideInstance = null;
let sqlDb = null;
let pyodideLoading = false;
let sqlLoading = false;

// ─── DOM ELEMENTS ───────────────────────────
const views = {
    language: document.getElementById('languageView'),
    list: document.getElementById('listView'),
    editor: document.getElementById('editorView')
};

// ─── LOCALSTORAGE HELPERS ───────────────────
function getProgress(langKey) {
    const data = localStorage.getItem(`cp_exercise_progress_${langKey}`);
    return data ? JSON.parse(data) : {};
}

function saveProgress(langKey, exerciseId, code, completed) {
    const progress = getProgress(langKey);
    progress[exerciseId] = { code, completed, timestamp: Date.now() };
    localStorage.setItem(`cp_exercise_progress_${langKey}`, JSON.stringify(progress));
}

function getCompletedCount(langKey) {
    const progress = getProgress(langKey);
    return Object.values(progress).filter(p => p.completed).length;
}

function isExerciseUnlocked(langKey, exerciseIndex) {
    return true;
}

// ─── VIEW SWITCHING ─────────────────────────
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove('active'));
    views[viewName].classList.add('active');
}

function showLanguageView() {
    switchView('language');
    renderLanguageGrid();
}

function showListView() {
    switchView('list');
    renderExerciseList();
}

function showEditorView() {
    switchView('editor');
}

// ─── TOAST ──────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ═══════════════════════════════════════════
// LANGUAGE SELECTION
// ═══════════════════════════════════════════
function renderLanguageGrid() {
    const grid = document.getElementById('languageGrid');
    grid.innerHTML = LANGUAGES.map(lang => {
        const completed = getCompletedCount(lang.key);
        const percent = Math.round((completed / 10) * 100);
        return `
            <div class="language-card" onclick="selectLanguage('${lang.key}')" style="--lang-color: ${lang.color}">
                <div style="position:absolute;top:0;left:0;right:0;height:3px;background:${lang.color};border-radius:16px 16px 0 0;"></div>
                <div class="language-card-icon" style="background: ${lang.color}22; color: ${lang.color}; border: 1.5px solid ${lang.color}44;">
                    ${lang.icon}
                </div>
                <div class="language-card-name">${lang.name}</div>
                <div class="language-card-meta">10 Exercises • Basic → Intermediate</div>
                <div class="language-card-progress">
                    <div class="language-card-progress-fill" style="width: ${percent}%; background: linear-gradient(90deg, ${lang.color}, ${lang.color}88);"></div>
                </div>
                <div class="language-card-progress-text">${completed}/10 completed</div>
            </div>
        `;
    }).join('');
}

async function selectLanguage(langKey) {
    const lang = LANGUAGES.find(l => l.key === langKey);
    if (!lang) return;

    currentLanguage = lang;

    try {
        const response = await fetch(lang.file);
        const data = await response.json();
        currentExercises = data.exercises;
        showListView();
    } catch (err) {
        showToast('❌ Failed to load exercises');
        console.error(err);
    }
}

// ═══════════════════════════════════════════
// EXERCISE LIST
// ═══════════════════════════════════════════
function renderExerciseList() {
    if (!currentLanguage) return;

    const badge = document.getElementById('listBadge');
    const progressText = document.getElementById('listProgress');
    const progressFill = document.getElementById('progressBarFill');
    const list = document.getElementById('exerciseList');

    const completed = getCompletedCount(currentLanguage.key);
    badge.textContent = currentLanguage.name;
    progressText.textContent = `${completed} / 10 Completed`;
    progressFill.style.width = `${(completed / 10) * 100}%`;

    list.innerHTML = currentExercises.map((ex, i) => {
        const progress = getProgress(currentLanguage.key);
        const isDone = progress[ex.id]?.completed;
        const unlocked = isExerciseUnlocked(currentLanguage.key, i);

        let stateClass = 'locked';
        let numberClass = 'locked';
        let statusIcon = '🔒';

        if (isDone) {
            stateClass = 'completed';
            numberClass = 'completed';
            statusIcon = '✅';
        } else if (unlocked) {
            stateClass = '';
            numberClass = 'unlocked';
            statusIcon = '▶️';
        }

        return `
            <div class="exercise-item ${stateClass}" onclick="${unlocked ? `openExercise(${i})` : 'showToast(\"🔒 Complete the previous exercise first!\")'}">
                <div class="exercise-number ${numberClass}">${isDone ? '✓' : (i + 1)}</div>
                <div class="exercise-info">
                    <div class="exercise-info-title">${ex.title}</div>
                    <div class="exercise-info-diff ${ex.difficulty}">${ex.difficulty}</div>
                </div>
                <div class="exercise-status-icon">${statusIcon}</div>
            </div>
        `;
    }).join('');
}

// ═══════════════════════════════════════════
// CODE EDITOR
// ═══════════════════════════════════════════
function openExercise(index) {
    currentExerciseIndex = index;
    const exercise = currentExercises[index];
    const progress = getProgress(currentLanguage.key);

    // Update UI elements
    document.getElementById('editorBadge').textContent = currentLanguage.name;
    document.getElementById('editorTitle').textContent = exercise.title;
    document.getElementById('questionNumber').textContent = `Exercise ${index + 1} of 10`;
    document.getElementById('questionDescription').innerHTML = exercise.description;
    document.getElementById('hintText').textContent = exercise.hint;
    document.getElementById('hintText').style.display = 'none';
    document.getElementById('btnHint').textContent = '💡 Show Hint';

    // Setup Solution
    document.getElementById('solutionText').style.display = 'none';
    document.getElementById('btnSolution').textContent = '📝 View Solution';
    document.getElementById('btnSolution').style.background = 'var(--bg-card)';
    document.getElementById('solutionCode').textContent = exercise.solutionCode || exercise.expectedOutput || 'No solution available.';

    // Difficulty badge
    const diffBadge = document.getElementById('editorDifficulty');
    diffBadge.textContent = exercise.difficulty;
    diffBadge.className = `difficulty-badge ${exercise.difficulty}`;

    // Load saved code or starter code
    const savedCode = progress[exercise.id]?.code;
    const iframe = document.getElementById('editorIframe');
    
    // Clear previous onload to prevent duplicates
    iframe.onload = null;
    iframe.src = currentLanguage.editorUrl;
    
    iframe.onload = () => {
        try {
            const doc = iframe.contentWindow.document;
            const textarea = doc.getElementById('cssInput') || doc.getElementById('reactInput') || doc.getElementById('jsInput') || doc.getElementById('pythonInput') || doc.getElementById('javaInput') || doc.getElementById('sqlInput') || doc.getElementById('cInput') || doc.getElementById('cppInput') || doc.getElementById('csharpInput') || doc.getElementById('htmlInput') || doc.getElementById('nodejsInput') || doc.getElementById('phpInput') || doc.getElementById('dsaInput') || doc.getElementById('gitInput') || doc.getElementById('mongodbInput') || doc.getElementById('numpyInput') || doc.getElementById('pandasInput') || doc.getElementById('xmlInput') || doc.getElementById('jqueryInput') || doc.getElementById('bootstrapInput') || doc.getElementById('djangoInput') || doc.getElementById('typescriptInput') || doc.getElementById('mysqlInput') || doc.getElementById('formulaInput') || doc.querySelector('textarea');
            if (textarea) {
                textarea.value = savedCode || exercise.starterCode;
                textarea.addEventListener('input', () => {
                    const code = textarea.value;
                    const prgs = getProgress(currentLanguage.key);
                    const existing = prgs[exercise.id] || {};
                    saveProgress(currentLanguage.key, exercise.id, code, existing.completed || false);
                });
            }
        } catch(e) {
            console.error("Error accessing iframe: ", e);
        }
    };

    // Hide feedback & next button
    document.getElementById('resultFeedback').style.display = 'none';
    document.getElementById('nextExerciseBar').style.display = 'none';

    // Show completed state if already done
    if (progress[exercise.id]?.completed) {
        showSuccessFeedback();
        if (index < currentExercises.length - 1) {
            document.getElementById('nextExerciseBar').style.display = 'block';
        }
    }

    // On mobile, always start by showing the question panel for a new exercise
    if (window.innerWidth <= 768) {
        showPanel('question');
    }

    showEditorView();
}

function toggleHint() {
    const hintText = document.getElementById('hintText');
    const btn = document.getElementById('btnHint');
    if (hintText.style.display === 'none') {
        hintText.style.display = 'block';
        btn.textContent = '💡 Hide Hint';
    } else {
        hintText.style.display = 'none';
        btn.textContent = '💡 Show Hint';
    }
}

function toggleSolution() {
    const solText = document.getElementById('solutionText');
    const btn = document.getElementById('btnSolution');
    if (solText.style.display === 'none') {
        solText.style.display = 'block';
        btn.textContent = '📝 Hide Solution';
        btn.style.background = 'rgba(0, 255, 179, 0.1)';
    } else {
        solText.style.display = 'none';
        btn.textContent = '📝 View Solution';
        btn.style.background = 'var(--bg-card)';
    }
}

// ─── MOBILE PANEL TOGGLE ────────────────────
function showPanel(panelName) {
    const questionPanel = document.getElementById('questionPanel');
    const editorWorkspace = document.getElementById('editorWorkspace');
    const btnQuestion = document.getElementById('btnShowQuestion');
    const btnEditor = document.getElementById('btnShowEditor');

    if (panelName === 'question') {
        questionPanel.classList.remove('mobile-hidden');
        editorWorkspace.classList.add('mobile-hidden');
        btnQuestion.classList.add('active');
        btnEditor.classList.remove('active');
    } else if (panelName === 'editor') {
        questionPanel.classList.add('mobile-hidden');
        editorWorkspace.classList.remove('mobile-hidden');
        btnQuestion.classList.remove('active');
        btnEditor.classList.add('active');
    }
}

// Ensure both panels are visible when resizing back to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('questionPanel')?.classList.remove('mobile-hidden');
        document.getElementById('editorWorkspace')?.classList.remove('mobile-hidden');
    } else {
        // Reset to question panel on resize to mobile if both are visible
        const btnQuestion = document.getElementById('btnShowQuestion');
        if (btnQuestion && !btnQuestion.classList.contains('active') && !document.getElementById('btnShowEditor')?.classList.contains('active')) {
             showPanel('question');
        }
    }
});

function resetCode() {
    const exercise = currentExercises[currentExerciseIndex];
    const iframe = document.getElementById('editorIframe');
    if (iframe && iframe.contentWindow) {
        const doc = iframe.contentWindow.document;
        const textarea = doc.querySelector('textarea');
        if (textarea) textarea.value = exercise.starterCode;
        
        const consoleDiv = doc.getElementById('consoleDiv');
        if (consoleDiv) consoleDiv.innerHTML = '<span class="log-info">Ready to run code...</span>';
    }
    document.getElementById('resultFeedback').style.display = 'none';
    document.getElementById('nextExerciseBar').style.display = 'none';
}

// Auto-save is now handled inside iframe.onload

// ═══════════════════════════════════════════
// CODE EXECUTION
// ═══════════════════════════════════════════
function runCode() {
    const iframe = document.getElementById('editorIframe');
    if (!iframe || !iframe.contentWindow) return;
    try {
        const doc = iframe.contentWindow.document;
        
        // Call native iframe run methods
        const runBtn = doc.getElementById('runBtn');
        if (runBtn) {
            runBtn.click();
        }
    } catch (e) {
        alert("Cross-Origin Error in runCode: " + e.message + ". The page must be served via a web server (like localhost or Liver Server) and not directly from the file system (file://) for the Run Code and Submit buttons to work across frames.");
    }
}


// ═══════════════════════════════════════════
// CODE SUBMISSION & VALIDATION
// ═══════════════════════════════════════════
async function submitCode() {
    let code = '';
    const iframe = document.getElementById('editorIframe');
    try {
        if (iframe && iframe.contentWindow) {
            const doc = iframe.contentWindow.document;
            const textarea = doc.getElementById('cssInput') || doc.getElementById('reactInput') || doc.getElementById('jsInput') || doc.getElementById('pythonInput') || doc.getElementById('javaInput') || doc.getElementById('sqlInput') || doc.getElementById('cInput') || doc.getElementById('cppInput') || doc.getElementById('csharpInput') || doc.getElementById('htmlInput') || doc.getElementById('nodejsInput') || doc.getElementById('phpInput') || doc.getElementById('dsaInput') || doc.getElementById('gitInput') || doc.getElementById('mongodbInput') || doc.getElementById('numpyInput') || doc.getElementById('pandasInput') || doc.getElementById('xmlInput') || doc.getElementById('jqueryInput') || doc.getElementById('bootstrapInput') || doc.getElementById('djangoInput') || doc.getElementById('typescriptInput') || doc.getElementById('mysqlInput') || doc.getElementById('formulaInput') || doc.querySelector('textarea');
            if (textarea) code = textarea.value.trim();
        }
    } catch (e) {
        alert("Cross-Origin Error or iframe error: " + e.message + ". The page must be served via a web server (like localhost or Liver Server) and not directly from the file system (file://) for the Run Code and Submit buttons to work across frames.");
        return;
    }
    const exercise = currentExercises[currentExerciseIndex];

    if (!code || code === exercise.starterCode.trim()) {
        showToast('⚠️ Please write some code first!');
        return;
    }

    // First run the code
    await runCodeAndWait(code);

    // Then validate
    const isCorrect = validateExercise(exercise, code);

    if (isCorrect) {
        // Save progress
        saveProgress(currentLanguage.key, exercise.id, code, true);
        showSuccessFeedback();

        // Show next button if not last exercise
        if (currentExerciseIndex < currentExercises.length - 1) {
            document.getElementById('nextExerciseBar').style.display = 'block';
        } else {
            showToast('🎉 All exercises completed!');
        }
    } else {
        showFailureFeedback();
        // Save code but not completed
        saveProgress(currentLanguage.key, exercise.id, code, false);
    }
}

async function runCodeAndWait(code) {
    runCode();
    // Wait for async execution in the iframe
    await new Promise(resolve => setTimeout(resolve, 800));
}

function validateExercise(exercise, code) {
    const type = exercise.validationType;
    const value = exercise.validationValue;

    switch (type) {
        case 'contains':
            return normalizeHTML(code).includes(normalizeHTML(value));

        case 'containsAll':
            if (Array.isArray(value)) {
                const normalized = normalizeHTML(code);
                return value.every(v => normalized.includes(normalizeHTML(v)));
            }
            return false;

        case 'outputContains':
            return getConsoleOutput().includes(value);

        case 'outputContainsAll':
            if (Array.isArray(value)) {
                const output = getConsoleOutput();
                return value.every(v => output.includes(v));
            }
            return false;

        case 'domContains':
            return getIframeContent().includes(value);

        case 'domContainsAll':
            if (Array.isArray(value)) {
                const content = getIframeContent();
                return value.every(v => content.includes(v));
            }
            return false;

        case 'sqlResult':
            // For SQL: check if output area has the expected content
            const sqlOutput = getConsoleOutput();
            return sqlOutput.includes(value) || sqlOutput.includes('rows returned');

        case 'sqlExec':
            const sqlOut = getConsoleOutput();
            return sqlOut.includes('successfully') || sqlOut.includes('rows returned');

        default:
            // Fallback: check if code is not just the starter
            return code.trim() !== exercise.starterCode.trim();
    }
}

function normalizeHTML(str) {
    return str.replace(/\s+/g, ' ').replace(/\s*>\s*/g, '>').replace(/\s*<\s*/g, '<').trim().toLowerCase();
}

function getConsoleOutput() {
    try {
        const iframe = document.getElementById('editorIframe');
        if (iframe && iframe.contentWindow) {
            const doc = iframe.contentWindow.document;
            const consoleDiv = doc.getElementById('consoleDiv');
            if (consoleDiv) return consoleDiv.textContent || '';
            const outputContent = doc.getElementById('outputContent');
            if (outputContent) return outputContent.textContent || outputContent.innerText || '';
            const outputDiv = doc.getElementById('outputDiv');
            if (outputDiv) return outputDiv.textContent || outputDiv.innerText || '';
        }
    } catch(e) {}
    return '';
}

function getIframeContent() {
    try {
        const iframe = document.getElementById('editorIframe');
        if (iframe && iframe.contentWindow) {
            const doc = iframe.contentWindow.document;
            const ids = ['htmlOutput', 'outputIframe', 'previewFrame', 'reactOutput'];
            for (const id of ids) {
                const inner = doc.getElementById(id);
                if (inner && inner.contentWindow) {
                    const text = inner.contentWindow.document.body ? (inner.contentWindow.document.body.textContent || '') : '';
                    if (text) return text;
                }
            }
        }
    } catch(e) {}
    return '';
}

// ─── FEEDBACK UI ────────────────────────────
function showSuccessFeedback() {
    const feedback = document.getElementById('resultFeedback');
    feedback.style.display = 'block';
    feedback.className = 'result-feedback success';
    document.getElementById('feedbackContent').innerHTML = `
        <div class="feedback-icon">✅</div>
        <div class="feedback-text">
            <h3>Correct! Great job!</h3>
            <p>Your solution passes all validation checks.</p>
        </div>
    `;
}

function showFailureFeedback() {
    const feedback = document.getElementById('resultFeedback');
    feedback.style.display = 'block';
    feedback.className = 'result-feedback failure';
    document.getElementById('feedbackContent').innerHTML = `
        <div class="feedback-icon">❌</div>
        <div class="feedback-text">
            <h3>Not quite right</h3>
            <p>Check the expected output and try again. Use the hint if you're stuck!</p>
        </div>
    `;
}

// ─── NEXT EXERCISE ──────────────────────────
function goToNextExercise() {
    if (currentExerciseIndex < currentExercises.length - 1) {
        openExercise(currentExerciseIndex + 1);
    }
}

// ═══════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════
renderLanguageGrid();

// ══════════════════════════════════════════
// FAQ CHATBOT
// ══════════════════════════════════════════

const exerciseFaqData = [
    {
        question: "How many exercises are there per language?",
        answer: "Each programming language has 10 exercises, ranging from basic fundamentals to intermediate-level challenges. You'll progressively build your skills as you move through them."
    },
    {
        question: "How does the progressive unlock system work?",
        answer: "Exercises are unlocked sequentially. You must complete Exercise 1 before Exercise 2 becomes available, and so on. This ensures you build a solid foundation before tackling harder problems."
    },
    {
        question: "Is my code saved automatically?",
        answer: "Yes! Your code is auto-saved to your browser's local storage as you type. If you leave and come back, your progress and code will still be there — no account needed."
    },
    {
        question: "What happens when I click 'Submit'?",
        answer: "When you submit, the system first runs your code and then validates your output against the expected result. If it's correct, you'll see a ✅ success message and the next exercise will be unlocked."
    },
    {
        question: "Can I use hints?",
        answer: "Absolutely! Each exercise has a hint available. Click the '💡 Show Hint' button below the question description to reveal a helpful tip. There's no penalty for using hints."
    },
    {
        question: "Which programming languages are supported?",
        answer: "We currently support 7 languages: HTML, CSS, JavaScript, Python, Java, SQL, and React. Each has its own dedicated code editor and execution environment."
    },
    {
        question: "How is my code executed?",
        answer: "It depends on the language! HTML/CSS/React run directly in your browser via an iframe. JavaScript runs in a sandboxed iframe. Python uses Pyodide (WebAssembly). Java compiles remotely via the Piston API. SQL uses an in-browser database engine (sql.js)."
    },
    {
        question: "Can I reset my code to the starter template?",
        answer: "Yes! Click the '↺ Reset' button in the editor to restore the original starter code. Note that this will replace your current code, but your completion status will remain."
    },
    {
        question: "What if my answer is marked wrong but I think it's correct?",
        answer: "The validation checks for specific patterns in your code or output. Make sure your output matches the expected format exactly (including capitalization and spacing). Try using the hint for guidance on what the system expects."
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
        <div class="chat-bubble bot">
            👋 Hi! I'm your <strong>Exercise Helper</strong>. I can answer common questions about how coding exercises work. Pick a question below!
        </div>
        <div class="faq-list">
            ${exerciseFaqData.map((faq, i) => `
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
    const faq = exerciseFaqData[index];
    const container = document.getElementById('chatbotMessages');

    container.innerHTML = `
        <div class="chat-bubble user">${faq.question}</div>
        <div class="chat-bubble bot">${faq.answer}</div>
        <button class="chatbot-back-btn" onclick="renderFaqList()">
            ← Back to questions
        </button>
    `;
    container.scrollTop = 0;
}

