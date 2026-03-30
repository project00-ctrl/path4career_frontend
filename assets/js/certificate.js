/**
 * Path4Career — Certificate Catalog (Dynamic Backend Integration)
 * 
 * Fetches modules and user certificates from the backend API.
 * Renders a catalog of course cards showing earned/locked status.
 * Opens a certificate modal with dynamic data for earned certificates.
 * Supports PDF download via window.print().
 * 
 * URL Parameters:
 *   ?moduleId=5   → auto-open that module's certificate on load
 */

// ──────────────────────────────────────────
// API CONFIG
// ──────────────────────────────────────────
const API_BASE_URL = "https://path4career-backend.onrender.com";

// ──────────────────────────────────────────
// COLOR PALETTE — deterministic per module
// ──────────────────────────────────────────
const DIFFICULTY_COLORS = {
    'BEGINNER': '#2A9D5C',
    'INTERMEDIATE': '#2563EB',
    'ADVANCED': '#7C3AED'
};

const FALLBACK_COLORS = [
    '#2A9D5C', '#2563EB', '#D97706', '#7C3AED', '#B45309',
    '#DC2626', '#0891B2', '#4F46E5', '#059669', '#9333EA'
];

function getModuleColor(module) {
    if (module.difficulty && DIFFICULTY_COLORS[module.difficulty.toUpperCase()]) {
        return DIFFICULTY_COLORS[module.difficulty.toUpperCase()];
    }
    return FALLBACK_COLORS[module.id % FALLBACK_COLORS.length];
}

