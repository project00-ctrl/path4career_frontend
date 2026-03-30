const searchInput = document.getElementById("searchInput");
const levelFilter = document.getElementById("levelFilter");
const courseCards = document.querySelectorAll(".course-card");

function filterCourses() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedLevel = levelFilter.value;

  courseCards.forEach(card => {
    const title = card.dataset.title.toLowerCase();
    const level = card.dataset.level;
    const keywords = card.dataset.keywords.toLowerCase();

    const matchesSearch =
      searchText === "" ||
      title.includes(searchText) ||
      keywords.includes(searchText);

    const matchesLevel =
      selectedLevel === "all" || level === selectedLevel;

    card.style.display =
      matchesSearch && matchesLevel ? "flex" : "none";
  });
}

// Live typing
searchInput.addEventListener("input", filterCourses);

// Enter key support
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    filterCourses();
  }
});

// Level filter
levelFilter.addEventListener("change", filterCourses);
