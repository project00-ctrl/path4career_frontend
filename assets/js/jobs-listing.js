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

    function filterAndRender() {
        const query = searchInput.value.trim().toLowerCase();
        const loc = locationFilter.value;
        const type = typeFilter.value;

        filteredJobs = allJobs.filter(job => {
            const matchesQuery = !query ||
                (job.title || '').toLowerCase().includes(query) ||
                (job.company || '').toLowerCase().includes(query) ||
                (job.description || '').toLowerCase().includes(query) ||
                (job.jobRoleName || '').toLowerCase().includes(query);
            const matchesLocation = !loc || (job.location || '').toLowerCase() === loc.toLowerCase();
            const matchesType = !type || (job.jobType || '').toLowerCase() === type.toLowerCase();
            return matchesQuery && matchesLocation && matchesType;
        });

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
            jobBoard.innerHTML = `<div class="empty-state"><h4>No jobs found</h4><p>Try adjusting your search or filters.</p></div>`;
            return;
        }

        jobBoard.innerHTML = pageJobs.map((job, i) => `
            <div class="job-card" style="animation-delay: ${i * 0.1}s">
                <div class="job-card-header">
                    <div class="job-card-logo-placeholder">💼</div>
                    <div>
                        <div class="job-card-title">${job.title || 'Untitled'}</div>
                        <div class="job-card-company">${job.company || 'Unknown Company'} ${job.location ? '· 📍 ' + job.location : ''}</div>
                    </div>
                </div>
                <div class="job-card-body">
                    <div class="job-card-tags">
                        ${job.jobType ? `<span class="tag">💼 ${job.jobType}</span>` : ''}
                        ${job.jobRoleName ? `<span class="tag">🏷️ ${job.jobRoleName}</span>` : ''}
                        ${job.salary ? `<span class="tag">💰 ${job.salary}</span>` : ''}
                    </div>
                    <div class="job-card-description">${JobsAPI.truncate(job.description, 120)}</div>
                </div>
                <div class="job-card-footer">
                    <div class="job-card-meta">
                        <span>📅 ${JobsAPI.timeAgo(job.createdAt)}</span>
                        <span>👁️ ${job.viewCount || 0} views</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-outline" onclick="viewJobModal(${job.id})" style="flex:1;">Quick View</button>
                        <a href="job-details.html?id=${job.id}" class="btn btn-primary" style="flex:1; text-decoration:none; text-align:center;">View Details</a>
                    </div>
                </div>
            </div>
        `).join('');
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
