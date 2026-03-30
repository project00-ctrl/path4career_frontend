/**
 * Recruiter Applicants Page Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Auth + role check
    const auth = await JobsAPI.checkAuth();
    if (!auth || !auth.loggedIn) {
        window.location.href = 'recruiter-login.html';
        return;
    }
    if (auth.role !== 'RECRUITER') {
        JobsAPI.showToast('Access denied. Only recruiters can access this page.', 'error');
        setTimeout(() => { window.location.href = 'jobs-listing.html'; }, 1500);
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('jobId');

    if (!jobId) {
        document.getElementById('applicantsContainer').innerHTML = `
            <div class="empty-state"><h4>No job specified</h4><p><a href="recruiter-dashboard.html" style="color: var(--primary);">Go to Dashboard</a></p></div>`;
        return;
    }

    // Load job info
    try {
        const job = await JobsAPI.fetchJobById(jobId);
        document.getElementById('pageTitle').textContent = `👥 Applicants for "${job.title}"`;
        document.getElementById('jobInfo').textContent = `${job.company} · ${job.location || 'N/A'} · ${job.applicationCount || 0} applicant(s)`;
        document.title = `Applicants - ${job.title} - path4career`;
    } catch (err) {
        document.getElementById('jobInfo').textContent = 'Job not found';
    }

    // Load applicants
    await loadApplicants(jobId);
});

async function loadApplicants(jobId) {
    const container = document.getElementById('applicantsContainer');

    try {
        const applicants = await JobsAPI.recruiterGetApplicants(jobId);

        if (applicants.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h4>No applicants yet</h4>
                    <p>When candidates apply, they'll appear here.</p>
                </div>`;
            return;
        }

        let html = `
            <table class="applicant-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Pitch</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>`;

        applicants.forEach(app => {
            const statusClass = getStatusClass(app.status);
            html += `
                <tr id="app-row-${app.id}">
                    <td><strong>${app.applicantName}</strong></td>
                    <td><a href="mailto:${app.applicantEmail}" style="color: var(--primary);">${app.applicantEmail}</a></td>
                    <td>${app.applicantPhone || 'N/A'}</td>
                    <td><span class="pitch-text" title="${(app.pitch || '').replace(/"/g, '&quot;')}">${app.pitch || 'No pitch provided'}</span></td>
                    <td>${JobsAPI.formatDate(app.appliedAt)}</td>
                    <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                    <td>
                        <select class="status-select" onchange="updateStatus(${app.id}, this.value, '${jobId}')">
                            <option value="">Change Status</option>
                            <option value="APPLIED">Applied</option>
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="REJECTED">Rejected</option>
                            <option value="HIRED">Hired</option>
                        </select>
                    </td>
                </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><h4>Error loading applicants</h4><p>${err.message}</p></div>`;
    }
}

function getStatusClass(status) {
    switch ((status || '').toUpperCase()) {
        case 'APPLIED': return 'status-pending';
        case 'SHORTLISTED': return 'status-approved';
        case 'HIRED': return 'status-approved';
        case 'REJECTED': return 'status-rejected';
        default: return 'status-pending';
    }
}

async function updateStatus(appId, newStatus, jobId) {
    if (!newStatus) return;

    try {
        await JobsAPI.recruiterUpdateStatus(appId, newStatus);
        JobsAPI.showToast(`Status updated to ${newStatus}`);
        loadApplicants(jobId);
    } catch (err) {
        JobsAPI.showToast(err.message || 'Failed to update status', 'error');
    }
}
