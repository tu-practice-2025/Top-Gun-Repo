import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener("DOMContentLoaded", () => {
  const userId = parseInt(sessionStorage.getItem("userId"));
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  const API_BASE_URL = "https://localhost:7121";
  const categorySelect = document.getElementById("category-select");
  const monthInput = document.getElementById("month");
  if (!monthInput) return;
  const balanceText = document.getElementById("balance-text");

  // AI feature
  const toggleBtn = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const closeBtn = document.getElementById("closeBtn");
  const output = document.getElementById("tipsOutput");

  // opens chat window removes toggle btn
  toggleBtn.addEventListener("click", async function () {
    document.getElementById("loader").style.display = "block";
    output.style.display = "none";

    chatWindow.classList.toggle("show-chat");
    toggleBtn.style.display = "none";
    const id = sessionStorage.getItem("userId");
    const url = `https://localhost:7121/api/llmchat/${id}`;
    let text;
    try {
      const response = await fetch(url, { method: "POST" });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      text = await response.text();
    } catch (error) {
      console.error(error.message);
    }
    console.log(text);
    output.style.display = "block";
    output.innerHTML = marked.parse(text);
    document.getElementById("loader").style.display = "none";
  });

  // closes chat window brings toggle btn back
  closeBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("show-chat");
    toggleBtn.style.display = "block  ";
    output.innerHTML = "";
  });

  // Get user ID from session storage

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
      allOption.textContent = "Всички категории";
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
          <div style="font-size: 0.9em; color: #555;">Карта: ${maskedCardNumber}</div>
          <div style="font-size: 0.9em; color: #555;">IBAN: ${maskedIban}</div>
        </td>
        <td style="font-weight: bold; color: ${
          transaction.type === "E" ? "red" : "green"
        };">
          ${transaction.type === "E" ? "-" : "+"}${transaction.amount.toFixed(
        2
      )} лв.

        </td>
      `;

      // Add styling based on amount
      if (transaction.amount > 500) {
        row.style.backgroundColor = "#white";
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
    <td colspan="3" style="text-align: right;">Общо:</td>
    <td style="color: ${color};">${totalAmount.toFixed(2)} лв.</td>
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
        <div style="color: black; font-weight: bold; font-size: 1.2em; text-decoration: underline;">Статистика</div>
        
        <div>
          <span style="color: black;">Общ разход:</span>
          <span style="color: red; font-weight: bold;">${totalExpenses.toFixed(
            2
          )} лв.</span>
        </div>

        <div>
          <span style="color: black;">Общ приход:</span>
          <span style="color: green; font-weight: bold;">${totalIncome.toFixed(
            2
          )} лв.</span>
        </div>

        <div>
          <span style="color: black;">Баланс:</span>
          <span style="color: ${
            balance >= 0 ? "green" : "red"
          }; font-weight: bold;">
          ${balance.toFixed(2)} лв.</div>
        <div style="color: #666; font-size: 0.9em;">
          Брой транзакции: ${allTransactions.length}
        <span
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

      const isIncomeCategory =
        selectedCategory === "Приход" || selectedCategory === "Приход ATM";
      const spentOrIncomeLabel = isIncomeCategory ? "Приход" : "Разход";
      const amountColor = isIncomeCategory ? "green" : "red";

      balanceText.innerHTML = `
        <div style="color: black; font-weight: bold; font-size: 1.2em;">${selectedCategory}</div>
        

        <div>
          <span style="color: black;">${spentOrIncomeLabel}:</span>
          <span style="color: ${amountColor}; font-weight: bold;">${categoryTotal.toFixed(
        2
      )} лв.</span>
        </div>

        <div>Процент: ${percentage.toFixed(2)}%</div>
        <div style="color: #666; font-size: 0.9em;">
          Брой транзакции: ${filteredTransactions.length}
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

      let budgets = [];
      const categoryNameToId = {
        "Транспорт и авто услуги": 1,
        Супермаркети: 2,
        "Пътуване и ваканция": 3,
        Шопинг: 4,
        "Ресторанти и барове": 5,
        "Финансови услуги": 6,
        Инвестиции: 7,
        "Забавление и спорт": 8,
        "Здраве и красота": 9,
        Дрехи: 10,
        Кеш: 11,
        "За дома": 12,
        "Публични услуги": 13,
        "Бизнес услуги": 14,
        "Битови сметки": 15,
        Образование: 16,
        "Задължения и такси": 17,
        Преводи: 18,
        Други: 19,
        "Погасяване по кредитни продукти": 20,
        Приход: 21,
        "Приход ATM": 22,
      };

      try {
        const res = await fetch(
          `https://localhost:7121/api/Budgets/${userId}`,
          { method: "GET" }
        );
        if (!res.ok) throw new Error(`Response status: ${res.status}`);
        budgets = await res.json();
      } catch (error) {
        console.error("Error fetching budgets:", error.message);
        return;
      }

      // Create map for quick lookup: category_id -> limit
      const categoryBudgets = {};
      budgets.forEach((b) => {
        categoryBudgets[b.category_id] = b.limit;
      });

      // Render bars
      Object.entries(categoryTotals).forEach(([categoryName, amount]) => {
        const categoryId = categoryNameToId[categoryName];
        const categoryLimit = categoryBudgets[categoryId] || 0;
        const percent = categoryLimit > 0 ? (amount / categoryLimit) * 100 : 0;

        const barWrapper = document.createElement("div");
        barWrapper.style.marginBottom = "20px";

        const label = document.createElement("div");
        label.textContent = `${categoryName} - ${percent.toFixed(1)}%`;
        label.style.marginBottom = "5px";
        label.style.color = "black";
        label.style.fontWeight = "bold";

        const amountLabel = document.createElement("div");
        amountLabel.textContent = `${amount.toFixed(
          2
        )} BGN от ${categoryLimit.toFixed(2)} BGN`;
        amountLabel.style.marginBottom = "5px";
        amountLabel.style.color = "#666";
        amountLabel.style.fontSize = "0.9em";

        const barContainer = document.createElement("div");
        barContainer.style.height = "30px";
        barContainer.style.width = "100%";
        barContainer.style.backgroundColor = "#fce4ec";
        barContainer.style.borderRadius = "20px";
        barContainer.style.overflow = "hidden";
        barContainer.style.cursor = "pointer";

        const filledBar = document.createElement("div");
        filledBar.style.height = "100%";
        filledBar.style.width = `${Math.min(100, percent)}%`;
        filledBar.style.backgroundColor = "red";
        filledBar.style.borderRadius = "20px";
        filledBar.style.transition = "width 0.3s ease";

        // ➕ Add click-to-edit budget logic
        barContainer.addEventListener("click", async () => {
          const newLimit = prompt(`Въведете нов бюджет за "${categoryName}":`);
          if (newLimit === null || isNaN(parseFloat(newLimit))) {
            alert("Невалидна стойност.");
            return;
          }

          const limit = parseFloat(newLimit);
          const existing = budgets.find((b) => b.category_id === categoryId);
          const method = existing ? "PUT" : "POST";

          try {
            const res = await fetch(
              `https://localhost:7121/api/Budgets/${userId}?cat_id=${categoryId}&limit=${limit}`,
              {
                method,
                headers: { "Content-Type": "application/json" },
              }
            );

            if (!res.ok) throw new Error(`Error ${res.status}`);

            loadAndRenderBalance();
          } catch (err) {
            console.error(err);
            alert("Грешка при записване на бюджета.");
          }
        });

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

  function toggleDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    dropdown.classList.toggle("show");

    const name = sessionStorage.getItem("userName") || "Неизвестен";
    const email = sessionStorage.getItem("userEmail") || "Няма имейл";
    const userId = sessionStorage.getItem("userId");

    document.getElementById("dropdownUserName").innerText = `Име: ${name}`;
    document.getElementById("dropdownUserEmail").innerText = `Имейл: ${email}`;

    const logoutBtn = document.getElementById("dropdownLogoutBtn");

    if (logoutBtn) {
      logoutBtn.onclick = () => {
        sessionStorage.clear();
        window.location.href = "login.html";
      };
    }
  }

  window.toggleDropdown = toggleDropdown;

  const sendEmailBtn = document.getElementById("sendEmailBtn");

  if (sendEmailBtn) {
    sendEmailBtn.onclick = async () => {
      const email = sessionStorage.getItem("userEmail");
      const userId = sessionStorage.getItem("userId");

      if (!email || !userId) {
        alert("Липсва информация за потребителя или имейла.");
        return;
      }

      try {
        const response = await fetch(
          `https://localhost:7121/api/email/send?email=${email}&userId=${userId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          alert("Обобщението беше изпратено успешно!");
        } else {
          alert("Грешка при изпращане на обобщение.");
        }
      } catch (err) {
        console.error("Email error:", err);
        alert("Възникна грешка при изпращането.");
      }
    };
  }

  createParticles();

  document
    .querySelectorAll(".category-display, .balance-box")
    .forEach((element) => {
      element.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    });
});

window.addEventListener("click", function (event) {
  const dropdown = document.getElementById("profileDropdown");
  const dropdownButton = document.querySelector(".dropbtn");

  // Check if the click is outside both the dropdown and the button
  if (
    !dropdown.contains(event.target) &&
    !dropdownButton.contains(event.target)
  ) {
    dropdown.style.display = "none";
  } else {
    const isVisible = dropdown.style.display === "block";
    dropdown.style.display = isVisible ? "none" : "block";
  }
});
