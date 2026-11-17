
/* ==========================================
   DOROS — COMPETITION DEMO READER
   Step 7G

   Seven selected readings
   Full reading experience
   Separate demo reading history
========================================== */


/* ==========================================
   1. AVAILABLE DEMO READINGS
========================================== */

const availableDays = Object.keys(dorosBook)
  .map(Number)
  .filter((day) =>
    Number.isInteger(day) &&
    day >= 1 &&
    day <= 366 &&
    dorosBook[day] &&
    Array.isArray(dorosBook[day].paragraphs)
  )
  .sort((a, b) => a - b);

const totalDays = availableDays.length;

if (totalDays === 0) {
  throw new Error(
    "DOROS demo has no available readings."
  );
}

function isAvailableDay(day) {
  return availableDays.includes(day);
}


/* ==========================================
   2. READING FONT SIZE CONTROLS
========================================== */

const increaseButton = document.querySelector(
  "#increase-font"
);

const decreaseButton = document.querySelector(
  "#decrease-font"
);

const bookText = document.querySelector(
  "#book-text"
);

const savedFontSize = Number(
  localStorage.getItem("dorosFontSize")
);

let fontSize =
  savedFontSize >= 14 && savedFontSize <= 30
    ? savedFontSize
    : 18;

function updateFontSize() {
  bookText.style.fontSize = fontSize + "px";
}

increaseButton.addEventListener("click", () => {
  if (fontSize < 30) {
    fontSize += 2;
    updateFontSize();

    localStorage.setItem(
      "dorosFontSize",
      String(fontSize)
    );
  }
});

decreaseButton.addEventListener("click", () => {
  if (fontSize > 14) {
    fontSize -= 2;
    updateFontSize();

    localStorage.setItem(
      "dorosFontSize",
      String(fontSize)
    );
  }
});

updateFontSize();


/* ==========================================
   3. DAILY READING NAVIGATION
========================================== */

const previousDayButton = document.querySelector(
  "#previous-day"
);

const nextDayButton = document.querySelector(
  "#next-day"
);

const currentDayLabel = document.querySelector(
  "#current-day"
);

const readingTitle = document.querySelector(
  ".reading-content h2"
);

const currentDayKey = "dorosDemoCurrentDay";

const savedDay = Number(
  localStorage.getItem(currentDayKey)
);

let currentDay = isAvailableDay(savedDay)
  ? savedDay
  : availableDays[0];

function getCurrentDayIndex() {
  return availableDays.indexOf(currentDay);
}


/* ==========================================
   4. JUMP TO DAY SELECTOR
========================================== */

const jumpToDaySelect = document.querySelector(
  "#jump-to-day"
);

const goToDayButton = document.querySelector(
  "#go-to-day"
);

function populateDaySelector() {
  jumpToDaySelect.replaceChildren();

  availableDays.forEach((day) => {
    const option = document.createElement("option");

    option.value = String(day);
    option.textContent = `Day ${day}`;

    jumpToDaySelect.appendChild(option);
  });

  jumpToDaySelect.value = String(currentDay);
}

goToDayButton.addEventListener("click", () => {
  const selectedDay = Number(
    jumpToDaySelect.value
  );

  if (isAvailableDay(selectedDay)) {
    currentDay = selectedDay;
    displayReadingContent();

    document.querySelector(
      ".reading-content"
    ).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
});


/* ==========================================
   5. MULTIPLE BOOKMARKS
========================================== */

const bookmarkButton = document.querySelector(
  "#bookmark-button"
);

const bookmarksKey = "dorosDemoBookmarks";

function loadBookmarks() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(bookmarksKey) || "[]"
    );

    if (Array.isArray(saved)) {
      return saved.filter((day) =>
        Number.isInteger(day) &&
        isAvailableDay(day)
      );
    }
  } catch (error) {
    console.warn(
      "Unable to load demo bookmarks.",
      error
    );
  }

  return [];
}

let bookmarkedDays = loadBookmarks();

