// ==========================================
// LANDING PAGE JS
// (navbar logic removed - handled by navbar.js)
// ==========================================

const cards = document.querySelectorAll(".course-card");
const reveals = document.querySelectorAll(".reveal");

// Chat
const chat = document.getElementById("chatMsg");
const chatWidget = document.getElementById("chat-widget");
const chatClose = document.getElementById("chat-close");

// ==========================================
// REVEAL ON SCROLL
// ==========================================
window.addEventListener("scroll", () => {
  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
});

// ==========================================
// FILTER FUNCTION (for Featured Courses)
// ==========================================
function filterCourses(query) {
  cards.forEach((card) => {
    const keyword = card.dataset.keyword ? card.dataset.keyword.toLowerCase() : '';
    if (keyword.includes(query.toLowerCase())) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });
}

// ==========================================
// CHAT WIDGET
// ==========================================
if (chat) {
  chat.addEventListener("click", () => {
    chatWidget.classList.toggle("open");
  });
}

if (chatClose) {
  chatClose.addEventListener("click", () => {
    chatWidget.classList.remove("open");
  });
}

function appendChatMessage(text, who) {
  who = who || "bot";
  var thread = document.getElementById("chatThread");
  if (!thread) return;
  var row = document.createElement("div");
  row.className = "chat-row " + (who === "user" ? "chat-row-user" : "chat-row-bot");
  var bubble = document.createElement("div");
  bubble.className = "chat-bubble " + (who === "user" ? "chat-bubble-user" : "chat-bubble-bot");
  if (who === "bot") { bubble.innerHTML = text; } else { bubble.textContent = text; }
  row.appendChild(bubble);
  thread.appendChild(row);
  // Scroll the chat body so the latest message is visible
  var chatBody = thread.closest(".chat-body");
  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
  var thread = document.getElementById("chatThread");
  if (!thread) return null;
  var row = document.createElement("div");
  row.className = "chat-row chat-row-bot";
  row.id = "typing-indicator";
  row.innerHTML = '<div class="chat-bubble chat-bubble-bot" style="display:flex;gap:5px;padding:14px 20px;">' +
    '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  thread.appendChild(row);
  var chatBody = thread.closest(".chat-body");
  if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  return row;
}

function removeTypingIndicator() {
  var el = document.getElementById("typing-indicator");
  if (el) el.remove();
}

function handleChatQuestion(q) {
  appendChatMessage(q, "user");
  showTypingIndicator();
  setTimeout(function () {
    removeTypingIndicator();
    appendChatMessage(getAnswer(q), "bot");
  }, 400 + Math.random() * 400);
}

