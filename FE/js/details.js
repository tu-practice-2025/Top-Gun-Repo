document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "https://localhost:7121";
  const categorySelect = document.getElementById("category-select");
  const monthInput = document.getElementById("month");
  const balanceText = document.getElementById("balance-text");

  // Get user ID from session storage
  const userId = sessionStorage.getItem("userId") || "1"; // Default to 1 if not set

  // Set current month
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;

  if (month > 12) {
    month = 1;
    year += 1;
  }

  const formattedMonth = `${year}-${month.toString().padStart(2, "0")}`;
  monthInput.value = formattedMonth;

  // Get selected category from session storage (consistent with homeScreen.js)
  const selectedCategory = sessionStorage.getItem("selectedCategory");

  // Initialize page
  loadCategories();

  // Add event listeners
  categorySelect.addEventListener("change", handleCategoryChange);
  monthInput.addEventListener("change", handleMonthChange);

  async function loadCategories() {
    try {
      // Fetch transaction data to get available categories
      const response = await fetch(
        `${API_BASE_URL}/api/Transactions/${userId}`
      );
      const data = await response.json();

      categorySelect.innerHTML = "";

      const allOption = document.createElement("option");
      allOption.value = "All";
      allOption.textContent = "All categories";
      categorySelect.appendChild(allOption);

      // Add categories from expenses data
      if (data.expenses && data.expenses.length > 0) {
        data.expenses.forEach((expense) => {
          const option = document.createElement("option");
          option.value = expense.categoryName;
          option.textContent = expense.categoryName;
          categorySelect.appendChild(option);
        });
      }

      // Set selected category
      if (selectedCategory && selectedCategory !== "All") {
        categorySelect.value = selectedCategory;
      } else {
        categorySelect.value = "All";
      }

      // Load initial data
      await loadTransactionData();
    } catch (error) {
      console.error("Error loading categories:", error);
      showError("Failed to load categories");
    }
  }

  function handleCategoryChange() {
    const selected = categorySelect.value;

    // Update session storage
    sessionStorage.setItem("selectedCategory", selected);

    console.log("Selected category:", selected);
    loadTransactionData();
  }

  function handleMonthChange() {
    loadTransactionData();
  }

  async function loadTransactionData() {
    try {
      showLoading();

      const category = categorySelect.value;

      // Fetch transaction data
      const response = await fetch(
        `${API_BASE_URL}/api/Transactions/${userId}`
      );
      const data = await response.json();

      // Filter and display data
      let displayData = [];

      if (category === "All") {
        displayData = data.expenses || [];
      } else {
        const selectedCategoryData = data.expenses?.find(
          (expense) => expense.categoryName === category
        );
        if (selectedCategoryData) {
          displayData = [selectedCategoryData];
        }
      }

      // Update UI
      updateTransactionTable(displayData, category);
      updateBalanceDisplay(data, category);
      loadAndRenderBalance(data);
    } catch (error) {
      console.error("Error loading transaction data:", error);
      showError("Failed to load transaction data");
    }
  }

  function updateTransactionTable(categoryData, selectedCategory) {
    const tableBody = document.querySelector(".table-placeholder table tbody");
    if (!tableBody) {
      // Create tbody if it doesn't exist
      const table = document.querySelector(".table-placeholder table");
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
    }

    const tbody = document.querySelector(".table-placeholder table tbody");
    tbody.innerHTML = "";

    if (categoryData.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td colspan="3" style="text-align: center; color: #666;">No transactions found for this category</td>';
      tbody.appendChild(row);
      return;
    }

    // Since we have category summaries, not individual transactions,
    // we'll display the category summary information
    categoryData.forEach((category) => {
      const row = document.createElement("tr");
      const currentDate = new Date().toLocaleDateString();

      row.innerHTML = `
                <td>${currentDate}</td>
                <td>${category.categoryName}</td>
                <td>$${category.totalAmount.toFixed(2)}</td>
            `;

      // Add styling based on amount
      if (category.totalAmount > 500) {
        row.style.backgroundColor = "#ffebee";
      }

      tbody.appendChild(row);
    });

    // Add a summary row if showing all categories
    if (selectedCategory === "All" && categoryData.length > 1) {
      const totalAmount = categoryData.reduce(
        (sum, cat) => sum + cat.totalAmount,
        0
      );
      const summaryRow = document.createElement("tr");
      summaryRow.style.borderTop = "2px solid black";
      summaryRow.style.fontWeight = "bold";
      summaryRow.innerHTML = `
                <td colspan="2" style="text-align: right;">TOTAL:</td>
                <td>$${totalAmount.toFixed(2)}</td>
            `;
      tbody.appendChild(summaryRow);
    }
  }

  function updateBalanceDisplay(data, selectedCategory) {
    if (selectedCategory === "All") {
      const totalExpenses = data.totalExpenses || 0;
      const totalIncome = data.totalIncome || 0;
      const balance = totalIncome - totalExpenses;

      balanceText.innerHTML = `
                <div style="color: black; font-weight: bold; font-size: 1.2em;">Overall Summary</div>
                <div>Total Income: $${totalIncome.toFixed(2)}</div>
                <div>Total Expenses: $${totalExpenses.toFixed(2)}</div>
                <div style="color: ${
                  balance >= 0 ? "green" : "black"
                }; font-weight: bold;">
                    Balance: $${balance.toFixed(2)}
                </div>
            `;
    } else {
      const categoryInfo = data.expenses?.find(
        (expense) => expense.categoryName === selectedCategory
      );
      if (categoryInfo) {
        balanceText.innerHTML = `
                    <div style="color: black; font-weight: bold; font-size: 1.2em;">${selectedCategory}</div>
                    <div>Total Spent: $${categoryInfo.totalAmount.toFixed(
                      2
                    )}</div>
                    <div>Percentage of Total: ${categoryInfo.percentageAmount.toFixed(
                      2
                    )}%</div>
                `;
      } else {
        balanceText.innerHTML = `
                    <div style="color: black; font-weight: bold;">No data found for ${selectedCategory}</div>
                `;
      }
    }
  }

  function showLoading() {
    const tbody = document.querySelector(".table-placeholder table tbody");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="3" style="text-align: center;">Loading...</td></tr>';
    }

    balanceText.innerHTML =
      '<div style="text-align: center;">Loading balance...</div>';
  }

  function showError(message) {
    const tbody = document.querySelector(".table-placeholder table tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: black;">${message}</td></tr>`;
    }

    balanceText.innerHTML = `<div style="color: black;">${message}</div>`;
  }

  // Updated balance bars functionality to work with the new data structure
  async function loadAndRenderBalance(data = null) {
    try {
      const category = categorySelect.value;
      let displayData = [];

      // Use passed data or fetch new data
      if (!data) {
        const response = await fetch(
          `${API_BASE_URL}/api/Transactions/${userId}`
        );
        data = await response.json();
      }

      if (category === "All") {
        displayData = data.expenses || [];
      } else {
        const selectedCategoryData = data.expenses?.find(
          (expense) => expense.categoryName === category
        );
        if (selectedCategoryData) {
          displayData = [selectedCategoryData];
        }
      }

      const container = document.getElementById("balance-bars");
      container.innerHTML = "";

      displayData.forEach((item) => {
        // Calculate percentage based on total expenses
        const percent =
          data.totalExpenses > 0
            ? (item.totalAmount / data.totalExpenses) * 100
            : 0;

        const barWrapper = document.createElement("div");
        barWrapper.style.marginBottom = "20px";

        const label = document.createElement("div");
        label.textContent = `${item.categoryName} - ${percent.toFixed(1)}%`;
        label.style.marginBottom = "5px";
        label.style.color = "black";
        label.style.fontWeight = "bold";

        const amountLabel = document.createElement("div");
        amountLabel.textContent = `$${item.totalAmount.toFixed(2)}`;
        amountLabel.style.marginBottom = "5px";
        amountLabel.style.color = "#666";
        amountLabel.style.fontSize = "0.9em";

        const barContainer = document.createElement("div");
        barContainer.style.height = "30px";
        barContainer.style.width = "100%";
        barContainer.style.backgroundColor = "#fce4ec";
        barContainer.style.borderRadius = "20px";
        barContainer.style.overflow = "hidden";

        const filledBar = document.createElement("div");
        filledBar.style.height = "100%";
        filledBar.style.width = `${Math.min(100, percent)}%`;
        filledBar.style.backgroundColor = "red";
        filledBar.style.borderRadius = "20px";
        filledBar.style.transition = "width 0.3s ease";

        barContainer.appendChild(filledBar);
        barWrapper.appendChild(label);
        barWrapper.appendChild(amountLabel);
        barWrapper.appendChild(barContainer);
        container.appendChild(barWrapper);
      });
    } catch (error) {
      console.error("Error loading balance data:", error);
    }
  }
});

// Keep existing particle and animation functions
function createParticles() {
  const particles = document.getElementById("particles");
  if (!particles) return;

  const particleCount = 50;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 15 + "s";
    particle.style.animationDuration = Math.random() * 10 + 10 + "s";
    particles.appendChild(particle);
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

createParticles();

document
  .querySelectorAll(".category-display, .balance-box")
  .forEach((element) => {
    element.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)";
    });
  });
