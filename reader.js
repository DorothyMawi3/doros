
/* Doros - Reading Font Size Controls */

const increaseButton = document.querySelector("#increase-font");
const decreaseButton = document.querySelector("#decrease-font");
const readingText = document.querySelector(".reading-content p");

// Load the reader's saved font size
const savedFontSize = Number(localStorage.getItem("dorosFontSize"));

let fontSize =
  savedFontSize >= 14 && savedFontSize <= 30
    ? savedFontSize
    : 18;

// Apply the saved font size
readingText.style.fontSize = fontSize + "px";

// Increase font size
increaseButton.addEventListener("click", () => {
  if (fontSize < 30) {
    fontSize += 2;
    readingText.style.fontSize = fontSize + "px";
    localStorage.setItem("dorosFontSize", fontSize);
  }
});

// Decrease font size
decreaseButton.addEventListener("click", () => {
  if (fontSize > 14) {
    fontSize -= 2;
    readingText.style.fontSize = fontSize + "px";
    localStorage.setItem("dorosFontSize", fontSize);
  }
});


/* Doros - Bookmark Feature */

// Find the bookmark button
const bookmarkButton = document.querySelector("#bookmark-button");

// Check if Day 1 was previously bookmarked
let isBookmarked =
  localStorage.getItem("dorosBookmarkDay1") === "true";

// Display the saved bookmark state
function updateBookmarkButton() {
  bookmarkButton.textContent = isBookmarked
    ? "★ Bookmarked"
    : "☆ Save Bookmark";

  bookmarkButton.setAttribute(
    "aria-pressed",
    String(isBookmarked)
  );
}

// Show the correct state when the page loads
updateBookmarkButton();

// Save or remove the bookmark when clicked
bookmarkButton.addEventListener("click", () => {
  isBookmarked = !isBookmarked;

  localStorage.setItem(
    "dorosBookmarkDay1",
    String(isBookmarked)
  );

  updateBookmarkButton();
});


/* Doros - Daily Reading Navigation */

const previousDayButton = document.querySelector("#previous-day");
const nextDayButton = document.querySelector("#next-day");
const currentDayLabel = document.querySelector("#current-day");
const readingTitle = document.querySelector(".reading-content h2");

let currentDay = 1;
const totalDays = 365;

function updateReadingDay() {
  currentDayLabel.textContent =
    `Day ${currentDay} of ${totalDays}`;

  readingTitle.textContent =
    currentDay === 1
      ? "Day 1 — A New Beginning"
      : `Day ${currentDay} — Coming Soon`;

  previousDayButton.disabled = currentDay === 1;
  nextDayButton.disabled = currentDay === totalDays;
}

previousDayButton.addEventListener("click", () => {
  if (currentDay > 1) {
    currentDay--;
    updateReadingDay();
  }
});

nextDayButton.addEventListener("click", () => {
  if (currentDay < totalDays) {
    currentDay++;
    updateReadingDay();
  }
});

updateReadingDay();
