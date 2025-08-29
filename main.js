let currentId = 0;
const currentEventsContainer = document.querySelector(".current-events");
// Is First Time Run Code ? Load Value From Array existedElements
if (localStorage.getItem("hasCodeRunBefore") === null) {
  currentId = 0;
  runOnceCode(); // Display Ready Elements
  localStorage.setItem("hasCodeRunBefore", "true");
}

function runOnceCode() {
  // Example Of Ready Events
  const existedElements = [
    {
      id: `event-${currentId++}`,
      name: "Sprint",
      by: "Organizer",
      on: "2025-11-02", // Use YYYY-MM-DD format for date input compatibility
    },
    {
      id: `event-${currentId++}`,
      name: "Cars",
      by: "Elon",
      on: "2025-09-09", // Use YYYY-MM-DD format for date input compatibility
    },
  ];
  localStorage.setItem("currentEvents", JSON.stringify(existedElements));
}

// Change Theme Mode
document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.querySelector("input[type='checkbox']");
  const body = document.body;

  // Check for user's preferred theme in local storage or system preference
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  // Check on local Theme and Applay it or System Theme Mode
  if (savedTheme) {
    body.classList.add(savedTheme);
    if (savedTheme === "dark-mode") {
      darkModeToggle.checked = true;
    } else {
      darkModeToggle.checked = false;
    } // User System Theme
  } else if (prefersDarkMode) {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
  }
  // OnClick Theme Mode
  darkModeToggle.addEventListener("click", () => {
    if (darkModeToggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark-mode");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light-mode");
    }
  });
  // Render Events
  loadEventsFromLocalStorage();
});

// Delete Endded Events
window.onload = () => {
  setTimeout(() => {
    document.querySelectorAll(".time-left").forEach((eventTime) => {
      if (eventTime.lastElementChild.textContent === "Event Passed") {
        removeFromLocalStorage(eventTime);
        eventTime.parentElement.remove();
      }
    });
  }, 1000);
};

// Elements
const nameInput = document.getElementById("eventName");
const organizerInput = document.getElementById("eventOrganizer");
const dateInput = document.getElementById("eventDate");
const nameAlert = document.querySelector(".alert-name");
const organizerAlert = document.querySelector(".alert-organizer");
const dateAlert = document.querySelector(".alert-date");

//! OnInput Check
//? Display Alert When Value Is Empty
function displayAlert(alertElement) {
  alertElement.classList.add("active");
  alertElement.textContent = "Can't Be Empty";
}
// Display Max Length When Length Is Reached
function displayMaxLengthAlert(alertElement, length, type) {
  alertElement.classList.add("active");
  alertElement.textContent = `Event ${type} Characters limit: ${length} / 18`;
}
// Hide Max Length When Length Is Not Reached
function hideMaxLengthAlert(alertElement) {
  alertElement.classList.remove("active");
}

// Check Value oninput
function onInputCheck(element, alertElement, type) {
  let value = element.value.trim();
  // Check On Each Of Input Value
  if (value.length > 18) {
    displayMaxLengthAlert(alertElement, value.length, type);
    return;
  } else {
    hideMaxLengthAlert(alertElement);
  }
}
//? Call CheckValue oninput Function
nameInput.oninput = () => onInputCheck(nameInput, nameAlert, "Name");
organizerInput.oninput = () =>
  onInputCheck(organizerInput, organizerAlert, "Organizer");

//! Main Event => Form Submit
document.forms[0].addEventListener("submit", (event) => {
  event.preventDefault();
  let valueOfName = nameInput.value.trim();
  let valueOfOrgan = organizerInput.value.trim();
  let valueOfDate = dateInput.value.trim();
  // Check On Each Of Input Value
  // Name Input
  if (valueOfName === "") {
    displayAlert(nameAlert);
    return;
  }
  if (valueOfName.length > 18) {
    return;
  }
  // Organizer Input
  if (valueOfOrgan === "") {
    displayAlert(organizerAlert);
    return;
  }
  if (valueOfOrgan.length > 18) {
    return;
  }
  // Date Input
  if (valueOfDate === "") {
    displayAlert(dateAlert);
    return;
  } else {
    dateAlert.classList.remove("active");
  }
  // Create Elements Function
  currentEventsContainer.appendChild(
    createEvent(`event-${currentId}`, valueOfName, valueOfOrgan, valueOfDate)
  );
  // Remove Value From Inputs
  nameInput.value = "";
  organizerInput.value = "";
  dateInput.value = "";

  // Add To Local Storage
  saveToLocalStorage(
    `event-${currentId}`,
    valueOfName,
    valueOfOrgan,
    valueOfDate
  );
});

