/* ===================================================
  Path4Career — Dashboard (fully wired)
   =================================================== */

/* ──── Helper: authenticated fetch using localStorage token ──── */
function authFetch(url, options = {}) {
    const token = localStorage.getItem('AUTH_TOKEN');
    return fetch(API_BASE_URL + url, {
        ...options,
        credentials: "include",
        headers: {
            ...(options.headers || {}),
            "Content-Type": "application/json",
            "Authorization": token ? "Bearer " + token : ""
        }
    });
}

/* ──── Guard: redirect to login if 401 ──── */
function guard(res) {
    if (res.status === 401 || res.status === 403) {
        // Token expired or invalid
        localStorage.removeItem('AUTH_TOKEN');
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.href);
        return null;
    }
    return res.json();
}

/* ──── Upfront auth check: redirect immediately if not logged in ──── */
(function checkAuth() {
    const token = localStorage.getItem('AUTH_TOKEN');
    if (!token) {
        window.location.href = "login.html?redirect=" + encodeURIComponent(window.location.href);
        return;
    }
})();

/* ===================================================
   1. DASHBOARD SUMMARY  (Hero + KPIs)
   =================================================== */
authFetch("/api/dashboard/summary")
    .then(guard)
    .then(data => {
        if (!data) return;

        document.getElementById("heroUsername").innerText = data.username;
        document.getElementById("profileName").innerText = data.username;
        document.getElementById("profileAvatar").innerText =
            data.username.charAt(0).toUpperCase();

        document.getElementById("kpi-streak").innerText =
            data.learningStreak + " Days";
        document.getElementById("kpi-courses").innerText =
            data.coursesCompleted;
        document.getElementById("kpi-jobs").innerText =
            data.jobsApplied;
        document.getElementById("kpi-level").innerText =
            data.skillLevel;

        const pct = data.overallSkillProgress || 0;
        document.getElementById("overallSkillPercent").innerText = pct + "%";
        const ring = document.querySelector(".ring");
        if (ring) {
            ring.style.background =
                `conic-gradient(#00C985 ${pct}%, #e5e7eb ${pct}%)`;
        }

        const continueBtn = document.getElementById("continue-learning-btn");
        if (continueBtn) {
            continueBtn.onclick = () => {
                window.location.href = data.lastAccessedCourseUrl || "../../index.html";
            };
        }

        const jobsBtn = document.getElementById("explore-jobs-btn");
        if (jobsBtn) {
            jobsBtn.onclick = () => {
                window.location.href = "../jobs/jobs-listing.html";
            };
        }
    })
    .catch(err => console.error("Dashboard summary error:", err));


/* ===================================================
   2. PROFILE DATA  (Personal Details modal)
   =================================================== */
authFetch("/api/v1/user/profile")
    .then(guard)
    .then(profile => {
        if (!profile) return;

        document.getElementById("fullName").value = profile.fullName || profile.username || "";
        document.getElementById("email").value = profile.email || "";
        document.getElementById("phone").value = profile.phone || "";
        document.getElementById("dob").value = profile.dob || "";
        document.getElementById("gender").value = profile.gender || "";
        document.getElementById("location").value = profile.location || "";

        document.getElementById("saveBtn").disabled = false;
    })
    .catch(err => console.error("Profile load error:", err));


/* ===================================================
   3. SKILLS  (Skill Progress card)
   =================================================== */
authFetch("/api/dashboard/skills")
    .then(guard)
    .then(skills => {
        if (!skills) return;
        const container = document.getElementById("skills-container");
        container.innerHTML = "";

        if (skills.length === 0) {
            container.innerHTML = `<p style="color:#64748b;font-size:14px;">No skills tracked yet. Start learning!</p>`;
            return;
        }

        skills.forEach(skill => {
            const div = document.createElement("div");
            div.className = "skill";
            div.innerHTML = `
        <label>${skill.skillName}</label>
        <div class="bar">
          <div style="width:${skill.progress}%"></div>
        </div>
      `;
            container.appendChild(div);
        });
    })
    .catch(err => console.error("Skills load error:", err));


/* ===================================================
   4. ACTIVITIES  (Recent Activity card)
   =================================================== */
authFetch("/api/dashboard/activities")
    .then(guard)
    .then(activities => {
        if (!activities) return;
        const list = document.getElementById("activity-list");
        list.innerHTML = "";

        if (activities.length === 0) {
            list.innerHTML = `<li style="color:#64748b;font-size:14px;list-style:none;">No recent activity yet.</li>`;
            return;
        }

        activities.slice(0, 10).forEach(act => {
            const li = document.createElement("li");
            li.className = "event";
            li.innerHTML = `
        <div class="dot"></div>
        <div>
          <p>${act.description}</p>
          <span>${new Date(act.createdAt).toLocaleString()}</span>
        </div>
      `;
            list.appendChild(li);
        });
    })
    .catch(err => console.error("Activities load error:", err));