function updateBookmarkButton() {
  const isBookmarked = bookmarkedDays.includes(
    currentDay
  );

  bookmarkButton.textContent = isBookmarked
    ? "★ Bookmarked"
    : "☆ Save Bookmark";

  bookmarkButton.setAttribute(
    "aria-pressed",
    String(isBookmarked)
  );
}

bookmarkButton.addEventListener("click", () => {
  if (bookmarkedDays.includes(currentDay)) {
    bookmarkedDays = bookmarkedDays.filter(
      (day) => day !== currentDay
    );
  } else {
    bookmarkedDays.push(currentDay);
  }

  localStorage.setItem(
    bookmarksKey,
    JSON.stringify(bookmarkedDays)
  );

  updateBookmarkButton();
});


/* ==========================================
   6. READING COMPLETION JOURNAL
========================================== */

const readingDateInput = document.querySelector(
  "#reading-date"
);

const markAsReadButton = document.querySelector(
  "#mark-as-read"
);

const readingStatus = document.querySelector(
  "#reading-status"
);

const removeReadDateButton = document.querySelector(
  "#remove-read-date"
);

const readingRecordsKey = "dorosDemoReadingRecords";

function loadReadingRecords() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(readingRecordsKey) || "{}"
    );

    if (
      saved &&
      typeof saved === "object" &&
      !Array.isArray(saved)
    ) {
      return saved;
    }
  } catch (error) {
    console.warn(
      "Could not load demo reading records.",
      error
    );
  }

  return {};
}

const readingRecords = loadReadingRecords();