function getCardIconForCert(name) {
    const t = (name || '').toLowerCase();
    if (/web|html|css/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';
    if (/front|react|bootstrap|jquery|ui|angular|vue/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" y1="4" x2="10" y2="20"/></svg>';
    if (/python|data|machine|ml|ai|pandas|numpy/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    if (/java|enterprise|c#|spring|\.net/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';
    if (/back|server|api|node|express|django/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>';
    if (/full\s*stack/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';
    if (/database|sql|mongo|postgre/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>';
    if (/secur|cyber|hack/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';
    if (/cloud|devops|docker|aws|azure/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>';
    if (/mobile|android|ios|flutter|swift/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
    if (/system|low.level|c\b|c\+\+|memory/.test(t)) return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>';
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>';
}

// ──────────────────────────────────────────
// STATE
// ──────────────────────────────────────────
let allModules = [];
let earnedCertificates = {};  // moduleId → CertificateResponseDTO
let activeFilter = 'all';

// ──────────────────────────────────────────
// DOM REFERENCES
// ──────────────────────────────────────────
const catalogGrid = document.getElementById('catalogGrid');
const modal = document.getElementById('certModal');
const modalOverlay = document.getElementById('modalOverlay');
const certContainer = document.getElementById('certContainer');
const btnClose = document.getElementById('btnClose');
const btnPrint = document.getElementById('btnPrint');
const btnDownload = document.getElementById('btnDownload');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const countEl = document.getElementById('courseCount');
const loadingEl = document.getElementById('certLoading');
const errorEl = document.getElementById('certError');

// ──────────────────────────────────────────
// AUTH HELPERS
// ──────────────────────────────────────────
function getToken() {
    return localStorage.getItem('AUTH_TOKEN');
}

function getUserData() {
    try {
        const data = localStorage.getItem('path4careerUser');
        return data ? JSON.parse(data) : null;
    } catch { return null; }
}

// ──────────────────────────────────────────
// INITIALIZATION
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadCatalogData();
});

async function loadCatalogData() {
    showLoading(true);
    showError(false);

    try {
        // 1. Fetch all modules (public endpoint)
        const modulesRes = await fetch(`${API_BASE_URL}/api/user/modules`);
        if (!modulesRes.ok) throw new Error('Failed to load modules');
        allModules = await modulesRes.json();

        // 2. Refresh & fetch user's certificates (requires auth)
        //    POST /refresh scans quiz completions and issues missing certs
        const token = getToken();
        if (token) {
            try {
                const certRes = await fetch(`${API_BASE_URL}/api/v1/certificates/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                });
                if (certRes.ok) {
                    const certs = await certRes.json();
                    earnedCertificates = {};
                    certs.forEach(cert => {
                        earnedCertificates[cert.moduleId] = cert;
                    });
                    console.log('Certificates loaded:', Object.keys(earnedCertificates).length);
                } else {
                    console.warn('Certificate refresh failed:', certRes.status, await certRes.text());
                }
            } catch (err) {
                console.warn('Could not fetch certificates:', err);
            }
        }

        showLoading(false);
        applyFilters();

        // Auto-open certificate if ?moduleId= is in URL
        const params = new URLSearchParams(window.location.search);
        const autoOpenId = params.get('moduleId');
        if (autoOpenId && earnedCertificates[Number(autoOpenId)]) {
            openCertificate(Number(autoOpenId));
        }
    } catch (err) {
        console.error('Failed to load catalog:', err);
        showLoading(false);
        showError(true);
    }
}

function showLoading(show) {
    loadingEl.style.display = show ? 'flex' : 'none';
    catalogGrid.style.display = show ? 'none' : '';
}

function showError(show) {
    errorEl.style.display = show ? 'flex' : 'none';
    catalogGrid.style.display = show ? 'none' : '';
}

// ──────────────────────────────────────────
// CATALOG RENDERING
// ──────────────────────────────────────────
function renderCatalog(list) {
    catalogGrid.innerHTML = '';
    countEl.textContent = list.length;

    if (!list.length) {
        catalogGrid.innerHTML = '<p class="empty-state">No courses found.</p>';
        return;
    }

    list.forEach((module, i) => {
        const cert = earnedCertificates[module.id];
        const isEarned = !!cert;
        const color = getModuleColor(module);
        const badgeIcon = getCardIconForCert(module.name);
        const difficulty = module.difficulty || 'Beginner';
        const duration = module.durationValue
            ? `${module.durationValue} ${(module.durationUnit || 'WEEKS').toLowerCase()}`
            : '—';
        const skillCount = module.skillIds ? module.skillIds.length : 0;

        const card = document.createElement('div');
        card.className = `course-card ${isEarned ? 'earned' : 'locked'}`;
        card.style.animationDelay = (i * 0.07) + 's';
        card.style.setProperty('--c-color', color);
        card.style.setProperty('--btn-color', color);

        let statusHtml;
        if (isEarned) {
            statusHtml = `
                <div class="card-status earned">
                    <span class="status-dot earned"></span>
                    <span>Certificate Earned</span>
                </div>`;
        } else {
            statusHtml = `
                <a href="quiz.html?moduleId=${module.id}" class="card-status locked" style="text-decoration:none; cursor:pointer;">
                    <span class="status-dot locked"></span>
                    <span>Complete Quiz to Earn →</span>
                </a>`;
        }

        let actionHtml;
        if (isEarned) {
            actionHtml = `
                <button class="btn-view-cert" onclick="openCertificate(${module.id})">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    View Certificate
                </button>`;
        } else {
            actionHtml = `
                <a href="quiz.html?moduleId=${module.id}" class="btn-take-quiz">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    Take Quiz →
                </a>`;
        }

        card.innerHTML =
            '<div class="card-top">' +
                '<div class="card-badge" style="background:' + color + '18;color:' + color + ';border-color:' + color + '40">' + badgeIcon + '</div>' +
                '<span class="card-level">' + difficulty + '</span>' +
            '</div>' +
            '<h3 class="card-title">' + escapeHtml(module.name) + '</h3>' +
            '<p class="card-subtitle">' + (module.description ? escapeHtml(module.description).substring(0, 80) + (module.description.length > 80 ? '…' : '') : '—') + '</p>' +
            '<div class="card-meta">' +
                '<span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + duration + '</span>' +
                '<span class="meta-item"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>' + skillCount + ' Skills</span>' +
            '</div>' +
            statusHtml +
            actionHtml;

        catalogGrid.appendChild(card);
    });
}

// ──────────────────────────────────────────
// SEARCH & FILTER
// ──────────────────────────────────────────
function applyFilters() {
    const q = searchInput.value.toLowerCase().trim();
    const filtered = allModules.filter(m => {
        const matchSearch = !q || (m.name && m.name.toLowerCase().includes(q)) ||
                              (m.description && m.description.toLowerCase().includes(q));
        const diff = (m.difficulty || '').toLowerCase();
        const matchFilter = activeFilter === 'all'
            || (activeFilter === 'beginner' && diff.includes('beginner'))
            || (activeFilter === 'intermediate' && diff.includes('intermediate'))
            || (activeFilter === 'advanced' && diff.includes('advanced'));
        return matchSearch && matchFilter;
    });
    renderCatalog(filtered);
}

searchInput.addEventListener('input', applyFilters);
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        applyFilters();
    });
});

// ──────────────────────────────────────────
// QR CODE
// ──────────────────────────────────────────
function buildQR(certId) {
    const url = 'https://path4career.io/verify/' + certId;
    const src = 'https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=' +
        encodeURIComponent(url) + '&color=000000&bgcolor=ffffff&format=png&qzone=1';
    return '<img src="' + src + '" class="cert-qr-img" width="64" height="64" alt="Verify QR">';
}

// ──────────────────────────────────────────
// GOLD CERTIFIED BADGE SVG
// ──────────────────────────────────────────
function buildBadge(color) {
    const pts = [];
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const r = i % 2 === 0 ? 46 : 40;
        pts.push((50 + r * Math.cos(angle)).toFixed(2) + ',' + (50 + r * Math.sin(angle)).toFixed(2));
    }
    return (
        '<svg class="cert-badge-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
        '<polygon points="' + pts.join(' ') + '" fill="url(#goldGrad)" stroke="#8B6914" stroke-width="0.8"/>' +
        '<circle cx="50" cy="50" r="32" fill="' + color + '"/>' +
        '<circle cx="50" cy="50" r="32" fill="none" stroke="#C9A84C" stroke-width="1.5"/>' +
        '<path d="M24 68 L18 80 L30 74 L36 80 Z" fill="#C9A84C"/>' +
        '<path d="M76 68 L82 80 L70 74 L64 80 Z" fill="#C9A84C"/>' +
        '<polygon points="50,28 53,38 63,38 55,44 58,54 50,48 42,54 45,44 37,38 47,38" fill="#F0D080" stroke="#C9A84C" stroke-width="0.5"/>' +
        '<text x="50" y="63" text-anchor="middle" font-family="Lato,sans-serif" font-weight="900" font-size="8.5" fill="#FFFFFF" letter-spacing="1">CERTIFIED</text>' +
        '<defs><linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#F0D080"/><stop offset="50%" stop-color="#C9A84C"/><stop offset="100%" stop-color="#8B6914"/></linearGradient></defs>' +
        '</svg>'
    );
}

// ──────────────────────────────────────────
// BUILD CERTIFICATE HTML
// ──────────────────────────────────────────
function buildCertHTML(cert) {
    const module = allModules.find(m => m.id === cert.moduleId) || {};
    const color = getModuleColor(module);
    const courseName = cert.moduleName || module.name || 'Course';
    const recipientName = cert.issuedToName || 'Student';
    const certId = cert.certificateId || 'CP-0000-00000';
    const verifyUrl = 'verify.path4career.com/' + certId;
    const difficulty = cert.difficulty || module.difficulty || 'Intermediate';
    const duration = cert.durationValue
        ? `${cert.durationValue} ${(cert.durationUnit || 'WEEKS').charAt(0) + (cert.durationUnit || 'WEEKS').slice(1).toLowerCase()}`
        : '—';
    const skillCount = cert.skillCount || (module.skillIds ? module.skillIds.length : 0);

    const issuedDate = cert.issuedAt
        ? new Date(cert.issuedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        '<div class="certificate" id="printArea" style="--cert-color:' + color + '">' +

        /* outer border */
        '<div class="cert-outer-border" style="border-color:' + color + '55"></div>' +

        /* wave bottom */
        '<div class="cert-wave">' +
            '<svg viewBox="0 0 900 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M0,80 C150,140 300,20 450,80 C600,140 750,20 900,80 L900,160 L0,160 Z" fill="' + color + '14"/>' +
                '<path d="M0,110 C150,160 300,60 450,110 C600,160 750,60 900,110 L900,160 L0,160 Z" fill="' + color + '0D"/>' +
            '</svg>' +
        '</div>' +

        /* watermark */
        '<div class="cert-watermark">' +
            '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' +
                '<path d="M10 80 L30 30 L50 60 L70 20 L90 45" stroke="' + color + '" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
                '<polygon points="75,20 90,20 90,35" fill="' + color + '"/>' +
            '</svg>' +
        '</div>' +

        /* ── CONTENT ── */
        '<div class="cert-content">' +

            /* Top row: logo | title | QR */
            '<div class="cert-top-row">' +

                '<div class="cert-logo">' +
                    '<div class="cert-logo-icon">' +
                        '<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">' +
                            '<circle cx="22" cy="22" r="22" fill="url(#lg2)"/>' +
                            '<defs><linearGradient id="lg2" x1="0" y1="0" x2="44" y2="44"><stop stop-color="#34C67A"/><stop offset="1" stop-color="#1A8C4E"/></linearGradient></defs>' +
                            '<path d="M10 28 L17 19 L24 23 L34 13" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
                            '<polyline points="28,13 34,13 34,19" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div>' +
                        '<span class="cert-logo-brand">Path4Career</span>' +
                        '<span class="cert-logo-tagline">path4career.io</span>' +
                    '</div>' +
                '</div>' +

                '<div class="cert-title-block">' +
                    '<div class="cert-main-title">CERTIFICATE <span>of</span> COMPLETION</div>' +
                    '<div class="cert-title-rule" style="background:linear-gradient(90deg,transparent,' + color + ',transparent)"></div>' +
                '</div>' +

                '<div class="cert-qr-block">' +
                    '<div class="cert-qr-wrap">' + buildQR(certId) + '</div>' +
                    '<div class="cert-qr-id">Certificate ID: ' + certId + '</div>' +
                '</div>' +

            '</div>' +

            /* This certifies that */
            '<p class="cert-certifies">This certifies that</p>' +

            /* Recipient */
            '<div class="cert-recipient">' + escapeHtml(recipientName) + '</div>' +

            /* Completion text */
            '<p class="cert-completion-text">has successfully completed the <strong>Path4Career Program</strong> and is hereby declared a</p>' +

            /* Gold badge */
            '<div class="cert-badge-center">' + buildBadge(color) + '</div>' +

            /* Course name */
            '<div class="cert-course-name">' + escapeHtml(courseName) + '</div>' +

            /* Thin rule */
            '<div class="cert-bottom-rule"></div>' +

            /* Meta: duration · level · skills */
            '<div class="cert-meta-inline">' +
                '<span><strong>Duration:</strong>&nbsp;' + duration + '</span>' +
                '<span>·</span>' +
                '<span><strong>Level:</strong>&nbsp;' + difficulty + '</span>' +
                '<span>·</span>' +
                '<span><strong>Skills:</strong>&nbsp;' + skillCount + ' Completed</span>' +
            '</div>' +

            /* Bottom info row: issued (center) + signature (right) */
            '<div class="cert-info-row">' +

                '<div style="flex:1"></div>' +

                '<div class="cert-issued">Issued ' + issuedDate + '</div>' +

                '<div class="cert-sig-block">' +
                    '<div class="cert-sig-scribble">' +
                        '<svg viewBox="0 0 140 36" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round">' +
                            '<path d="M8 26 C20 6,36 32,54 16 C66 4,82 28,100 12 C112 2,126 24,136 16"/>' +
                        '</svg>' +
                    '</div>' +
                    '<div class="cert-sig-line"></div>' +
                    '<div class="cert-sig-name">Thomas Howard</div>' +
                    '<div class="cert-sig-role">Director of Path4Career</div>' +
                '</div>' +

            '</div>' +

        '</div>' +

        /* Verify URL bottom-left */
        '<div class="cert-verify">' +
            '<strong>Verify at</strong>' +
            '<span>' + verifyUrl + '</span>' +
        '</div>' +

        '</div>'
    );
}

// ──────────────────────────────────────────
// MODAL OPEN / CLOSE
// ──────────────────────────────────────────
function openCertificate(moduleId) {
    const cert = earnedCertificates[moduleId];
    if (!cert) return;

    modal.dataset.active = moduleId;
    certContainer.innerHTML = buildCertHTML(cert);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function downloadCert() {
    const moduleId = Number(modal.dataset.active);
    const cert = earnedCertificates[moduleId];
    const courseName = cert ? cert.moduleName.replace(/\s+/g, '_') : 'Certificate';
    document.title = 'Path4Career_Certificate_' + courseName;
    window.print();
    document.title = 'Certificate Catalog — Path4Career';
}

// Null-safe event bindings (fallback — onclick handlers also exist on the buttons)
if (btnClose) btnClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
if (btnPrint) btnPrint.addEventListener('click', () => { window.print(); });
if (btnDownload) btnDownload.addEventListener('click', downloadCert);

// ──────────────────────────────────────────
// UTILITY
// ──────────────────────────────────────────
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ──────────────────────────────────────────
// REFRESH CERTIFICATES — explicit sync from quiz completions
// ──────────────────────────────────────────
async function refreshCertificates() {
    const btn = document.getElementById('btnRefreshCerts');
    const token = getToken();

    if (!token) {
        alert('Please log in first to refresh your certificates.');
        return;
    }

    // Visual feedback
    if (btn) {
        btn.disabled = true;
        btn.textContent = '⏳ Syncing...';
    }

    try {
        const res = await fetch(`${API_BASE_URL}/api/v1/certificates/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Refresh failed:', res.status, errorText);
            alert('Certificate refresh failed: ' + res.status + '\n' + errorText);
            return;
        }

        const certs = await res.json();
        console.log('Refresh response — certificates:', certs);

        // Update local state
        earnedCertificates = {};
        certs.forEach(cert => {
            earnedCertificates[cert.moduleId] = cert;
        });

        // Re-render the catalog
        applyFilters();

        const count = Object.keys(earnedCertificates).length;
        if (btn) btn.textContent = `✅ ${count} Certificate${count !== 1 ? 's' : ''} Found`;

        // Auto-open if moduleId is in URL
        const params = new URLSearchParams(window.location.search);
        const autoOpenId = params.get('moduleId');
        if (autoOpenId && earnedCertificates[Number(autoOpenId)]) {
            openCertificate(Number(autoOpenId));
        }

    } catch (err) {
        console.error('Refresh error:', err);
        alert('Could not refresh certificates. Is the backend running?\n' + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            setTimeout(() => {
                btn.textContent = '🔄 Refresh Certificates';
            }, 3000);
        }
    }
}

function retryLoad() {
    loadCatalogData();
}
