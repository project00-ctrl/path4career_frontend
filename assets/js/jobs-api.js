/**
 * Jobs API Helper — replaces localStorage-based SharedData
 * All job management pages use this for backend communication.
 */
const JobsAPI = (() => {
    'use strict';

    const BASE_URL = 'https://path4career-backend.onrender.com';

    function getAuthToken() {
        return localStorage.getItem('AUTH_TOKEN');
    }

    function authHeaders() {
        const token = getAuthToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) {
            headers['Authorization'] = 'Bearer ' + token;
        }
        return headers;
    }

    async function request(method, url, body) {
        const opts = {
            method,
            headers: authHeaders()
        };
        if (body) opts.body = JSON.stringify(body);
        const res = await fetch(BASE_URL + url, opts);
        if (!res.ok) {
            const text = await res.text();
            throw new Error(text || `HTTP ${res.status}`);
        }
        // Handle empty responses (204 etc.)
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return res.json();
        }
        return res.text();
    }

    // ===== Public Job Endpoints =====

    async function fetchJobs() {
        return request('GET', '/api/jobs');
    }

    async function fetchJobById(id) {
        return request('GET', '/api/jobs/' + id);
    }

    // ===== Application Endpoints =====

    async function applyToJob(jobId, data) {
        return request('POST', '/api/applications/job/' + jobId + '/apply', data);
    }

    async function getMyApplications() {
        return request('GET', '/api/applications/my');
    }

    async function getApplicationsByEmail(email) {
        return request('GET', '/api/applications/by-email?email=' + encodeURIComponent(email));
    }

    // ===== Recruiter Job Endpoints =====

    async function recruiterCreateJob(data) {
        return request('POST', '/api/jobs/recruiter/post', data);
    }

    async function recruiterGetMyJobs() {
        return request('GET', '/api/jobs/recruiter/my-jobs');
    }

    async function recruiterUpdateJob(id, data) {
        return request('PUT', '/api/jobs/recruiter/' + id, data);
    }

    async function recruiterCloseJob(id) {
        return request('POST', '/api/jobs/' + id + '/close');
    }

    async function recruiterDeleteJob(id) {
        return request('DELETE', '/api/jobs/recruiter/' + id);
    }

    // ===== Recruiter Applicant Endpoints =====

    async function recruiterGetApplicants(jobId) {
        return request('GET', '/api/applications/job/' + jobId);
    }

    async function recruiterUpdateStatus(appId, status) {
        return request('PUT', '/api/applications/' + appId + '/status', { status });
    }

    // ===== Job Roles =====
    async function fetchJobRoles() {
        return request('GET', '/api/job-roles/public');
    }

    // ===== Adzuna Endpoints =====
    async function fetchAdzunaJobs(keyword, country = 'in', page = 1) {
        return request('GET', `/api/adzuna-jobs/search?keyword=${encodeURIComponent(keyword)}&country=${country}&page=${page}`);
    }

    // ===== Auth Check =====
    async function checkAuth() {
        try {
            const res = await fetch(BASE_URL + '/api/v1/auth/status', {
                headers: authHeaders()
            });
            if (res.ok) return res.json();
            return null;
        } catch {
            return null;
        }
    }

    // ===== Toast Notification =====
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existing = document.querySelector('.jobs-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'jobs-toast jobs-toast-' + type;
        toast.innerHTML = `
            <span class="jobs-toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('jobs-toast-show');
        });

        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('jobs-toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Helpers =====
    function formatDate(dateStr) {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    function timeAgo(dateStr) {
        if (!dateStr) return '';
        const now = new Date();
        const d = new Date(dateStr);
        const diffMs = now - d;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return diffDays + 'd ago';
        if (diffDays < 30) return Math.floor(diffDays / 7) + 'w ago';
        return Math.floor(diffDays / 30) + 'mo ago';
    }

    function truncate(str, len) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    }

    return {
        fetchJobs,
        fetchJobById,
        fetchAdzunaJobs,
        applyToJob,
        getMyApplications,
        getApplicationsByEmail,
        recruiterCreateJob,
        recruiterGetMyJobs,
        recruiterUpdateJob,
        recruiterCloseJob,
        recruiterDeleteJob,
        recruiterGetApplicants,
        recruiterUpdateStatus,
        fetchJobRoles,
        checkAuth,
        showToast,
        formatDate,
        timeAgo,
        truncate,
        getAuthToken
    };
})();