function formatReadingDate(dateString) {
  const [year, month, day] = dateString
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getTodayDate() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(
    today.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    today.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function updateReadingJournal() {
  const savedDate = readingRecords[currentDay];

  if (savedDate) {
    readingDateInput.value = savedDate;

    readingStatus.textContent =
      `✓ Day ${currentDay} completed on ` +
      formatReadingDate(savedDate) +
      ".";

    markAsReadButton.textContent =
      "✓ Marked as Read";

    markAsReadButton.classList.add("is-read");

    markAsReadButton.setAttribute(
      "aria-pressed",
      "true"
    );

    removeReadDateButton.hidden = false;
  } else {
    readingDateInput.value = "";

    readingStatus.textContent =
      "Not marked as read yet.";

    markAsReadButton.textContent =
      "Mark as Read";

    markAsReadButton.classList.remove("is-read");

    markAsReadButton.setAttribute(
      "aria-pressed",
      "false"
    );

    removeReadDateButton.hidden = true;
  }
}


/* ==========================================
   7. READING PROGRESS TRACKER
========================================== */

const progressText = document.querySelector(
  "#progress-text"
);

const progressBar = document.querySelector(
  "#reading-progress-bar"
);

const progressPercentage = document.querySelector(
  "#progress-percentage"
);

function updateReadingProgress() {
  const completedDays = availableDays.filter(
    (day) => Boolean(readingRecords[day])
  ).length;

  const percentage =
    (completedDays / totalDays) * 100;

  progressText.textContent =
    `${completedDays} of ${totalDays} demo readings completed`;

  progressBar.value = completedDays;
  progressBar.max = totalDays;

  progressPercentage.textContent =
    `${percentage.toFixed(2)}% completed`;
}

markAsReadButton.addEventListener("click", () => {
  const selectedDate =
    readingDateInput.value || getTodayDate();

  readingRecords[currentDay] = selectedDate;

  localStorage.setItem(
    readingRecordsKey,
    JSON.stringify(readingRecords)
  );

  updateReadingJournal();
  updateReadingProgress();
});

removeReadDateButton.addEventListener(
  "click",
  () => {
    delete readingRecords[currentDay];

    localStorage.setItem(
      readingRecordsKey,
      JSON.stringify(readingRecords)
    );

    updateReadingJournal();
    updateReadingProgress();
  }
);


/* ==========================================
   8. DISPLAY DAILY READING CONTENT
========================================== */

function displayReadingContent() {
  const entry = dorosBook[currentDay];

  bookText.replaceChildren();

  readingTitle.textContent =
    `Day ${currentDay} — ${entry.title}`;

  entry.paragraphs.forEach((paragraphText) => {
    const paragraph = document.createElement("p");

    paragraph.textContent = paragraphText;

    bookText.appendChild(paragraph);
  });

  const currentIndex = getCurrentDayIndex();

  currentDayLabel.textContent =
    `Day ${currentDay} — Demo Reading ` +
    `${currentIndex + 1} of ${totalDays}`;

  localStorage.setItem(
    currentDayKey,
    String(currentDay)
  );

  previousDayButton.disabled =
    currentIndex === 0;

  nextDayButton.disabled =
    currentIndex === totalDays - 1;

  jumpToDaySelect.value = String(currentDay);

  updateBookmarkButton();
  updateReadingJournal();
  updateFontSize();
}


/* ==========================================
   9. PREVIOUS AND NEXT DAY BUTTONS
========================================== */

previousDayButton.addEventListener(
  "click",
  () => {
    const currentIndex = getCurrentDayIndex();

    if (currentIndex > 0) {
      currentDay = availableDays[currentIndex - 1];
      displayReadingContent();
    }
  }
);

nextDayButton.addEventListener("click", () => {
  const currentIndex = getCurrentDayIndex();

  if (currentIndex < totalDays - 1) {
    currentDay = availableDays[currentIndex + 1];
    displayReadingContent();
  }
});


/* ==========================================
   10. DOROS CHRISTMAS MUSIC PLAYER
========================================== */

const dorosAudio = document.querySelector(
  "#doros-audio"
);

const musicPlayPauseButton = document.querySelector(
  "#music-play-pause"
);

const musicVolumeSlider = document.querySelector(
  "#music-volume"
);

const musicStatus = document.querySelector(
  "#music-status"
);

const musicVolumeKey = "dorosMusicVolume";

const storedMusicVolume = localStorage.getItem(
  musicVolumeKey
);

const savedMusicVolume =
  storedMusicVolume === null
    ? 35
    : Number(storedMusicVolume);

const initialMusicVolume =
  Number.isFinite(savedMusicVolume) &&
  savedMusicVolume >= 0 &&
  savedMusicVolume <= 100
    ? savedMusicVolume
    : 35;

dorosAudio.volume = initialMusicVolume / 100;

musicVolumeSlider.value = String(
  initialMusicVolume
);

function updateMusicPlayer() {
  const isPlaying =
    !dorosAudio.paused &&
    !dorosAudio.ended;

  musicPlayPauseButton.textContent = isPlaying
    ? "❚❚ Pause Music"
    : "▶ Play Music";

  musicPlayPauseButton.classList.toggle(
    "is-playing",
    isPlaying
  );

  musicPlayPauseButton.setAttribute(
    "aria-label",
    isPlaying
      ? "Pause background music"
      : "Play background music"
  );

  musicStatus.textContent = isPlaying
    ? "Music is playing."
    : "Music is paused.";
}

musicPlayPauseButton.addEventListener(
  "click",
  async () => {
    if (!dorosAudio.paused) {
      dorosAudio.pause();
      return;
    }

    musicStatus.textContent = "Loading music...";

    try {
      await dorosAudio.play();
    } catch (error) {
      console.warn(
        "Unable to play DOROS music.",
        error
      );

      updateMusicPlayer();

      musicStatus.textContent =
        "Music is unavailable. Please check the audio file.";
    }
  }
);

musicVolumeSlider.addEventListener(
  "input",
  () => {
    const volume = Number(
      musicVolumeSlider.value
    );

    dorosAudio.volume = volume / 100;

    localStorage.setItem(
      musicVolumeKey,
      String(volume)
    );
  }
);

dorosAudio.addEventListener(
  "play",
  updateMusicPlayer
);

dorosAudio.addEventListener(
  "pause",
  updateMusicPlayer
);

dorosAudio.addEventListener(
  "ended",
  updateMusicPlayer
);

dorosAudio.addEventListener("error", () => {
  updateMusicPlayer();

  musicStatus.textContent =
    "Music could not be loaded. Check the audio file.";
});


/* ==========================================
   11. INITIALIZE DOROS DEMO
========================================== */

populateDaySelector();
displayReadingContent();
updateReadingProgress();
updateMusicPlayer();
