document.addEventListener('DOMContentLoaded', function() {
    
    document.getElementById("userForm").addEventListener("submit", async function (e) {
    e.preventDefault(); 

    const formData = new FormData(this);

    const response = await fetch("https://localhost:7121/api/auth/login", {
        method: "POST",
        body: formData,
        credentials: "include"
    });

    if (response.ok) {
        window.location.href = "homeScreen.html"; 
    } else {
        const result = await response.json();
        alert(result.message || "Login failed");
    }
    });
});