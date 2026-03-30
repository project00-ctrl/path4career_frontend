/**
 * Job Details Page Logic
 */
let currentJob = null;

document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const jobId = params.get('id');

    if (!jobId) {
        document.getElementById('detailTitle').textContent = 'Job Not Found';
        document.getElementById('detailContent').innerHTML = '<p>No job ID provided. <a href="jobs-listing.html">Browse all jobs</a></p>';
        return;
    }

    try {
        currentJob = await JobsAPI.fetchJobById(jobId);
        renderJobDetails(currentJob);
        checkIfAlreadyApplied(currentJob.id);
    } catch (err) {
        document.getElementById('detailTitle').textContent = 'Job Not Found';
        document.getElementById('detailContent').innerHTML = `<p>${err.message}. <a href="jobs-listing.html">Browse all jobs</a></p>`;
    }
});

function renderJobDetails(job) {
    document.title = `${job.title} - path4career`;

    document.getElementById('detailTitle').textContent = job.title;
    document.getElementById('detailCompany').textContent = `${job.company || ''} ${job.location ? '· 📍 ' + job.location : ''}`;

    // Tags
    const tags = [];
    if (job.jobType) tags.push(`<span class="tag">💼 ${job.jobType}</span>`);
    if (job.jobRoleName) tags.push(`<span class="tag">🏷️ ${job.jobRoleName}</span>`);
    if (job.salary) tags.push(`<span class="tag">💰 ${job.salary}</span>`);
    document.getElementById('detailTags').innerHTML = tags.join('');

    // Content
    const desc = (job.description || 'No description provided.').replace(/\n/g, '<br>');
    document.getElementById('detailContent').innerHTML = `
        <h3>Job Description</h3>
        <p>${desc}</p>
    `;

    // Sidebar
    document.getElementById('sidebarDetails').innerHTML = `
        <div class="sidebar-item">📍 <strong>Location</strong> <span style="margin-left:auto;">${job.location || 'N/A'}</span></div>
        <div class="sidebar-item">💼 <strong>Type</strong> <span style="margin-left:auto;">${job.jobType || 'N/A'}</span></div>
        <div class="sidebar-item">💰 <strong>Salary</strong> <span style="margin-left:auto;">${job.salary || 'Not specified'}</span></div>
        <div class="sidebar-item">🏷️ <strong>Role</strong> <span style="margin-left:auto;">${job.jobRoleName || 'N/A'}</span></div>
        <div class="sidebar-item">📅 <strong>Posted</strong> <span style="margin-left:auto;">${JobsAPI.formatDate(job.createdAt)}</span></div>
        <div class="sidebar-item">⏰ <strong>Expires</strong> <span style="margin-left:auto;">${JobsAPI.formatDate(job.expiryDate)}</span></div>
        <div class="sidebar-item">👁️ <strong>Views</strong> <span style="margin-left:auto;">${job.viewCount || 0}</span></div>
        <div class="sidebar-item">📝 <strong>Applications</strong> <span style="margin-left:auto;">${job.applicationCount || 0}</span></div>
    `;

    document.getElementById('applyJobTitle').textContent = job.title + ' at ' + job.company;
}

async function checkIfAlreadyApplied(jobId) {
    const auth = await JobsAPI.checkAuth();
    if (auth && auth.email) {
        try {
            const apps = await JobsAPI.getApplicationsByEmail(auth.email);
            const applied = apps.find(a => a.jobId === jobId);
            if (applied) {
                document.getElementById('applyBtn').style.display = 'none';
                document.getElementById('alreadyApplied').style.display = 'block';
            }
            // Pre-fill form
            document.getElementById('appEmail').value = auth.email;
            if (auth.username) document.getElementById('appName').value = auth.username;
        } catch (e) { /* ignore */ }
    }
}

function openApplyModal() {
    if (currentJob && currentJob.applyUrl) {
        // Show choice popup if external apply URL exists
        document.getElementById('choiceModal').classList.add('show');
        document.getElementById('choiceJobTitle').textContent = currentJob.title;
        document.getElementById('externalApplyLink').href = currentJob.applyUrl;
    } else {
        // No external URL — go straight to in-app form
        document.getElementById('applyModal').classList.add('show');
    }
}

function closeApplyModal() {
    document.getElementById('applyModal').classList.remove('show');
}

function closeChoiceModal() {
    document.getElementById('choiceModal').classList.remove('show');
}

function chooseInAppApply() {
    closeChoiceModal();
    document.getElementById('applyModal').classList.add('show');
}

document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentJob) return;

    const data = {
        applicantName: document.getElementById('appName').value.trim(),
        applicantEmail: document.getElementById('appEmail').value.trim(),
        applicantPhone: document.getElementById('appPhone').value.trim(),
        pitch: document.getElementById('appPitch').value.trim()
    };

    if (!data.applicantName || !data.applicantEmail) {
        JobsAPI.showToast('Please fill in all required fields', 'error');
        return;
    }

    try {
        await JobsAPI.applyToJob(currentJob.id, data);
        JobsAPI.showToast('Application submitted successfully!');
        closeApplyModal();
        document.getElementById('applyBtn').style.display = 'none';
        document.getElementById('alreadyApplied').style.display = 'block';
    } catch (err) {
        JobsAPI.showToast(err.message || 'Failed to submit application', 'error');
    }
});