/* ===================================================
   5. ACHIEVEMENTS  (Badges card)
   =================================================== */
authFetch("/api/dashboard/achievements")
    .then(guard)
    .then(badges => {
        if (!badges) return;
        const box = document.getElementById("achievement-box");
        box.innerHTML = "";

        if (badges.length === 0) {
            box.innerHTML = `<p style="color:#64748b;font-size:14px;">No achievements yet. Keep going!</p>`;
            return;
        }

        badges.forEach(b => {
            const div = document.createElement("div");
            div.className = "badge";
            div.innerText = b.title;
            box.appendChild(div);
        });
    })
    .catch(err => console.error("Achievements load error:", err));


/* ===================================================
   6. PROFILE FORM  (Save personal details)
   =================================================== */
document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
        fullName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: document.getElementById("dob").value || null,
        gender: document.getElementById("gender").value,
        location: document.getElementById("location").value.trim()
    };

    authFetch("/api/v1/user/profile", {
        method: "PUT",
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error();
            alert("Profile updated successfully ✅");
            location.reload();
        })
        .catch(() => alert("Profile update failed ❌"));
});


/* ===================================================
   7. CHANGE PASSWORD
   =================================================== */
document.getElementById("passwordForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorEl = document.getElementById("passwordError");
    errorEl.innerText = "";

    if (newPassword.length < 6) {
        errorEl.innerText = "Password must be at least 6 characters";
        return;
    }

    if (newPassword !== confirmPassword) {
        errorEl.innerText = "Passwords do not match";
        return;
    }

    authFetch("/api/v1/user/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword })
    })
        .then(res => {
            if (!res.ok) throw new Error();
            alert("Password updated ✅ Please login again.");
            window.location.href = "login.html";
        })
        .catch(() => {
            errorEl.innerText = "Current password is incorrect";
        });
});


/* ===================================================
   8. ACCOUNT SETTINGS  (Preferences modal)
   =================================================== */

authFetch("/api/v1/user/preferences")
    .then(guard)
    .then(prefs => {
        if (!prefs) return;
        document.getElementById("emailNotify").checked = prefs.emailNotifications || false;
        document.getElementById("platformNotify").checked = prefs.platformNotifications || false;
        document.getElementById("jobAlerts").checked = prefs.jobAlerts || false;
        document.getElementById("theme").value = prefs.theme || "system";
        document.getElementById("learningPath").value = prefs.learningPath || "student";
    })
    .catch(err => console.error("Preferences load error:", err));

authFetch("/api/v1/user/account-info")
    .then(guard)
    .then(info => {
        if (!info) return;
        const lastLoginEl = document.getElementById("lastLogin");
        if (lastLoginEl && info.lastLoginAt) {
            lastLoginEl.innerText = new Date(info.lastLoginAt).toLocaleString();
        } else if (lastLoginEl) {
            lastLoginEl.innerText = "Never";
        }
    })
    .catch(err => console.error("Account info error:", err));

function savePreferences() {
    const payload = {
        emailNotifications: document.getElementById("emailNotify").checked,
        platformNotifications: document.getElementById("platformNotify").checked,
        jobAlerts: document.getElementById("jobAlerts").checked,
        theme: document.getElementById("theme").value,
        learningPath: document.getElementById("learningPath").value
    };

    authFetch("/api/v1/user/preferences", {
        method: "PUT",
        body: JSON.stringify(payload)
    }).catch(err => console.error("Preferences save error:", err));
}

["emailNotify", "platformNotify", "jobAlerts", "theme", "learningPath"].forEach(id => {
    document.getElementById(id).addEventListener("change", savePreferences);
});

document.getElementById("logoutAll").addEventListener("click", () => {
    if (!confirm("This will log you out from ALL devices. Continue?")) return;

    authFetch("/api/v1/user/logout-all", { method: "POST" })
        .then(res => {
            if (!res.ok) throw new Error();
            localStorage.removeItem('AUTH_TOKEN');
            alert("Logged out from all devices ✅");
            window.location.href = "login.html";
        })
        .catch(() => alert("Failed to logout from all devices"));
});


/* ===================================================
   9. SINGLE LOGOUT
   =================================================== */
document.getElementById("logout").addEventListener("click", () => {
    if (!confirm("Are you sure you want to logout?")) return;

    localStorage.removeItem('AUTH_TOKEN');
    authFetch("/api/v1/auth/logout", { method: "POST" })
        .finally(() => window.location.href = "login.html");
});


