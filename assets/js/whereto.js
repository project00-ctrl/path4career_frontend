// const select = document.getElementById("Module-Role");
// const message = document.getElementById("user-message");
// const progressFill = document.getElementById("progressFill");
// const progressText = document.getElementById("progressText");
// const progressBox = document.getElementById("progressBox");

// const timelines = {
//   "front-end": document.querySelector(".timeline"),
//   "back-end": document.querySelector(".timeline-2"),
//   "Data-analysis": document.querySelector(".timeline-3"),
//   "machine-learning": document.querySelector(".timeline-4"),
// };

// // select role
// select.addEventListener("change", () => {
//   // hide all
//   Object.values(timelines).forEach((t) => (t.style.display = "none"));

//   // show selected
//   const selected = timelines[select.value];
//   selected.style.display = "block";

//   // greeting
//   message.innerHTML = `🚀 Great choice! You selected <b>${select.options[select.selectedIndex].text}</b> path. Stay consistent and you’ll succeed!`;

//   progressBox.classList.remove("hidden");

//   loadProgress();
// });

// // click cards = complete step
// document
//   .querySelectorAll(".card, .card-2, .card-3, .card-4")
//   .forEach((card) => {
//     card.addEventListener("click", (e) => {
//       e.preventDefault();

//       card.classList.toggle("done");

//       saveProgress();
//       updateProgress();
//     });
//   });

// // save progress
// function saveProgress() {
//   const done = document.querySelectorAll(".done").length;
//   localStorage.setItem("doneSteps", done);
// }

// // load progress
// function loadProgress() {
//   const saved = localStorage.getItem("doneSteps") || 0;

//   let cards = document.querySelectorAll(".card, .card-2, .card-3, .card-4");

//   cards.forEach((card, i) => {
//     if (i < saved) {
//       card.classList.add("done");
//     }
//   });

//   updateProgress();
// }

// // update progress bar
// function updateProgress() {
//   const total = document.querySelectorAll(
//     `${getVisibleTimeline()} .card,
//          ${getVisibleTimeline()} .card-2,
//          ${getVisibleTimeline()} .card-3,
//          ${getVisibleTimeline()} .card-4`,
//   ).length;

//   const done = document.querySelectorAll(
//     `${getVisibleTimeline()} .done`,
//   ).length;

//   const percent = Math.round((done / total) * 100) || 0;

//   progressFill.style.width = percent + "%";
//   progressText.innerText = `Progress: ${percent}%`;
// }

// // helper
// function getVisibleTimeline() {
//   return (
//     Object.values(timelines)
//       .find((t) => t.style.display === "block")
//       ?.className.split(" ")[0] || ".timeline"
//   );
// }

// ================= ELEMENTS =================
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const profileMenu = document.getElementById("profileMenu");

const tutorButtons = document.querySelectorAll(".tutor-refer");
const referButtons = document.querySelectorAll(".refer-btn");

const tutorCard = document.getElementById("tutorial-card");
const referCard = document.getElementById("refer-card");

const tutorClose = document.getElementById("tutor-close");
const referClose = document.getElementById("reference-close");

// ================= MOBILE MENU =================
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileNav.classList.toggle("open");
});

// ================= PROFILE =================
function toggleProfileMenu(e) {
  e.stopPropagation();
  profileMenu.classList.toggle("open");
}

// ================= OPEN TUTOR =================
tutorButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    mobileNav.classList.remove("open");
    referCard.style.display = "none";

    tutorCard.style.display = "flex";
  });
});

// ================= OPEN REFERENCE =================
referButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    mobileNav.classList.remove("open");
    tutorCard.style.display = "none";

    referCard.style.display = "flex";
  });
});

// ================= CLOSE BUTTONS =================
tutorClose.addEventListener("click", () => {
  tutorCard.style.display = "none";
});

referClose.addEventListener("click", () => {
  referCard.style.display = "none";
});

// ================= CLICK OUTSIDE =================
document.addEventListener("click", () => {
  mobileNav.classList.remove("open");
  profileMenu.classList.remove("open");
});
