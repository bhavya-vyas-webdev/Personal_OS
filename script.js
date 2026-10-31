// Make the DIV element draggable:
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("notes"));
dragElement(document.getElementById("grandslams"));
dragElement(document.getElementById("weather"));
dragElement(document.getElementById("stopwatch"));

// Step 1: Define a function called `dragElement` that makes an HTML element draggable.
function dragElement(element) {
  // Step 2: Set up variables to keep track of the element's position.
  var initialX = 0;
  var initialY = 0;
  var currentX = 0;
  var currentY = 0;

  // Step 3: Check if there is a special header element associated with the draggable element.
  if (document.getElementById(element.id + "header")) {
    // Step 4: If present, assign the `dragMouseDown` function to the header's `onmousedown` event.
    // This allows you to drag the window around by its header.
    document.getElementById(element.id + "header").onmousedown = startDragging;
  } else {
    // Step 5: If not present, assign the function directly to the draggable element's `onmousedown` event.
    // This allows you to drag the window by holding down anywhere on the window.
    element.onmousedown = startDragging;
  }

  // Step 6: Define the `startDragging` function to capture the initial mouse position and set up event listeners.
  function startDragging(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 7: Get the mouse cursor position at startup.
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 8: Set up event listeners for mouse movement (`elementDrag`) and mouse button release (`closeDragElement`).
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  // Step 9: Define the `elementDrag` function to calculate the new position of the element based on mouse movement.
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // Step 10: Calculate the new cursor position.
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    // Step 11: Update the element's new position by modifying its `top` and `left` CSS properties.
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  // Step 12: Define the `stopDragging` function to stop tracking mouse movement by removing the event listeners.
  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

//Opening and closing the welcome screen
var welcomeScreen = document.querySelector("#welcome")
var windowZIndex = 0

function updateWelcomeDetails() {
  var today = new Date();
  var birthdayMonth = 8;
  var birthdayDay = 13;
  var age = today.getFullYear() - 2013;
  if (
    today.getMonth() < birthdayMonth ||
    (today.getMonth() === birthdayMonth && today.getDate() < birthdayDay)
  ) {
    age -= 1;
  }

  var schoolYear = today.getFullYear();
  var schoolYearStart = new Date(schoolYear, 7, 12);
  if (today < schoolYearStart) {
    schoolYear -= 1;
  }
  var grade = 7 + schoolYear - 2026;
  var gradeSuffix = grade % 100 >= 11 && grade % 100 <= 13
    ? "th"
    : ({ 1: "st", 2: "nd", 3: "rd" }[grade % 10] || "th");
  var dateText = today.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  }) + "/" + String(today.getFullYear()).slice(-2);

  document.querySelector("#welcomeage").textContent = age;
  document.querySelector("#welcomeasof").textContent = dateText;
  document.querySelector("#welcomegrade").textContent = grade + gradeSuffix;
}

updateWelcomeDetails();
setInterval(updateWelcomeDetails, 60000);

function bringWindowToFront(element) {
  windowZIndex += 1
  element.style.zIndex = windowZIndex
}

document.querySelectorAll(".window").forEach((element) => {
  element.addEventListener("click", () => bringWindowToFront(element))
});
bringWindowToFront(welcomeScreen)

function closeWindow(element) {
  element.style.display = "none"
}
function openWindow(element) {
  element.style.display = "block"
  bringWindowToFront(element)
}
var welcomeScreenClose = document.querySelector("#welcomeclose")
var welcomeScreenOpen = document.querySelector("#welcomeopen")

welcomeScreenClose.addEventListener("click", function() {
  closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
  openWindow(welcomeScreen);
});

var notesScreen = document.querySelector("#notes")
var notesScreenOpen = document.querySelector("#notesopen")
var notesScreenClose = document.querySelector("#notesclose")
var notesContent = document.querySelector("#notescontent")
var notesClear = document.querySelector("#notesclear")
var savedNotes = localStorage.getItem("alcarazOSNotes")

notesContent.value = savedNotes || ""
notesContent.addEventListener("input", () => {
  localStorage.setItem("alcarazOSNotes", notesContent.value)
});
notesClear.addEventListener("click", () => {
  notesContent.value = "";
  localStorage.removeItem("alcarazOSNotes");
});
notesScreenOpen.addEventListener("click", () => openWindow(notesScreen));
notesScreenClose.addEventListener("click", () => closeWindow(notesScreen));

var grandslamsScreen = document.querySelector("#grandslams")
var grandslamsScreenOpen = document.querySelector("#grandslamsopen")
var grandslamsScreenClose = document.querySelector("#grandslamsclose")

function updateNextGrandSlam() {
  var tournaments = [
    { name: "Australian Open", month: 0, day: 14 },
    { name: "French Open", month: 4, day: 25 },
    { name: "Wimbledon", month: 5, day: 29 },
    { name: "US Open", month: 7, day: 24 },
  ];
  var today = new Date();
  today.setHours(0, 0, 0, 0);

  for (var year = today.getFullYear(); year <= today.getFullYear() + 1; year++) {
    for (var tournament of tournaments) {
      var startDate = new Date(year, tournament.month, tournament.day);
      if (startDate >= today) {
        document.querySelector("#grandslamsmessage").textContent =
          "Look for " + tournament.name + "!";
        return;
      }
    }
  }
}

