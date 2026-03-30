/**
 * Shared Navbar Component
 * Dynamically injects header, mobile nav, course nav bar,
 * tutorials popup, and references popup into any page.
 * Supports pages at: root, /pages/, /pages/references/, /pages/roadmaps/, etc.
 */
(function () {
    'use strict';

    // ==========================================
    // PATH DETECTION — supports multiple depths
    // ==========================================
    const pathname = window.location.pathname.replace(/\\/g, '/');

    // Calculate depth: how many /subfolders/ are between project root and this page
    // Root (index.html)             → ROOT = './', PAGES = './pages/', REFS = './pages/references/'
    // pages/ (tutorial.html)        → ROOT = '../', PAGES = './',      REFS = './references/'
    // pages/references/ (html*.html)→ ROOT = '../../', PAGES = '../',  REFS = './'
    // pages/roadmaps/               → ROOT = '../../', PAGES = '../',  REFS = '../references/'

    let ROOT, PAGES, REFS, AUTH;

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
    // Encode current page URL for redirect after login
    const CURRENT_URL = encodeURIComponent(window.location.href);

    function buildNavbarHTML() {
        return `
        <!-- NAVBAR HEADER -->
        <header class="navbar-header" id="navbarHeader">
            <div class="header-container">
                <!-- Hamburger -->
                <div class="navbar-hamburger" id="navbarHamburger">☰</div>

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

                <!-- Mobile search toggle (opens dropdown search) -->
                <button class="navbar-mobile-search-btn" id="navbarMobileSearchToggle" aria-label="Search">
                    🔍
                </button>

                <!-- Desktop Nav -->
                <ul class="navbar-nav-items">
                    <li><a href="${PAGES}ai-career-shield/index.html">AI Career Shield</a></li>
                    <li><a href="${PAGES}path4career-simulator/index.html">AI Career Simulator</a></li>
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

                <!-- Profile (shown when logged in) -->
                <div class="navbar-profile" id="navbarProfile" style="display:none;">
                    <div class="navbar-avatar" id="navbarAvatar">U</div>
                    <span id="navbarUsername">User</span>
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
            <a href="${PAGES}ai-career-shield/index.html">AI Career Shield</a>
            <a href="${PAGES}path4career-simulator/index.html">AI Career Simulator</a>
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
        <div class="navbar-spacer"></div>
        `;
    }

    // ==========================================
    // INJECT INTO PAGE
    // ==========================================
    function injectNavbar() {
        const root = document.getElementById('navbar-root');
        if (!root) {
            document.body.insertAdjacentHTML('afterbegin', buildNavbarHTML());
        } else {
            root.innerHTML = buildNavbarHTML();
        }
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
            { name: 'AI Career Simulator', desc: 'Simulate career trajectory, connect with mentors, analyze risks', icon: '🚀', url: `${PAGES}path4career-simulator/index.html` },
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

        // Tutorials popup
        const tutorPopup = document.getElementById('navbarTutorPopup');
        const tutorClose = document.getElementById('navbarTutorClose');

        document.querySelectorAll('#navbarTutorBtn, #navbarMobileTutorBtn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (tutorPopup) tutorPopup.classList.add('open');
                if (mobileNav) mobileNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('open');
            });
        });

        if (tutorClose && tutorPopup) {
            tutorClose.addEventListener('click', () => tutorPopup.classList.remove('open'));
            tutorPopup.addEventListener('click', (e) => {
                // Mobile overlay: close when clicking outside inner panel
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
                if (referPopup) referPopup.classList.add('open');
                if (mobileNav) mobileNav.classList.remove('open');
                if (hamburger) hamburger.classList.remove('active');
                if (mobileOverlay) mobileOverlay.classList.remove('open');
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
        const API_BASE = 'https://path4career-backend.onrender.com';
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
    // INIT
    // ==========================================
    function init() {
        injectNavbar();
        // Remove white background in provided logo (simple chroma-key)
        makeLogoTransparent();
        attachEvents();
        loadTutorialsConfig();
        populateReferPopup();
        checkAuthState();
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
