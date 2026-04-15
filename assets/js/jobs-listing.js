/**
 * Jobs Listing Page Logic
 * Fetches from backend API, handles search/filter/pagination, and renders job cards.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const jobBoard = document.getElementById('jobBoard');
    const searchInput = document.getElementById('searchInput');
    const locationFilter = document.getElementById('locationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchBtn = document.getElementById('searchBtn');
    const jobCount = document.getElementById('jobCount');
    const pagination = document.getElementById('pagination');
    const filterChips = document.getElementById('filterChips');

    let allJobs = [];
    let filteredJobs = [];
    let currentPage = 1;
    const itemsPerPage = 6;

    // Read query params
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) searchInput.value = params.get('q');
    if (params.get('location')) locationFilter.value = params.get('location');
    if (params.get('type')) typeFilter.value = params.get('type');

    // Fetch jobs
    try {
        allJobs = await JobsAPI.fetchJobs();
        populateLocationFilter(allJobs);
        filterAndRender();
    } catch (err) {
        jobBoard.innerHTML = `<div class="empty-state"><h4>Unable to load jobs</h4><p>${err.message}</p></div>`;
        jobCount.textContent = 'Error loading jobs';
    }

    // Show recruiter portal button only for recruiters
    try {
        const auth = await JobsAPI.checkAuth();
        if (auth && auth.role === 'RECRUITER') {
            const btn = document.getElementById('recruiterPortalBtn');
            if (btn) {
                btn.style.display = '';
                btn.href = 'recruiter-dashboard.html';
            }
        }
    } catch (e) { /* guest user — keep hidden */ }

    // Event listeners
    searchBtn.addEventListener('click', () => { currentPage = 1; filterAndRender(); });
    searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') { currentPage = 1; filterAndRender(); }});
    locationFilter.addEventListener('change', () => { currentPage = 1; filterAndRender(); });
    typeFilter.addEventListener('change', () => { currentPage = 1; filterAndRender(); });

    // Modal close
    document.getElementById('modalClose').addEventListener('click', () => {
        document.getElementById('jobModal').classList.remove('show');
    });
    document.getElementById('jobModal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('jobModal')) {
            document.getElementById('jobModal').classList.remove('show');
        }
    });

    function populateLocationFilter(jobs) {
        const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))].sort();
        locations.forEach(loc => {
            const opt = document.createElement('option');
            opt.value = loc;
            opt.textContent = loc;
            if (params.get('location') === loc) opt.selected = true;
            locationFilter.appendChild(opt);
        });
    }

    async function filterAndRender() {
        const query = searchInput.value.trim().toLowerCase();
        const loc = locationFilter.value;
        const type = typeFilter.value;

        // 1. Filter local database jobs
        let localMatches = allJobs.filter(job => {
            const matchesQuery = !query ||
                (job.title || '').toLowerCase().includes(query) ||
                (job.company || '').toLowerCase().includes(query) ||
                (job.description || '').toLowerCase().includes(query) ||
                (job.jobRoleName || '').toLowerCase().includes(query);
            const matchesLocation = !loc || (job.location || '').toLowerCase() === loc.toLowerCase();
            const matchesType = !type || (job.jobType || '').toLowerCase() === type.toLowerCase();
            return matchesQuery && matchesLocation && matchesType;
        });

        // 2. Fetch from Adzuna if there's a search query
        let adzunaMatches = [];
        if (query.length > 2) {
            try {
                jobCount.textContent = 'Searching live jobs...';
                const adzunaData = await JobsAPI.fetchAdzunaJobs(query);
                if (adzunaData && adzunaData.results) {
                    adzunaMatches = adzunaData.results.map(aj => ({
                        id: 'az-' + aj.id,
                        title: aj.title.replace(/<\/?[^>]+(>|$)/g, ""), // strip tags
                        company: aj.company.display_name,
                        location: aj.location.display_name,
                        description: aj.description.replace(/<\/?[^>]+(>|$)/g, ""),
                        applyUrl: aj.redirect_url,
                        jobType: aj.contract_type || 'Full-time',
                        salary: aj.salary_max ? 'Up to ₹' + aj.salary_max : null,
                        source: 'ADZUNA',
                        createdAt: aj.created,
                        isExternal: true
                    }));
                }
            } catch (err) {
                console.error('Adzuna fetch failed:', err);
            }
        }

        // 3. Merge: Local results first (preferred), then Adzuna
        filteredJobs = [...localMatches, ...adzunaMatches];

        renderFilterChips(query, loc, type);
        renderJobs();
        renderPagination();
    }

    function renderFilterChips(query, loc, type) {
        let html = '';
        if (query) html += `<span class="filter-chip">🔍 "${query}" <i onclick="clearFilter('search')">✕</i></span>`;
        if (loc) html += `<span class="filter-chip">📍 ${loc} <i onclick="clearFilter('location')">✕</i></span>`;
        if (type) html += `<span class="filter-chip">💼 ${type} <i onclick="clearFilter('type')">✕</i></span>`;
        if (query || loc || type) html += `<button class="clear-all-btn" onclick="clearAllFilters()">Clear All</button>`;
        filterChips.innerHTML = html;
    }

    // Global functions for filter chips
    window.clearFilter = function(which) {
        if (which === 'search') searchInput.value = '';
        if (which === 'location') locationFilter.value = '';
        if (which === 'type') typeFilter.value = '';
        currentPage = 1;
        filterAndRender();
    };
    window.clearAllFilters = function() {
        searchInput.value = '';
        locationFilter.value = '';
        typeFilter.value = '';
        currentPage = 1;
        filterAndRender();
    };

    function renderJobs() {
        const start = (currentPage - 1) * itemsPerPage;
        const pageJobs = filteredJobs.slice(start, start + itemsPerPage);

        jobCount.textContent = `${filteredJobs.length} Jobs Found`;

        if (pageJobs.length === 0) {
            const hasQuery = searchInput.value.trim().length > 0;
            jobBoard.innerHTML = `
                <div class="empty-state">
                    <h4>${hasQuery ? 'No matching jobs found' : 'Start your search'}</h4>
                    <p>${hasQuery ? 'Try broader keywords or different locations.' : 'Use the search bar above to discover thousands of live opportunities from Adzuna.'}</p>
                    ${!hasQuery ? `<button class="btn btn-primary" style="margin-top:1rem;" onclick="document.getElementById('searchInput').focus()">🔍 Start Searching</button>` : ''}
                </div>`;
            return;
        }

        jobBoard.innerHTML = pageJobs.map((job, i) => {
            const isExternal = job.isExternal || job.source === 'ADZUNA';
            const detailsLink = isExternal ? job.applyUrl : `job-details.html?id=${job.id}`;
            const target = isExternal ? '_blank' : '_self';

            return `
            <div class="job-card" style="animation-delay: ${i * 0.1}s">
                <div class="job-card-header">
                    <div class="job-card-logo-placeholder">${isExternal ? '🌐' : '💼'}</div>
                    <div>
                        <div class="job-card-title">${job.title || 'Untitled'}</div>
                        <div class="job-card-company">
                            ${job.company || 'Unknown Company'} ${job.location ? '· 📍 ' + job.location : ''}
                            ${isExternal ? `<span class="badge badge-adzuna" style="background:var(--primary-light); color:var(--primary); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; margin-left: 8px;">Live</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="job-card-body">
                    <div class="job-card-tags">
                        ${job.jobType ? `<span class="tag">💼 ${job.jobType}</span>` : ''}
                        ${job.jobRoleName ? `<span class="tag">🏷️ ${job.jobRoleName}</span>` : ''}
                        ${job.salary ? `<span class="tag">💰 ${job.salary}</span>` : ''}
                    </div>
                    <div class="job-card-description">${JobsAPI.truncate(job.description, 160)}</div>
                </div>
                <div class="job-card-footer">
                    <div class="job-card-meta">
                        <span>📅 ${isExternal ? 'Recently' : JobsAPI.timeAgo(job.createdAt)}</span>
                        <span>👁️ ${job.viewCount || 0} views</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline" onclick="${isExternal ? `window.open('${job.applyUrl}', '_blank')` : `viewJobModal(${job.id})`}" style="flex:1;">
                            ${isExternal ? 'View on Adzuna' : 'Quick View'}
                        </button>
                        <a href="${detailsLink}" target="${target}" class="btn btn-primary" style="flex:1; text-decoration:none; text-align:center;">
                            ${isExternal ? 'Apply Now →' : 'View Details'}
                        </a>
                    </div>
                </div>
            </div>
        `;}).join('');
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
        if (totalPages <= 1) { pagination.innerHTML = ''; return; }

        let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">← Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        }
        html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">Next →</button>`;
        pagination.innerHTML = html;
    }

    window.goToPage = function(page) {
        currentPage = page;
        renderJobs();
        renderPagination();
        window.scrollTo({ top: document.getElementById('jobBoard').offsetTop - 100, behavior: 'smooth' });
    };

    window.viewJobModal = function(id) {
        const job = allJobs.find(j => j.id === id);
        if (!job) return;

        document.getElementById('modalTitle').textContent = job.title;
        document.getElementById('modalCompany').textContent = job.company;
        document.getElementById('modalDescription').textContent = job.description || 'No description provided.';

        const tags = [];
        if (job.jobType) tags.push(`<span class="tag">💼 ${job.jobType}</span>`);
        if (job.jobRoleName) tags.push(`<span class="tag">🏷️ ${job.jobRoleName}</span>`);
        if (job.salary) tags.push(`<span class="tag">💰 ${job.salary}</span>`);
        document.getElementById('modalTags').innerHTML = tags.join('');

        document.getElementById('modalDetails').innerHTML = `
            <span>📍 <strong>Location:</strong> ${job.location || 'N/A'}</span>
            <span>💰 <strong>Salary:</strong> ${job.salary || 'Not specified'}</span>
            <span>📅 <strong>Posted:</strong> ${JobsAPI.formatDate(job.createdAt)}</span>
            <span>⏰ <strong>Expires:</strong> ${JobsAPI.formatDate(job.expiryDate)}</span>
        `;

        document.getElementById('modalApplyBtn').href = 'job-details.html?id=' + job.id;
        document.getElementById('jobModal').classList.add('show');
    };
});
