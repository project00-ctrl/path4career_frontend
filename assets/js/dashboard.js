const searchInput = document.getElementById("search");
const cards = document.querySelectorAll(".course-card");
const searchBtn = document.getElementById("search-btn");
const chat = document.getElementById("chatMsg");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const tutorial = document.getElementById("tutorials");

// Auth Guard

// if(!localStorage.getItem("isLoggedIn")){
//   window.location.href ="login.html";
// }

// localStorage.setItem("isLoggedIn","true");

// localStorage.removeItem("isLoggedIn");
// window.location.href="login.html";

// dynamic mock data

const userData = {
  name: "Pranitha",
  streak: 12,
  completed: 5,
  applied: 18,
  skill: "Intermediate",
};

document.querySelector(".hero span").innerText = userData.name;
document.querySelectorAll(".kpi h2")[0].innerText = userData.streak + "Days";
document.querySelectorAll(".kpi h2")[1].innerText = userData.completed;
document.querySelectorAll(".kpi h2")[2].innerText = userData.applied;
document.querySelectorAll(".kpi h2")[3].innerText = userData.skill;

//  FILTER FUNCTION
function filterCourses(query) {
  cards.forEach((card) => {
    const keyword = card.dataset.keyword.toLowerCase();

    if (keyword.includes(query.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

//  SEARCH
function searchLogic() {
  const query = searchInput.value.toLowerCase().trim();
  if (query === "") {
    cards.forEach((card) => {
      card.style.display = "block";
    });
    return;
  }
  filterCourses(query);
}
//  EVENTS
searchInput.addEventListener("input", searchLogic);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchLogic();
  }
});
searchBtn.addEventListener("click", searchLogic);

// CHAT
if (chat) {
  chat.addEventListener("click", () => {
    chatWidget.classList.add("open");
  });
}

if (chatClose) {
  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });
}