function getAnswer(q) {
  var s = (q || "").toLowerCase();
  var linkStyle = 'style="color:#6c63ff;text-decoration:underline;font-weight:500;"';

  // ── Getting started ──
  if (s.indexOf("start") !== -1 || s.indexOf("begin") !== -1 || s.indexOf("new") !== -1 || s.indexOf("where do i") !== -1) {
    return 'Start with <strong>HTML \u2192 CSS \u2192 JavaScript</strong>. Use the <a href="./pages/roadmaps/whereto.html" ' + linkStyle + '>Where to Start</a> guide, then follow <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Roadmaps</a> for a structured learning path.';
  }

  // ── Technology-specific queries (check BEFORE generic "tutorial" / "course") ──
  if (/\bhtml\b/.test(s)) {
    return 'Learn HTML from scratch! Check out the <a href="./pages/tutorial.html?course=htmlPages.json" ' + linkStyle + '>HTML Tutorial</a>, the <a href="./pages/reference.html?course=htmlReference.json" ' + linkStyle + '>HTML Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>HTML Exercises</a>.';
  }
  if (/\bcss\b/.test(s)) {
    return 'Master CSS styling! Start with the <a href="./pages/tutorial.html?course=cssPages.json" ' + linkStyle + '>CSS Tutorial</a>, check the <a href="./pages/reference.html?course=cssReference.json" ' + linkStyle + '>CSS Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>CSS Exercises</a>.';
  }
  if (/\bjavascript\b|\bjs\b/.test(s)) {
    return 'JavaScript is essential for web development! Start with the <a href="./pages/tutorial.html?course=jsPages.json" ' + linkStyle + '>JavaScript Tutorial</a>, use the <a href="./pages/reference.html?course=jsReference.json" ' + linkStyle + '>JS Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>JS Exercises</a>.';
  }
  if (/\bpython\b/.test(s)) {
    return 'Python is great for beginners and pros alike! Check out the <a href="./pages/tutorial.html?course=pythonPages.json" ' + linkStyle + '>Python Tutorial</a>, the <a href="./pages/reference.html?course=pythonReference.json" ' + linkStyle + '>Python Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>Python Exercises</a>.';
  }
  if (/\bjava\b/.test(s) && !/javascript/.test(s)) {
    return 'Learn Java programming! Start with the <a href="./pages/tutorial.html?course=javaPages.json" ' + linkStyle + '>Java Tutorial</a>, use the <a href="./pages/reference.html?course=javaReference.json" ' + linkStyle + '>Java Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>Java Exercises</a>.';
  }
  if (/\breact\b/.test(s)) {
    return 'Build modern UIs with React! Check out the <a href="./pages/tutorial.html?course=reactPages.json" ' + linkStyle + '>React Tutorial</a> or the <a href="./pages/reference.html?course=reactReference.json" ' + linkStyle + '>React Reference</a>.';
  }
  if (/\bsql\b|\bmysql\b|\bdatabase\b|\bmongo\b|\bpostgre/.test(s)) {
    return 'Learn databases and SQL! Start with the <a href="./pages/tutorial.html?course=sqlPages.json" ' + linkStyle + '>SQL Tutorial</a>, the <a href="./pages/reference.html?course=sqlReference.json" ' + linkStyle + '>SQL Reference</a>, or practice with <a href="./pages/exercise.html" ' + linkStyle + '>SQL Exercises</a>.';
  }
  if (/\bc\+\+|\bcpp\b/.test(s)) {
    return 'Learn C++ programming! Check out the <a href="./pages/tutorial.html?course=cInc.json" ' + linkStyle + '>C++ Tutorial</a> and the <a href="./pages/reference.html?course=cppReference.json" ' + linkStyle + '>C++ Reference</a>.';
  }
  if (/\bc#|\bcsharp\b/.test(s)) {
    return 'Learn C# programming! Check out the <a href="./pages/tutorial.html?course=cSharpPages.json" ' + linkStyle + '>C# Tutorial</a> and the <a href="./pages/reference.html?course=csharpReference.json" ' + linkStyle + '>C# Reference</a>.';
  }
  if (/\bphp\b/.test(s)) {
    return 'Learn PHP for server-side development! Start with the <a href="./pages/tutorial.html?course=phpPages.json" ' + linkStyle + '>PHP Tutorial</a> and the <a href="./pages/reference.html?course=phpReference.json" ' + linkStyle + '>PHP Reference</a>.';
  }
  if (/\bbootstrap\b/.test(s)) {
    return 'Build responsive websites fast with Bootstrap! Check out the <a href="./pages/tutorial.html?course=bootstrapPages.json" ' + linkStyle + '>Bootstrap Tutorial</a> and the <a href="./pages/reference.html?course=bootstrapReference.json" ' + linkStyle + '>Bootstrap Reference</a>.';
  }
  if (/\btypescript\b|\bts\b/.test(s)) {
    return 'TypeScript adds type safety to JavaScript! Start with the <a href="./pages/tutorial.html?course=typescriptPages.json" ' + linkStyle + '>TypeScript Tutorial</a> and the <a href="./pages/reference.html?course=typescriptReference.json" ' + linkStyle + '>TypeScript Reference</a>.';
  }
  if (/\bnode\b|\bnodejs\b|\bexpress\b/.test(s)) {
    return 'Build backend apps with Node.js! Check out the <a href="./pages/tutorial.html?course=nodejsPages.json" ' + linkStyle + '>Node.js Tutorial</a> and the <a href="./pages/reference.html?course=nodejsReference.json" ' + linkStyle + '>Node.js Reference</a>.';
  }
  if (/\bdjango\b/.test(s)) {
    return 'Build Python web apps with Django! Check out the <a href="./pages/tutorial.html?course=djangoPages.json" ' + linkStyle + '>Django Tutorial</a> and the <a href="./pages/reference.html?course=djangoReference.json" ' + linkStyle + '>Django Reference</a>.';
  }
  if (/\bflask\b/.test(s)) {
    return 'Build lightweight Python web apps! Check out the <a href="./pages/tutorial.html?course=flaskPages.json" ' + linkStyle + '>Flask Tutorial</a> and the <a href="./pages/reference.html?course=flaskReference.json" ' + linkStyle + '>Flask Reference</a>.';
  }
  if (/\bgit\b/.test(s)) {
    return 'Learn version control with Git! Check out the <a href="./pages/tutorial.html?course=gitPages.json" ' + linkStyle + '>Git Tutorial</a> and the <a href="./pages/reference.html?course=gitReference.json" ' + linkStyle + '>Git Reference</a>.';
  }
  if (/\bdocker\b|\bkubernetes\b|\bdevops\b/.test(s)) {
    return 'Learn DevOps tools! Check out the <a href="./pages/tutorial.html?course=dockerPages.json" ' + linkStyle + '>Docker Tutorial</a> or explore our <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>DevOps Roadmap</a>.';
  }
  if (/\bai\b|\bmachine learning\b|\bml\b|\bdata science\b/.test(s)) {
    return 'Dive into AI & Data Science! Check out our <a href="./pages/tutorial.html?course=aiPages.json" ' + linkStyle + '>AI & ML Tutorials</a>, or explore a structured <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Data Science Roadmap</a>.';
  }
  if (/\bangular\b/.test(s)) {
    return 'Build enterprise web apps with Angular! Check out the <a href="./pages/tutorial.html?course=angularPages.json" ' + linkStyle + '>Angular Tutorial</a> and the <a href="./pages/reference.html?course=angularReference.json" ' + linkStyle + '>Angular Reference</a>.';
  }
  if (/\bvue\b/.test(s)) {
    return 'Build progressive UIs with Vue.js! Check out the <a href="./pages/tutorial.html?course=vuePages.json" ' + linkStyle + '>Vue.js Tutorial</a> and the <a href="./pages/reference.html?course=vuejsReference.json" ' + linkStyle + '>Vue.js Reference</a>.';
  }
  if (/\bmongodb\b/.test(s)) {
    return 'Learn MongoDB for modern apps! Check out the <a href="./pages/tutorial.html?course=mongodbPages.json" ' + linkStyle + '>MongoDB Tutorial</a> and the <a href="./pages/reference.html?course=mongodbReference.json" ' + linkStyle + '>MongoDB Reference</a>.';
  }
  if (/\bnumpy\b/.test(s)) {
    return 'Master numerical computing with NumPy! Check out the <a href="./pages/tutorial.html?course=numpyPages.json" ' + linkStyle + '>NumPy Tutorial</a> and the <a href="./pages/reference.html?course=numpyReference.json" ' + linkStyle + '>NumPy Reference</a>.';
  }
  if (/\bpandas\b/.test(s)) {
    return 'Analyze data with Pandas! Check out the <a href="./pages/tutorial.html?course=pandasPages.json" ' + linkStyle + '>Pandas Tutorial</a> and the <a href="./pages/reference.html?course=pandasReference.json" ' + linkStyle + '>Pandas Reference</a>.';
  }

  // ── Feature-specific queries ──
  if (s.indexOf("course") !== -1) {
    return 'Browse all courses at <a href="./pages/roadmaps/courses.html" ' + linkStyle + '>Courses</a>. You can also use the search bar in the navbar to find specific courses.';
  }
  if (s.indexOf("tutorial") !== -1 || s.indexOf("learn") !== -1) {
    return 'Explore step-by-step tutorials at <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorials</a>. We cover 50+ technologies from HTML basics to advanced AI.';
  }
  if (s.indexOf("reference") !== -1 || s.indexOf("cheat") !== -1 || s.indexOf("syntax") !== -1) {
    return 'Quick lookup references are at <a href="./pages/reference.html" ' + linkStyle + '>References</a>. They include tags, methods, properties & syntax for 45+ technologies.';
  }
  if (s.indexOf("exercise") !== -1 || s.indexOf("practice") !== -1) {
    return 'Sharpen your skills with hands-on challenges at <a href="./pages/exercise.html" ' + linkStyle + '>Exercises</a>. Each exercise has an integrated code editor.';
  }
  if (s.indexOf("quiz") !== -1 || s.indexOf("test") !== -1) {
    return 'Test your knowledge at <a href="./pages/quizzes.html" ' + linkStyle + '>Quizzes</a>. Complete them to boost your knowledge and earn certificate eligibility.';
  }
  if (s.indexOf("certificate") !== -1 || s.indexOf("certif") !== -1) {
    return 'Complete a course (including required quizzes) to unlock certificates. <a href="./pages/auth/login.html" ' + linkStyle + '>Log in</a> and visit your <a href="./pages/dashboard.html" ' + linkStyle + '>Dashboard</a> to view earned certificates.';
  }
  if (s.indexOf("roadmap") !== -1 || s.indexOf("career") !== -1 || s.indexOf("learning path") !== -1) {
    return 'Explore structured learning paths at <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Roadmaps</a>. Each roadmap is designed for a specific job role. Not sure where to start? Try <a href="./pages/roadmaps/whereto.html" ' + linkStyle + '>Where to Start</a>.';
  }
  if (s.indexOf("editor") !== -1 || s.indexOf("try it") !== -1 || s.indexOf("code editor") !== -1 || s.indexOf("playground") !== -1) {
    return 'Try our built-in code editors! Each <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorial</a> and <a href="./pages/exercise.html" ' + linkStyle + '>Exercise</a> has a <strong>Try It</strong> button. You can also scroll down to the <strong>Try It Yourself</strong> section on this page.';
  }
  if (s.indexOf("resume") !== -1 || s.indexOf("cv") !== -1) {
    return 'Build a professional resume with our <a href="./pages/resume-builder.html" ' + linkStyle + '>Resume Builder</a>! It helps you create ATS-friendly resumes in minutes.';
  }
  if (s.indexOf("job") !== -1 || s.indexOf("hire") !== -1 || s.indexOf("recruit") !== -1 || s.indexOf("work") !== -1) {
    return 'Looking for jobs? Check out our <a href="./pages/jobs/jobs-listing.html" ' + linkStyle + '>Job Listings</a>. You can also build your resume using our <a href="./pages/resume-builder.html" ' + linkStyle + '>Resume Builder</a>.';
  }
  if (s.indexOf("dashboard") !== -1 || s.indexOf("progress") !== -1 || s.indexOf("profile") !== -1) {
    return 'Track your learning progress on your <a href="./pages/dashboard.html" ' + linkStyle + '>Dashboard</a>. <a href="./pages/auth/login.html" ' + linkStyle + '>Log in</a> to view your courses, certificates, and achievements.';
  }
  if (s.indexOf("login") !== -1 || s.indexOf("sign") !== -1 || s.indexOf("account") !== -1 || s.indexOf("register") !== -1) {
    return '<a href="./pages/auth/login.html" ' + linkStyle + '>Login</a> or <a href="./pages/auth/register.html" ' + linkStyle + '>Sign Up</a> to track progress, earn certificates, and personalize your learning.';
  }
  if (s.indexOf("support") !== -1 || s.indexOf("contact") !== -1 || s.indexOf("help") !== -1) {
    return 'Need help? You can ask me anything about the platform! You can also explore our <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorials</a>, <a href="./pages/reference.html" ' + linkStyle + '>References</a>, or <a href="./pages/exercise.html" ' + linkStyle + '>Exercises</a> to find what you need.';
  }
  if (s.indexOf("free") !== -1 || s.indexOf("price") !== -1 || s.indexOf("cost") !== -1) {
    return 'Path4Career is <strong>completely free</strong>! All <a href="./pages/tutorial.html" ' + linkStyle + '>tutorials</a>, <a href="./pages/reference.html" ' + linkStyle + '>references</a>, <a href="./pages/exercise.html" ' + linkStyle + '>exercises</a>, <a href="./pages/quizzes.html" ' + linkStyle + '>quizzes</a>, and code editors are available at no cost.';
  }
  if (s.indexOf("code") !== -1 || s.indexOf("programming") !== -1 || s.indexOf("coding") !== -1) {
    return 'Ready to code? Start with our <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorials</a>, practice with <a href="./pages/exercise.html" ' + linkStyle + '>Exercises</a>, or jump into a code editor from any tutorial page. Not sure where to begin? Try <a href="./pages/roadmaps/whereto.html" ' + linkStyle + '>Where to Start</a>.';
  }
  if (/\bweb\b|\bfrontend\b|\bfront.end\b/.test(s)) {
    return 'Start your web development journey! Learn <a href="./pages/tutorial.html?course=htmlPages.json" ' + linkStyle + '>HTML</a>, <a href="./pages/tutorial.html?course=cssPages.json" ' + linkStyle + '>CSS</a>, and <a href="./pages/tutorial.html?course=jsPages.json" ' + linkStyle + '>JavaScript</a>. Or explore the <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Frontend Roadmap</a>.';
  }
  if (/\bbackend\b|\bback.end\b|\bserver\b|\bapi\b/.test(s)) {
    return 'Build powerful backends! Learn <a href="./pages/tutorial.html?course=nodejsPages.json" ' + linkStyle + '>Node.js</a>, <a href="./pages/tutorial.html?course=pythonPages.json" ' + linkStyle + '>Python</a>, or <a href="./pages/tutorial.html?course=javaPages.json" ' + linkStyle + '>Java</a>. Check out the <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Backend Roadmap</a> for a guided path.';
  }
  if (/\bfull.?stack\b/.test(s)) {
    return 'Become a Full-Stack Developer! Start with our <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Full-Stack Roadmap</a>, or explore <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorials</a> for both frontend and backend technologies.';
  }

  // ── Fallback — provide ALL major links so the user always has somewhere to go ──
  return 'I can help you navigate! Here are our main sections:<br><br>' +
    '\u2022 <a href="./pages/tutorial.html" ' + linkStyle + '>Tutorials</a> \u2013 Step-by-step learning<br>' +
    '\u2022 <a href="./pages/reference.html" ' + linkStyle + '>References</a> \u2013 Quick syntax lookup<br>' +
    '\u2022 <a href="./pages/roadmaps/courses.html" ' + linkStyle + '>Courses</a> \u2013 Structured courses<br>' +
    '\u2022 <a href="./pages/exercise.html" ' + linkStyle + '>Exercises</a> \u2013 Hands-on practice<br>' +
    '\u2022 <a href="./pages/quizzes.html" ' + linkStyle + '>Quizzes</a> \u2013 Test your knowledge<br>' +
    '\u2022 <a href="./pages/roadmaps/roadmaps.html" ' + linkStyle + '>Roadmaps</a> \u2013 Career learning paths<br>' +
    '\u2022 <a href="./pages/resume-builder.html" ' + linkStyle + '>Resume Builder</a> \u2013 Build your CV<br><br>' +
    'Try asking about a specific technology like <strong>Python</strong>, <strong>JavaScript</strong>, or <strong>React</strong>!';
}

