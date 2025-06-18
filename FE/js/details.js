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
      // Extract month from the month input for API call
      const selectedMonth = monthInput.value;
      const monthNumber = selectedMonth.split("-")[1];

      // Fetch transaction data to get available categories
      const response = await fetch(
        `${API_BASE_URL}/api/transactions/${userId}/by-month/${monthNumber}`
      );
      const transactions = await response.json();

      categorySelect.innerHTML = "";

      const allOption = document.createElement("option");
      allOption.value = "All";
      allOption.textContent = "All categories";
      categorySelect.appendChild(allOption);

      // Get unique categories from transactions
      const uniqueCategories = [
        ...new Set(transactions.map((t) => t.categoryName)),
      ];

      uniqueCategories.forEach((categoryName) => {
        const option = document.createElement("option");
        option.value = categoryName;
        option.textContent = categoryName;
        categorySelect.appendChild(option);
      });

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
    loadCategories(); // Reload categories for the new month
  }

  async function loadTransactionData() {
    try {
      showLoading();

      const category = categorySelect.value;
      const selectedMonth = monthInput.value;
      const monthNumber = selectedMonth.split("-")[1];

      // Fetch transaction data for the selected month
      const response = await fetch(
        `${API_BASE_URL}/api/transactions/${userId}/by-month/${monthNumber}`
      );
      const transactions = await response.json();

      // Filter transactions by category if not "All"
      let filteredTransactions = transactions;
      if (category !== "All") {
        filteredTransactions = transactions.filter(
          (t) => t.categoryName === category
        );
      }
      console.log(filteredTransactions);

      // Update UI
      updateTransactionTable(filteredTransactions);
      updateBalanceDisplay(transactions, filteredTransactions, category);
      loadAndRenderBalance(transactions, filteredTransactions);
    } catch (error) {
      console.error("Error loading transaction data:", error);
      showError("Failed to load transaction data");
    }
  }

  function updateTransactionTable(transactions) {
    const tableBody = document.querySelector(".table-placeholder table tbody");
    if (!tableBody) {
      // Create tbody if it doesn't exist
      const table = document.querySelector(".table-placeholder table");
      const tbody = document.createElement("tbody");
      table.appendChild(tbody);
    }

    const tbody = document.querySelector(".table-placeholder table tbody");
    tbody.innerHTML = "";

    if (transactions.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML =
        '<td colspan="5" style="text-align: center; color: #666;">No transactions found for this category</td>';
      tbody.appendChild(row);
      return;
    }

    // Display individual transactions
    transactions.forEach((transaction) => {
      const row = document.createElement("tr");
      const transactionDate = new Date(transaction.date).toLocaleDateString();

      // Format card number (show last 4 digits)
      let maskedCardNumber = "None";
      if (transaction.cardNumber !== null) {
        maskedCardNumber = `****-****-****-${transaction.cardNumber.slice(-4)}`;
      }

      // Format IBAN (show first 4 and last 4 characters)
      const maskedIban = `${transaction.iban.slice(
        0,
        4
      )}****${transaction.iban.slice(-4)}`;

      row.innerHTML = `
        <td>${transactionDate}</td>
        <td>
          <div><strong>${transaction.merchantName}</strong></div>
          <div style="font-size: 0.8em; color: #666;">${
            transaction.merchantDescription
          }</div>
          <div style="font-size: 0.8em; color: #888;">${
            transaction.categoryName
          }</div>
        </td>
        <td>
          <div style="font-size: 0.9em; color: #555;">Card: ${maskedCardNumber}</div>
          <div style="font-size: 0.9em; color: #555;">IBAN: ${maskedIban}</div>
        </td>
        <td style="font-weight: bold; color: ${
          transaction.type === "E" ? "red" : "green"
        };">
          ${transaction.type === "E" ? "-" : "+"}${transaction.amount.toFixed(
        2

      )} BGN

        </td>
      `;

      // Add styling based on amount
      if (transaction.amount > 500) {
        row.style.backgroundColor = "#ffebee";
      }

      tbody.appendChild(row);
    });

    // Add a summary row if showing multiple transactions
    if (transactions.length > 1) {

  const totalAmount = transactions.reduce((sum, t) => {
    const signedAmount = t.type === "E" ? -t.amount : t.amount;
    return sum + signedAmount;
  }, 0);
  const summaryRow = document.createElement("tr");
  summaryRow.style.borderTop = "2px solid black";
  summaryRow.style.fontWeight = "bold";

  const color = totalAmount < 0 ? "red" : "green";
  const sign = totalAmount < 0 ? "-" : "+";

  summaryRow.innerHTML = `
    <td colspan="3" style="text-align: right;">TOTAL:</td>
    <td style="color: ${color};">${(totalAmount).toFixed(2)} лв.</td>
  `;
  tbody.appendChild(summaryRow);

    }
  }

  function updateBalanceDisplay(
    allTransactions,
    filteredTransactions,
    selectedCategory
  ) {
    if (selectedCategory === "All") {
      const totalExpenses = allTransactions.reduce(
        (sum, t) => sum + (t.type === "E" ? t.amount : 0),
        0
      );
      const totalIncome = allTransactions.reduce(
        (sum, t) => sum + (t.type === "I" ? t.amount : 0),
        0
      );
      const balance = totalIncome - totalExpenses;

      balanceText.innerHTML = `
        <div style="color: black; font-weight: bold; font-size: 1.2em;">Overall Summary</div>
        <div>Total Income: ${totalIncome.toFixed(2)} BGN</div>
        <div>Total Expenses: ${totalExpenses.toFixed(2)} BGN</div>
        <div style="color: ${
          balance >= 0 ? "green" : "red"
        }; font-weight: bold;">
          Balance: ${balance.toFixed(2)} BGN</div>
        <div style="color: #666; font-size: 0.9em;">
          Transactions: ${allTransactions.length}
        </div>
      `;
    } else {
      const categoryTotal = filteredTransactions.reduce(
        (sum, t) => sum + t.amount,
        0
      );
      const totalExpenses = allTransactions.reduce(
        (sum, t) => sum + (t.type === "E" ? t.amount : 0),
        0
      );
      const percentage =
        totalExpenses > 0 ? (categoryTotal / totalExpenses) * 100 : 0;

      balanceText.innerHTML = `
        <div style="color: black; font-weight: bold; font-size: 1.2em;">${selectedCategory}</div>
        <div>Total Spent: ${categoryTotal.toFixed(2)} BGN</div>
        <div>Percentage of Total: ${percentage.toFixed(2)}%</div>
        <div style="color: #666; font-size: 0.9em;">
          Transactions: ${filteredTransactions.length}
        </div>
      `;
    }
  }

  function showLoading() {
    const tbody = document.querySelector(".table-placeholder table tbody");
    if (tbody) {
      tbody.innerHTML =
        '<tr><td colspan="4" style="text-align: center;">Loading...</td></tr>';
    }

    balanceText.innerHTML =
      '<div style="text-align: center;">Loading balance...</div>';
  }

  function showError(message) {
    const tbody = document.querySelector(".table-placeholder table tbody");
    if (tbody) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: black;">${message}</td></tr>`;
    }

    balanceText.innerHTML = `<div style="color: black;">${message}</div>`;
  }

  // Updated balance bars functionality to work with individual transactions
  async function loadAndRenderBalance(
    allTransactions = null,
    filteredTransactions = null
  ) {
    try {
      const category = categorySelect.value;

      // Use passed data or fetch new data
      if (!allTransactions) {
        const selectedMonth = monthInput.value;
        const monthNumber = selectedMonth.split("-")[1];
        const response = await fetch(
          `${API_BASE_URL}/api/transactions/${userId}/by-month/${monthNumber}`
        );
        allTransactions = await response.json();

        if (category !== "All") {
          filteredTransactions = allTransactions.filter(
            (t) => t.categoryName === category
          );
        } else {
          filteredTransactions = allTransactions;
        }
      }

      const container = document.getElementById("balance-bars");
      container.innerHTML = "";

      // Group transactions by category for visualization
      const categoryTotals = {};
      const transactionsToShow =
        category === "All" ? allTransactions : filteredTransactions;

      transactionsToShow.forEach((transaction) => {
        if (!categoryTotals[transaction.categoryName]) {
          categoryTotals[transaction.categoryName] = 0;
        }
        categoryTotals[transaction.categoryName] += transaction.amount;
      });

      const totalExpenses = allTransactions.reduce(
        (sum, t) => sum + (t.type === "E" ? t.amount : 0),
        0
      );

      Object.entries(categoryTotals).forEach(([categoryName, amount]) => {
        // Calculate percentage based on total expenses
        const percent = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;

        const barWrapper = document.createElement("div");
        barWrapper.style.marginBottom = "20px";

        const label = document.createElement("div");
        label.textContent = `${categoryName} - ${percent.toFixed(1)}%`;
        label.style.marginBottom = "5px";
        label.style.color = "black";
        label.style.fontWeight = "bold";

        const amountLabel = document.createElement("div");
        amountLabel.textContent = `${amount.toFixed(2)} BGN`;
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
