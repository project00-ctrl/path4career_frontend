/**
 * Recruiter Dashboard Logic
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

    document.getElementById('welcomeMsg').textContent = `Welcome back, ${auth.username || auth.email}!`;

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('AUTH_TOKEN');
        localStorage.removeItem('recruiter_email');
        window.location.href = 'recruiter-login.html';
    });

    // Load jobs
    await loadJobs();
});

async function loadJobs() {
    const container = document.getElementById('jobsTableContainer');

    try {
        const jobs = await JobsAPI.recruiterGetMyJobs();

        // Update stats
        document.getElementById('totalJobs').textContent = jobs.length;
        const active = jobs.filter(j => j.status === 'APPROVED').length;
        document.getElementById('activeJobs').textContent = active;
        const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0);
        document.getElementById('totalApps').textContent = totalApps;

        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h4>No jobs posted yet</h4>
                    <p>Click "Post New Job" to create your first job listing.</p>
                </div>`;
            return;
        }

        let html = `
            <table class="recruiter-jobs-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Company</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Posted</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>`;

        jobs.forEach(job => {
            const statusClass = getStatusClass(job.status);
            html += `
                <tr>
                    <td><strong>${job.title}</strong></td>
                    <td>${job.company || 'N/A'}</td>
                    <td>${job.jobType || 'N/A'}</td>
                    <td><span class="status-badge ${statusClass}">${job.status}</span></td>
                    <td>${job.applicationCount || 0}</td>
                    <td>${JobsAPI.timeAgo(job.createdAt)}</td>
                    <td>
                        <div class="action-btns">
                            <a href="recruiter-applicants.html?jobId=${job.id}">👥 Applicants</a>
                            <a href="recruiter-job-form.html?editId=${job.id}">✏️ Edit</a>
                            ${job.status === 'APPROVED' ? `<button onclick="closeJob(${job.id})">🔒 Close</button>` : ''}
                            <button class="btn-danger" onclick="deleteJob(${job.id})">🗑️ Delete</button>
                        </div>
                    </td>
                </tr>`;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (err) {
        container.innerHTML = `<div class="empty-state"><h4>Error loading jobs</h4><p>${err.message}</p></div>`;
    }
}

function getStatusClass(status) {
    switch (status) {
        case 'APPROVED': return 'status-approved';
        case 'PENDING': return 'status-pending';
        case 'REJECTED': case 'CLOSED': case 'DELETED': return 'status-rejected';
        default: return 'status-pending';
    }
}

async function closeJob(id) {
    if (!confirm('Close this job listing? It will no longer accept applications.')) return;
    try {
        await JobsAPI.recruiterCloseJob(id);
        JobsAPI.showToast('Job closed successfully');
        loadJobs();
    } catch (err) {
        JobsAPI.showToast(err.message || 'Failed to close job', 'error');
    }
}

async function deleteJob(id) {
    if (!confirm('Delete this job listing? This cannot be undone.')) return;
    try {
        await JobsAPI.recruiterDeleteJob(id);
        JobsAPI.showToast('Job deleted successfully');
        loadJobs();
    } catch (err) {
        JobsAPI.showToast(err.message || 'Failed to delete job', 'error');
    }
}