document.addEventListener("DOMContentLoaded", function () {
  var quick = document.getElementById("chatQuick");
  if (quick) {
    quick.addEventListener("click", function (e) {
      var btn = e.target.closest("button[data-q]");
      if (!btn) return;
      handleChatQuestion(btn.getAttribute("data-q"));
    });
  }

  var chatText = document.getElementById("chatText");
  var chatSend = document.getElementById("chatSend");

  function sendMessage() {
    if (!chatText) return;
    var q = chatText.value.trim();
    if (!q) return;
    chatText.value = "";
    handleChatQuestion(q);
  }

  if (chatText) {
    chatText.addEventListener("keydown", function (e) {
      if (e.key === "Enter") sendMessage();
    });
  }

  if (chatSend) {
    chatSend.addEventListener("click", sendMessage);
  }
});

// ==========================================
// CODE EDITOR (frontend/backend toggle)
// ==========================================
const frontendCode = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; background: #f0f0f0; text-align: center; }
    h1 { color: #22c55e; }
  \x3C/style>
</head>
<body>
  <h1>Hello Frontend!</h1>
  <p>This is a sample HTML snippet.</p>
</body>
</html>`;

const backendCode = `// Backend Example (Node.js)
// Run this in a Node.js environment
const express = require('express');
const app = express();
app.get('/', (req,res)=> res.send('Hello Backend!'));
app.listen(3000);`;

function loadCode(type) {
  const editor = document.getElementById("code-editor");
  const output = document.getElementById("output-box");

  document
    .querySelectorAll(".editor-tabs button")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-${type}`).classList.add("active");

  if (type === "frontend") {
    editor.value = frontendCode;
    output.srcdoc = frontendCode;
  } else {
    editor.value = backendCode;
    output.srcdoc = `
      <style>
        body { font-family: Arial; background: #111; color: #0f0; padding: 1rem; }
        .console { background:#000; padding:1rem; border-radius:8px; }
      \x3C/style>
      <div class="console">
        <p>Server running on <strong>http://localhost:3000</strong></p>
        <p>GET / \u2192 Hello Backend!</p>
      </div>
    `;
  }
}