/* ===================================================
   10. PROFILE MENU TOGGLE
   =================================================== */
function toggleProfileMenu(e) {
    e.stopPropagation();
    document.getElementById("profileMenu").classList.toggle("open");
}

document.addEventListener("click", () => {
    document.getElementById("profileMenu").classList.remove("open");
});


/* ===================================================
   11. MODAL OPEN / CLOSE HANDLERS
   =================================================== */
document.getElementById("personal-details").onclick = (e) => {
    e.preventDefault();
    document.querySelector(".personal").classList.add("show");
    document.getElementById("overlay").classList.add("show");
};

document.getElementById("details-close").onclick = () => {
    document.querySelector(".personal").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
};

document.getElementById("overlay").onclick = () => {
    document.querySelector(".personal").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
};

document.getElementById("account-settings").onclick = (e) => {
    e.preventDefault();
    document.querySelector(".account").classList.add("shows");
    document.getElementById("account-overlay").classList.add("shows");
};

document.getElementById("accounts-close").onclick = () => {
    document.querySelector(".account").classList.remove("shows");
    document.getElementById("account-overlay").classList.remove("shows");
};

document.getElementById("account-overlay").onclick = () => {
    document.querySelector(".account").classList.remove("shows");
    document.getElementById("account-overlay").classList.remove("shows");
};

document.getElementById("change-password").onclick = (e) => {
    e.preventDefault();
    document.getElementById("changePassword").classList.add("shows");
    document.getElementById("passwordOverlay").classList.add("shows");
};

document.getElementById("passwordClose").onclick = () => {
    document.getElementById("changePassword").classList.remove("shows");
    document.getElementById("passwordOverlay").classList.remove("shows");
};

document.getElementById("passwordOverlay").onclick = () => {
    document.getElementById("changePassword").classList.remove("shows");
    document.getElementById("passwordOverlay").classList.remove("shows");
};


/* ===================================================
   12. HEADER SEARCH BAR
   =================================================== */
const dashSearch = document.getElementById("search");
const dashSearchBtn = document.getElementById("search-btn");

function handleDashSearch() {
    const q = dashSearch.value.trim();
    if (!q) return;
    window.location.href = `../../index.html?search=${encodeURIComponent(q)}`;
}

if (dashSearch) {
    dashSearch.addEventListener("keydown", (e) => {
        if (e.key === "Enter") handleDashSearch();
    });
}
if (dashSearchBtn) {
    dashSearchBtn.addEventListener("click", handleDashSearch);
}


/* ===================================================
   13. HAMBURGER / MOBILE NAV
   =================================================== */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");

if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
        mobileNav.classList.toggle("open");
    });
}


/* ===================================================
   14. CHAT WIDGET
   =================================================== */
const chatMsg = document.getElementById("chatMsg");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");

if (chatMsg) {
    chatMsg.addEventListener("click", () => {
        chatWidget.classList.add("open");
    });
}

if (chatClose) {
    chatClose.addEventListener("click", () => {
        chatWidget.classList.remove("open");
    });
}


/* ===================================================
   15. NAV JOBS LINK
   =================================================== */
const navJobsLink = document.getElementById("nav-jobs-link");
if (navJobsLink) {
    navJobsLink.addEventListener("click", (e) => {
        // Allow the default HTML href to work
    });
}


/* ===================================================
   16. VERIFY EMAIL / PHONE BUTTONS (placeholders)
   =================================================== */
const verifyEmail = document.getElementById("verifyEmail");
const editEmail = document.getElementById("editEmail");
const verifyPhone = document.getElementById("verifyPhone");
const editPhone = document.getElementById("editPhone");
const otpBox = document.getElementById("otpBox");
const confirmOtp = document.getElementById("confirmOtp");

if (verifyEmail) {
    verifyEmail.addEventListener("click", () => {
        alert("Verification email sent! (Feature coming soon)");
    });
}

if (editEmail) {
    editEmail.addEventListener("click", () => {
        const emailInput = document.getElementById("email");
        emailInput.removeAttribute("readonly");
        emailInput.focus();
    });
}

if (verifyPhone) {
    verifyPhone.addEventListener("click", () => {
        if (otpBox) otpBox.style.display = "flex";
    });
}

if (editPhone) {
    editPhone.addEventListener("click", () => {
        const phoneInput = document.getElementById("phone");
        phoneInput.focus();
    });
}

if (confirmOtp) {
    confirmOtp.addEventListener("click", () => {
        const otp = document.getElementById("otpInput").value;
        if (otp.length === 6) {
            alert("Phone verified! ✅ (Feature coming soon)");
            if (otpBox) otpBox.style.display = "none";
        } else {
            alert("Please enter a valid 6-digit OTP");
        }
    });
}