// Save To Local Storage Function
function saveToLocalStorage(id, name, organizer, date) {
  let array = JSON.parse(localStorage.getItem("currentEvents")) || [];
  let newEvent = {
    id: id,
    name: name,
    by: organizer,
    on: date,
  };
  array.push(newEvent);
  localStorage.setItem("currentEvents", JSON.stringify(array));
  currentId++;
}
// Delete From Local Storage Function
function removeFromLocalStorage(deleteButtonElement) {
  let array = JSON.parse(localStorage.getItem("currentEvents")) || [];
  const eventIdToDelete = deleteButtonElement.parentElement.id;
  let updatedArray = array.filter((event) => event.id !== eventIdToDelete);
  localStorage.setItem("currentEvents", JSON.stringify(updatedArray));
}

function loadEventsFromLocalStorage() {
  let savedEvents = JSON.parse(localStorage.getItem("currentEvents"));
  if (!savedEvents) return;
  for (let i = 0; i < savedEvents.length; i++) {
    // Create Elements Function
    currentEventsContainer.appendChild(
      createEvent(
        savedEvents[i].id,
        savedEvents[i].name,
        savedEvents[i].by,
        savedEvents[i].on
      )
    );
  }
}


//! Delete Events Button
currentEventsContainer.addEventListener("click", (event) => {
  let deleteBtn = event.target.closest(".delete");
  if (!deleteBtn) return;
  // Update Deleting In Local Storage
  removeFromLocalStorage(deleteBtn);
  deleteBtn.parentElement.remove();
});

function createEvent(id, name, organizer, date) {
  // Create Elements
  const $cardDiv = document.createElement("div");
  const $nameH3 = document.createElement("h3");
  const $organizerDiv = document.createElement("div");
  const $orgSpan1 = document.createElement("span");
  const $orgSpan2 = $orgSpan1.cloneNode();
  const $dateDiv = document.createElement("div");
  const $dateSpan1 = document.createElement("span");
  const $dateSpan2 = $dateSpan1.cloneNode();
  const $timeLeftDiv = document.createElement("div");
  const $timeLeftSpan1 = document.createElement("span");
  const $timeLeftSpan2 = $timeLeftSpan1.cloneNode();
  const $deleteBtn = document.createElement("button");
  // Adding Classes To Elements
  $cardDiv.classList.add("card");
  $organizerDiv.classList.add("by");
  $dateDiv.classList.add("on");
  $timeLeftDiv.classList.add("time-left");
  $deleteBtn.classList.add("delete");
  // Adding Info To Elements
  $nameH3.textContent =
    name.toString().charAt(0).toUpperCase() + name.toString().slice(1);
  $orgSpan1.textContent = "By";
  $orgSpan2.textContent =
    organizer.toString().charAt(0).toUpperCase() +
    organizer.toString().slice(1);
  $dateSpan1.textContent = "On";
  $dateSpan2.textContent = date;
  $timeLeftSpan1.textContent = "Time Left";
  $timeLeftSpan2.textContent = "Loading..."; // Function Gets The Remain Time
  $deleteBtn.textContent = "Delete";
  // Append Every Child To His Parent
  $organizerDiv.appendChild($orgSpan1);
  $organizerDiv.appendChild($orgSpan2);
  $dateDiv.appendChild($dateSpan1);
  $dateDiv.appendChild($dateSpan2);
  $timeLeftDiv.appendChild($timeLeftSpan1);
  $timeLeftDiv.appendChild($timeLeftSpan2);
  // Append Every Parent & Child To Container
  $cardDiv.appendChild($nameH3);
  $cardDiv.appendChild($organizerDiv);
  $cardDiv.appendChild($dateDiv);
  $cardDiv.appendChild($timeLeftDiv);
  $cardDiv.appendChild($deleteBtn);
  // Set dataset ID for deletion
  $cardDiv.id = id;
  // Get Remain Time Every Second
  setInterval(() => {
    $timeLeftSpan2.textContent = getTimeLeft(date);
  }, 1000);
  // Return Final Event Element
  return $cardDiv;
}

// Calculating The Time
function getTimeLeft(eventDateString) {
  const eventDate = new Date(eventDateString + "T00:00:00");
  const now = new Date();
  const timeLeft = eventDate - now;
  if (timeLeft < 0) return "Event Passed";
  // Get Remaining Time
  let totalSeconds = Math.floor(timeLeft / 1000);
  const seconds = totalSeconds % 60;
  let totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  let totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  // Update Time Remain
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