function runCode() {
  const code = document.getElementById("code-editor").value;
  const output = document.getElementById("output-box");

  if (code.includes("<html>")) {
    output.srcdoc = code;
  } else {
    output.srcdoc = `
      <style>
        body { font-family: Arial; background: #111; color: #0f0; padding: 1rem; }
        .console { background:#000; padding:1rem; border-radius:8px; }
      \x3C/style>
      <div class="console">
        <p>Server running on <strong>http://localhost:3000</strong></p>
        <p>GET / \u2192 Hello Backend!</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnFrontend = document.getElementById("btn-frontend");
  const btnBackend = document.getElementById("btn-backend");

  if (btnFrontend) btnFrontend.addEventListener("click", () => loadCode("frontend"));
  if (btnBackend) btnBackend.addEventListener("click", () => loadCode("backend"));

  loadCode("frontend");

  // ==========================================
  // TUTORIALS SHOWCASE - Dynamic Card Grid
  // ==========================================
  loadTutorialShowcase();

  // ==========================================
  // REFERENCES SHOWCASE
  // ==========================================
  loadReferencesShowcase();

  // ==========================================
  // EDITORS SHOWCASE
  // ==========================================
  loadEditorsShowcase();
});

// ==========================================
// TUTORIALS SHOWCASE
// ==========================================
async function loadTutorialShowcase() {
  const grid = document.getElementById("tutorials-grid");
  const filterContainer = document.getElementById("tutorials-filter");
  if (!grid || !filterContainer) return;

  try {
    const resp = await fetch("./assets/data/tutorials-config.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const config = await resp.json();
    const tutorials = config.tutorials;

    // Build filter tabs
    const categories = [...new Set(tutorials.map(t => t.category))];
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-tab";
      btn.dataset.filter = cat;
      btn.textContent = cat;
      filterContainer.appendChild(btn);
    });

    // Build cards
    renderTutorialCards(tutorials, grid);

    // Filter logic
    filterContainer.addEventListener("click", (e) => {
      if (!e.target.classList.contains("filter-tab")) return;

      filterContainer.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const filter = e.target.dataset.filter;
      const filtered = filter === "all" ? tutorials : tutorials.filter(t => t.category === filter);
      renderTutorialCards(filtered, grid);
    });

  } catch (err) {
    console.warn("Could not load tutorials showcase:", err);
  }
}

function renderTutorialCards(tutorials, container) {
  container.innerHTML = tutorials.map(t => {
    const href = `./pages/tutorial.html?course=${t.file}`;
    return `
      <a href="${href}" class="tutorial-card-item">
        <div class="tutorial-card-icon">${t.icon}</div>
        <div class="tutorial-card-body">
          <h3>${t.name}</h3>
          <p>${t.desc}</p>
          <span class="tutorial-card-badge">${t.category}</span>
        </div>
        <div class="tutorial-card-arrow">\u2192</div>
      </a>`;
  }).join('');
}

// ==========================================
// REFERENCES SHOWCASE
// ==========================================
async function loadReferencesShowcase() {
  const grid = document.getElementById("references-grid");
  if (!grid) return;

  try {
    const resp = await fetch("./assets/data/references-config.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const config = await resp.json();
    const references = config.references;

    grid.innerHTML = references.map(r => {
      const href = `./pages/reference.html?course=${r.file}`;
      return `
        <a href="${href}" class="tutorial-card-item ref-card-item">
          <div class="tutorial-card-icon">${r.icon}</div>
          <div class="tutorial-card-body">
            <h3>${r.name}</h3>
            <p>${r.desc}</p>
            <span class="tutorial-card-badge ref-badge">Reference</span>
          </div>
          <div class="tutorial-card-arrow">\u2192</div>
        </a>`;
    }).join('');

  } catch (err) {
    console.warn("Could not load references showcase:", err);
  }
}

// ==========================================
// EDITORS SHOWCASE
// ==========================================
async function loadEditorsShowcase() {
  const grid = document.getElementById("editors-grid");
  const filterContainer = document.getElementById("editors-filter");
  if (!grid) return;

  try {
    const resp = await fetch("./assets/data/editors-config.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const config = await resp.json();
    const editors = config.editors;

    // Categorize editors
    const editorCategories = {
      'Frontend': ['html', 'css', 'js', 'typescript', 'react', 'vue', 'angular', 'bootstrap', 'tailwind', 'jquery', 'nextjs', 'xml'],
      'Backend': ['python', 'java', 'c-editor', 'cpp', 'csharp', 'php', 'go', 'r-editor', 'nodejs', 'deno', 'django', 'flask', 'fastapi', 'nest', 'springboot', 'asp', 'graphql', 'restapi'],
      'Database': ['sql', 'mysql', 'postgresql', 'mongodb', 'clickhouse'],
      'Data & AI': ['numpy', 'pandas', 'datascience', 'spark', 'powerbi', 'ai', 'aws'],
      'Tools': ['docker', 'kubernetes', 'dsa', 'git', 'excel']
    };

    function getEditorCategory(fileName) {
      const base = fileName.replace('-editor.html', '');
      for (const [cat, list] of Object.entries(editorCategories)) {
        if (list.some(k => base.includes(k))) return cat;
      }
      return 'Other';
    }

    // Build filter tabs
    if (filterContainer) {
      const cats = [...new Set(editors.map(e => getEditorCategory(e.file)))];
      cats.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "filter-tab";
        btn.dataset.filter = cat;
        btn.textContent = cat;
        filterContainer.appendChild(btn);
      });

      filterContainer.addEventListener("click", (e) => {
        if (!e.target.classList.contains("filter-tab")) return;
        filterContainer.querySelectorAll(".filter-tab").forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");

        const filter = e.target.dataset.filter;
        const filtered = filter === "all" ? editors : editors.filter(ed => getEditorCategory(ed.file) === filter);
        renderEditorCards(filtered, grid);
      });
    }

    renderEditorCards(editors, grid);

  } catch (err) {
    console.warn("Could not load editors showcase:", err);
  }
}

function renderEditorCards(editors, container) {
  container.innerHTML = editors.map(e => {
    const href = `./pages/editors/${e.file}`;
    return `
      <a href="${href}" class="tutorial-card-item editor-card-item">
        <div class="tutorial-card-icon">${e.icon}</div>
        <div class="tutorial-card-body">
          <h3>${e.name}</h3>
          <p>${e.desc}</p>
          <span class="tutorial-card-badge editor-badge">Editor</span>
        </div>
        <div class="tutorial-card-arrow">\u25B6</div>
      </a>`;
  }).join('');
}
