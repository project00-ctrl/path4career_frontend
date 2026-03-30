/**
 * Reference Page — Dynamic Loader
 * Loads reference JSON data, renders sidebar + tables,
 * supports topic navigation, course prefixing, tag-to-tutorial linking,
 * and a landing page with search when no ?course= is specified.
 */
document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================
    // STATE
    // ==========================================
    let sections = [];
    let currentSectionIndex = 0;

    const urlParams = new URLSearchParams(window.location.search);
    const courseFile = urlParams.get('course');

    const contentArea = document.querySelector('.content-area');
    const sidebar = document.querySelector('.sidebar-menu');

    // ==========================================
    // TUTORIAL FILE MAP (reference → tutorial)
    // ==========================================
    const TUTORIAL_FILE_MAP = {
        'htmlReference.json': 'htmlPages.json',
        'cssReference.json': 'cssPages.json',
        'jsReference.json': 'jsPages.json',
        'typescriptReference.json': 'typescriptPages.json',
        'reactReference.json': 'reactPages.json',
        'vuejsReference.json': 'vuePages.json',
        'angularReference.json': 'angularPages.json',
        'bootstrapReference.json': 'bootstrapPages.json',
        'tailwindReference.json': 'tailwindcssPages.json',
        'jqueryReference.json': 'jqueryPages.json',
        'nextjsReference.json': 'nextjsPages.json',
        'pythonReference.json': 'pythonPages.json',
        'javaReference.json': 'javaPages.json',
        'cReference.json': 'cPages.json',
        'cppReference.json': 'cPages.json',
        'csharpReference.json': 'cSharpPages.json',
        'phpReference.json': 'phpPages.json',
        'goReference.json': 'goPages.json',
        'rReference.json': 'rPages.json',
        'nodejsReference.json': 'nodejsPages.json',
        'djangoReference.json': 'djangoPages.json',
        'flaskReference.json': 'flaskPages.json',
        'fastapiReference.json': 'fastapiPages.json',
        'springbootReference.json': 'springbootPages.json',
        'aspnetReference.json': 'aspPages.json',
        'graphqlReference.json': 'graphqlPages.json',
        'sqlReference.json': 'sqlPages.json',
        'mysqlReference.json': 'mysqlPages.json',
        'postgresqlReference.json': 'postgresqlPages.json',
        'mongodbReference.json': 'mongodbPages.json',
        'numpyReference.json': 'numpyPages.json',
        'pandasReference.json': 'pandasPages.json',
        'pytorchReference.json': 'pytorchPages.json',
        'matplotlibReference.json': 'matplotlibPages.json',
        'seabornReference.json': 'seabornPages.json',
        'excelReference.json': 'excelPages.json',
        'powerbiReference.json': 'powerbiPages.json',
        'datascienceReference.json': 'datasciencePages.json',
        'dockerReference.json': 'dockerPages.json',
        'kubernetesReference.json': 'kubernetesPages.json',
        'gitReference.json': 'gitPages.json',
        'awsReference.json': 'awsPages.json',
        'xmlReference.json': 'xmlPages.json',
        'dsaReference.json': 'dsaPages.json',
        'aiReference.json': 'aiPages.json'
    };

    // ==========================================
    // EDITOR PAGE MAP (reference → editor page)
    // ==========================================
    const EDITOR_MAP = {
        'htmlReference.json': 'html-editor.html',
        'cssReference.json': 'css-editor.html',
        'jsReference.json': 'js-editor.html',
        'typescriptReference.json': 'typescript-editor.html',
        'reactReference.json': 'react-editor.html',
        'vuejsReference.json': 'vue-editor.html',
        'angularReference.json': 'angular-editor.html',
        'bootstrapReference.json': 'bootstrap-editor.html',
        'tailwindReference.json': 'tailwind-editor.html',
        'jqueryReference.json': 'jquery-editor.html',
        'nextjsReference.json': 'nextjs-editor.html',
        'pythonReference.json': 'python-editor.html',
        'javaReference.json': 'java-editor.html',
        'cReference.json': 'c-editor.html',
        'cppReference.json': 'cpp-editor.html',
        'csharpReference.json': 'csharp-editor.html',
        'phpReference.json': 'php-editor.html',
        'goReference.json': 'go-editor.html',
        'rReference.json': 'r-editor.html',
        'nodejsReference.json': 'nodejs-editor.html',
        'djangoReference.json': 'django-editor.html',
        'flaskReference.json': 'flask-editor.html',
        'fastapiReference.json': 'fastapi-editor.html',
        'springbootReference.json': 'springboot-editor.html',
        'aspnetReference.json': 'asp-editor.html',
        'graphqlReference.json': 'graphql-editor.html',
        'sqlReference.json': 'sql-editor.html',
        'mysqlReference.json': 'mysql-editor.html',
        'postgresqlReference.json': 'postgresql-editor.html',
        'mongodbReference.json': 'mongodb-editor.html',
        'numpyReference.json': 'numpy-editor.html',
        'pandasReference.json': 'pandas-editor.html',
        'pytorchReference.json': 'datascience-editor.html',
        'matplotlibReference.json': 'datascience-editor.html',
        'seabornReference.json': 'datascience-editor.html',
        'excelReference.json': 'excel-editor.html',
        'powerbiReference.json': 'powerbi-editor.html',
        'datascienceReference.json': 'datascience-editor.html',
        'dockerReference.json': 'docker-editor.html',
        'kubernetesReference.json': 'kubernetes-editor.html',
        'gitReference.json': 'git-editor.html',
        'awsReference.json': 'aws-editor.html',
        'xmlReference.json': 'xml-editor.html',
        'dsaReference.json': 'dsa-editor.html',
        'aiReference.json': 'ai-editor.html'
    };

    // When opening an editor from the Reference page we should not reuse
    // stale localStorage from an earlier Tutorial/Exercise attempt.
    const EDITOR_STORAGE_KEY_MAP = {
        'html-editor.html': 'path4careerHtmlCode',
        'css-editor.html': 'path4careerCssCode',
        'js-editor.html': 'path4careerJSCode',
        'javascript-editor.html': 'path4careerJSCode',
        'typescript-editor.html': 'path4careerTypeScriptCode',
        'react-editor.html': 'path4careerReactCode',
        'vue-editor.html': 'path4careerVueCode',
        'angular-editor.html': 'path4careerAngularCode',
        'bootstrap-editor.html': 'path4careerBootstrapCode',
        'tailwind-editor.html': 'path4careerTailwindCode',
        'jquery-editor.html': 'path4careerJqueryCode',
        'nextjs-editor.html': 'path4careerNextjsCode',
        'python-editor.html': 'path4careerPythonCode',
        'java-editor.html': 'path4careerJavaCode',
        'c-editor.html': 'path4careerCCode',
        'cpp-editor.html': 'path4careerCppCode',
        'csharp-editor.html': 'path4careerCSharpCode',
        'php-editor.html': 'path4careerPhpCode',
        'go-editor.html': 'path4careerGoCode',
        'r-editor.html': 'path4careerRCode',
        'nodejs-editor.html': 'path4careerNodejsCode',
        'django-editor.html': 'path4careerDjangoCode',
        'flask-editor.html': 'path4careerFlaskCode',
        'fastapi-editor.html': 'path4careerFastapiCode',
        'springboot-editor.html': 'path4careerSpringbootCode',
        'asp-editor.html': 'path4careerAspCode',
        'graphql-editor.html': 'path4careerGraphqlCode',
        'sql-editor.html': 'path4careerTempCode',
        'mysql-editor.html': 'path4careerMySQLCode',
        'postgresql-editor.html': 'path4careerPostgresqlCode',
        'mongodb-editor.html': 'path4careerMongoDBCode',
        'numpy-editor.html': 'path4careerNumpyCode',
        'pandas-editor.html': 'path4careerPandasCode',
        'datascience-editor.html': 'path4careerDatascienceCode',
        'excel-editor.html': 'path4careerExcelCode',
        'powerbi-editor.html': 'path4careerPowerbiCode',
        'docker-editor.html': 'path4careerDockerCode',
        'kubernetes-editor.html': 'path4careerKubernetesCode',
        'git-editor.html': 'path4careerGitCode',
        'aws-editor.html': 'path4careerAwsCode',
        'xml-editor.html': 'path4careerXmlCode',
        'dsa-editor.html': 'path4careerDSACode',
        'ai-editor.html': 'path4careerAiCode'
    };

    function getStorageKeyForEditorUrl(editorUrl) {
        try {
            const file = String(editorUrl || '').split('/').pop();
            return EDITOR_STORAGE_KEY_MAP[file] || null;
        } catch {
            return null;
        }
    }

    // ==========================================
    // REFERENCE CARDS (for landing page)
    // ==========================================
    const REFERENCE_CARDS = [
        // Frontend
        { icon: '🌐', name: 'HTML',        file: 'htmlReference.json' },
        { icon: '🎨', name: 'CSS',         file: 'cssReference.json' },
        { icon: '⚡', name: 'JavaScript',  file: 'jsReference.json' },
        { icon: '🔷', name: 'TypeScript',  file: 'typescriptReference.json' },
        { icon: '⚛️', name: 'React',       file: 'reactReference.json' },
        { icon: '💚', name: 'Vue.js',      file: 'vuejsReference.json' },
        { icon: '🅰️', name: 'Angular',     file: 'angularReference.json' },
        { icon: '🅱️', name: 'Bootstrap',   file: 'bootstrapReference.json' },
        { icon: '🌊', name: 'Tailwind',    file: 'tailwindReference.json' },
        { icon: '📦', name: 'jQuery',      file: 'jqueryReference.json' },
        { icon: '▲',  name: 'Next.js',     file: 'nextjsReference.json' },
        // Backend
        { icon: '🟢', name: 'Node.js',     file: 'nodejsReference.json' },
        { icon: '🎸', name: 'Django',      file: 'djangoReference.json' },
        { icon: '🧪', name: 'Flask',       file: 'flaskReference.json' },
        { icon: '🚀', name: 'FastAPI',     file: 'fastapiReference.json' },
        { icon: '🍃', name: 'Spring Boot', file: 'springbootReference.json' },
        { icon: '🟦', name: 'ASP.NET',     file: 'aspnetReference.json' },
        { icon: '◈',  name: 'GraphQL',     file: 'graphqlReference.json' },
        // Database
        { icon: '🗃️', name: 'SQL',         file: 'sqlReference.json' },
        { icon: '🐬', name: 'MySQL',       file: 'mysqlReference.json' },
        { icon: '🐘', name: 'PostgreSQL',  file: 'postgresqlReference.json' },
        { icon: '🍃', name: 'MongoDB',     file: 'mongodbReference.json' },
        // Languages
        { icon: '🐍', name: 'Python',      file: 'pythonReference.json' },
        { icon: '☕', name: 'Java',        file: 'javaReference.json' },
        { icon: '💻', name: 'C',           file: 'cReference.json' },
        { icon: '⚙️', name: 'C++',         file: 'cppReference.json' },
        { icon: '🟪', name: 'C#',          file: 'csharpReference.json' },
        { icon: '🐘', name: 'PHP',         file: 'phpReference.json' },
        { icon: '🐹', name: 'Go',          file: 'goReference.json' },
        { icon: '📊', name: 'R',           file: 'rReference.json' },
        // Data Science
        { icon: '🔢', name: 'NumPy',       file: 'numpyReference.json' },
        { icon: '🐼', name: 'Pandas',      file: 'pandasReference.json' },
        { icon: '🔥', name: 'PyTorch',     file: 'pytorchReference.json' },
        { icon: '📉', name: 'Matplotlib',  file: 'matplotlibReference.json' },
        { icon: '🎨', name: 'Seaborn',     file: 'seabornReference.json' },
        { icon: '📊', name: 'Excel',       file: 'excelReference.json' },
        { icon: '📊', name: 'Power BI',    file: 'powerbiReference.json' },
        { icon: '🔬', name: 'Data Science', file: 'datascienceReference.json' },
        // DevOps
        { icon: '🐳', name: 'Docker',      file: 'dockerReference.json' },
        { icon: '☸️', name: 'Kubernetes',   file: 'kubernetesReference.json' },
        { icon: '🔀', name: 'Git',         file: 'gitReference.json' },
        { icon: '☁️', name: 'AWS',          file: 'awsReference.json' },
        // Other
        { icon: '📄', name: 'XML',         file: 'xmlReference.json' },
        { icon: '🧮', name: 'DSA',         file: 'dsaReference.json' },
        { icon: '🤖', name: 'AI',          file: 'aiReference.json' }
    ];

    // ==========================================
    // COURSE NAME FROM FILE
    // ==========================================
    function getCourseName(file) {
        if (!file) return '';
        const map = {
            'htmlReference.json': 'HTML',
            'cssReference.json': 'CSS',
            'jsReference.json': 'JavaScript',
            'typescriptReference.json': 'TypeScript',
            'reactReference.json': 'React',
            'vuejsReference.json': 'Vue.js',
            'angularReference.json': 'Angular',
            'bootstrapReference.json': 'Bootstrap',
            'tailwindReference.json': 'Tailwind',
            'jqueryReference.json': 'jQuery',
            'nextjsReference.json': 'Next.js',
            'pythonReference.json': 'Python',
            'javaReference.json': 'Java',
            'cReference.json': 'C',
            'cppReference.json': 'C++',
            'csharpReference.json': 'C#',
            'phpReference.json': 'PHP',
            'goReference.json': 'Go',
            'rReference.json': 'R',
            'nodejsReference.json': 'Node.js',
            'djangoReference.json': 'Django',
            'flaskReference.json': 'Flask',
            'fastapiReference.json': 'FastAPI',
            'springbootReference.json': 'Spring Boot',
            'aspnetReference.json': 'ASP.NET',
            'graphqlReference.json': 'GraphQL',
            'sqlReference.json': 'SQL',
            'mysqlReference.json': 'MySQL',
            'postgresqlReference.json': 'PostgreSQL',
            'mongodbReference.json': 'MongoDB',
            'numpyReference.json': 'NumPy',
            'pandasReference.json': 'Pandas',
            'pytorchReference.json': 'PyTorch',
            'matplotlibReference.json': 'Matplotlib',
            'seabornReference.json': 'Seaborn',
            'excelReference.json': 'Excel',
            'powerbiReference.json': 'Power BI',
            'datascienceReference.json': 'Data Science',
            'dockerReference.json': 'Docker',
            'kubernetesReference.json': 'Kubernetes',
            'gitReference.json': 'Git',
            'awsReference.json': 'AWS',
            'xmlReference.json': 'XML',
            'dsaReference.json': 'DSA',
            'aiReference.json': 'AI'
        };
        return map[file] || file.replace('Reference.json', '');
    }

    function prefixedTitle(title) {
        const course = getCourseName(courseFile);
        return course ? `${course} ${title}` : title;
    }

    // ==========================================
    // HTML ESCAPING
    // ==========================================
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ==========================================
    // TAG LINK BUILDER
    // ==========================================
    function buildTagLink(rawValue, sectionTitle) {
        const tutorialFile = TUTORIAL_FILE_MAP[courseFile];
        if (!tutorialFile) return escapeHTML(rawValue);

        // Clean the tag: strip angle brackets and parentheses
        const cleanTag = rawValue
            .replace(/^<|>$/g, '')
            .replace(/[()]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .trim();

        // Build topic slug from section title
        const topicSlug = sectionTitle
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        const href = `tutorial.html?course=${tutorialFile}&topic=${topicSlug}&tag=${cleanTag}`;
        return `<a href="${href}" class="ref-link">${escapeHTML(rawValue)}</a>`;
    }

    // ==========================================
    // LANDING PAGE (no course param)
    // ==========================================
    function renderLanding() {
        if (sidebar) sidebar.style.display = 'none';

        let html = `
            <div class="ref-landing-header">
                <h1>📚 References</h1>
                <p>Quick-access documentation and cheat sheets for all technologies</p>
            </div>
            <div class="ref-search-wrapper">
                <span class="search-icon">🔍</span>
                <input type="text" class="ref-search-input" id="ref-search-input"
                       placeholder="Search references..." autocomplete="off">
            </div>
            <div class="ref-landing-grid" id="ref-landing-grid">`;

        REFERENCE_CARDS.forEach(card => {
            html += `
                <a href="reference.html?course=${card.file}" class="ref-landing-card" data-name="${card.name.toLowerCase()}">
                    <span class="card-icon">${card.icon}</span>
                    <span class="card-label">${card.name}</span>
                </a>`;
        });

        html += `</div>`;
        contentArea.innerHTML = html;

        // Search filter
        const searchInput = document.getElementById('ref-search-input');
        const grid = document.getElementById('ref-landing-grid');
        if (searchInput && grid) {
            searchInput.addEventListener('input', function () {
                const q = this.value.trim().toLowerCase();
                const cards = grid.querySelectorAll('.ref-landing-card');
                let visibleCount = 0;

                cards.forEach(card => {
                    const name = card.getAttribute('data-name') || '';
                    const match = name.includes(q);
                    card.style.display = match ? '' : 'none';
                    if (match) visibleCount++;
                });

                // Show/hide no-results
                let noResults = grid.querySelector('.ref-no-results');
                if (visibleCount === 0) {
                    if (!noResults) {
                        noResults = document.createElement('div');
                        noResults.className = 'ref-no-results';
                        noResults.textContent = 'No matching references found.';
                        grid.appendChild(noResults);
                    }
                    noResults.style.display = '';
                } else if (noResults) {
                    noResults.style.display = 'none';
                }
            });
        }
    }

    // ==========================================
    // LOAD COURSE DATA
    // ==========================================
    async function loadCourse(file) {
        try {
            const resp = await fetch(`../assets/data/references/${file}`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();

            sections = data.sections || [];
            if (!sections.length) {
                contentArea.innerHTML = '<h2 style="color:#ff4757;padding:40px;">No reference data found.</h2>';
                return;
            }

            buildSidebar();
            renderSection(0);
        } catch (err) {
            console.error('Reference loading error:', err);
            contentArea.innerHTML =
                `<h2 style="color:#ff4757; padding:40px;">
                    Error loading reference data.<br>
                    Check file path & ensure Live Server is running.
                </h2>`;
        }
    }

    // ==========================================
    // BUILD SIDEBAR
    // ==========================================
    function buildSidebar() {
        if (!sidebar) return;
        sidebar.innerHTML = '';

        sections.forEach((section, index) => {
            const li = document.createElement('li');
            li.textContent = prefixedTitle(section.title);
            li.dataset.index = index;
            sidebar.appendChild(li);
        });

        updateSidebarActive();
    }

    function updateSidebarActive() {
        if (!sidebar) return;
        const items = sidebar.querySelectorAll('li');

        items.forEach((li, i) => {
            li.style = '';
            if (i === currentSectionIndex) {
                li.style.color = '#020617'; // High-contrast dark text
                li.style.fontWeight = '700';
                li.style.borderLeft = '4px solid #00C985';
                li.style.paddingLeft = '20px';
                li.style.backgroundColor = 'rgba(0, 201, 133, 0.12)'; // Light green, "dont over shade"
                li.style.borderRadius = '0(10px 10px 0)';
                li.style.marginRight = '8px';
            } else {
                li.style.color = '#475569'; 
                li.style.paddingLeft = '24px';
            }
        });
    }

    // ==========================================
    // RENDER SECTION
    // ==========================================
    function renderSection(index) {
        if (!sections.length) return;
        if (index < 0 || index >= sections.length) index = 0;

        currentSectionIndex = index;
        const section = sections[index];
        const title = prefixedTitle(section.title);

        let html = '';

        // Top navigation
        html += buildNavButtons('top');

        // Title + description
        html += `<h1>${escapeHTML(title)}</h1>`;
        if (section.desc) {
            html += `<p class="ref-section-desc">${escapeHTML(section.desc)}</p>`;
        }

        // Open Editor button (inline modal, no page redirect)
        const editorPage = EDITOR_MAP[courseFile];
        if (editorPage) {
            html += `<button class="open-editor-btn" onclick="window._openRefEditorModal('editors/${editorPage}')" title="Open code editor">🖥️ Open Editor</button>`;
        }

        // Render content based on type
        switch (section.type) {
            case 'table':
                html += renderTable(section);
                break;
            case 'grouped-list':
                html += renderGroupedList(section);
                break;
            case 'code-block':
                html += renderCodeBlock(section);
                break;
            case 'module':
                html += renderModule(section);
                break;
            case 'html-content':
                html += section.content || '';
                break;
            default:
                html += renderTable(section);
        }

        // Bottom navigation
        html += buildNavButtons('bottom');

        contentArea.innerHTML = html;
        contentArea.scrollTo(0, 0);
        updateSidebarActive();

        // Update URL
        history.replaceState(null, '', `reference.html?course=${courseFile}`);
    }

    // ==========================================
    // TABLE RENDERER
    // ==========================================
    function renderTable(section) {
        const columns = section.columns || [];
        const rows = section.rows || [];
        if (!columns.length || !rows.length) return '';

        let html = '<div class="ref-table-wrap"><table class="ref-table"><thead><tr>';
        columns.forEach(col => {
            html += `<th>${escapeHTML(col)}</th>`;
        });
        html += '</tr></thead><tbody>';

        rows.forEach(row => {
            html += '<tr>';
            if (Array.isArray(row)) {
                row.forEach((cell, ci) => {
                    if (ci === 0) {
                        html += `<td>${buildTagLink(cell, section.title)}</td>`;
                    } else {
                        html += `<td>${escapeHTML(cell)}</td>`;
                    }
                });
            } else {
                // Object-style rows: { tag, desc, html5 }
                const values = Object.values(row);
                values.forEach((cell, ci) => {
                    if (ci === 0) {
                        html += `<td>${buildTagLink(cell, section.title)}</td>`;
                    } else {
                        html += `<td>${escapeHTML(cell)}</td>`;
                    }
                });
            }
            html += '</tr>';
        });

        html += '</tbody></table></div>';
        return html;
    }

    // ==========================================
    // GROUPED LIST RENDERER
    // ==========================================
    function renderGroupedList(section) {
        const groups = section.groups || [];
        let html = '';

        groups.forEach(group => {
            html += `<div class="ref-group"><h3>${escapeHTML(group.title || '')}</h3><ul>`;
            (group.items || []).forEach(item => {
                if (typeof item === 'string') {
                    html += `<li>${buildTagLink(item, section.title)}</li>`;
                } else {
                    const name = item.name || item.code || item.tag || '';
                    const desc = item.desc || item.description || '';
                    html += `<li>${buildTagLink(name, section.title)} — ${escapeHTML(desc)}</li>`;
                }
            });
            html += '</ul></div>';
        });

        return html;
    }

    // ==========================================
    // CODE BLOCK RENDERER
    // ==========================================
    function renderCodeBlock(section) {
        const code = section.code || '';
        return `<div class="ref-code-block"><pre>${escapeHTML(code)}</pre></div>`;
    }

    // ==========================================
    // MODULE RENDERER
    // ==========================================
    function renderModule(section) {
        const modules = section.modules || [];
        let html = '';

        modules.forEach(mod => {
            html += `<div class="ref-group"><h3>${escapeHTML(mod.name || '')}</h3>`;
            if (mod.description) {
                html += `<p class="ref-section-desc">${escapeHTML(mod.description)}</p>`;
            }
            if (mod.items && mod.items.length) {
                html += '<ul>';
                mod.items.forEach(item => {
                    const name = item.name || item.code || item.tag || '';
                    const desc = item.desc || item.description || '';
                    html += `<li>${buildTagLink(name, section.title)} — ${escapeHTML(desc)}</li>`;
                });
                html += '</ul>';
            }
            html += '</div>';
        });

        return html;
    }

    // ==========================================
    // NAVIGATION BUTTONS
    // ==========================================
    function buildNavButtons(position) {
        const isTop = position === 'top';
        const cssClass = isTop ? 'page-nav-buttons' : 'page-nav-buttons bottom-nav';

        const prevTitle = currentSectionIndex > 0
            ? prefixedTitle(sections[currentSectionIndex - 1].title)
            : null;
        const nextTitle = currentSectionIndex < sections.length - 1
            ? prefixedTitle(sections[currentSectionIndex + 1].title)
            : null;

        let html = `<div class="${cssClass}">`;

        if (prevTitle) {
            html += `<button class="btn-secondary prev-btn" title="${escapeHTML(prevTitle)}">« ${escapeHTML(prevTitle)}</button>`;
        } else {
            html += `<span></span>`;
        }

        if (nextTitle) {
            html += `<button class="btn-primary next-btn" title="${escapeHTML(nextTitle)}">${escapeHTML(nextTitle)} »</button>`;
        } else {
            html += `<span></span>`;
        }

        html += '</div>';
        return html;
    }

    // ==========================================
    // EVENT LISTENERS
    // ==========================================

    // Sidebar click
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                renderSection(parseInt(e.target.dataset.index));
            }
        });
    }

    // Next / Prev buttons (event delegation)
    if (contentArea) {
        contentArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-btn') && !e.target.disabled) {
                renderSection(currentSectionIndex + 1);
            } else if (e.target.classList.contains('prev-btn') && !e.target.disabled) {
                renderSection(currentSectionIndex - 1);
            }
        });
    }

    // ==========================================
    // MOBILE SIDEBAR TOGGLE
    // ==========================================
    const refSidebarToggle = document.getElementById('refSidebarToggle');
    const refSidebarOverlay = document.getElementById('refSidebarOverlay');
    const refLeftSidebar = document.getElementById('refLeftSidebar');
    const refSidebarClose = document.getElementById('refSidebarClose');

    function openRefSidebar() {
        if (refLeftSidebar) refLeftSidebar.classList.add('open');
        if (refSidebarOverlay) refSidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeRefSidebar() {
        if (refLeftSidebar) refLeftSidebar.classList.remove('open');
        if (refSidebarOverlay) refSidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (refSidebarToggle) {
        refSidebarToggle.addEventListener('click', openRefSidebar);
    }
    if (refSidebarClose) {
        refSidebarClose.addEventListener('click', closeRefSidebar);
    }
    if (refSidebarOverlay) {
        refSidebarOverlay.addEventListener('click', closeRefSidebar);
    }

    // Close sidebar when item clicked on mobile
    if (sidebar) {
        sidebar.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && window.innerWidth <= 768) {
                closeRefSidebar();
            }
        });
    }

    // Auto-close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeRefSidebar();
        }
    });

    // ==========================================
    // INLINE EDITOR MODAL (replaces target="_blank")
    // ==========================================
    window._openRefEditorModal = function(editorUrl) {
        window._closeRefEditorModal();

        // Clear the editor's storage key so it loads its own default template.
        const storageKey = getStorageKeyForEditorUrl(editorUrl);
        if (storageKey) {
            try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
        }

        const overlay = document.createElement('div');
        overlay.id = 'refEditorModalOverlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; z-index: 50000;
            background: rgba(0, 0, 0, 0.85);
            display: flex; flex-direction: column;
            backdrop-filter: blur(6px);
        `;

        const closeBar = document.createElement('div');
        closeBar.style.cssText = `
            display: flex; justify-content: flex-end; align-items: center;
            padding: 8px 16px; background: #1e293b;
            border-bottom: 2px solid #10B981;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕ Close Editor';
        closeBtn.style.cssText = `
            background: #ff4757; color: #fff; border: none;
            padding: 8px 18px; border-radius: 6px; cursor: pointer;
            font-size: 14px; font-weight: 600;
            transition: background 0.2s;
        `;
        closeBtn.onmouseenter = () => closeBtn.style.background = '#ff6b81';
        closeBtn.onmouseleave = () => closeBtn.style.background = '#ff4757';
        closeBtn.onclick = window._closeRefEditorModal;
        closeBar.appendChild(closeBtn);

        const iframe = document.createElement('iframe');
        iframe.src = editorUrl;
        iframe.style.cssText = `
            flex: 1; width: 100%; border: none; background: #0a0a23;
        `;

        overlay.appendChild(closeBar);
        overlay.appendChild(iframe);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';

        overlay._escHandler = (e) => {
            if (e.key === 'Escape') window._closeRefEditorModal();
        };
        document.addEventListener('keydown', overlay._escHandler);
    };

    window._closeRefEditorModal = function() {
        const overlay = document.getElementById('refEditorModalOverlay');
        if (overlay) {
            if (overlay._escHandler) {
                document.removeEventListener('keydown', overlay._escHandler);
            }
            overlay.remove();
            document.body.style.overflow = '';
        }
    };

    // ==========================================
    // INIT
    // ==========================================
    if (courseFile) {
        loadCourse(courseFile);
    } else {
        renderLanding();
    }

});
