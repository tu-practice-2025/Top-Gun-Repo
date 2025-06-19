document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleForm");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const formTitle = document.getElementById("formTitle");
  const formSubtitle = document.getElementById("formSubtitle");

  let isLoginMode = true;

  toggleButton.addEventListener("click", function () {
    isLoginMode = !isLoginMode;

    if (isLoginMode) {
      // Switch to login
      loginForm.classList.add("active");
      registerForm.classList.remove("active");
      formTitle.textContent = "Добре дошли!";
      formSubtitle.textContent = "";
    } else {
      // Switch to register
      registerForm.classList.add("active");
      loginForm.classList.remove("active");
      formTitle.textContent = "Присъедини с към нас!";
      formSubtitle.textContent = "Създай своя акаунт";
    }
  });

  // Form submissions
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Успешен вход");
    // Add your login logic here
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Успешна регистрация");
    // Add your registration logic here
  });

  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      const response = await fetch("https://localhost:7121/api/auth/login", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        data = await response.json();
        userId = data.userId;
        userEmail = data.email;
        userName = data.name;

        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("userName", userName);

        window.location.href = "homeScreen.html";
      } else {
        const result = await response.json();
        alert(result.message || "Грешка при вход");
      }
    });

  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);

      const response = await fetch("https://localhost:7121/api/auth/register", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "login.html";
      } else {
        const result = await response.json();
        alert(result.message || "Грешка при регистрация");
      }
    });
});

function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const numberOfParticles = 50;

  for (let i = 0; i < numberOfParticles; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Toggle between login and register forms
function toggleForm() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const toggleBtn = document.getElementById("toggle-btn");
  const formTitle = document.getElementById("form-title");

  if (loginForm.classList.contains("active")) {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");
    toggleBtn.classList.add("rotate");
    formTitle.textContent = "Регистрация";
  } else {
    registerForm.classList.remove("active");
    loginForm.classList.add("active");
    toggleBtn.classList.remove("rotate");
    formTitle.textContent = "Вход";
  }
}

// Initialize particles when page loads
window.addEventListener("load", createParticles);
