/**
 * My Applications Page Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    const emailInput = document.getElementById('emailInput');
    const filterBtn = document.getElementById('filterBtn');
    const appsContainer = document.getElementById('appsContainer');

    // Try to auto-fill with logged in user's email
    const auth = await JobsAPI.checkAuth();
    if (auth && auth.email) {
        emailInput.value = auth.email;
        loadApplications(auth.email);
    }

    filterBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (email) loadApplications(email);
    });

    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const email = emailInput.value.trim();
            if (email) loadApplications(email);
        }
    });

    async function loadApplications(email) {
        appsContainer.innerHTML = '<div style="text-align:center; padding:2rem; color: var(--text-muted);">Loading applications...</div>';

        try {
            const apps = await JobsAPI.getApplicationsByEmail(email);

            if (apps.length === 0) {
                appsContainer.innerHTML = `
                    <div class="empty-state">
                        <h4>No applications found</h4>
                        <p>No applications found for <strong>${email}</strong>. <a href="jobs-listing.html" style="color: var(--primary);">Browse jobs</a> to apply.</p>
                    </div>`;
                return;
            }

            let html = `
                <table class="apps-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Applied</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>`;

            apps.forEach(app => {
                const statusClass = getStatusClass(app.status);
                html += `
                    <tr>
                        <td><strong>${app.jobTitle || 'N/A'}</strong></td>
                        <td>${app.company || 'N/A'}</td>
                        <td>${JobsAPI.formatDate(app.appliedAt)}</td>
                        <td><span class="status-badge ${statusClass}">${app.status}</span></td>
                        <td><a href="job-details.html?id=${app.jobId}" class="btn btn-outline" style="font-size:0.8rem; padding:0.4rem 0.8rem; text-decoration:none;">View Job</a></td>
                    </tr>`;
            });

            html += '</tbody></table>';
            appsContainer.innerHTML = html;
        } catch (err) {
            appsContainer.innerHTML = `<div class="empty-state"><h4>Error</h4><p>${err.message}</p></div>`;
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
});
