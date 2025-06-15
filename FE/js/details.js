document.addEventListener("DOMContentLoaded", () => {
    const API_BASE_URL = 'https://localhost:7121';
    const categorySelect = document.getElementById("category-select");

    const monthInput = document.getElementById("month");
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    if (month > 12) {
        month = 1;
        year += 1;
    }

    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    monthInput.value = formattedMonth;

    const selectedCategory = localStorage.getItem("selectedCategory");

    loadCategories();

    function loadCategories() {
        fetch(`${API_BASE_URL}/api/Categories/spending/3`)
            .then(response => response.json())
            .then(data => {
                categorySelect.innerHTML = ''; 

                const allOption = document.createElement("option");
                allOption.value = "All";
                allOption.textContent = "All categories";
                categorySelect.appendChild(allOption);

                data.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.name;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });

                if (selectedCategory) {
                    categorySelect.value = selectedCategory;
                } else {
                    categorySelect.value = "All";
                }
            })
            .catch(error => {
                console.error("Error with loading of categories:", error);
            });

            categorySelect.addEventListener("change", () => {
                const selected = categorySelect.value;
                localStorage.setItem("selectedCategory", selected);
                console.log("Selected category:", selected);
                loadAndRenderBalance();
            });
    }
});

async function loadAndRenderBalance() {
    const category = document.getElementById("category-select").value;
    let data = [];

    if (category === "All") {
        const response = await fetch(`${API_BASE_URL}/api/Categories/spending/3`);
        data = await response.json();
    } else {
        const response = await fetch(`${API_BASE_URL}/api/Categories/spending/3`);
        const allData = await response.json();
        const filtered = allData.find(item => item.name === category);
        if (filtered) {
            data = [filtered];
        }
    }

    const container = document.getElementById("balance-bars");
    container.innerHTML = "";

    data.forEach(item => {
        const percent = item.plannedAmount > 0 ? Math.min(100, (item.totalSpent / item.plannedAmount) * 100) : 0;

        const barWrapper = document.createElement("div");
        barWrapper.style.marginBottom = "20px";

        const label = document.createElement("div");
        label.textContent = `${item.name} - ${percent.toFixed(1)}%`;
        label.style.marginBottom = "5px";
        label.style.color = "#E2001A";
        label.style.fontWeight = "bold";

        const barContainer = document.createElement("div");
        barContainer.style.height = "30px";
        barContainer.style.width = "100%";
        barContainer.style.backgroundColor = "#fce4ec";
        barContainer.style.borderRadius = "20px";
        barContainer.style.overflow = "hidden";

        const filledBar = document.createElement("div");
        filledBar.style.height = "100%";
        filledBar.style.width = `${percent}%`;
        filledBar.style.backgroundColor = "#f06292";
        filledBar.style.borderRadius = "20px";

        barContainer.appendChild(filledBar);
        barWrapper.appendChild(label);
        barWrapper.appendChild(barContainer);
        container.appendChild(barWrapper);
    });
}

function createParticles() {
    const particles = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particles.appendChild(particle);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

createParticles();

document.querySelectorAll('.category-display, .balance-box').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});