document.addEventListener('DOMContentLoaded', function() {

    const toggleButton = document.getElementById("toggleForm");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    toggleButton.addEventListener("click", () => {
        loginForm.classList.toggle("active");
        registerForm.classList.toggle("active");
        toggleButton.classList.toggle("rotate");
    });
    
    document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const formData = new FormData(this);

    const response = await fetch("https://localhost:7121/api/auth/login", {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    if (response.ok) {
        data = await response.json();
        userId = data.userId;
        userEmail = data.email;
        userName = data.name;

        sessionStorage.setItem('userId', userId);
        sessionStorage.setItem('userEmail', userEmail);
        sessionStorage.setItem('userName', userName);


        window.location.href = "homeScreen.html"; 
    } else {
        const result = await response.json();
        alert(result.message || "Login failed");
    }
    });

    document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const formData = new FormData(this);

    const response = await fetch("https://localhost:7121/api/auth/register", {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    if (response.ok) {
        window.location.href = "login.html"; 
    } else {
        const result = await response.json();
        alert(result.message || "Registration failed");
    }
    });
});

