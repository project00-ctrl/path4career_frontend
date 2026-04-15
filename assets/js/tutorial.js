document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // CONFIG
    // ==========================================
    const API_BASE = "https://path4career-backend.onrender.com";

    // ==========================================
    // STATE MANAGEMENT
    // ==========================================
    let currentPageIndex = 0;
    let tutorialPages = [];

    // Read course from URL param ?course=, fallback to localStorage, then default
    const urlParams = new URLSearchParams(window.location.search);
    function normalizeCourseFile(fileName) {
        // If a caller passes a path (e.g. ".../jsPages.json"), only keep the basename.
        return String(fileName || '').split('/').pop().trim();
    }

    let currentCourseFile =
        normalizeCourseFile(urlParams.get('course')) ||
        normalizeCourseFile(localStorage.getItem('path4careerCourse')) ||
        'htmlPages.json';

    const topicParam = urlParams.get('topic');
    const tagParam = urlParams.get('tag');

    // Skill-completion tracking (from skills.html)
    const _skillId = urlParams.get('skillId');
    const _moduleId = urlParams.get('moduleId');

    // Reverse map: course file → DB tutorial_id (lowercase name from tutorials-config.json)
    const COURSE_TO_TUTORIAL_MAP = {
        'htmlPages.json': 'html', 'cssPages.json': 'css', 'jsPages.json': 'javascript',
        'bootstrapPages.json': 'bootstrap', 'reactPages.json': 'react',
        'jqueryPages.json': 'jquery', 'xmlPages.json': 'xml',
        'pythonPages.json': 'python', 'javaPages.json': 'java',
        'phpPages.json': 'php', 'cPages.json': 'c', 'cInc.json': 'c++',
        'cSharpPages.json': 'c#', 'nodejsPages.json': 'node.js',
        'djangoPages.json': 'django', 'sqlPages.json': 'sql',
        'mysqlPages.json': 'mysql', 'mongodbPages.json': 'mongodb',
        'excelPages.json': 'excel', 'gitPages.json': 'git',
        'numpyPages.json': 'numpy', 'pandasPages.json': 'pandas',
        'dsaPages.json': 'dsa',
        'angularPages.json': 'angular', 'aspPages.json': 'asp.net',
        'awsPages.json': 'aws', 'clickhousePages.json': 'clickhouse',
        'datasciencePages.json': 'datascience', 'denoPages.json': 'deno',
        'dockerPages.json': 'docker', 'fastapiPages.json': 'fastapi',
        'flaskPages.json': 'flask', 'goPages.json': 'go',
        'graphqlPages.json': 'graphql', 'kubernetesPages.json': 'kubernetes',
        'matplotlibPages.json': 'matplotlib', 'nestPages.json': 'nestjs',
        'nextjsPages.json': 'nextjs', 'postgresqlPages.json': 'postgresql',
        'powerbiPages.json': 'powerbi', 'pytorchPages.json': 'pytorch',
        'rPages.json': 'r', 'restapiPages.json': 'restapi',
        'seabornPages.json': 'seaborn', 'sparkPages.json': 'spark',
        'springbootPages.json': 'springboot', 'tailwindcssPages.json': 'tailwindcss',
        'typescriptPages.json': 'typescript', 'vuePages.json': 'vue',
        'aiPages.json': 'ai', 'tutorialPages.json': 'tutorial'
    };

    // Reverse: DB tutorial_id → quiz URL module key (for redirecting back to quiz)
    const DB_TUTORIAL_TO_QUIZ_MODULE = {
        'javascript': 'js', 'c++': 'cpp', 'c#': 'csharp', 'node.js': 'nodejs'
    };
    function getQuizModuleKey(dbTutorialId) {
        return DB_TUTORIAL_TO_QUIZ_MODULE[dbTutorialId] || dbTutorialId;
    }

    const contentArea = document.querySelector('.content-area');
    const sidebar = document.querySelector('.sidebar-menu');
    const courseLinks = document.querySelectorAll('.course-link');

    // ==========================================
    // DEEP-LINK HELPERS
    // ==========================================

    /** Find the tutorial page index that best matches a topic slug */
    function findTopicIndex(topicSlug) {
        const slug = topicSlug.toLowerCase().replace(/\s+/g, '-');
        const idx = tutorialPages.findIndex(page => {
            const titleSlug = (page.title || '')
                .toLowerCase()
                .replace(/\s+/g, '-');
            return titleSlug === slug || titleSlug.includes(slug) || slug.includes(titleSlug);
        });
        return idx >= 0 ? idx : 0;
    }

    /** Scroll to an element matching the tag name and highlight it */
    function scrollToTag(tag) {
        if (!contentArea) return;
        const cleanTag = tag.toLowerCase().replace(/[-_]/g, ' ').trim();

        // Strategy 1: Search all headings (h1-h6) for matching text
        const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const el of headings) {
            const text = el.textContent.toLowerCase();
            if (text.includes(cleanTag) || text.includes(tag)) {
                highlightAndScroll(el);
                return;
            }
        }

        // Strategy 2: Search code elements, <b>, <strong>, table cells
        const codeEls = contentArea.querySelectorAll('code, b, strong, td, th');
        for (const el of codeEls) {
            const text = el.textContent.toLowerCase().trim();
            if (text === cleanTag || text === `<${cleanTag}>` || text === tag) {
                highlightAndScroll(el);
                return;
            }
        }

        // Strategy 3: Broad text search in paragraphs
        const paras = contentArea.querySelectorAll('p, li, dd');
        for (const el of paras) {
            const text = el.textContent.toLowerCase();
            if (text.includes(`<${cleanTag}>`) || text.includes(cleanTag)) {
                highlightAndScroll(el);
                return;
            }
        }
    }

    /** Scroll to element and apply a highlight flash */
    function highlightAndScroll(el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('tag-highlight');
        setTimeout(() => el.classList.remove('tag-highlight'), 3000);
    }

    // ==========================================
    // AUTH HELPER
    // ==========================================
    function getAuthToken() {
        // Try cookie first
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'AUTH_TOKEN') return value;
        }
        // Fallback to localStorage
        return localStorage.getItem('AUTH_TOKEN') || localStorage.getItem('token');
    }

    // ==========================================
    // LOAD COURSE (SAFE FETCH)
    // ==========================================
    async function loadCourse(fileName, isSwitchingCourse = false) {

        try {
            const normalizedCourseFile = normalizeCourseFile(fileName);
            currentCourseFile = normalizedCourseFile;

            const response = await fetch(`../assets/data/tutorials/${normalizedCourseFile}`);

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid JSON structure");
            }

            tutorialPages = data;

            localStorage.setItem('path4careerCourse', normalizedCourseFile);

            buildSidebar();

            // Deep-link: if a topic param exists, find the matching page
            if (topicParam && !isSwitchingCourse) {
                const targetIdx = findTopicIndex(topicParam);
                renderPage(targetIdx);
                // After render, scroll to tag if present
                if (tagParam) {
                    setTimeout(() => scrollToTag(tagParam), 300);
                }
            } else {
                const savedPage = parseInt(
                    localStorage.getItem(`path4careerSavedPage_${fileName}`)
                );

                if (!isSwitchingCourse &&
                    !isNaN(savedPage) &&
                    savedPage < tutorialPages.length) {

                    renderPage(savedPage);
                } else {
                    renderPage(0);
                }
            }

        } catch (error) {
            console.error("Course loading error:", error);
            if (contentArea) {
                contentArea.innerHTML =
                    `<h2 style="color:#ff4757; padding:40px;">
                        Error loading course data.<br>
                        Check file path & ensure Live Server is running.
                    </h2>`;
            }
        }

    }

    // ==========================================
    // BUILD SIDEBAR
    // ==========================================
    function buildSidebar() {
        if (!sidebar) return;

        sidebar.innerHTML = '';

        tutorialPages.forEach((page, index) => {
            const li = document.createElement('li');
            li.textContent = page.title;
            li.dataset.index = index;
            sidebar.appendChild(li);
        });

        updateSidebarActive();
    }

    // ==========================================
    // RENDER PAGE (SAFE)
    // ==========================================
    function renderPage(index) {

        if (!tutorialPages.length) return;

        if (index < 0 || index >= tutorialPages.length) {
            index = 0;
        }

        currentPageIndex = index;

        if (contentArea) {
            contentArea.innerHTML =
                tutorialPages[currentPageIndex].content;
            contentArea.scrollTo(0, 0);

            // Fix 1: Remove "Open Editor" buttons on the first page only
            if (currentPageIndex === 0) {
                const clickables = contentArea.querySelectorAll('button, a');
                clickables.forEach(el => {
                    const text = el.textContent.trim().toLowerCase();
                    if (text.includes('open') && text.includes('editor')) {
                        const wrapper = el.closest('.syntax-wrapper, .editor-box, .playground, div');
                        if (wrapper) wrapper.remove();
                        else el.remove();
                    }
                });
            }

            // On the last page, replace next-btn with "Mark as Completed"
            // Works both when accessed from skills.html (with skillId) or directly (without)
            if (currentPageIndex === tutorialPages.length - 1) {
                const tutorialIdStr = COURSE_TO_TUTORIAL_MAP[currentCourseFile];
                if (_skillId || tutorialIdStr) {
                    replaceNextWithComplete();
                }
            }
        }

        updateSidebarActive();

        // Save page index per course
        localStorage.setItem(
            `path4careerSavedPage_${currentCourseFile}`,
            currentPageIndex
        );
    }

    // ==========================================
    // REPLACE NEXT BTN WITH MARK AS COMPLETED
    // ==========================================
    function replaceNextWithComplete() {
        if (!contentArea) return;

        // Find all next-btn elements on the current page and replace with "Mark as Completed"
        const nextBtns = contentArea.querySelectorAll('.next-btn');
        nextBtns.forEach(btn => {
            const completeBtn = document.createElement('button');
            completeBtn.className = 'btn-primary complete-btn';
            completeBtn.innerHTML = '✅ Mark as Completed';
            completeBtn.style.cssText = `
                background: linear-gradient(135deg, #00c853, #00e676);
                color: #fff;
                border: none;
                padding: 10px 24px;
                border-radius: 8px;
                font-size: 15px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,200,83,0.3);
            `;
            completeBtn.addEventListener('mouseenter', () => {
                completeBtn.style.transform = 'translateY(-1px)';
                completeBtn.style.boxShadow = '0 4px 12px rgba(0,200,83,0.4)';
            });
            completeBtn.addEventListener('mouseleave', () => {
                completeBtn.style.transform = '';
                completeBtn.style.boxShadow = '0 2px 8px rgba(0,200,83,0.3)';
            });
            btn.replaceWith(completeBtn);
        });
    }

    // ==========================================
    // MARK AS COMPLETED (API CALL)
    // ==========================================
    async function markTutorialCompleted() {
        const token = getAuthToken();

        if (!token) {
            alert('Please log in to mark this tutorial as completed.');
            window.location.href = '../pages/auth/login.html';
            return;
        }

        try {
            let apiUrl;
            if (_skillId) {
                // Accessed from skills.html — use numeric skillId endpoint
                apiUrl = `${API_BASE}/api/v1/tutorials/complete/${_skillId}`;
            } else {
                // Accessed directly — use string tutorialId endpoint
                const tutorialIdStr = COURSE_TO_TUTORIAL_MAP[currentCourseFile];
                if (!tutorialIdStr) {
                    alert('Cannot determine tutorial ID. Please try again from the skills page.');
                    return;
                }
                apiUrl = `${API_BASE}/api/v1/tutorials/complete-tutorial/${encodeURIComponent(tutorialIdStr)}`;
            }

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 401 || res.status === 403) {
                alert('Session expired. Please log in again.');
                window.location.href = '../pages/auth/login.html';
                return;
            }

            if (!res.ok) {
                let errorMsg = `Failed: ${res.status}`;
                try {
                    const errBody = await res.json();
                    errorMsg = errBody.error || errorMsg;
                } catch (e) { /* ignore parse errors */ }
                throw new Error(errorMsg);
            }

            // Also update localStorage for backward compatibility
            if (_skillId && _moduleId) {
                localStorage.setItem(`skill_completed_${_moduleId}_${_skillId}`, 'true');
            }

            // Show success feedback
            showCompletionToast();

            // Redirect: back to skills page if we came from there, otherwise stay
            setTimeout(() => {
                if (_moduleId) {
                    window.location.href = `./roadmaps/skills.html?courseId=${_moduleId}`;
                } else {
                    // Came from direct access (e.g., quiz page) — go back or show quiz link
                    const tutorialIdStr = COURSE_TO_TUTORIAL_MAP[currentCourseFile];
                    if (tutorialIdStr) {
                        const quizKey = getQuizModuleKey(tutorialIdStr);
                        window.location.href = `./quiz.html?tutorialId=${quizKey}`;
                    } else {
                        window.history.back();
                    }
                }
            }, 1500);

        } catch (err) {
            console.error('Error marking completed:', err);
            alert('Failed to mark tutorial as completed.\n\n' + err.message + '\n\nThis skill may not have a tutorial_id set in the database. Please update it from the admin panel.');
        }
    }

    // ==========================================
    // SUCCESS TOAST
    // ==========================================
    function showCompletionToast() {
        const toast = document.createElement('div');
        toast.innerHTML = '🎉 Tutorial Completed!';
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #00c853, #00e676);
            color: #fff;
            padding: 16px 28px;
            border-radius: 12px;
            font-size: 16px;
            font-weight: 700;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,200,83,0.4);
            animation: slideIn 0.4s ease-out;
        `;
        document.body.appendChild(toast);

        // Add animation keyframes
        if (!document.getElementById('toast-anim-style')) {
            const style = document.createElement('style');
            style.id = 'toast-anim-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ==========================================
    // SIDEBAR ACTIVE STYLE
    // ==========================================
    function updateSidebarActive() {
        if (!sidebar) return;

        const items = sidebar.querySelectorAll('li');

        items.forEach((li, i) => {
            li.style = '';

            if (i === currentPageIndex) {
                li.style.color = '#020617'; // High-contrast dark text
                li.style.fontWeight = '700';
                li.style.borderLeft = '4px solid #00C985';
                li.style.paddingLeft = '20px';
                li.style.backgroundColor = 'rgba(0, 201, 133, 0.12)'; // Light green, "dont over shade"
                li.style.borderRadius = '0 10px 10px 0';
                li.style.marginRight = '8px';
            } else {
                li.style.color = '#475569'; 
                li.style.paddingLeft = '24px';
            }
        });
    }

    // ==========================================
    // TOP COURSE SWITCHING
    // ==========================================
    courseLinks.forEach(link => {

        link.addEventListener('click', (e) => {
            e.preventDefault();

            courseLinks.forEach(l => l.style.color = '');
            link.style.color = '#00ffb3';

            const fileToLoad =
                link.getAttribute('data-course');

            if (fileToLoad) {
                loadCourse(fileToLoad, true);
            }
        });

        // Highlight current course on load
        if (link.getAttribute('data-course') === currentCourseFile) {
            link.style.color = '#00ffb3';
        }
    });

    // ==========================================
    // SIDEBAR CLICK (EVENT DELEGATION)
    // ==========================================
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                renderPage(parseInt(e.target.dataset.index));
            }
        });
    }

    // ==========================================
    // NEXT / PREV / TRY IT / COMPLETE BUTTONS
    // ==========================================
    if (contentArea) {
        contentArea.addEventListener('click', (e) => {

            if (e.target.classList.contains('next-btn') &&
                !e.target.disabled) {

                renderPage(currentPageIndex + 1);
            }

            else if (e.target.classList.contains('prev-btn') &&
                !e.target.disabled) {

                renderPage(currentPageIndex - 1);
            }

            // Handle "Mark as Completed" button
            else if (e.target.classList.contains('complete-btn')) {
                e.target.disabled = true;
                e.target.innerHTML = '⏳ Saving...';
                markTutorialCompleted();
            }

            else if (e.target.classList.contains('btn-try-it')) {

                const wrapper =
                    e.target.closest('.syntax-wrapper');

                if (!wrapper) return;

                const pre = wrapper.querySelector('pre');
                if (!pre) return;

                const code = pre.textContent.trim();

                // Many tutorial snippets include wrapper tags such as <script>...</script>
                // and <style>...</style> (plus extra HTML around them). The editor iframes
                // usually expect *raw* code for their language pane, so we extract the
                // correct inner part when needed.
                function extractBetweenTags(raw, tagName) {
                    if (!raw) return raw;
                    const re = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'gi');
                    const parts = [];
                    let m;
                    while ((m = re.exec(raw)) !== null) {
                        parts.push(m[1]);
                    }
                    if (!parts.length) return raw;
                    return parts.join('\\n').trim();
                }

                let codeForEditor = code;
                if (currentCourseFile === 'jsPages.json') {
                    // Keep the full snippet for the JS editor (javascript-editor.html).
                    // Many tutorial snippets include HTML + <script>...</script> tags.
                    // The js-editor iframe can safely handle both.
                    codeForEditor = code;
                } else if (currentCourseFile === 'cssPages.json') {
                    // css-editor wraps CSS inside its own <style>, so save only CSS inside <style>.
                    codeForEditor = extractBetweenTags(code, 'style');
                }

                // Map course file to editor URL and localStorage key
                const editorMap = {
                    // IMPORTANT:
                    // Each editor iframe reads a specific localStorage key.
                    // If we write to the wrong key here, the editor will show stale/incorrect code.
                    'sqlPages.json':        { key: 'path4careerTempCode',     url: './editors/sql-editor.html' },
                    'cssPages.json':        { key: 'path4careerCssCode',      url: './editors/css-editor.html' },
                    'jsPages.json':         { key: 'path4careerJSCode',       url: './editors/js-editor.html' },
                    'javaPages.json':       { key: 'path4careerJavaCode',     url: './editors/java-editor.html' },
                    'pythonPages.json':     { key: 'path4careerPythonCode',   url: './editors/python-editor.html' },
                    'numpyPages.json':      { key: 'path4careerNumpyCode',    url: './editors/numpy-editor.html' },
                    'pandasPages.json':     { key: 'path4careerPandasCode',   url: './editors/pandas-editor.html' },
                    'jqueryPages.json':     { key: 'path4careerJqueryCode',   url: './editors/jquery-editor.html' },
                    'nodejsPages.json':     { key: 'path4careerNodejsCode',   url: './editors/nodejs-editor.html' },
                    'reactPages.json':      { key: 'path4careerReactCode',    url: './editors/react-editor.html' },
                    'htmlPages.json':       { key: 'path4careerHtmlCode',     url: './editors/html-editor.html' },
                    'xmlPages.json':        { key: 'path4careerXmlCode',      url: './editors/xml-editor.html' },
                    'bootstrapPages.json':  { key: 'path4careerBootstrapCode',url: './editors/bootstrap-editor.html' },
                    'mongodbPages.json':    { key: 'path4careerMongoDBCode',  url: './editors/mongodb-editor.html' },
                    'mysqlPages.json':      { key: 'path4careerMySQLCode',    url: './editors/mysql-editor.html' },
                    'phpPages.json':        { key: 'path4careerPhpCode',      url: './editors/php-editor.html' },
                    'djangoPages.json':     { key: 'path4careerDjangoCode',   url: './editors/django-editor.html' },
                    'typescriptPages.json': { key: 'path4careerTypeScriptCode', url: './editors/typescript-editor.html' },
                    'cPages.json':          { key: 'path4careerCCode',        url: './editors/c-editor.html' },
                    'cInc.json':            { key: 'path4careerCppCode',      url: './editors/cpp-editor.html' },
                    'cSharpPages.json':     { key: 'path4careerCSharpCode',   url: './editors/csharp-editor.html' },
                    'dsaPages.json':        { key: 'path4careerDSACode',      url: './editors/dsa-editor.html' },
                    'gitPages.json':        { key: 'path4careerGitCode',      url: './editors/git-editor.html' },
                    'excelPages.json':      { key: 'path4careerExcelCode',    url: './editors/excel-editor.html' },
                    // --- Additional mappings for all remaining courses ---
                    'angularPages.json':    { key: 'path4careerAngularCode',  url: './editors/angular-editor.html' },
                    'aspPages.json':        { key: 'path4careerAspCode',      url: './editors/asp-editor.html' },
                    'awsPages.json':        { key: 'path4careerAwsCode',      url: './editors/aws-editor.html' },
                    'clickhousePages.json': { key: 'path4careerClickhouseCode', url: './editors/clickhouse-editor.html' },
                    'datasciencePages.json':{ key: 'path4careerDatascienceCode', url: './editors/datascience-editor.html' },
                    'denoPages.json':       { key: 'path4careerDenoCode',     url: './editors/deno-editor.html' },
                    'dockerPages.json':     { key: 'path4careerDockerCode',   url: './editors/docker-editor.html' },
                    'fastapiPages.json':    { key: 'path4careerFastapiCode',  url: './editors/fastapi-editor.html' },
                    'flaskPages.json':      { key: 'path4careerFlaskCode',    url: './editors/flask-editor.html' },
                    'goPages.json':         { key: 'path4careerGoCode',       url: './editors/go-editor.html' },
                    'graphqlPages.json':    { key: 'path4careerGraphqlCode',  url: './editors/graphql-editor.html' },
                    'kubernetesPages.json': { key: 'path4careerKubernetesCode', url: './editors/kubernetes-editor.html' },
                    'matplotlibPages.json': { key: 'path4careerMatplotlibCode', url: './editors/datascience-editor.html' },
                    'nestPages.json':       { key: 'path4careerNestCode',     url: './editors/nest-editor.html' },
                    'nextjsPages.json':     { key: 'path4careerNextjsCode',   url: './editors/nextjs-editor.html' },
                    'postgresqlPages.json': { key: 'path4careerPostgresqlCode', url: './editors/postgresql-editor.html' },
                    'powerbiPages.json':    { key: 'path4careerPowerbiCode',  url: './editors/powerbi-editor.html' },
                    'pytorchPages.json':    { key: 'path4careerPytorchCode',  url: './editors/datascience-editor.html' },
                    'rPages.json':          { key: 'path4careerRCode',        url: './editors/r-editor.html' },
                    'restapiPages.json':    { key: 'path4careerRestapiCode',  url: './editors/restapi-editor.html' },
                    'seabornPages.json':    { key: 'path4careerSeabornCode',  url: './editors/datascience-editor.html' },
                    'sparkPages.json':      { key: 'path4careerSparkCode',    url: './editors/spark-editor.html' },
                    'springbootPages.json': { key: 'path4careerSpringbootCode', url: './editors/springboot-editor.html' },
                    'tailwindcssPages.json':{ key: 'path4careerTailwindCode', url: './editors/tailwind-editor.html' },
                    'vuePages.json':        { key: 'path4careerVueCode',      url: './editors/vue-editor.html' },
                    'aiPages.json':         { key: 'path4careerAiCode',       url: './editors/ai-editor.html' },
                    'tutorialPages.json':   { key: 'path4careerHtmlCode',     url: './editors/html-editor.html' }
                };

                const mapping = editorMap[currentCourseFile] || { key: 'path4careerHtmlCode', url: './editors/html-editor.html' };

                if (mapping.key) {
                    // Avoid stale/corrupted values from previous attempts.
                    try { localStorage.removeItem(mapping.key); } catch { /* ignore */ }
                    localStorage.setItem(mapping.key, codeForEditor);
                }

                window.open(mapping.url, '_blank');
            }
        });
    }

    // Editor modal removed — Try It buttons now navigate directly to /editors/ pages

    // ==========================================
    // MOBILE SIDEBAR TOGGLE
    // ==========================================
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const leftSidebar = document.getElementById('leftSidebar');
    const sidebarClose = document.getElementById('sidebarClose');

    function openSidebar() {
        if (leftSidebar) leftSidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (leftSidebar) leftSidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', openSidebar);
    }
    if (sidebarClose) {
        sidebarClose.addEventListener('click', closeSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when a sidebar item is clicked (on mobile)
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    }

    // Auto-close sidebar on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });

    // ==========================================
    // DYNAMIC RIGHT SIDEBAR (fetch from API)
    // ==========================================
    async function loadRightSidebar() {
        const rightSidebar = document.getElementById('rightSidebar');
        if (!rightSidebar) return;

        try {
            // Load tutorials config so we can link to valid course files
            let tutorialConfig = null;
            try {
                const cfgRes = await fetch('../assets/data/tutorials-config.json');
                if (cfgRes.ok) tutorialConfig = await cfgRes.json();
            } catch { /* ignore */ }

            const normalize = (s) => (s || '')
                .toLowerCase()
                .replace(/&/g, 'and')
                .replace(/[^a-z0-9]+/g, ' ')
                .trim();

            const tutorialFileByName = new Map();
            if (tutorialConfig && Array.isArray(tutorialConfig.tutorials)) {
                tutorialConfig.tutorials.forEach(t => {
                    tutorialFileByName.set(normalize(t.name), t.file);
                });
            }

            const res = await fetch('https://path4career-backend.onrender.com/api/user/modules');
            if (!res.ok) throw new Error('API error');
            const modules = await res.json();

            // Only show courses that have tutorial content configured
            const candidates = (modules || []).filter(m => {
                const n = normalize(m?.name);
                if (!n) return false;
                if (tutorialFileByName.has(n)) return true;
                return [...tutorialFileByName.keys()].some(key => key.includes(n) || n.includes(key));
            });

            // Show up to 5 suggested courses
            const suggestions = candidates.slice(0, 5);
            if (suggestions.length === 0) {
                rightSidebar.style.display = 'none';
                return;
            }

            const courseIcons = ['🌐', '⚛️', '🗄️', '🐍', '📊', '☕', '💎', '🔧'];

            let html = '<div class="right-sidebar-title">Suggested Courses</div>';
            html += suggestions.map((m, i) => {
                const icon = courseIcons[i % courseIcons.length];
                // Try to find a matching tutorials-config entry; fallback to current course
                const n = normalize(m.name);
                let courseFile =
                    tutorialFileByName.get(n) ||
                    [...tutorialFileByName.entries()].find(([key]) => key.includes(n) || n.includes(key))?.[1] ||
                    currentCourseFile ||
                    'htmlPages.json';
                return `
                <div class="course-card">
                    <h4 class="card-title">
                        <span class="icon">${icon}</span> ${m.name || 'Course'}
                    </h4>
                    <p class="card-desc">${m.description || 'Explore this course to learn more.'}</p>
                    <button class="gradient-btn"
                        onclick="window.location.href='./roadmaps/skills.html?courseId=${m.id}'">Open course</button>
                </div>`;
            }).join('');

            html += `
                <div class="course-card" style="background:transparent; border:1px dashed rgba(0,0,0,0.12);">
                    <button class="gradient-btn"
                        onclick="window.location.href='./roadmaps/courses.html'">Show more courses</button>
                </div>`;

            rightSidebar.innerHTML = html;

        } catch (err) {
            console.warn('Could not load right sidebar courses:', err);
            // Hide right sidebar if API is unavailable
            rightSidebar.style.display = 'none';
        }
    }

    // ==========================================
    // START APP
    // ==========================================
    loadCourse(currentCourseFile);
    loadRightSidebar();

});