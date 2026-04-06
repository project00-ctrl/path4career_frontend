/**
 * Dashboard Page Script
 * Handles: hero data, chat widget, modals (personal details, account settings,
 * change password), and hooks into the shared navbar profile menu.
 */
(function () {
  "use strict";

  // ==========================================
  // DYNAMIC MOCK DATA
  // ==========================================
  const userData = {
    name: "Pranitha",
    streak: 12,
    completed: 5,
    applied: 18,
    skill: "Intermediate",
  };

  const heroSpan = document.querySelector(".hero span");
  const kpiHeadings = document.querySelectorAll(".kpi h2");

  if (heroSpan) heroSpan.innerText = userData.name;
  if (kpiHeadings[0]) kpiHeadings[0].innerText = userData.streak + " Days";
  if (kpiHeadings[1]) kpiHeadings[1].innerText = userData.completed;
  if (kpiHeadings[2]) kpiHeadings[2].innerText = userData.applied;
  if (kpiHeadings[3]) kpiHeadings[3].innerText = userData.skill;

  // ==========================================
  // CHAT WIDGET
  // ==========================================
  const chat = document.getElementById("chatMsg");
  const chatWidget = document.getElementById("chat-widget");
  const chatClose = document.getElementById("chat-close");

  if (chat) {
    chat.addEventListener("click", () => {
      if (chatWidget) chatWidget.classList.add("open");
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => {
      if (chatWidget) chatWidget.classList.remove("open");
    });
  }

  function appendChatMessage(text, who = "bot") {
    const thread = document.getElementById("chatThread");
    if (!thread) return;
    const row = document.createElement("div");
    row.className = `chat-row ${who === "user" ? "chat-row-user" : "chat-row-bot"}`;
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${who === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`;
    if (who === "bot") {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }
    row.appendChild(bubble);
    thread.appendChild(row);
    thread.scrollTop = thread.scrollHeight;
  }

  function getAnswer(q) {
    const s = (q || "").toLowerCase();
    if (s.includes("editor"))
      return "Practice in our built-in Code Editor: <a href='./exercise.html' style='color:#00c985; text-decoration:underline;'>Click here</a>.";
    if (s.includes("job") || s.includes("career"))
      return "Looking for opportunities? Check out our <a href='./jobs/jobs-listing.html' style='color:#00c985; text-decoration:underline;'>Jobs section</a>.";
    if (s.includes("start"))
      return "Open <a href='./roadmaps/whereto.html' style='color:#00c985; text-decoration:underline;'>Where to Start</a> for guidance.";
    if (s.includes("resume"))
      return "Build your resume with our <a href='./resume-builder.html' style='color:#00c985; text-decoration:underline;'>Resume Builder</a>.";
    if (s.includes("bootcamp") || s.includes("boot camp"))
      return "Check out our intensive <a href='./bootcamp.html' style='color:#00c985; text-decoration:underline;'>Boot Camp</a> programs.";
    if (s.includes("certificate"))
      return "Earn certificates for completed courses: <a href='./certificate.html' style='color:#00c985; text-decoration:underline;'>Certificates</a>.";
    return "I can help you find Bootcamps, Resumes, Jobs, Editors, Courses, Tutorials, Roadmaps, Dashboards, and more. Try asking for what you need!";
  }

  // Chat quick-questions and text input
  const quick = document.getElementById("chatQuick");
  if (quick) {
    quick.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-q]");
      if (!btn) return;
      const q = btn.getAttribute("data-q");
      appendChatMessage(q, "user");
      appendChatMessage(getAnswer(q), "bot");
    });
  }

  const chatText = document.getElementById("chatText");
  if (chatText) {
    chatText.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = chatText.value.trim();
      if (!q) return;
      chatText.value = "";
      appendChatMessage(q, "user");
      appendChatMessage(getAnswer(q), "bot");
    });
  }

  // ==========================================
  // PERSONAL DETAILS MODAL
  // ==========================================
  const personalModal = document.querySelector(".personal");
  const detailsClose = document.getElementById("details-close");
  const overlay = document.getElementById("overlay");

  function openPersonal() {
    if (personalModal) personalModal.classList.add("show");
    if (overlay) overlay.classList.add("show");
  }

  function closePersonal() {
    if (personalModal) personalModal.classList.remove("show");
    if (overlay) overlay.classList.remove("show");
  }

  if (detailsClose) detailsClose.addEventListener("click", closePersonal);
  if (overlay) overlay.addEventListener("click", closePersonal);

  // ==========================================
  // ACCOUNT SETTINGS MODAL
  // ==========================================
  const accountModal = document.querySelector(".account");
  const accountClose = document.getElementById("accounts-close");
  const accountOverlay = document.getElementById("account-overlay");

  function openAccount() {
    if (accountModal) accountModal.classList.add("shows");
    if (accountOverlay) accountOverlay.classList.add("shows");
  }

  function closeAccount() {
    if (accountModal) accountModal.classList.remove("shows");
    if (accountOverlay) accountOverlay.classList.remove("shows");
  }

  if (accountClose) accountClose.addEventListener("click", closeAccount);
  if (accountOverlay) accountOverlay.addEventListener("click", closeAccount);

  // ==========================================
  // CHANGE PASSWORD MODAL
  // ==========================================
  const changePassModal = document.getElementById("changePassword");
  const passOverlay = document.getElementById("passwordOverlay");
  const closePass = document.getElementById("passwordClose");

  function openChangePassword() {
    if (changePassModal) changePassModal.classList.add("shows");
    if (passOverlay) passOverlay.classList.add("shows");
  }

  function closeChangePassword() {
    if (changePassModal) changePassModal.classList.remove("shows");
    if (passOverlay) passOverlay.classList.remove("shows");
  }

  if (closePass) closePass.addEventListener("click", closeChangePassword);
  if (passOverlay) passOverlay.addEventListener("click", closeChangePassword);

  // Change Password button inside Account Settings
  const changePasswordBtn = document.getElementById("changePasswordBtn");
  if (changePasswordBtn) {
    changePasswordBtn.addEventListener("click", () => {
      closeAccount();
      openChangePassword();
    });
  }

  // ==========================================
  // ESCAPE KEY CLOSES ALL MODALS
  // ==========================================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePersonal();
      closeAccount();
      closeChangePassword();
    }
  });

  // ==========================================
  // HOOK INTO SHARED NAVBAR PROFILE MENU
  // (navbar.js creates these elements)
  // The navbar profile menu has:
  //   #navbarProfileLink → opens personal details
  //   #navbarSettingsLink → opens account settings
  //   #navbarLogout → logout
  // We also add a change password trigger inside account settings via a link
  // ==========================================
  function hookNavbarProfileMenu() {
    const profileLink = document.getElementById("navbarProfileLink");
    const settingsLink = document.getElementById("navbarSettingsLink");
    const logoutLink = document.getElementById("navbarLogout");
    const profileMenu = document.getElementById("navbarProfileMenu");

    if (profileLink) {
      profileLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (profileMenu) profileMenu.classList.remove("open");
        openPersonal();
      });
    }

    if (settingsLink) {
      settingsLink.addEventListener("click", (e) => {
        e.preventDefault();
        if (profileMenu) profileMenu.classList.remove("open");
        openAccount();
      });
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (!confirmLogout) return;
        localStorage.removeItem("AUTH_TOKEN");
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        sessionStorage.clear();
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = "./auth/login.html";
      });
    }
  }

  // Wait for navbar.js to finish injecting, then hook events
  // Use MutationObserver or a small delay since navbar.js injects async
  function waitForNavbar(callback, maxAttempts = 20) {
    let attempts = 0;
    const check = () => {
      attempts++;
      if (document.getElementById("navbarProfileLink") || attempts >= maxAttempts) {
        callback();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }

  waitForNavbar(hookNavbarProfileMenu);

  // ==========================================
  // PERSONAL DETAILS FORM
  // ==========================================
  const profileForm = document.getElementById("profile-form");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const otpInput = document.getElementById("otpInput");
  const otpBox = document.getElementById("otpBox");
  const saveBtn = document.getElementById("saveBtn");

  let emailVerified = false;
  let phoneVerified = false;
  let otpTarget = null;
  const MOCK_OTP = "123456";

  const initialData = {
    fullName: "Pranitha",
    email: "pranitha@example.com",
    phone: "9876543210",
  };

  const fullNameInput = document.getElementById("fullName");
  if (fullNameInput) fullNameInput.value = initialData.fullName;
  if (emailInput) emailInput.value = initialData.email;
  if (phoneInput) phoneInput.value = initialData.phone;

  // Detect changes
  if (profileForm && saveBtn) {
    profileForm.addEventListener("input", () => {
      saveBtn.disabled = !(emailVerified || phoneVerified || hasOtherChanges());
    });
  }

  function hasOtherChanges() {
    const fn = document.getElementById("fullName");
    const dob = document.getElementById("dob");
    const gender = document.getElementById("gender");
    const location = document.getElementById("location");
    const pic = document.getElementById("profilePic");
    return (
      (fn && fn.value !== initialData.fullName) ||
      (dob && dob.value) ||
      (gender && gender.value) ||
      (location && location.value) ||
      (pic && pic.files && pic.files.length > 0)
    );
  }

  // Email OTP
  const verifyEmailBtn = document.getElementById("verifyEmail");
  if (verifyEmailBtn) {
    verifyEmailBtn.addEventListener("click", () => {
      otpTarget = "email";
      if (otpBox) otpBox.style.display = "flex";
      alert("OTP sent to email (use: 123456)");
      if (emailInput) emailInput.removeAttribute("readonly");
    });
  }

  // Phone OTP
  const verifyPhoneBtn = document.getElementById("verifyPhone");
  if (verifyPhoneBtn) {
    verifyPhoneBtn.addEventListener("click", () => {
      const phoneValue = phoneInput ? phoneInput.value.trim() : "";
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phoneValue)) {
        alert("Enter a valid 10-digit mobile number");
        return;
      }
      otpTarget = "phone";
      if (otpBox) otpBox.style.display = "flex";
      alert("OTP sent to phone (use: 123456)");
    });
  }

  // Confirm OTP
  const confirmOtpBtn = document.getElementById("confirmOtp");
  if (confirmOtpBtn) {
    confirmOtpBtn.addEventListener("click", () => {
      if (otpInput && otpInput.value === MOCK_OTP) {
        if (otpTarget === "email") emailVerified = true;
        if (otpTarget === "phone") phoneVerified = true;
        if (otpBox) otpBox.style.display = "none";
        if (otpInput) otpInput.value = "";
        if (saveBtn) saveBtn.disabled = false;
        alert("OTP Verified Successfully");
      } else {
        alert("Invalid OTP");
      }
    });
  }

  // Save profile
  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Profile Updated Successfully");
      if (saveBtn) saveBtn.disabled = true;
    });
  }

  // Edit email
  const editEmailBtn = document.getElementById("editEmail");
  if (editEmailBtn) {
    editEmailBtn.addEventListener("click", () => {
      if (emailInput) {
        emailInput.removeAttribute("readonly");
        emailInput.focus();
      }
    });
  }

  // Edit phone
  const editPhoneBtn = document.getElementById("editPhone");
  if (editPhoneBtn) {
    editPhoneBtn.addEventListener("click", () => {
      if (phoneInput) {
        phoneInput.disabled = false;
        phoneInput.focus();
      }
      if (verifyPhoneBtn) {
        verifyPhoneBtn.innerText = "Verify";
        verifyPhoneBtn.disabled = false;
      }
    });
  }

  // ==========================================
  // ACCOUNT SETTINGS LOGIC
  // ==========================================
  const emailNotify = document.getElementById("emailNotify");
  const platformNotify = document.getElementById("platformNotify");
  const jobAlerts = document.getElementById("jobAlerts");
  const themeSelect = document.getElementById("theme");
  const learningPath = document.getElementById("learningPath");
  const lastLogin = document.getElementById("lastLogin");

  const settings = JSON.parse(localStorage.getItem("settings")) || {
    emailNotify: true,
    platformNotify: true,
    jobAlerts: false,
    theme: "system",
    learningPath: "student",
  };

  if (emailNotify) emailNotify.checked = settings.emailNotify;
  if (platformNotify) platformNotify.checked = settings.platformNotify;
  if (jobAlerts) jobAlerts.checked = settings.jobAlerts;
  if (themeSelect) themeSelect.value = settings.theme;
  if (learningPath) learningPath.value = settings.learningPath;
  if (lastLogin) lastLogin.textContent = new Date().toLocaleString();

  function saveSettings() {
    const newSettings = {
      emailNotify: emailNotify ? emailNotify.checked : true,
      platformNotify: platformNotify ? platformNotify.checked : true,
      jobAlerts: jobAlerts ? jobAlerts.checked : false,
      theme: themeSelect ? themeSelect.value : "system",
      learningPath: learningPath ? learningPath.value : "student",
    };
    localStorage.setItem("settings", JSON.stringify(newSettings));
    applyTheme(newSettings.theme);
    console.log("Settings saved:", newSettings);
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.style.background = "#020617";
      document.body.style.color = "#e2e8f0";
    } else if (theme === "light") {
      document.body.style.background = "#F8FAFC";
      document.body.style.color = "#000";
    } else {
      document.body.style.background = "";
      document.body.style.color = "";
    }
  }

  // Bind change events for account settings inputs
  [emailNotify, platformNotify, jobAlerts, themeSelect, learningPath].forEach((el) => {
    if (el) el.addEventListener("change", saveSettings);
  });

  // Logout all devices
  const logoutAllBtn = document.getElementById("logoutAll");
  if (logoutAllBtn) {
    logoutAllBtn.addEventListener("click", () => {
      alert("Logged out from all devices");
    });
  }

  // ==========================================
  // CHANGE PASSWORD LOGIC
  // ==========================================
  const passwordForm = document.getElementById("passwordForm");
  const passError = document.getElementById("passwordError");
  const storedPassword = "Test@1234";

  if (passwordForm) {
    passwordForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currentPw = document.getElementById("currentPassword");
      const newPw = document.getElementById("newPassword");
      const confirmPw = document.getElementById("confirmPassword");

      if (!currentPw || !newPw || !confirmPw) return;

      const current = currentPw.value;
      const newPass = newPw.value;
      const confirmVal = confirmPw.value;

      if (current !== storedPassword) {
        return showPassError("Current password is incorrect");
      }
      if (current === newPass) {
        return showPassError("New password must be different from old password");
      }
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!strongRegex.test(newPass)) {
        return showPassError(
          "Password must be 8+ chars with uppercase, lowercase, number & symbol"
        );
      }
      if (newPass !== confirmVal) {
        return showPassError("Passwords do not match");
      }

      if (passError) {
        passError.style.color = "#22C55E";
        passError.textContent = "Password updated successfully";
      }

      setTimeout(() => {
        closeChangePassword();
        passwordForm.reset();
        if (passError) passError.textContent = "";
      }, 1500);
    });
  }

  function showPassError(msg) {
    if (passError) {
      passError.style.color = "#F87171";
      passError.textContent = msg;
    }
  }
})();
