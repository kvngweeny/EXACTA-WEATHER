const apiKey = config.API_KEY;

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");

const temperature = document.getElementById("temperature");
const weather = document.getElementById("weather");
const dateEl = document.getElementById("date");
const locationEl = document.getElementById("location");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const pressure = document.getElementById("pressure");
const feelsLike = document.getElementById("feels-like");
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");

const forecastContainer = document.getElementById("forecast-container");

/* SEARCH WEATHER */
async function getWeather(city) {
  try {
    // CURRENT WEATHER
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const weatherResponse = await fetch(weatherURL);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod !== 200) {
      alert("City not found!");
      return;
    }

    // 5 DAY FORECAST
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    updateUI(weatherData);
    updateForecast(forecastData);
  } catch (error) {
    console.log(error);
    alert("Something went wrong!");
  }
}

/* UPDATE UI */
function updateUI(data) {
  temperature.innerHTML = `${Math.round(data.main.temp)}°C`;

  weather.innerHTML = data.weather[0].description;

  const now = new Date();

  dateEl.innerHTML = now.toDateString();

  locationEl.innerHTML = `
    <i class="fa-solid fa-location-dot"></i>
    ${data.name}, ${data.sys.country}
  `;

  humidity.innerHTML = `${data.main.humidity}%`;

  wind.innerHTML = `${data.wind.speed} km/h`;

  pressure.innerHTML = `${data.main.pressure} hPa`;

  feelsLike.innerHTML = `${Math.round(data.main.feels_like)}°C`;

  sunrise.innerHTML = formatTime(data.sys.sunrise);

  sunset.innerHTML = formatTime(data.sys.sunset);
}

/* FORECAST */
function updateForecast(data) {
  forecastContainer.innerHTML = "";

  const dailyData = data.list.filter((item) =>
    item.dt_txt.includes("12:00:00"),
  );

  dailyData.forEach((day) => {
    const date = new Date(day.dt_txt);

    const forecastItem = document.createElement("div");

    forecastItem.classList.add("forecast-item");

    forecastItem.innerHTML = `
      <p>${date.toDateString().slice(0, 10)}</p>
      <p>${Math.round(day.main.temp)}°C</p>
      <p>${day.weather[0].main}</p>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}

/* TIME FORMAT */
function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* SEARCH BUTTON */
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city !== "") {
    getWeather(city);
  }
});

/* ENTER KEY SEARCH */
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

/* DEFAULT CITY */
getWeather("London");

/* FULLSCREEN VIDEO */
const video = document.getElementById("bg-video");

video.muted = true;
video.loop = true;

video.play().catch((error) => {
  console.log("Autoplay blocked:", error);
});