grandslamsScreenOpen.addEventListener("click", () => {
  updateNextGrandSlam();
  openWindow(grandslamsScreen);
});
grandslamsScreenClose.addEventListener("click", () => closeWindow(grandslamsScreen));

var weatherScreen = document.querySelector("#weather")
var weatherScreenOpen = document.querySelector("#weatheropen")
var weatherScreenClose = document.querySelector("#weatherclose")
var weatherStatus = document.querySelector("#weatherstatus")
var weatherDetails = document.querySelector("#weatherdetails")

function describeWeather(code) {
  var descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Freezing fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Light freezing drizzle",
    57: "Freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    85: "Light snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Current conditions";
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 600000,
    });
  });
}

async function loadLocalWeather() {
  weatherStatus.textContent = "Getting your location...";
  weatherDetails.hidden = true;

  if (!navigator.geolocation) {
    weatherStatus.textContent = "Location access is not available in this browser.";
    return;
  }

  try {
    var position = await getCurrentPosition();
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
    weatherUrl.search = new URLSearchParams({
      latitude: latitude,
      longitude: longitude,
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
      timezone: "auto",
    });
    var response = await fetch(weatherUrl);
    if (!response.ok) {
      throw new Error("Weather service returned " + response.status);
    }

    var data = await response.json();
    if (!data.current || !data.current_units) {
      throw new Error("Weather response is missing current conditions.");
    }

    document.querySelector("#weathercondition").textContent =
      describeWeather(data.current.weather_code);
    document.querySelector("#weathertemperature").textContent =
      "Temperature: " + data.current.temperature_2m + data.current_units.temperature_2m;
    document.querySelector("#weatherfeelslike").textContent =
      "Feels like: " + data.current.apparent_temperature + data.current_units.apparent_temperature;
    document.querySelector("#weatherhumidity").textContent =
      "Humidity: " + data.current.relative_humidity_2m + data.current_units.relative_humidity_2m;
    document.querySelector("#weatherwind").textContent =
      "Wind: " + data.current.wind_speed_10m + " " + data.current_units.wind_speed_10m;
    weatherStatus.textContent =
      "Near " + latitude.toFixed(2) + ", " + longitude.toFixed(2) +
      " · Updated " + new Date(data.current.time).toLocaleTimeString();
    weatherDetails.hidden = false;
  } catch (error) {
    if (error && typeof error.code === "number") {
      if (error.code === 1) {
        weatherStatus.textContent = "Location permission was denied. Allow location access and try again.";
      } else if (error.code === 2) {
        weatherStatus.textContent = "Your location could not be determined. Try again.";
      } else {
        weatherStatus.textContent = "Location lookup timed out. Try again.";
      }
      return;
    }

    console.error("Could not load local weather:", error);
    weatherStatus.textContent = "Weather could not be loaded. Check your connection and try again.";
  }
}

weatherScreenOpen.addEventListener("click", () => {
  openWindow(weatherScreen);
  loadLocalWeather();
});
weatherScreenClose.addEventListener("click", () => closeWindow(weatherScreen));
document.querySelector("#weatherrefresh").addEventListener("click", loadLocalWeather);

var stopwatchScreen = document.querySelector("#stopwatch")
var stopwatchScreenOpen = document.querySelector("#stopwatchopen")
var stopwatchScreenClose = document.querySelector("#stopwatchclose")
var stopwatchDisplay = document.querySelector("#stopwatchdisplay")
var stopwatchStart = document.querySelector("#stopwatchstart")
var stopwatchPause = document.querySelector("#stopwatchpause")
var stopwatchReset = document.querySelector("#stopwatchreset")
var stopwatchElapsed = 0
var stopwatchStartedAt = null
var stopwatchInterval = null

function renderStopwatch() {
  var elapsed = stopwatchElapsed;
  if (stopwatchStartedAt !== null) {
    elapsed += performance.now() - stopwatchStartedAt;
  }

  var centiseconds = Math.floor(elapsed / 10);
  var hours = Math.floor(centiseconds / 360000);
  var minutes = Math.floor((centiseconds % 360000) / 6000);
  var seconds = Math.floor((centiseconds % 6000) / 100);
  var fraction = centiseconds % 100;
  stopwatchDisplay.textContent =
    String(hours).padStart(2, "0") + ":" +
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0") + "." +
    String(fraction).padStart(2, "0");
}

stopwatchScreenOpen.addEventListener("click", () => openWindow(stopwatchScreen));
stopwatchScreenClose.addEventListener("click", () => closeWindow(stopwatchScreen));
stopwatchStart.addEventListener("click", () => {
  if (stopwatchStartedAt !== null) {
    return;
  }

  stopwatchStartedAt = performance.now();
  stopwatchInterval = setInterval(renderStopwatch, 10);
  stopwatchStart.disabled = true;
  stopwatchPause.disabled = false;
  renderStopwatch();
});
stopwatchPause.addEventListener("click", () => {
  if (stopwatchStartedAt === null) {
    return;
  }

  stopwatchElapsed += performance.now() - stopwatchStartedAt;
  stopwatchStartedAt = null;
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchStart.disabled = false;
  stopwatchPause.disabled = true;
  renderStopwatch();
});
stopwatchReset.addEventListener("click", () => {
  clearInterval(stopwatchInterval);
  stopwatchInterval = null;
  stopwatchElapsed = 0;
  stopwatchStartedAt = null;
  stopwatchStart.disabled = false;
  stopwatchPause.disabled = true;
  renderStopwatch();
});
  