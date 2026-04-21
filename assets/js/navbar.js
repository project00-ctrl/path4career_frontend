/**
 * Shared Navbar Component
 * Dynamically injects header, mobile nav, course nav bar,
 * tutorials popup, and references popup into any page.
 * Supports pages at: root, /pages/, /pages/references/, /pages/roadmaps/, etc.
 */
(function () {
    'use strict';

    // ==========================================
    // PATH DETECTION – dynamic & robust
    // Uses the script's own location to find the project root
    // ==========================================
    let ROOT, PAGES, REFS, AUTH;
    
    // Global API Configuration
    const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8080' 
        : 'https://path4career-backend.onrender.com';

    function detectPaths() {
        const scriptTag = document.currentScript;
        if (scriptTag && scriptTag.src.includes('/assets/js/')) {
            // Absolute root is the URL up to the "assets/" folder
            // e.g. "https://domain.com/path/assets/js/navbar.js" -> "https://domain.com/path/"
            ROOT = scriptTag.src.split('assets/js/')[0];
            PAGES = ROOT + 'pages/';
            REFS = PAGES + 'references/';
            AUTH = PAGES + 'auth/';
            console.log('[Navbar] Dynamic Root Detected:', ROOT);
        } else {
            // Fallback to pathname-based logic if currentScript is unavailable
            console.warn('[Navbar] Fallback to pathname detection');
            const pathname = window.location.pathname.replace(/\\/g, '/');
            if (pathname.includes('/pages/auth/')) {
                ROOT = '../../';
                PAGES = '../';
                REFS = '../references/';
                AUTH = './';
            } else if (pathname.includes('/pages/references/')) {
                ROOT = '../../';
                PAGES = '../';
                REFS = './';
                AUTH = '../auth/';
            } else if (pathname.includes('/pages/roadmaps/')) {
                ROOT = '../../';
                PAGES = '../';
                REFS = '../references/';
                AUTH = '../auth/';
            } else if (
                pathname.includes('/pages/jobs/') || 
                pathname.includes('/pages/bootcamp-hub/') || 
                pathname.includes('/pages/path4career-simulator/') || 
                pathname.includes('/pages/ai-career-shield/')
            ) {
                ROOT = '../../';
                PAGES = '../';
                REFS = '../references/';
                AUTH = '../auth/';
            } else if (pathname.includes('/pages/')) {
                ROOT = '../';
                PAGES = './';
                REFS = './references/';
                AUTH = './auth/';
            } else {
                ROOT = './';
                PAGES = './pages/';
                REFS = './pages/references/';
                AUTH = './pages/auth/';
            }
        }
    }
    detectPaths();


    // ==========================================
    // REFERENCES DATA (dynamic reference page)
    // ==========================================
    const REFER_CARDS = [
        // Frontend
        { cat: 'Frontend', icon: '🌐', name: 'HTML', desc: 'Tags, attributes, elements', file: 'htmlReference.json' },
        { cat: 'Frontend', icon: '🎨', name: 'CSS', desc: 'Properties, selectors, units', file: 'cssReference.json' },
        { cat: 'Frontend', icon: '⚡', name: 'JavaScript', desc: 'Objects, methods, DOM, events', file: 'jsReference.json' },
        { cat: 'Frontend', icon: '🔷', name: 'TypeScript', desc: 'Types, interfaces, generics', file: 'typescriptReference.json' },
        { cat: 'Frontend', icon: '⚛️', name: 'React', desc: 'Hooks, components, state patterns', file: 'reactReference.json' },
        { cat: 'Frontend', icon: '💚', name: 'Vue.js', desc: 'Directives, lifecycle, Vuex', file: 'vuejsReference.json' },
        { cat: 'Frontend', icon: '🅰️', name: 'Angular', desc: 'Components, services, modules', file: 'angularReference.json' },
        { cat: 'Frontend', icon: '🅱️', name: 'Bootstrap', desc: 'Grid, components, utilities', file: 'bootstrapReference.json' },
        { cat: 'Frontend', icon: '🌊', name: 'Tailwind', desc: 'Utility classes, responsive design', file: 'tailwindReference.json' },
        { cat: 'Frontend', icon: '📦', name: 'jQuery', desc: 'Selectors, events, effects, AJAX', file: 'jqueryReference.json' },
        { cat: 'Frontend', icon: '▲', name: 'Next.js', desc: 'Routing, API, SSR, configuration', file: 'nextjsReference.json' },
        // Backend
        { cat: 'Backend', icon: '🟢', name: 'Node.js', desc: 'Core modules, fs, http, Express', file: 'nodejsReference.json' },
        { cat: 'Backend', icon: '🎸', name: 'Django', desc: 'Models, views, URLs, templates', file: 'djangoReference.json' },
        { cat: 'Backend', icon: '🧪', name: 'Flask', desc: 'Routes, templates, extensions', file: 'flaskReference.json' },
        { cat: 'Backend', icon: '🚀', name: 'FastAPI', desc: 'Endpoints, models, middleware', file: 'fastapiReference.json' },
        { cat: 'Backend', icon: '🍃', name: 'Spring Boot', desc: 'Annotations, beans, configuration', file: 'springbootReference.json' },
        { cat: 'Backend', icon: '🟦', name: 'ASP.NET', desc: 'Controllers, middleware, routing', file: 'aspnetReference.json' },
        { cat: 'Backend', icon: '◈', name: 'GraphQL', desc: 'Queries, mutations, schemas', file: 'graphqlReference.json' },
        // Languages
        { cat: 'Languages', icon: '🐍', name: 'Python', desc: 'Built-ins, data types, modules', file: 'pythonReference.json' },
        { cat: 'Languages', icon: '☕', name: 'Java', desc: 'OOP, collections, threads', file: 'javaReference.json' },
        { cat: 'Languages', icon: '💻', name: 'C', desc: 'Pointers, memory, stdio', file: 'cReference.json' },
        { cat: 'Languages', icon: '⚙️', name: 'C++', desc: 'OOP, STL, templates, modern C++', file: 'cppReference.json' },
        { cat: 'Languages', icon: '🟪', name: 'C#', desc: 'LINQ, async, OOP, .NET classes', file: 'csharpReference.json' },
        { cat: 'Languages', icon: '🐘', name: 'PHP', desc: 'Functions, OOP, arrays, strings', file: 'phpReference.json' },
        { cat: 'Languages', icon: '🐹', name: 'Go', desc: 'Goroutines, channels, stdlib', file: 'goReference.json' },
        { cat: 'Languages', icon: '📊', name: 'R', desc: 'Functions, packages, data operations', file: 'rReference.json' },
        // Database
        { cat: 'Database', icon: '🗃️', name: 'SQL', desc: 'Commands, joins, aggregates', file: 'sqlReference.json' },
        { cat: 'Database', icon: '🐬', name: 'MySQL', desc: 'Functions, JSON, procedures', file: 'mysqlReference.json' },
        { cat: 'Database', icon: '🐘', name: 'PostgreSQL', desc: 'Functions, data types, extensions', file: 'postgresqlReference.json' },
        { cat: 'Database', icon: '🍃', name: 'MongoDB', desc: 'CRUD, operators, aggregation', file: 'mongodbReference.json' },
        // Data Science
        { cat: 'Data Science', icon: '🔢', name: 'NumPy', desc: 'Arrays, math, statistics', file: 'numpyReference.json' },
        { cat: 'Data Science', icon: '🐼', name: 'Pandas', desc: 'DataFrames, cleaning, grouping', file: 'pandasReference.json' },
        { cat: 'Data Science', icon: '🔥', name: 'PyTorch', desc: 'Tensors, models, training', file: 'pytorchReference.json' },
        { cat: 'Data Science', icon: '📉', name: 'Matplotlib', desc: 'Plots, charts, customization', file: 'matplotlibReference.json' },
        { cat: 'Data Science', icon: '🎨', name: 'Seaborn', desc: 'Statistical plots, themes', file: 'seabornReference.json' },
        { cat: 'Data Science', icon: '📊', name: 'Excel', desc: 'Formulas, functions, shortcuts', file: 'excelReference.json' },
        { cat: 'Data Science', icon: '📊', name: 'Power BI', desc: 'DAX formulas, visualizations', file: 'powerbiReference.json' },
        { cat: 'Data Science', icon: '🔬', name: 'Data Science', desc: 'Methods, tools, workflows', file: 'datascienceReference.json' },
        // DevOps & Tools
        { cat: 'DevOps', icon: '🐳', name: 'Docker', desc: 'Commands, images, containers', file: 'dockerReference.json' },
        { cat: 'DevOps', icon: '☸️', name: 'Kubernetes', desc: 'Resources, commands, config', file: 'kubernetesReference.json' },
        { cat: 'DevOps', icon: '🔀', name: 'Git', desc: 'Commands, branching, workflows', file: 'gitReference.json' },
        { cat: 'DevOps', icon: '☁️', name: 'AWS', desc: 'Services, CLI, configurations', file: 'awsReference.json' },
        // Other
        { cat: 'Other', icon: '📄', name: 'XML', desc: 'Syntax, DTD, XPath, XSLT', file: 'xmlReference.json' },
        { cat: 'Other', icon: '🧮', name: 'DSA', desc: 'Arrays, trees, graphs, sorting', file: 'dsaReference.json' },
        { cat: 'Other', icon: '🤖', name: 'AI', desc: 'Concepts, algorithms, terminology', file: 'aiReference.json' }
    ];

    // ==========================================
    // BUILD HTML
    // ==========================================
    // DEPENDENCIES (FontAwesome)
    // ==========================================
    // DEPENDENCIES (CSS + FontAwesome)
    // ==========================================
    function injectDependencies() {
        // 1. Inject Navbar CSS automatically
        if (!document.querySelector('link[href*="navbar.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${ROOT}assets/css/navbar.css`;
            document.head.appendChild(link);
        }

        // 2. Inject FontAwesome
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fa = document.createElement('link');
            fa.rel = 'stylesheet';
            fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fa);
        }
    }

    // Encode current page URL for redirect after login
    const CURRENT_URL = encodeURIComponent(window.location.href);

    function buildNavbarHTML() {
        return `
        <!-- NAVBAR HEADER -->
        <header class="navbar-header" id="navbarHeader">
            <div class="header-container">

                <!-- Logo + Tutorials + References -->
                <div class="navbar-logo">
                    <a href="${ROOT}index.html" class="navbar-logo-link">
                        <div class="navbar-logo-icon" aria-hidden="true">
                            <img class="navbar-logo-img" src="${ROOT}assets/images/path4career-icon.png" alt="Path4Career logo">
                        </div>
                        <h3>Path4Career</h3>
                    </a>
                    <a href="#" class="navbar-tutor-btn navbar-desk-only" id="navbarTutorBtn">Tutorials</a>
                    <a href="#" class="navbar-refer-btn navbar-desk-only" id="navbarReferBtn">References</a>
                </div>

                <!-- Search -->
                <div class="navbar-search" style="position:relative;">
                    <input type="text" placeholder="Search skills, courses, roles..." id="navbarSearchInput" autocomplete="off">
                    <button class="navbar-search-icon" id="navbarSearchBtn">🔍</button>
                    <div class="navbar-search-results" id="navbarSearchResults"></div>
                </div>

                <!-- Desktop Nav -->
                <ul class="navbar-nav-items">
                    <li><a href="${ROOT}index.html#ai-features">AI Features</a></li>
                    <li><a href="${PAGES}jobs/jobs-listing.html">Jobs</a></li>
                    <li><a href="${PAGES}resume-builder.html">Resume Builder</a></li>
                    <li><a href="${PAGES}bootcamp.html">Boot Camp</a></li>
                    <li><a href="${PAGES}certificate.html">Certificates</a></li>
                    <li id="navbarAuthLi">
                        <button class="navbar-auth-btn" id="navbarAuthBtn">
                            <a href="${AUTH}login.html?redirect=${CURRENT_URL}">Login /</a>
                            <a href="${AUTH}register.html">SignUp</a>
                        </button>
                    </li>
                </ul>

                <!-- Desktop/Mobile Right Actions -->
                <div class="navbar-right-actions">
                    <!-- Mobile search toggle (opens dropdown search) -->
                    <button class="navbar-mobile-search-btn" id="navbarMobileSearchToggle" aria-label="Search">
                        🔍
                    </button>

                    <!-- Profile (shown when logged in) -->
                    <div class="navbar-profile" id="navbarProfile" style="display:none;">
                        <div class="navbar-avatar" id="navbarAvatar">U</div>
                        <span id="navbarUsername">User</span>
                    </div>

                    <!-- Hamburger -->
                    <div class="navbar-hamburger" id="navbarHamburger">☰</div>
                </div>
            </div>
        </header>

        <!-- MOBILE SEARCH DROPDOWN (under header) -->
        <div class="navbar-mobile-searchbar" id="navbarMobileSearchbar" role="search" aria-label="Search Path4Career">
            <div class="navbar-mobile-searchbar-inner">
                <input type="text" placeholder="Search skills, courses, roles..." id="navbarMobileSearchInput" autocomplete="off">
                <button class="navbar-mobile-searchbar-close" id="navbarMobileSearchClose" aria-label="Close search">✕</button>
            </div>
            <div class="navbar-mobile-search-results" id="navbarMobileSearchResults"></div>
        </div>

        <!-- MOBILE NAV OVERLAY -->
        <div class="navbar-mobile-overlay" id="navbarMobileOverlay"></div>

        <!-- MOBILE NAV -->
        <div class="navbar-mobile-nav" id="navbarMobileNav">
            <div class="navbar-mobile-top">
                <a href="${ROOT}index.html" class="navbar-mobile-brand" aria-label="Path4Career Home">
                    <span class="navbar-mobile-logo" aria-hidden="true">
                        <img class="navbar-logo-img" src="${ROOT}assets/images/path4career-icon.png" alt="Path4Career logo">
                    </span>
                    <span class="navbar-mobile-brand-text">Path4Career</span>
                </a>
                <button class="navbar-mobile-close" id="navbarMobileClose" aria-label="Close menu">✕</button>
            </div>

            <a href="#" class="navbar-tutor-btn" id="navbarMobileTutorBtn">Tutorials</a>
            <a href="#" class="navbar-refer-btn" id="navbarMobileReferBtn">References</a>
            <a href="${ROOT}index.html#ai-features">AI Features</a>
            <a href="${PAGES}jobs/jobs-listing.html">Jobs</a>
            <a href="${PAGES}resume-builder.html">Resume Builder</a>
            <a href="${PAGES}bootcamp.html">Boot Camp</a>
            <a href="${PAGES}certificate.html">Certificates</a>
            <a href="${AUTH}login.html?redirect=${CURRENT_URL}" id="navbarMobileLogin">Login</a>
            <a href="${AUTH}register.html" id="navbarMobileSignup">Sign Up</a>
        </div>

        <!-- COURSE NAV STRIP -->
        <nav class="navbar-course-strip" id="navbarCourseStrip">
            <div class="strip-inner" id="navbarStripInner">
                <!-- Populated dynamically -->
            </div>
        </nav>

        <!-- PROFILE MENU (auth-aware dropdown) -->
        <div class="navbar-profile-menu" id="navbarProfileMenu">
            <!-- Guest links -->
            <a href="${AUTH}register.html" id="navbarSignup" class="navbar-guest-link">Sign Up</a>
            <a href="${AUTH}login.html?redirect=${CURRENT_URL}" id="navbarLogin" class="navbar-guest-link">Login</a>
            <!-- Logged-in links (hidden by default) -->
            <a href="${AUTH}dashboard.html" id="navbarDashboard" class="navbar-user-link" style="display:none;">📊 Dashboard</a>
            <a href="#" id="navbarProfileLink" class="navbar-user-link" style="display:none;">👤 My Profile</a>
            <a href="#" id="navbarSettingsLink" class="navbar-user-link" style="display:none;">⚙️ Settings</a>
            <hr id="navbarMenuDivider" style="display:none;">
            <a href="#" id="navbarLogout" class="navbar-user-link" style="display:none;">🚪 Logout</a>
        </div>

        <!-- TUTORIALS POPUP -->
        <div class="navbar-tutor-popup" id="navbarTutorPopup">
            <div class="navbar-tutor-popup-inner">
                <button class="navbar-tutor-close" id="navbarTutorClose">✕</button>
                <h2 class="navbar-tutor-title">Tutorials</h2>
                <div id="navbarTutorContent">
                    <!-- Populated dynamically -->
                </div>
            </div>
        </div>

        <!-- REFERENCES POPUP -->
        <div class="navbar-refer-popup" id="navbarReferPopup">
            <div class="navbar-refer-popup-inner">
                <button class="navbar-refer-close" id="navbarReferClose">✕</button>
                <h2 class="navbar-refer-title">📖 References</h2>
                <p class="navbar-refer-subtitle">Quick-access documentation and cheat sheets</p>
                <div class="navbar-refer-search-wrap">
                    <span class="navbar-refer-search-icon">🔍</span>
                    <input type="text" class="navbar-refer-search" id="navbarReferSearch" placeholder="Search references..." autocomplete="off">
                </div>
                <div id="navbarReferContent">
                    <!-- Populated dynamically -->
                </div>
            </div>
        </div>

        <!-- Spacer -->
        <div class="navbar-spacer"></div>`;
    }

    function buildGlobalToolsHTML() {
        return `
        <!-- ════ GLOBAL ATS HUD (Unique Mini-AI Console) ════ -->
        <div class="ats-hud-widget" id="atsGlobalFab" onclick="window.openGlobalATS()" style="display: none;">
            <div class="ats-hud-scanner">
                <i class="fas fa-file-circle-check"></i>
                <div class="ats-hud-scan-line"></div>
            </div>
            <div class="ats-hud-info">
                <span class="ats-hud-tag">AI OPTIMIZER</span>
                <span class="ats-hud-label">ATS RESUME SCAN</span>
            </div>
            <div class="ats-hud-glow"></div>
        </div>

        <!-- ════ GLOBAL ATS MODAL (v2 Modernized) ════ -->
        <div class="ats-mo v2-glass" id="atsModalV2" style="display: none;">
            <div class="ats-mc v2-card">
                <header class="ats-hdr v2-mesh">
                    <button class="ats-cx" onclick="window.closeGlobalATS()">✕</button>
                    <h2>ATS Resume Checker</h2>
                    <p>AI-Powered Optimization</p>
                </header>
                <div class="ats-body">
                    <!-- Info Section -->
                    <div class="ats-info-pane" style="background: rgba(99, 102, 241, 0.05); padding: 1.2rem; border-radius: 12px; margin-bottom: 1.5rem; border: 1px solid rgba(99, 102, 241, 0.2);">
                        <h3 style="font-size: 1.05rem; color: #1e293b; margin-top: 0; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-robot" style="color: #6366f1;"></i> What is an ATS?
                        </h3>
                        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 1rem; line-height: 1.5;">
                            An <strong>Applicant Tracking System (ATS)</strong> is a software used by recruiters to automatically scan, filter, and rank resumes based on keywords and formatting before a human ever sees them.
                        </p>
                        
                        <h3 style="font-size: 1.05rem; color: #1e293b; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-bullseye" style="color: #6366f1;"></i> Why use this ATS Checker?
                        </h3>
                        <p style="font-size: 0.85rem; color: #475569; margin-bottom: 1rem; line-height: 1.5;">
                            Over 75% of resumes are rejected by ATS bots. This tool simulates an ATS scan to ensure your resume contains the right keywords, structure, and formatting to pass the filter.
                        </p>

                        <h3 style="font-size: 1.05rem; color: #1e293b; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-check-circle" style="color: #6366f1;"></i> How to use
                        </h3>
                        <ol style="font-size: 0.85rem; color: #475569; margin-bottom: 0; padding-left: 1.2rem; line-height: 1.5;">
                            <li><strong>Upload</strong> your current resume (PDF, DOCX, or TXT).</li>
                            <li><strong>Review</strong> your ATS pass rate and parsed skills.</li>
                            <li><strong>Improve</strong> your resume using our AI suggestions.</li>
                        </ol>
                    </div>

                    <!-- Job Description Input -->
                    <div id="atsJDSection" style="margin-bottom: 1.5rem;">
                        <h3 style="font-size: 1.05rem; color: #1e293b; margin-top: 0; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-file-alt" style="color: #6366f1;"></i> Paste Job Description
                        </h3>
                        <textarea id="atsJDIn" placeholder="Paste the job description here to analyze compatibility..." 
                            style="width: 100%; height: 120px; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; font-family: inherit; font-size: 0.9rem; resize: none; outline: none; transition: border-color 0.2s;"
                            onfocus="this.style.borderColor='#6366f1'" onblur="this.style.borderColor='#e2e8f0'"></textarea>
                    </div>

                    <!-- Upload Zone -->
                    <div id="atsUploadZone" class="ats-uz v2-zone" onclick="document.getElementById('atsFileIn').click()">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Click to upload or drag & drop</p>
                        <small>PDF, DOCX, DOC, TXT (Max 5MB)</small>
                        <input type="file" id="atsFileIn" hidden accept=".pdf,.docx,.doc,.txt">
                    </div>

                    <!-- Action Button (Analyze) -->
                    <div id="atsActionArea" style="margin-top: 1.5rem; text-align: center;">
                        <button id="atsAnalyzeBtn" class="ats-btn-primary v2-btn" style="margin-top: 0; display: none;" onclick="window.triggerATSContextualAnalysis()">
                            <i class="fas fa-wand-magic-sparkles"></i> Analyze Resume
                        </button>
                    </div>


                    <!-- Loading State -->
                    <div id="atsLoading" style="display:none; text-align:center; padding:2rem;">
                        <i class="fas fa-circle-notch fa-spin" style="font-size:2rem; color:#6366f1;"></i>
                        <p style="margin-top:1rem; color:#64748b;">Analysing...</p>
                    </div>

                    <!-- Results -->
                    <div id="atsRes" style="display:none;">
                        <div class="ats-score-box">
                            <div class="ats-circle v2-circle" id="atsCircleS" data-score="poor">
                                <div class="ats-score-inner">
                                    <span id="atsScoreTxtS">0</span>
                                    <small>Score</small>
                                </div>
                            </div>
                        </div>

                        <div class="ats-chk v2-chk" id="atsChkS"></div>

                        <div class="ats-res-sec">
                            <h3><i class="fas fa-lightbulb"></i> Suggestions</h3>
                            <div class="ats-sugg-list" id="atsSuggestions"></div>
                        </div>

                        <button class="ats-btn-primary v2-btn" onclick="window.resetATSStandalone()">
                            <i class="fas fa-redo"></i> Check Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }

    function buildFooterHTML() {
        return `
        <footer class="p4c-footer-rich">
            <div class="p4c-footer-rich-inner">
                <!-- Brand Column -->
                <div class="p4c-footer-col p4c-footer-brand-col">
                    <a class="p4c-footer-name" href="${ROOT}index.html" aria-label="Path4Career Home">
                        <div class="p4c-footer-logo">
                            <img src="${ROOT}assets/images/path4career-icon.png" alt="Path4Career logo" style="width:34px;height:34px;object-fit:contain;display:block;">
                        </div>
                        <span>Path4Career</span>
                    </a>
                    <p class="p4c-footer-tagline">Learn skills that build real careers. Tutorials, roadmaps, and AI tools — all in one platform.</p>
                    <div class="p4c-footer-social">
                        <a href="${AUTH}register.html" class="navbar-auth-btn" id="footerAuthBtn" style="text-decoration:none; display:inline-block; margin-top:10px;">Get Started Free →</a>
                    </div>
                </div>

                <!-- Tutorials Column -->
                <div class="p4c-footer-col">
                    <h4 class="p4c-footer-col-title">📚 Tutorials</h4>
                    <ul class="p4c-footer-list">
                        <li><a href="${PAGES}tutorial.html?course=htmlPages.json">HTML</a></li>
                        <li><a href="${PAGES}tutorial.html?course=cssPages.json">CSS</a></li>
                        <li><a href="${PAGES}tutorial.html?course=jsPages.json">JavaScript</a></li>
                        <li><a href="${PAGES}tutorial.html?course=pythonPages.json">Python</a></li>
                        <li><a href="${PAGES}tutorial.html?course=reactPages.json">React</a></li>
                        <li><a href="${PAGES}tutorial.html?course=javaPages.json">Java</a></li>
                        <li><a href="${PAGES}tutorial.html?course=cppPages.json">C++</a></li>
                        <li><a href="${PAGES}tutorial.html?course=sqlPages.json">SQL</a></li>
                        <li><a href="${PAGES}tutorial.html?course=nodejsPages.json">Node.js</a></li>
                        <li><a href="${PAGES}tutorial.html?course=dsaPages.json">DSA</a></li>
                    </ul>
                </div>

                <!-- References Column -->
                <div class="p4c-footer-col">
                    <h4 class="p4c-footer-col-title">📖 References</h4>
                    <ul class="p4c-footer-list">
                        <li><a href="${PAGES}references/htmlReference.html">HTML</a></li>
                        <li><a href="${PAGES}references/cssReference.html">CSS</a></li>
                        <li><a href="${PAGES}references/jsReference.html">JavaScript</a></li>
                        <li><a href="${PAGES}references/sqlReference.html">SQL</a></li>
                        <li><a href="${PAGES}references/pythonReference.html">Python</a></li>
                        <li><a href="${PAGES}references/reactReference.html">React</a></li>
                        <li><a href="${PAGES}references/javaReference.html">Java</a></li>
                        <li><a href="${PAGES}references/cppReference.html">C++</a></li>
                        <li><a href="${PAGES}references/mongodbReference.html">MongoDB</a></li>
                        <li><a href="${PAGES}references/expressReference.html">ExpressJS</a></li>
                    </ul>
                </div>

                <!-- Roadmaps Column -->
                <div class="p4c-footer-col">
                    <h4 class="p4c-footer-col-title">🚀 Roadmaps</h4>
                    <ul class="p4c-footer-list">
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Frontend Developer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Backend Developer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Full-Stack Dev</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Data Scientist</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">AI Engineer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">DevOps Engineer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Cyber Security</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Android Developer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">iOS Developer</a></li>
                        <li><a href="${PAGES}roadmaps/roadmaps.html">Cloud Native</a></li>
                    </ul>
                </div>

                <!-- Platform & Tools Column -->
                <div class="p4c-footer-col">
                    <h4 class="p4c-footer-col-title">🛠️ Platform</h4>
                    <ul class="p4c-footer-list">
                        <li><a href="${PAGES}resume-builder.html">Resume Builder</a></li>
                        <li><a href="${PAGES}jobs/jobs-listing.html">Job Board</a></li>
                        <li><a href="${PAGES}exercise.html">Exercises</a></li>
                        <li><a href="${PAGES}quizzes.html">Quizzes</a></li>
                        <li><a href="${PAGES}roadmaps/courses.html">All Courses</a></li>
                        <li><a href="${PAGES}roadmaps/whereto.html">Where to Start</a></li>
                        <li><a href="${PAGES}ai-career-shield/index.html">AI Career Shield</a></li>
                        <li><a href="${PAGES}path4career-simulator/index.html">Interview Simulator</a></li>
                        <li><a href="${PAGES}bootcamp.html">Bootcamp Hub</a></li>
                        <li><a href="${PAGES}dashboard.html">Dashboard</a></li>
                    </ul>
                </div>

                <!-- Feedback Column -->
                <div class="p4c-footer-col">
                    <div class="footer-feedback-box">
                        <h4 class="p4c-footer-col-title">💬 Feedback</h4>
                        <form id="footerFeedbackForm" class="footer-feedback-form">
                            <input type="email" id="feedbackEmail" placeholder="Your Email" required>
                            <select id="feedbackCategory" required>
                                <option value="" disabled selected>Category</option>
                                <option value="Suggestion">Suggestion</option>
                                <option value="Bug">Bug Report</option>
                                <option value="Other">Other</option>
                            </select>
                            <textarea id="feedbackMessage" placeholder="Your feedback or suggestions..." required></textarea>
                            <button type="submit" class="feedback-submit-btn" id="feedbackSubmitBtn">Send Feedback</button>
                            <p id="feedbackSuccess" class="feedback-success-msg">Thanks! Your feedback was received. 🚀</p>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="p4c-footer-bottom">
                <div class="p4c-footer-rich-inner" style="padding-top:0; padding-bottom:0; display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <p>© 2026 Path4Career. Learn · Build · Grow</p>
                    <div class="p4c-footer-bottom-links">
                        <a href="${AUTH}privacy.html">Privacy</a>
                        <a href="${AUTH}terms.html">Terms</a>
                        <a href="${PAGES}certificate.html">Certificates</a>
                        <a href="${ROOT}index.html">Home</a>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }

    function injectFooter() {
        if (document.querySelector('.p4c-footer-rich')) return;

        // Remove ALL old hardcoded <footer> elements from any page
        // (e.g. .bc-footer, .site-footer, .p4c-footer, plain <footer> tags)
        document.querySelectorAll('footer:not(.p4c-footer-rich)').forEach(oldFooter => {
            oldFooter.remove();
        });

        const footerHtml = buildFooterHTML();
        const root = document.getElementById('footer-root');
        if (root) {
            root.innerHTML = footerHtml;
        } else {
            document.body.insertAdjacentHTML('beforeend', footerHtml);
        }
    }

    function injectGlobalTools() {
        if (document.getElementById('atsModalV2')) return;
        document.body.insertAdjacentHTML('beforeend', buildGlobalToolsHTML());
        attachATSGlobalEvents();

        // Ensure the FAB is ONLY on Resume Builder pages
        const isResumePage = window.location.pathname.includes('resume-builder.html') || 
                            window.location.pathname.includes('resume-builder-app.html');
        
        const fab = document.getElementById('atsGlobalFab');
        if (fab) {
            if (isResumePage) {
                fab.style.setProperty('display', 'flex', 'important');
            } else {
                fab.remove(); // Completely remove from DOM to prevent !important CSS overrides
            }
        }
    }

    // ==========================================
    // INJECT INTO PAGE
    // ==========================================
    function injectNavbar() {
        const root = document.getElementById('navbar-root');
        const navHtml = buildNavbarHTML();

        if (!root) {
            document.body.insertAdjacentHTML('afterbegin', navHtml);
        } else {
            root.innerHTML = navHtml;
        }

        // Shared rich footer
        injectFooter();

        // Global tools injected separately at the end of body
        injectGlobalTools();
    }

    // ==========================================
    // FETCH TUTORIALS CONFIG & POPULATE
    // ==========================================
    async function loadTutorialsConfig() {
        try {
            const resp = await fetch(`${ROOT}assets/data/tutorials-config.json`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const config = await resp.json();
            populateCourseStrip(config.tutorials);
            populateTutorPopup(config.tutorials);
            // Build search index with tutorials data
            buildSearchIndex(config.tutorials);
        } catch (err) {
            console.warn('Navbar: Could not load tutorials config:', err);
            // Build search index even without tutorials
            buildSearchIndex([]);
        }
    }

    function populateCourseStrip(tutorials) {
        const strip = document.getElementById('navbarStripInner');
        if (!strip) return;

        strip.innerHTML = tutorials.map(t => {
            const href = `${PAGES}tutorial.html?course=${t.file}`;
            return `<a href="${href}">${t.name.toUpperCase()}</a>`;
        }).join('');
    }

    function populateTutorPopup(tutorials) {
        const container = document.getElementById('navbarTutorContent');
        if (!container) return;

        const groups = {};
        tutorials.forEach(t => {
            if (!groups[t.category]) groups[t.category] = [];
            groups[t.category].push(t);
        });

        let html = '';
        const categoryOrder = ['Frontend', 'Backend', 'Framework', 'Runtime', 'Database', 'Data Science', 'DevOps', 'Tools', 'Computer Science'];

        categoryOrder.forEach(cat => {
            if (!groups[cat]) return;
            html += `<div class="navbar-tutor-category">${cat}</div>`;
            html += `<div class="navbar-tutor-grid">`;
            groups[cat].forEach(t => {
                const href = `${PAGES}tutorial.html?course=${t.file}`;
                html += `
                    <a href="${href}" class="navbar-tutor-item">
                        <span class="navbar-tutor-item-icon">${t.icon}</span>
                        ${t.name}
                    </a>`;
            });
            html += `</div>`;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // POPULATE REFERENCES POPUP
    // ==========================================
    function populateReferPopup() {
        const container = document.getElementById('navbarReferContent');
        if (!container) return;

        const groups = {};
        REFER_CARDS.forEach(c => {
            if (!groups[c.cat]) groups[c.cat] = [];
            groups[c.cat].push(c);
        });

        const catOrder = ['Frontend', 'Backend', 'Languages', 'Database', 'Data Science', 'DevOps', 'Other'];
        let html = '';

        catOrder.forEach(cat => {
            if (!groups[cat]) return;
            html += `<div class="navbar-ref-section" data-cat="${cat}">`;
            html += `<div class="navbar-ref-section-header">
                        <span class="navbar-ref-section-icon">${cat === 'Frontend' ? '🖥️' : cat === 'Backend' ? '⚙️' : cat === 'Languages' ? '💬' : cat === 'Database' ? '🗄️' : cat === 'Data Science' ? '📈' : cat === 'DevOps' ? '🔧' : cat === 'Other' ? '📚' : '🔧'}</span>
                        <h3>${cat}</h3>
                     </div>`;
            html += `<div class="navbar-ref-list">`;
            groups[cat].forEach(c => {
                const href = `${PAGES}reference.html?course=${c.file}`;
                html += `<a href="${href}" class="navbar-ref-card" data-name="${c.name.toLowerCase()}">
                    <div class="navbar-ref-card-icon">${c.icon}</div>
                    <div class="navbar-ref-card-info">
                        <h4>${c.name}</h4>
                        <p>${c.desc}</p>
                    </div>
                    <span class="navbar-ref-card-arrow">→</span>
                </a>`;
            });
            html += `</div></div>`;
        });

        container.innerHTML = html;

        // Search/filter logic
        const searchInput = document.getElementById('navbarReferSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function () {
                const q = this.value.trim().toLowerCase();
                const cards = container.querySelectorAll('.navbar-ref-card');
                const sections = container.querySelectorAll('.navbar-ref-section');

                cards.forEach(card => {
                    const name = card.getAttribute('data-name') || '';
                    const text = card.textContent.toLowerCase();
                    card.style.display = (name.includes(q) || text.includes(q)) ? '' : 'none';
                });

                // Hide sections with no visible cards
                sections.forEach(sec => {
                    const visibleCards = sec.querySelectorAll('.navbar-ref-card:not([style*="display: none"])');
                    sec.style.display = visibleCards.length > 0 ? '' : 'none';
                });
            });
        }
    }

    // ==========================================
    // GLOBAL SEARCH
    // ==========================================
    let SEARCH_INDEX = [];

    function buildSearchIndex(tutorials) {
        SEARCH_INDEX = [];

        // Add tutorials
        if (tutorials && tutorials.length) {
            tutorials.forEach(t => {
                SEARCH_INDEX.push({
                    name: t.name,
                    desc: t.desc || '',
                    category: 'Tutorial',
                    icon: t.icon || '📘',
                    url: `${PAGES}tutorial.html?course=${t.file}`
                });
            });
        }

        // Add references
        REFER_CARDS.forEach(c => {
            SEARCH_INDEX.push({
                name: c.name + ' Reference',
                desc: c.desc || '',
                category: 'Reference',
                icon: c.icon || '📖',
                url: `${PAGES}reference.html?course=${c.file}`
            });
        });

        // Add site pages
        const sitePages = [
            { name: 'AI Features', desc: 'AI Career Shield & Simulator — resume analysis and career trajectory', icon: '🤖', url: `${ROOT}index.html#ai-features` },
            { name: 'AI Career Simulator', desc: 'Simulate career trajectory, connect with mentors, analyze risks', icon: '🚀', url: `${PAGES}path4career-simulator/index.html` },
            { name: 'AI Career Shield', desc: 'Upload resume for AI safety score and learning roadmap', icon: '🛡️', url: `${PAGES}ai-career-shield/index.html` },
            { name: 'Jobs', desc: 'Browse and apply for tech jobs', icon: '💼', url: `${PAGES}jobs/jobs-listing.html` },
            { name: 'Resume Builder', desc: 'Build a professional resume with AI', icon: '📄', url: `${PAGES}resume-builder.html` },
            { name: 'Boot Camp', desc: 'Intensive coding bootcamps', icon: '🏕️', url: `${PAGES}bootcamp.html` },
            { name: 'Certificates', desc: 'Earn certificates for completed courses', icon: '🎓', url: `${PAGES}certificate.html` },
            { name: 'Exercises', desc: 'Practice coding exercises', icon: '💪', url: `${PAGES}exercise.html` },
            { name: 'Quizzes', desc: 'Test your knowledge with quizzes', icon: '🧠', url: `${PAGES}quizzes.html` },
            { name: 'Courses', desc: 'Explore all available courses', icon: '📚', url: `${PAGES}roadmaps/courses.html` },
            { name: 'Roadmaps', desc: 'Structured learning paths for job roles', icon: '🗺️', url: `${PAGES}roadmaps/roadmaps.html` },
            { name: 'Dashboard', desc: 'View your learning progress', icon: '📊', url: `${PAGES}dashboard.html` },
        ];
        sitePages.forEach(p => {
            SEARCH_INDEX.push({ ...p, category: 'Page' });
        });

        // Add common search terms / roles
        const roles = [
            { name: 'Frontend Developer', desc: 'HTML, CSS, JavaScript, React', icon: '🖥️', url: `${PAGES}roadmaps/roadmaps.html` },
            { name: 'Backend Developer', desc: 'Node.js, Python, Java, SQL', icon: '⚙️', url: `${PAGES}roadmaps/roadmaps.html` },
            { name: 'Full Stack Developer', desc: 'Frontend + Backend combined', icon: '🚀', url: `${PAGES}roadmaps/roadmaps.html` },
            { name: 'Data Scientist', desc: 'Python, NumPy, Pandas, ML', icon: '📈', url: `${PAGES}roadmaps/roadmaps.html` },
        ];
        roles.forEach(r => {
            SEARCH_INDEX.push({ ...r, category: 'Role' });
        });
    }

    function performSearch(query) {
        const resultsBox = document.getElementById('navbarSearchResults');
        if (!resultsBox) return;

        if (!query || query.length < 2) {
            resultsBox.classList.remove('open');
            resultsBox.innerHTML = '';
            return;
        }

        const q = query.toLowerCase();
        const matches = SEARCH_INDEX.filter(item => {
            return item.name.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);
        }).slice(0, 8);

        if (matches.length === 0) {
            resultsBox.innerHTML = `<div class="navbar-search-empty">No results found for "${query}"</div>`;
            resultsBox.classList.add('open');
            return;
        }

        // Group by category
        const grouped = {};
        matches.forEach(m => {
            if (!grouped[m.category]) grouped[m.category] = [];
            grouped[m.category].push(m);
        });

        let html = '';
        for (const [cat, items] of Object.entries(grouped)) {
            html += `<div class="navbar-search-cat">${cat}</div>`;
            items.forEach(item => {
                html += `<a href="${item.url}" class="navbar-search-item">
                    <span class="navbar-search-item-icon">${item.icon}</span>
                    <div class="navbar-search-item-info">
                        <span class="navbar-search-item-name">${item.name}</span>
                        <span class="navbar-search-item-desc">${item.desc}</span>
                    </div>
                </a>`;
            });
        }

        resultsBox.innerHTML = html;
        resultsBox.classList.add('open');
    }

    function performSearchInto(query, resultsBox) {
        if (!resultsBox) return;

        if (!query || query.length < 2) {
            resultsBox.classList.remove('open');
            resultsBox.innerHTML = '';
            return;
        }

        const q = query.toLowerCase();
        const matches = SEARCH_INDEX.filter(item => {
            return item.name.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.category.toLowerCase().includes(q);
        }).slice(0, 10);

        if (matches.length === 0) {
            resultsBox.innerHTML = `<div class="navbar-search-empty">No results found for "${query}"</div>`;
            resultsBox.classList.add('open');
            return;
        }

        const grouped = {};
        matches.forEach(m => {
            if (!grouped[m.category]) grouped[m.category] = [];
            grouped[m.category].push(m);
        });

        let html = '';
        for (const [cat, items] of Object.entries(grouped)) {
            html += `<div class="navbar-search-cat">${cat}</div>`;
            items.forEach(item => {
                html += `<a href="${item.url}" class="navbar-search-item">
                    <span class="navbar-search-item-icon">${item.icon}</span>
                    <div class="navbar-search-item-info">
                        <span class="navbar-search-item-name">${item.name}</span>
                        <span class="navbar-search-item-desc">${item.desc}</span>
                    </div>
                </a>`;
            });
        }

        resultsBox.innerHTML = html;
        resultsBox.classList.add('open');
    }

    function attachSearchEvents() {
        const input = document.getElementById('navbarSearchInput');
        const resultsBox = document.getElementById('navbarSearchResults');
        const searchBtn = document.getElementById('navbarSearchBtn');

        if (!input || !resultsBox) return;

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearch(input.value.trim());
            }, 200);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const q = input.value.trim().toLowerCase();
                
                // Smart Redirect logic
                const SECTION_MAP = {
                    'react': 'tutorial.html?course=reactPages.json',
                    'html': 'tutorial.html?course=htmlPages.json',
                    'css': 'tutorial.html?course=cssPages.json',
                    'javascript': 'tutorial.html?course=jsPages.json',
                    'python': 'tutorial.html?course=pythonPages.json',
                    'java': 'tutorial.html?course=javaPages.json',
                    'resume': 'resume-builder.html',
                    'builder': 'resume-builder.html',
                    'job': 'jobs/jobs-listing.html',
                    'jobs': 'jobs/jobs-listing.html',
                    'bootcamp': 'bootcamp.html',
                    'certificate': 'certificate.html',
                    'courses': 'roadmaps/courses.html',
                    'roadmap': 'roadmaps/roadmaps.html',
                    'dashboard': 'dashboard.html'
                };

                if (SECTION_MAP[q]) {
                    window.location.href = PAGES + SECTION_MAP[q];
                    return;
                }

                const firstResult = resultsBox.querySelector('.navbar-search-item');
                if (firstResult) {
                    window.location.href = firstResult.href;
                }
            }
            if (e.key === 'Escape') {
                resultsBox.classList.remove('open');
                input.blur();
            }
        });

        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const firstResult = resultsBox.querySelector('.navbar-search-item');
                if (firstResult) {
                    window.location.href = firstResult.href;
                } else {
                    performSearch(input.value.trim());
                }
            });
        }

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-search')) {
                resultsBox.classList.remove('open');
            }
        });

        // Reopen on focus if there's text
        input.addEventListener('focus', () => {
            if (input.value.trim().length >= 2) {
                performSearch(input.value.trim());
            }
        });
    }

    function attachMobileSearchEvents() {
        const toggleBtn = document.getElementById('navbarMobileSearchToggle');
        const wrap = document.getElementById('navbarMobileSearchbar');
        const input = document.getElementById('navbarMobileSearchInput');
        const closeBtn = document.getElementById('navbarMobileSearchClose');
        const results = document.getElementById('navbarMobileSearchResults');
        if (!toggleBtn || !wrap || !input || !closeBtn || !results) return;

        const open = () => {
            wrap.classList.add('open');
            setTimeout(() => input.focus(), 0);
        };
        const close = () => {
            wrap.classList.remove('open');
            results.classList.remove('open');
            results.innerHTML = '';
            input.value = '';
        };

        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (wrap.classList.contains('open')) close(); else open();
        });

        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            close();
        });

        let debounceTimer;
        input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                performSearchInto(input.value.trim(), results);
            }, 180);
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                close();
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                const first = results.querySelector('.navbar-search-item');
                if (first) window.location.href = first.href;
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#navbarMobileSearchbar') && !e.target.closest('#navbarMobileSearchToggle')) {
                close();
            }
        });
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================
    function attachEvents() {
        // Hamburger
        const hamburger = document.getElementById('navbarHamburger');
        const mobileNav = document.getElementById('navbarMobileNav');
        const mobileOverlay = document.getElementById('navbarMobileOverlay');
        const mobileClose = document.getElementById('navbarMobileClose');
        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                mobileNav.classList.toggle('open');
                hamburger.classList.toggle('active');
                if (mobileOverlay) mobileOverlay.classList.toggle('open');
            });
        }

        if (mobileClose && hamburger && mobileNav) {
            mobileClose.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('open');
            });
        }

        if (mobileOverlay && hamburger && mobileNav) {
            mobileOverlay.addEventListener('click', () => {
                mobileNav.classList.remove('open');
                hamburger.classList.remove('active');
                mobileOverlay.classList.remove('open');
            });
        }

        // Profile
        const profile = document.getElementById('navbarProfile');
        const profileMenu = document.getElementById('navbarProfileMenu');
        if (profile && profileMenu) {
            profile.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('open');
            });
            document.addEventListener('click', () => {
                profileMenu.classList.remove('open');
            });
        }

        // Helper to close all popups/menus
        function closeAllActivePopups() {
            if (tutorPopup) tutorPopup.classList.remove('open');
            if (referPopup) referPopup.classList.remove('open');
            if (mobileNav) mobileNav.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('open');
            if (profileMenu) profileMenu.classList.remove('open');
        }

        // Tutorials popup
        const tutorPopup = document.getElementById('navbarTutorPopup');
        const tutorClose = document.getElementById('navbarTutorClose');

        document.querySelectorAll('#navbarTutorBtn, #navbarMobileTutorBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // If it's already open, close it (toggle behavior)
                const isOpening = tutorPopup && !tutorPopup.classList.contains('open');
                closeAllActivePopups();
                if (isOpening && tutorPopup) tutorPopup.classList.add('open');
            });
        });

        if (tutorClose && tutorPopup) {
            tutorClose.addEventListener('click', () => tutorPopup.classList.remove('open'));
            tutorPopup.addEventListener('click', (e) => {
                if (e.target === tutorPopup) tutorPopup.classList.remove('open');
            });
        }

        // References popup
        const referPopup = document.getElementById('navbarReferPopup');
        const referClose = document.getElementById('navbarReferClose');

        document.querySelectorAll('#navbarReferBtn, #navbarMobileReferBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // If it's already open, close it (toggle behavior)
                const isOpening = referPopup && !referPopup.classList.contains('open');
                closeAllActivePopups();
                if (isOpening && referPopup) referPopup.classList.add('open');
            });
        });

        if (referClose && referPopup) {
            referClose.addEventListener('click', () => referPopup.classList.remove('open'));
            referPopup.addEventListener('click', (e) => {
                // Mobile overlay: close when clicking outside inner panel
                if (e.target === referPopup) referPopup.classList.remove('open');
            });
        }

        // Global search
        attachSearchEvents();
        attachMobileSearchEvents();

        // Close dropdown panels on outside click (desktop + mobile)
        document.addEventListener('click', (e) => {
            const clickedInsideTutor = tutorPopup && e.target.closest('#navbarTutorPopup');
            const clickedInsideRefer = referPopup && e.target.closest('#navbarReferPopup');
            const clickedTutorBtn = e.target.closest('#navbarTutorBtn, #navbarMobileTutorBtn');
            const clickedReferBtn = e.target.closest('#navbarReferBtn, #navbarMobileReferBtn');

            if (!clickedInsideTutor && !clickedTutorBtn && tutorPopup) tutorPopup.classList.remove('open');
            if (!clickedInsideRefer && !clickedReferBtn && referPopup) referPopup.classList.remove('open');
        });

        // Escape closes panels
        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (tutorPopup) tutorPopup.classList.remove('open');
            if (referPopup) referPopup.classList.remove('open');
            if (mobileNav) mobileNav.classList.remove('open');
            if (hamburger) hamburger.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('open');
        });
    }

    // ==========================================
    // AUTH STATE — check if user is logged in
    // ==========================================
    function checkAuthState() {
        const token = localStorage.getItem('AUTH_TOKEN');

        // No token in localStorage → user is guest
        if (!token) return;

        // Token exists → fetch profile to get username
        fetch(API_BASE + '/api/v1/user/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(res => {
                if (res.ok) return res.json();
                // Token expired or invalid — clear it
                localStorage.removeItem('AUTH_TOKEN');
                throw new Error('Token invalid');
            })
            .then(profile => {
                // User IS logged in — show profile, hide auth buttons
                const name = profile.fullName || profile.username || 'User';
                const initial = name.charAt(0).toUpperCase();

                const authLi = document.getElementById('navbarAuthLi');
                const profileEl = document.getElementById('navbarProfile');
                const avatarEl = document.getElementById('navbarAvatar');
                const usernameEl = document.getElementById('navbarUsername');

                if (authLi) authLi.style.display = 'none';
                if (profileEl) profileEl.style.display = 'flex';
                if (avatarEl) avatarEl.textContent = initial;
                if (usernameEl) usernameEl.textContent = name;

                // Hide footer auth button and pre-fill feedback email
                const footerAuthBtn = document.getElementById('footerAuthBtn');
                const feedbackEmail = document.getElementById('feedbackEmail');
                if (footerAuthBtn) footerAuthBtn.style.display = 'none';
                if (feedbackEmail && profile.email) feedbackEmail.value = profile.email;

                // Show logged-in menu items, hide guest items
                document.querySelectorAll('.navbar-guest-link').forEach(el => el.style.display = 'none');
                document.querySelectorAll('.navbar-user-link').forEach(el => el.style.display = 'block');
                const divider = document.getElementById('navbarMenuDivider');
                if (divider) divider.style.display = 'block';

                // Hide mobile login/signup
                const mobileLogin = document.getElementById('navbarMobileLogin');
                const mobileSignup = document.getElementById('navbarMobileSignup');
                if (mobileLogin) mobileLogin.style.display = 'none';
                if (mobileSignup) mobileSignup.style.display = 'none';

                // Attach logout handler
                const logoutBtn = document.getElementById('navbarLogout');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Clear localStorage
                        localStorage.removeItem('AUTH_TOKEN');
                        // Also clear backend session
                        fetch(API_BASE + '/api/v1/auth/logout', {
                            method: 'POST',
                            headers: { 'Authorization': 'Bearer ' + token },
                            credentials: 'include'
                        }).finally(() => {
                            // Reload same page — navbar will reset to guest state
                            window.location.reload();
                        });
                    });
                }

                // Profile link opens dashboard
                const profileLink = document.getElementById('navbarProfileLink');
                if (profileLink) {
                    profileLink.href = AUTH + 'dashboard.html';
                }

                const settingsLink = document.getElementById('navbarSettingsLink');
                if (settingsLink) {
                    settingsLink.href = AUTH + 'dashboard.html';
                }
            })
            .catch(() => {
                // User is NOT logged in — default guest state (already showing)
            });
    }

    // ==========================================
    // GLOBAL ATS LOGIC
    // ==========================================
    window.openGlobalATS = function(data = null) {
        console.log('Opening Global ATS V2...', data);
        const modal = document.getElementById('atsModalV2');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.add('active');
            
            // Show JD section initially
            const jdSec = document.getElementById('atsJDSection');
            if (jdSec) jdSec.style.display = 'block';
            
            if (data) {
                // Store data globally for contextual analysis if needed
                window.currentATSResumeData = data;
                window.currentATSResumeText = JSON.stringify(data);

                // Direct analysis (from Builder) - Still allow JD entry
                document.getElementById('atsUploadZone').style.display = 'none';
                document.getElementById('atsLoading').style.display = 'block';
                document.getElementById('atsRes').style.display = 'none';
                document.getElementById('atsAnalyzeBtn').style.display = 'none';
                
                setTimeout(() => {
                    const jd = document.getElementById('atsJDIn')?.value || "";
                    analyzeATSDataGlobal(data, window.currentATSResumeText, jd);
                }, 800);
            } else {
                window.resetATSStandalone();
            }
        } else {
            console.error('ATS Modal not found in DOM');
        }
    };
    window.closeGlobalATS = function() {
        const modal = document.getElementById('atsModalV2');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    };
    window.resetATSStandalone = function() {
        const uz = document.getElementById('atsUploadZone');
        const ld = document.getElementById('atsLoading');
        const rs = document.getElementById('atsRes');
        const fi = document.getElementById('atsFileIn');
        const info = document.querySelector('.ats-info-pane');
        const jdSec = document.getElementById('atsJDSection');
        const analyzeBtn = document.getElementById('atsAnalyzeBtn');
        const jdIn = document.getElementById('atsJDIn');

        if (info) info.style.display = 'block';
        if (uz) uz.style.display = 'block';
        if (ld) ld.style.display = 'none';
        if (rs) rs.style.display = 'none';
        if (jdSec) jdSec.style.display = 'block';
        if (analyzeBtn) analyzeBtn.style.display = 'none';
        if (jdIn) jdIn.value = '';
        if (fi) fi.value = '';
        
        window.currentATSResumeText = '';
        window.currentATSResumeData = null;
    };

    function attachATSGlobalEvents() {
        const fileIn = document.getElementById('atsFileIn');
        const uz = document.getElementById('atsUploadZone');
        if (!fileIn || !uz) return;

        fileIn.addEventListener('change', (e) => handleATSStandaloneUpload(e.target.files[0]));

        uz.addEventListener('dragover', (e) => { e.preventDefault(); uz.style.borderColor = '#8b5cf6'; });
        uz.addEventListener('dragleave', (e) => { e.preventDefault(); uz.style.borderColor = '#E2E8F0'; });
        uz.addEventListener('drop', (e) => {
            e.preventDefault();
            uz.style.borderColor = '#E2E8F0';
            const f = e.dataTransfer.files[0];
            if (f) handleATSStandaloneUpload(f);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeGlobalATS();
        });
    }

    async function handleATSStandaloneUpload(f) {
        if (!f) return;
        const uz = document.getElementById('atsUploadZone');
        const ld = document.getElementById('atsLoading');
        const analyzeBtn = document.getElementById('atsAnalyzeBtn');
        const info = document.querySelector('.ats-info-pane');

        if (info) info.style.display = 'none';
        uz.style.display = 'none';
        ld.style.display = 'block';

        try {
            let text = '';
            const ext = f.name.split('.').pop().toLowerCase();
            if (ext === 'pdf') text = await extractPDFText(f);
            else if (ext === 'docx') text = await extractDOCXText(f);
            else if (ext === 'doc') text = await extractDOCText(f);
            else if (ext === 'txt') text = await f.text();
            else throw new Error('Unsupported format');

            if (!text || text.trim().length < 50) throw new Error('Could not read enough text.');

            window.currentATSResumeText = text;
            window.currentATSResumeData = parseRGlobal(text);

            // Successfully uploaded - show Analyze button instead of immediate result
            ld.style.display = 'none';
            if (analyzeBtn) {
                analyzeBtn.style.display = 'inline-flex';
                analyzeBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Analyze for Match';
            }
            
            // Helpful feedback on zone
            uz.innerHTML = `<i class="fas fa-check-circle" style="color:#10b981;"></i><p>${f.name}</p><small>Resume Loaded. Ready to analyze.</small>`;
            uz.style.display = 'block';
            uz.style.borderColor = '#10b981';
            uz.onclick = () => document.getElementById('atsFileIn').click();

        } catch (err) {
            alert('Error: ' + err.message);
            window.resetATSStandalone();
        }
    }

    window.triggerATSContextualAnalysis = function() {
        if (!window.currentATSResumeText) {
            alert("Please upload a resume first.");
            return;
        }

        const jdIn = document.getElementById('atsJDIn');
        const jd = jdIn ? jdIn.value.trim() : "";
        const ld = document.getElementById('atsLoading');
        const res = document.getElementById('atsRes');
        const uz = document.getElementById('atsUploadZone');
        const jdSec = document.getElementById('atsJDSection');
        const analyzeBtn = document.getElementById('atsAnalyzeBtn');

        if (ld) ld.style.display = 'block';
        if (res) res.style.display = 'none';
        if (uz) uz.style.display = 'none';
        if (jdSec) jdSec.style.display = 'none';
        if (analyzeBtn) analyzeBtn.style.display = 'none';

        setTimeout(() => {
            analyzeATSDataGlobal(window.currentATSResumeData, window.currentATSResumeText, jd);
        }, 600);
    };

    async function extractPDFText(f) {
        if (typeof pdfjsLib === 'undefined') {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
            document.head.appendChild(s);
            await new Promise(r => s.onload = r);
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        }
        const arr = await f.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arr }).promise;
        let txt = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const pg = await pdf.getPage(i);
            const content = await pg.getTextContent();
            txt += content.items.map(it => it.str).join(' ') + '\n';
        }
        return txt;
    }

    async function extractDOCXText(f) {
        if (typeof mammoth === 'undefined') {
            const s = document.createElement('script');
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.4.21/mammoth.browser.min.js';
            document.head.appendChild(s);
            await new Promise(r => s.onload = r);
        }
        const arr = await f.arrayBuffer();
        const res = await mammoth.extractRawText({ arrayBuffer: arr });
        return res.value;
    }

    async function extractDOCText(f) {
        const b = await f.arrayBuffer();
        const arr = new Uint8Array(b);
        let txt = '';
        for (let i = 0; i < arr.length; i++) {
            const c = arr[i];
            if ((c >= 32 && c <= 126) || c === 10 || c === 13) txt += String.fromCharCode(c);
        }
        return txt.replace(/[^\x20-\x7E]/g, ' ').replace(/\s{3,}/g, ' ').trim();
    }

    function parseRGlobal(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 1);
        let d = { name: '', title: '', email: '', phone: '', summary: '', experience: [], education: [], skills: [] };
        const kws = { summary: ['summary', 'profile', 'about'], experience: ['experience', 'work', 'history'], education: ['education', 'academic'], skills: ['skills', 'technologies', 'tools'] };
        
        let cur = '';
        for (let l of lines) {
            const low = l.toLowerCase();
            let found = false;
            for (let [k, list] of Object.entries(kws)) {
                if (list.some(w => low.includes(w) && l.length < 30)) { cur = k; found = true; break; }
            }
            if (found) continue;

            if (low.includes('@') && !d.email) { d.email = l.match(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/)?.[0] || ''; }
            if ((low.includes('linkedin.com') || low.includes('github.com')) && !d.summary.includes(l)) d.summary += ' ' + l;

            if (cur === 'summary' && l.length > 10) d.summary += ' ' + l;
            else if (cur === 'experience' && l.length > 5) d.experience.push({ role: l });
            else if (cur === 'education' && l.length > 5) d.education.push({ school: l });
            else if (cur === 'skills') {
                const s = l.split(/[,|•·;]/).map(x => x.trim()).filter(x => x.length > 2 && x.length < 30);
                d.skills.push(...s);
            }
        }
        return d;
    }

    function analyzeATSDataGlobal(data, rawText, jdText = "") {
        const txt = (rawText || JSON.stringify(data)).toLowerCase();
        const jd = (jdText || "").toLowerCase();
        const hasJD = jd.length > 50;
        
        let score = 0;
        let qualityScore = 30; // Base for just existing
        let matchScore = 0;
        let checks = [];
        let suggests = [];

        // 1. QUALITY CHECKS (General Best Practices)
        if (data.summary && data.summary.length > 80) { qualityScore += 10; checks.push({ p: true, t: 'Summary', d: 'Well-defined professional intro.' }); }
        else { checks.push({ p: false, t: 'Brief Summary', d: 'Expand your bio for better keyword hits.' }); suggests.push({ t: 'Career Overview', d: 'Add 2-3 sentences about your expertise.' }); }

        if (data.experience.length >= 2) { qualityScore += 10; checks.push({ p: true, t: 'Experience', d: 'Solid work history detected.' }); }
        else { checks.push({ p: false, w: true, t: 'Experience', d: 'Only one role found. Consider adding more details.' }); suggests.push({ t: 'Quantify Work', d: 'Add specific bullet points for each previous role.' }); }

        if (data.skills.length >= 8) { qualityScore += 10; checks.push({ p: true, t: 'Skills', d: 'Strong technical baseline.' }); }
        else { checks.push({ p: false, t: 'Skills', d: 'Add at least 8-10 industry-specific keywords.' }); suggests.push({ t: 'Keywords', d: 'Look at job descriptions and add missing technical tools.' }); }

        const verbs = ['led', 'developed', 'managed', 'created', 'designed', 'improved', 'increased', 'reduced', 'built', 'launched', 'optimized'];
        let vc = 0; verbs.forEach(v => { if (txt.includes(v)) vc++; });
        if (vc >= 4) { qualityScore += 10; checks.push({ p: true, t: 'Action Verbs', d: 'Good use of dynamic language.' }); }
        else { checks.push({ p: false, t: 'Passive Tone', d: 'Use more action-oriented verbs.' }); suggests.push({ t: 'Strong Verbs', d: 'Start bullets with "Spearheaded", "Optimized", etc.' }); }

        if (/\d+%|\$\d|\d+x/i.test(txt)) { qualityScore += 10; checks.push({ p: true, t: 'Impact Metrics', d: 'Great job quantifying achievements.' }); }
        else { checks.push({ p: false, w: true, t: 'Impact', d: 'Missing numbers to prove results.' }); suggests.push({ t: 'Add Stats', d: 'Example: "Increased sales by 30%" instead of "Helped sales".' }); }

        // 2. CONTEXTUAL MATCH (JD Alignment)
        if (hasJD) {
            const commonTech = ["javascript", "typescript", "react", "node", "express", "python", "django", "flask", "java", "spring", "aws", "docker", "kubernetes", "sql", "nosql", "cloud", "agile", "scrum", "api"];
            let jdKeywords = [];
            commonTech.forEach(kw => { if (jd.includes(kw)) jdKeywords.push(kw); });
            
            // Extract some important words from JD (simple method)
            const jdWords = jd.replace(/[^a-z\s]/g, '').split(/\s+/).filter(w => w.length > 4);
            const uniqueJD = [...new Set(jdWords)];
            
            let matched = [];
            jdKeywords.forEach(kw => { if (txt.includes(kw)) matched.push(kw); });
            
            const matchRate = jdKeywords.length > 0 ? (matched.length / jdKeywords.length) : 0.5;
            matchScore = Math.floor(matchRate * 30);
            
            if (matchRate > 0.7) checks.push({ p: true, t: 'JD Alignment', d: 'Strong keyword overlap with the job description.' });
            else if (matchRate > 0.4) checks.push({ p: false, w: true, t: 'Partial Match', d: 'You have some matching skills, but missing key requirements.' });
            else checks.push({ p: false, t: 'Low Compatibility', d: 'Few keywords matched the JD. Consider tailoring your resume.' });

            // Missing from JD
            const missing = jdKeywords.filter(kw => !matched.includes(kw));
            if (missing.length > 0) {
                suggests.push({ t: 'Missing JD Keywords', d: `Consider adding: ${missing.slice(0, 5).join(', ')} if you have experience with them.` });
            }
            
            score = Math.min(100, qualityScore + matchScore);
        } else {
            // No JD - scale quality score to 100
            score = Math.floor(Math.min(100, qualityScore * 1.25));
            checks.push({ p: false, w: true, t: 'No JD Context', d: 'Analyze against a specific JD for a more accurate match score.' });
        }

        const circ = document.getElementById('atsCircleS');
        const stxt = document.getElementById('atsScoreTxtS');
        const chk = document.getElementById('atsChkS');
        const sugEl = document.getElementById('atsSuggestions');

        if (circ) { circ.style.setProperty('--p', `${score}%`); circ.dataset.score = score > 80 ? 'excellent' : score > 60 ? 'good' : 'poor'; }
        if (stxt) stxt.textContent = score;
        if (chk) { chk.innerHTML = checks.map(c => `<div class="ats-item ${c.p ? 'pass' : (c.w ? 'warn' : 'fail')}"><i class="fas ${c.p ? 'fa-check-circle' : (c.w ? 'fa-exclamation-triangle' : 'fa-times-circle')}"></i><div class="ats-itxt"><h4>${c.t}</h4><p>${c.d}</p></div></div>`).join(''); }
        if (sugEl) { sugEl.innerHTML = suggests.map(s => `<div class="ats-sugg-item"><i class="fas fa-lightbulb"></i><div class="ats-sugg-content"><h5>${s.t}</h5><p>${s.d}</p></div></div>`).join(''); }

        document.getElementById('atsLoading').style.display = 'none';
        document.getElementById('atsRes').style.display = 'block';
    }


    // ==========================================
    // BUTTON CLICK TRACKING
    // Tracks clicks on: tutorials, ai_features,
    // resume_builder, ats_resume_checker, jobs
    // ==========================================
    const TRACKING_API = API_BASE + '/api/v1/analytics/click';

    /**
     * Fire-and-forget click tracking.
     * Uses sendBeacon for reliability (works even if user navigates away).
     * Falls back to fetch if sendBeacon is unavailable.
     * @param {string} buttonName - one of: tutorials, ai_features, resume_builder, ats_resume_checker, jobs
     */
    function trackButtonClick(buttonName) {
        try {
            const payload = JSON.stringify({ buttonName: buttonName });
            const token = localStorage.getItem('AUTH_TOKEN');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            // Prefer sendBeacon (survives page navigation)
            if (navigator.sendBeacon) {
                const blob = new Blob([payload], { type: 'application/json' });
                navigator.sendBeacon(TRACKING_API, blob);
            } else {
                // Fallback: fetch fire-and-forget
                fetch(TRACKING_API, {
                    method: 'POST',
                    headers: headers,
                    body: payload,
                    keepalive: true
                }).catch(() => { /* silent */ });
            }
            console.log('[Analytics] Tracked click:', buttonName);
        } catch (e) {
            // Never block user interaction for analytics
        }
    }

    // Expose globally so inline onclick handlers (e.g., ATS hero button) can use it
    window.trackButtonClick = trackButtonClick;

    /**
     * Attach click listeners to all tracked nav buttons.
     * Called once from init() after navbar HTML is injected.
     */
    function attachClickTracking() {
        // ── TUTORIALS ──
        document.querySelectorAll('#navbarTutorBtn, #navbarMobileTutorBtn').forEach(btn => {
            btn.addEventListener('click', () => trackButtonClick('tutorials'));
        });

        // ── AI FEATURES ──
        // Desktop navbar link + mobile nav link — match by text content
        document.querySelectorAll('.navbar-nav-items a, .navbar-mobile-nav a').forEach(link => {
            if (link.textContent.trim() === 'AI Features') {
                link.addEventListener('click', () => trackButtonClick('ai_features'));
            }
        });

        // ── RESUME BUILDER ──
        document.querySelectorAll('.navbar-nav-items a, .navbar-mobile-nav a').forEach(link => {
            if (link.textContent.trim() === 'Resume Builder') {
                link.addEventListener('click', () => trackButtonClick('resume_builder'));
            }
        });

        // ── ATS RESUME CHECKER ──
        // The floating action button
        const atsFab = document.getElementById('atsGlobalFab');
        if (atsFab) {
            atsFab.addEventListener('click', () => trackButtonClick('ats_resume_checker'));
        }
        // Any ATS hero buttons on pages (class-based)
        document.querySelectorAll('.ats-hero-btn').forEach(btn => {
            btn.addEventListener('click', () => trackButtonClick('ats_resume_checker'));
        });

        // ── JOBS ──
        document.querySelectorAll('.navbar-nav-items a, .navbar-mobile-nav a').forEach(link => {
            if (link.textContent.trim() === 'Jobs') {
                link.addEventListener('click', () => trackButtonClick('jobs'));
            }
        });

        // ── EXPLORE COURSES ──
        document.querySelectorAll('a, button').forEach(link => {
            if (link.textContent && link.textContent.trim().toLowerCase().includes('explore courses')) {
                link.addEventListener('click', () => trackButtonClick('explore_courses'));
            }
        });

        console.log('[Analytics] Click tracking attached to: tutorials, ai_features, resume_builder, ats_resume_checker, jobs, explore_courses');
    }

    function attachFooterEvents() {
        const form = document.getElementById('footerFeedbackForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('feedbackSubmitBtn');
            const success = document.getElementById('feedbackSuccess');
            const email = document.getElementById('feedbackEmail').value;
            const category = document.getElementById('feedbackCategory').value;
            const message = document.getElementById('feedbackMessage').value;

            // Extract username if logged in
            const nameEl = document.getElementById('navbarUsername');
            const name = (nameEl && nameEl.textContent !== 'User') ? nameEl.textContent : 'Anonymous';

            btn.disabled = true;
            btn.textContent = 'Sending...';

            try {
                const resp = await fetch(`${API_BASE}/api/v1/feedback`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, category, message, name })
                });

                if (resp.ok) {
                    form.reset();
                    success.style.display = 'block';
                    setTimeout(() => { success.style.display = 'none'; }, 5000);
                } else {
                    throw new Error('Failed to send feedback');
                }
            } catch (err) {
                console.error('Feedback error:', err);
                alert('Oops! Could not send feedback. Please try again later.');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Send Feedback';
            }
        });
    }

    // ==========================================
    // INIT
    // ==========================================
    function init() {
        injectDependencies();
        injectNavbar();
        makeLogoTransparent();
        attachEvents();
        attachATSGlobalEvents(); // New global ATS events
        attachFooterEvents();   // Feedback form logic
        loadTutorialsConfig();
        populateReferPopup();
        checkAuthState();
        attachClickTracking(); // Button click analytics
    }

    function makeLogoTransparent() {
        const imgs = document.querySelectorAll('.navbar-logo-img');
        imgs.forEach(img => {
            if (img.dataset.cleaned === '1') return;
            img.dataset.cleaned = '1';

            const src = img.getAttribute('src');
            if (!src) return;

            const i = new Image();
            i.crossOrigin = 'anonymous';
            i.onload = () => {
                try {
                    // Crop to a centered square (works for icon-only or icon+text logos)
                    const fullW = i.naturalWidth || i.width;
                    const fullH = i.naturalHeight || i.height;
                    const cropSize = Math.min(fullW, fullH);
                    const sx = Math.max(0, Math.floor((fullW - cropSize) / 2));
                    const sy = Math.max(0, Math.floor((fullH - cropSize) / 2));

                    const canvas = document.createElement('canvas');
                    canvas.width = cropSize;
                    canvas.height = cropSize;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.drawImage(i, sx, sy, cropSize, cropSize, 0, 0, cropSize, cropSize);

                    const imgData = ctx.getImageData(0, 0, cropSize, cropSize);
                    const d = imgData.data;
                    for (let p = 0; p < d.length; p += 4) {
                        const r = d[p], g = d[p + 1], b = d[p + 2];
                        // near-white pixels become transparent
                        if (r > 245 && g > 245 && b > 245) {
                            d[p + 3] = 0;
                        }
                    }
                    ctx.putImageData(imgData, 0, 0);
                    img.src = canvas.toDataURL('image/png');
                } catch {
                    // ignore if canvas blocked
                }
            };
            i.src = src;
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
