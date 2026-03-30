/**
 * Recruiter Job Form Logic — supports create and edit
 */
let editId = null;

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

    // Load job roles
    try {
        const roles = await JobsAPI.fetchJobRoles();
        const select = document.getElementById('jobRoleId');
        roles.forEach(role => {
            const opt = document.createElement('option');
            opt.value = role.id;
            opt.textContent = role.name;
            select.appendChild(opt);
        });
    } catch (err) {
        console.warn('Failed to load job roles:', err);
    }

    // Check if editing
    const params = new URLSearchParams(window.location.search);
    editId = params.get('editId');

    if (editId) {
        document.getElementById('formTitle').textContent = '✏️ Edit Job';
        document.getElementById('submitBtn').textContent = 'Save Changes →';
        document.title = 'Edit Job - path4career';

        try {
            const job = await JobsAPI.fetchJobById(editId);
            document.getElementById('jobTitle').value = job.title || '';
            document.getElementById('jobCompany').value = job.company || '';
            document.getElementById('jobLocation').value = job.location || '';
            document.getElementById('jobType').value = job.jobType || 'Full-time';
            document.getElementById('jobSalary').value = job.salary || '';
            document.getElementById('jobDescription').value = job.description || '';
            document.getElementById('jobApplyUrl').value = job.applyUrl || '';

            if (job.expiryDate) {
                document.getElementById('jobExpiry').value = job.expiryDate.split('T')[0];
            }

            // Try to select the matching job role
            const roleSelect = document.getElementById('jobRoleId');
            for (let i = 0; i < roleSelect.options.length; i++) {
                if (roleSelect.options[i].textContent === job.jobRoleName) {
                    roleSelect.value = roleSelect.options[i].value;
                    break;
                }
            }
        } catch (err) {
            JobsAPI.showToast('Failed to load job data: ' + err.message, 'error');
        }
    }

    // Form submit
    document.getElementById('jobForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = editId ? 'Saving...' : 'Posting...';

        const expiryVal = document.getElementById('jobExpiry').value;

        const data = {
            title: document.getElementById('jobTitle').value.trim(),
            company: document.getElementById('jobCompany').value.trim(),
            location: document.getElementById('jobLocation').value.trim(),
            jobType: document.getElementById('jobType').value,
            salary: document.getElementById('jobSalary').value.trim(),
            description: document.getElementById('jobDescription').value.trim(),
            applyUrl: document.getElementById('jobApplyUrl').value.trim(),
            jobRoleId: parseInt(document.getElementById('jobRoleId').value),
            expiryDate: expiryVal ? expiryVal + 'T23:59:59' : null,
            source: 'RECRUITER'
        };

        try {
            if (editId) {
                await JobsAPI.recruiterUpdateJob(editId, data);
                JobsAPI.showToast('Job updated successfully!');
            } else {
                await JobsAPI.recruiterCreateJob(data);
                JobsAPI.showToast('Job posted successfully!');
            }
            setTimeout(() => {
                window.location.href = 'recruiter-dashboard.html';
            }, 800);
        } catch (err) {
            JobsAPI.showToast(err.message || 'Failed to save job', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = editId ? 'Save Changes →' : 'Post Job →';
        }
    });
});