function appendChatMessage(text, who = "bot") {
  const thread = document.getElementById("chatThread");
  if (!thread) return;
  const row = document.createElement("div");
  row.className = `chat-row ${who === "user" ? "chat-row-user" : "chat-row-bot"}`;
  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${who === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`;
  if (who === "bot") { bubble.innerHTML = text; } else { bubble.textContent = text; }
  row.appendChild(bubble);
  thread.appendChild(row);
  thread.scrollTop = thread.scrollHeight;
}

function getAnswer(q) {
  const s = (q || "").toLowerCase();
  if (s.includes("editor")) return "Practice in our built-in Code Editor: <a href='./exercise.html' style='color:#00c985; text-decoration:underline;'>Click here</a>.";
  if (s.includes("job") || s.includes("career")) return "Looking for opportunities? Check out our <a href='./jobs/jobs-listing.html' style='color:#00c985; text-decoration:underline;'>Jobs section</a>.";
  if (s.includes("start")) return "Open <a href='../roadmaps/whereto.html' style='color:#00c985; text-decoration:underline;'>Where to Start</a> for guidance.";
  return "I can help you find Bootcamps, Resumes, Jobs, Editors, Courses, Tutorials, Roadmaps, Dashboards, and more. Try asking for what you need!";
}

document.addEventListener("DOMContentLoaded", () => {
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
});

// HAMBURGER

hamburger.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});

// HTML TUTORIALS

tutorial.addEventListener("change", function () {
  if (this.value === "html") {
    window.location.href = "./tutorial.html";
  }
});

// PROFILE TOGGLE

function toggleProfileMenu(e) {
  e.stopPropagation();
  const menu = document.getElementById("profileMenu").classList.toggle("open");
}

document.addEventListener("click", () => {
  const menu = document.getElementById("profileMenu").classList.remove("open");
});

// ==============PROFILE DETAILS===============

// PERSONAL DETAILS FOR CHANGE THE DISPLAY OF CONTENT
const Personal = document.querySelector(".personal");
const details = document.getElementById("personal-details");
const detailsClose = document.getElementById("details-close");
const overlay = document.getElementById("overlay");

details.addEventListener("click", (e) => {
  e.preventDefault();
  Personal.classList.add("show");
  overlay.classList.add("show");
});

detailsClose.addEventListener("click", () => {
  Personal.classList.remove("show");
  overlay.classList.remove("show");
});

overlay.addEventListener("click", () => {
  Personal.classList.remove("show");
  overlay.classList.remove("show");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    Personal.classList.remove("show");
    overlay.classList.remove("show");
  }
});

// ACCOUNT SETTING FOR CHANGE THE DISPLAY OF CONTENT

const accountSetting = document.getElementById("account-settings");
const account = document.querySelector(".account");
const accountClose = document.getElementById("accounts-close");
const accountOverlay = document.getElementById("account-overlay");

accountSetting.addEventListener("click", (e) => {
  e.preventDefault();
  account.classList.add("shows");
  accountOverlay.classList.add("shows");
});

accountClose.addEventListener("click", () => {
  account.classList.remove("shows");
  accountOverlay.classList.remove("shows");
});

accountOverlay.addEventListener("click", () => {
  account.classList.remove("shows");
  accountOverlay.classList.remove("shows");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    account.classList.remove("shows");
    accountOverlay.classList.remove("shows");
  }
});

// CHANGE PASSWORD SETTING FOR CHANGE THE DISPLAY OF CONTENT

const passChange = document.getElementById("change-password");
const passOverlay = document.getElementById("passwordOverlay");
const changePass = document.getElementById("changePassword");
const closePass = document.getElementById("passwordClose");

passChange.addEventListener("click", (e) => {
  e.preventDefault();
  changePass.classList.add("shows");
  passOverlay.classList.add("shows");
});

closePass.addEventListener("click", () => {
  changePass.classList.remove("shows");
  passOverlay.classList.remove("shows");
});

passOverlay.addEventListener("click", () => {
  changePass.classList.remove("shows");
  passOverlay.classList.remove("shows");
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    changePass.classList.remove("shows");
    passOverlay.classList.remove("shows");
  }
});

// ======PERSONAL DETAILS======
const form = document.getElementById("personal-form");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const otpInput = document.getElementById("otpInput");
const otpBox = document.getElementById("otpBox");
const saveBtn = document.getElementById("saveBtn");

let emailVerified = false;
let phoneVerified = false;
let otp = null;
const MOCK_OTP = "123456";

const initialData = {
  fullName: "Kathir",
  email: "Kathir@example.com",
  phone: "9876543210",
};

document.getElementById("fullName").value = initialData.fullName;
emailInput.value = initialData.email;
phoneInput.value = initialData.phone;

// detects changes

form.addEventListener("input", () => {
  saveBtn.disabled = !(emailVerified || phoneVerified || hasOtherChanges());
});

function hasOtherChanges() {
  return (
    document.getElementById("fullName").value !== initialData.fullName ||
    document.getElementById("dob").value ||
    document.getElementById("gender").value ||
    document.getElementById("location").value ||
    document.getElementById("profilePic").file.length
  );
}

// email otp

document.getElementById("verifyEmail").onclick = () => {
  otp = "email";
  otpBox.style.display = "flex";
  alert("OTP sent to email (123456)");
  emailInput.removeAttribute("readonly");
};

// Phone OTP
document.getElementById("verifyPhone").onclick = () => {
  otpTarget = "phone";
  otpBox.style.display = "flex";
  alert("OTP sent to phone (123456)");
};

// confirm otp

document.getElementById("confirmOtp").onclick = () => {
  if (otpInput.value === MOCK_OTP) {
    if (otpTarget === "email") emailVerified = true;
    if (otpTarget === "phone") phoneVerified = true;

    otpBox.style.display = "none";
    otpInput.value = "";
    saveBtn.disabled = false;

    alert("OTP Verified Successfully");
  } else {
    alert("Invalid OTP");
  }
};

// save button

form.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Profile Updated Successfully");
  saveBtn.disabled = true;
});

//  email verify,edit

function enableEdit(inputId) {
  const input = document.getElementById(inputId);
  input.Disabled = false;
  input.focus();
}

const verifyEmail = document.getElementById("verifyEmail");
verifyEmail.addEventListener("click", () => {
  enableEdit("email");
});

const editEmail = document.getElementById("editEmail");
editEmail.addEventListener("click", () => {
  enableEdit("email");
});

// phone verify,edit

const phoneVerify = document.getElementById("verifyPhone");
const phoneEdit = document.getElementById("phoneEdit");

phoneVerify.addEventListener("click", () => {
  const phoneValue = phoneInput.value.trim();

  const phoneRegex = /^[6-9]\d{9}$/;

  if (!phoneRegex.test(phoneValue)) {
    alert("Enter a valid 10-digit mobile Number");
    return;
  }

  phoneInput.disabled = true;
  phoneVerify.innerText = "Verified ✅";
  phoneVerify.disabled = true;
});

// EDIT PHONE
phoneEdit.addEventListener("click", () => {
  phoneInput.disabled = false;
  phoneInput.focus();

  phoneVerify.innerText = "Verify";
  phoneVerify.disabled = false;
});

// ACCOUNT SETTING

const emailNotify = document.getElementById("emailNotify");
const platformNotify = document.getElementById("platformNotify");
const jobAlerts = document.getElementById("jobAlerts");
const ThemeSelect = document.getElementById("theme");
const Learning = document.getElementById("learningPath");
const lastLogin = document.getElementById("lastLogin");

const settings = JSON.parse(localStorage.getItem("setting")) || {
  emailNotify: true,
  platformNotify: true,
  jobAlerts: false,
  theme: "system",
  LearningPath: "student",
};

emailNotify.checked = settings.emailNotify;
platformNotify.checked = settings.emailNotify;
jobAlerts.checked = settings.jobAlerts;
themeSelect.value = settings.theme;
LearningPath.value = settings.learningPath;

lastLogin.textContent = new Data().toLocaleString();

document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("change", saveSetting);
});

function saveSetting() {
  const newSettings = {
    emailNotify: emailNotify.checked,
    platformNotify: platformNotify.checked,
    jobAlerts: jobAlerts.checked,
    themeSelect: themeSelect.value,
    learningPath: learningPath.value,
  };

  localStorage.setItem("settings", JSON.stringify(newSettings));
  applyTheme(newSettings.theme);
  console.log("Saved to DB (mock):", newSettings);
}

function applyTheme() {
  if (theme === "dark") {
    document.body.style.background = "#020617";
  } else if (theme === "light") {
    document.body.style.background = "#F8FAFC";
    document.body.style.color = "#000";
  } else {
    document.body.style.background = "";
  }
}

document.getElementById("logoutAll").onclick = () => {
  alert("Logged out from all devices");
};

// CHANGE PASSWORD

const passForm = document.getElementById("passwordForm");
const passError = document.getElementById("passwordError");
const modal = document.getElementById("changePassword");
const overlayPass = document.getElementById("passwordOverlay");

// MOCK: current password stored (from DB)
const storedPassword = "Test@1234";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const current = currentPassword.value;
  const newPass = newPassword.value;
  const confirm = confirmPassword.value;

  if (current !== storedPassword) {
    return showError("Current password is incorrect");
  }
  if (current === newPass) {
    return showError("New password must be different from old password");
  }
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!strongRegex.test(newPass)) {
    return showError(
      "Password must be 8+ chars with uppercase, lowercase, number & symbol",
    );
  }
  if (newPass !== confirm) {
    return showError("Passwords do not match");
  }

  errorBox.style.color = "#22C55E";
  errorBox.textContent = "Password updated successfully";

  setTimeout(() => {
    modal.classList.remove("shows");
    overlayPass.classList.remove("shows");
    form.reset();
    console.log("Force logout all devices (backend)");
  }, 1500);
});

function showError(msg) {
  errorBox.style.color = "#F87171";
  errorBox.textContent = msg;
}

// LOGOUT BTN

const logBtn = document.getElementById("logout");

logBtn.addEventListener("click", () => {
  const confirmLogout = confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");

  sessionStorage.clear();

  document.cookie.split(";").forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  window.location.href = "login.html";
});
