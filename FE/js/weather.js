function getWeatherForecast() {
  fetch("https://localhost:7121/WeatherForecast") // Replace with your actual API URL
    .then((response) => response.json())
    .then((data) => {
      const forecastContainer = document.getElementById("forecast-container");
      forecastContainer.innerHTML = ""; // Clear previous forecast

      data.forEach((forecast) => {
        const forecastDiv = document.createElement("div");
        forecastDiv.classList.add("forecast-item");
        forecastDiv.innerHTML = `
                                <h3>${forecast.date}</h3>
                                <p class="temperature">${forecast.temperatureC}°C</p>
                                <p>${forecast.summary}</p>
                            `;
        forecastContainer.appendChild(forecastDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      alert("Failed to load weather data.");
    });
}

// Redirect to the About page
function redirectToAboutPage() {
  window.location.href = "about.html"; // Redirect to about.html page
}
