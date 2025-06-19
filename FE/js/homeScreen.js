import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

document.addEventListener('DOMContentLoaded', function() {
  const userId = parseInt(sessionStorage.getItem("userId"));
  if (!userId) {
    window.location.href = "login.html";
    return;
  }
    // AI feature
  const toggleBtn = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const closeBtn = document.getElementById("closeBtn");
  const output = document.getElementById('tipsOutput');

  // opens chat window removes toggle btn
  toggleBtn.addEventListener("click", async function(){
    document.getElementById("loader").style.display = "block";
    output.style.display = "none";

    chatWindow.classList.toggle("show-chat");
    toggleBtn.style.display = "none";
    const id = sessionStorage.getItem("userId");
    const url = `https://localhost:7121/api/llmchat/${id}`;
    let text;
    try {
      const response = await fetch(url,{method: "POST"});
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      text = await response.text();
    } catch (error) {
      console.error(error.message);
    }
    console.log(text)
    output.style.display = "block";
    output.innerHTML = marked.parse(text);
    document.getElementById("loader").style.display = "none";
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
    dropdown.style.display = isVisible
      ? "none"
      : "block";
  }
});


  // closes chat window brings toggle btn back
  closeBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("show-chat");
    toggleBtn.style.display = "block  ";
    output.innerHTML = ""
  });




// Dashboard Configuration
const CONFIG = {
  API_BASE_URL: "https://localhost:7121",
  USER_ID: sessionStorage.getItem("userId"),

  CATEGORY_COLORS: {
    Transport: {
      bg: "rgba(255, 99, 132, 0.7)",
      border: "rgba(255, 99, 132, 1)",
    },
    Supermarkets: {
      bg: "rgba(54, 162, 235, 0.7)",
      border: "rgba(54, 162, 235, 1)",
    },
    "Traveling and holidays": {
      bg: "rgba(255, 206, 86, 0.7)",
      border: "rgba(255, 206, 86, 1)",
    },
    Shopping: {
      bg: "rgba(75, 192, 192, 0.7)",
      border: "rgba(75, 192, 192, 1)",
    },
    "Restaurants and bars": {
      bg: "rgba(153, 102, 255, 0.7)",
      border: "rgba(153, 102, 255, 1)",
    },
    "Financial services": {
      bg: "rgba(255, 159, 64, 0.7)",
      border: "rgba(255, 159, 64, 1)",
    },
    Investments: {
      bg: "rgba(201, 203, 207, 0.7)",
      border: "rgba(201, 203, 207, 1)",
    },
    "Entertainment and Sport": {
      bg: "rgba(255, 99, 255, 0.7)",
      border: "rgba(255, 99, 255, 1)",
    },
    "Health and beauty": {
      bg: "rgba(99, 255, 132, 0.7)",
      border: "rgba(99, 255, 132, 1)",
    },
    Clothing: {
      bg: "rgba(132, 99, 255, 0.7)",
      border: "rgba(132, 99, 255, 1)",
    },
    Cash: { bg: "rgba(255, 192, 203, 0.7)", border: "rgba(255, 192, 203, 1)" },
    Home: { bg: "rgba(144, 238, 144, 0.7)", border: "rgba(144, 238, 144, 1)" },
    "Public services": {
      bg: "rgba(255, 165, 0, 0.7)",
      border: "rgba(255, 165, 0, 1)",
    },
    "Business services": {
      bg: "rgba(106, 90, 205, 0.7)",
      border: "rgba(106, 90, 205, 1)",
    },
    "Utility payments": {
      bg: "rgba(220, 20, 60, 0.7)",
      border: "rgba(220, 20, 60, 1)",
    },
    "Training & Education": {
      bg: "rgba(0, 191, 255, 0.7)",
      border: "rgba(0, 191, 255, 1)",
    },
    "Debt repayments and fees": {
      bg: "rgba(50, 205, 50, 0.7)",
      border: "rgba(50, 205, 50, 1)",
    },
    "Outgoing payments": {
      bg: "rgba(255, 20, 147, 0.7)",
      border: "rgba(255, 20, 147, 1)",
    },
    Others: { bg: "rgba(255, 140, 0, 0.7)", border: "rgba(255, 140, 0, 1)" },
    "Loan or Credit Card Repaymets": {
      bg: "rgba(138, 43, 226, 0.7)",
      border: "rgba(138, 43, 226, 1)",
    },
    Income: { bg: "rgba(32, 178, 170, 0.7)", border: "rgba(32, 178, 170, 1)" },
    "Income ATM": {
      bg: "rgba(128, 128, 128, 0.7)",
      border: "rgba(128, 128, 128, 1)",
    },
  },

  // Fallback colors ако категорията не е намерена в CATEGORY_COLORS
  FALLBACK_COLORS: {
    backgrounds: [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(201, 203, 207, 0.7)",
      "rgba(255, 99, 255, 0.7)",
      "rgba(99, 255, 132, 0.7)",
      "rgba(132, 99, 255, 0.7)",
      "rgba(255, 192, 203, 0.7)",
      "rgba(144, 238, 144, 0.7)",
      "rgba(255, 165, 0, 0.7)",
      "rgba(106, 90, 205, 0.7)",
      "rgba(220, 20, 60, 0.7)",
      "rgba(0, 191, 255, 0.7)",
      "rgba(50, 205, 50, 0.7)",
      "rgba(255, 20, 147, 0.7)",
      "rgba(255, 140, 0, 0.7)",
      "rgba(138, 43, 226, 0.7)",
      "rgba(32, 178, 170, 0.7)",
      "rgba(128, 128, 128, 0.7)",
    ],
    borders: [
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(75, 192, 192, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
      "rgba(201, 203, 207, 1)",
      "rgba(255, 99, 255, 1)",
      "rgba(99, 255, 132, 1)",
      "rgba(132, 99, 255, 1)",
      "rgba(255, 192, 203, 1)",
      "rgba(144, 238, 144, 1)",
      "rgba(255, 165, 0, 1)",
      "rgba(106, 90, 205, 1)",
      "rgba(220, 20, 60, 1)",
      "rgba(0, 191, 255, 1)",
      "rgba(50, 205, 50, 1)",
      "rgba(255, 20, 147, 1)",
      "rgba(255, 140, 0, 1)",
      "rgba(138, 43, 226, 1)",
      "rgba(32, 178, 170, 1)",
      "rgba(128, 128, 128, 1)",
    ],
  },

  // Income colors (за bar chart-а)
  INCOME_COLORS: {
    backgrounds: [
      "rgba(255, 99, 132, 0.2)",
      "rgba(255, 159, 64, 0.2)",
      "rgba(255, 205, 86, 0.2)",
    ],
    borders: ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)"],
  },
};

// Color Service - централизирано управление на цветовете
class ColorService {
  /**
   * Получава цвят за конкретна категория
   * @param {string} categoryName - Име на категорията
   * @param {number} fallbackIndex - Fallback индекс ако категорията не е намерена
   * @returns {Object} - Обект с background и border цветове
   */
  static getCategoryColor(categoryName, fallbackIndex = 0) {
    // Първо проверяваме дали има фиксиран цвят за тази категория
    if (CONFIG.CATEGORY_COLORS[categoryName]) {
      return CONFIG.CATEGORY_COLORS[categoryName];
    }

    // Ако няма, използваме fallback цветовете
    const bgIndex = fallbackIndex % CONFIG.FALLBACK_COLORS.backgrounds.length;
    const borderIndex = fallbackIndex % CONFIG.FALLBACK_COLORS.borders.length;

    return {
      bg: CONFIG.FALLBACK_COLORS.backgrounds[bgIndex],
      border: CONFIG.FALLBACK_COLORS.borders[borderIndex],
    };
  }

  /**
   * Получава цветове за масив от категории
   * @param {Array} categories - Масив от категории
   * @returns {Object} - Обект с backgrounds и borders масиви
   */
  static getColorsForCategories(categories) {
    const backgrounds = [];
    const borders = [];

    categories.forEach((category, index) => {
      const categoryName = category.categoryName || category.name || category;
      const colors = this.getCategoryColor(categoryName, index);
      backgrounds.push(colors.bg);
      borders.push(colors.border);
    });

    return { backgrounds, borders };
  }
}

// API Service
class ApiService {
  static async fetchExpenses(userId) {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/api/Categories/spending/current-month/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch expenses");
    return response.json();
  }

  static async fetchIncome(userId) {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/api/Categories/income/current-month/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch income");
    return response.json();
  }

  static async fetchTransactions(userId) {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/api/transactions/${userId}`
    );
    if (!response.ok) throw new Error("Failed to fetch transactions");
    return response.json();
  }
}

// Plugin за показване на текст в центъра на дъгообразната диаграма
const centerTextPlugin = {
  id: "centerText",
  beforeDraw: function (chart) {
    if (chart.config.type !== "doughnut") return;

    const { ctx, width, height } = chart;
    const centerX = width / 2;
    const centerY = height / 2;

    // Изчисляване на общата сума от реалните данни
    let total = 0;
    if (
      chart.config.options.plugins.centerText &&
      chart.config.options.plugins.centerText.totalAmount
    ) {
      total = chart.config.options.plugins.centerText.totalAmount;
    } else {
      // Fallback - използваме данните от диаграмата
      const data = chart.data.datasets[0].data;
      total = data.reduce((sum, value) => sum + value, 0);
    }

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Заглавие "Total:"
    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "#333";
    ctx.fillText("Общо: лв.", centerX, centerY - 15);

    // Сума
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(`${total.toFixed(2)}`, centerX, centerY + 10);

    ctx.restore();
  },
};

// Регистриране на plugin-а
// Chart.register(centerTextPlugin);

// Chart Service
class ChartService {
  static createExpenseChart(apiData) {
    const labels = apiData.map((item) => item.categoryName);
    const ids = apiData.map((item) => item.categoryId);
    const amounts = apiData.map((item) => item.percentageAmount);

    const realAmounts = apiData.map(
      (item) => item.totalAmount || item.totalSpent || item.amount || 0
    );

    const totalSpent = realAmounts.reduce((sum, value) => sum + value, 0);

    const colors = ColorService.getColorsForCategories(apiData);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Expenses %",
          data: amounts,
          backgroundColor: colors.backgrounds,
          borderColor: colors.borders,
          borderWidth: 1,
        },
      ],
    };

    const chartConfig = {
      type: "doughnut",
      data: chartData,
      options: {
        plugins: {
          legend: { display: false },
          centerText: {
            totalAmount: totalSpent,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.parsed;
                return `Разходи: ${value.toFixed(2)}%`;
              },
            },
          },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCategory = labels[index];
            const selectedCategoryId = ids[index];

            // Store selection and navigate
            sessionStorage.setItem("selectedCategory", selectedCategory);
            sessionStorage.setItem("selectedCategoryId", selectedCategoryId);
            window.location.href = "details.html";
          }
        },
      },
    };

    const ctx = document.getElementById("myChart");
    if (!ctx) {
      console.error('Canvas element with id "myChart" not found');
      return null;
    }

    return new Chart(ctx.getContext("2d"), chartConfig);
  }

  static createIncomeChart(apiData) {
    const validData = apiData
      .filter((item) => item.totalSpent > 0)
      .slice(0, 10);
    const labels = validData.map((item) => item.name);
    const amounts = validData.map((item) => item.totalSpent);

    const chartData = {
      labels: labels,
      datasets: [
        {
          label: "Category Income",
          data: amounts,
          backgroundColor: CONFIG.INCOME_COLORS.backgrounds,
          borderColor: CONFIG.INCOME_COLORS.borders,
          borderWidth: 1,
        },
      ],
    };

    const chartConfig = {
      type: "bar",
      data: chartData,
      options: {
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.parsed.y || context.raw;
                return `Приходи: ${value.toFixed(2)} лв.`;
              },
            },
          },
        },
        scales: {
          y: { beginAtZero: true },
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCategory = labels[index];

            sessionStorage.setItem("selectedCategory", selectedCategory);
            window.location.href = "details.html";
          }
        },
      },
    };

    const ctx = document.getElementById("barChart");
    if (!ctx) {
      console.error('Canvas element with id "barChart" not found');
      return null;
    }

    return new Chart(ctx.getContext("2d"), chartConfig);
  }

  static createFallbackCharts() {
    // Fallback expense chart
    const expenseData = {
      labels: ["Transport", "Groceries", "Travel", "Shopping", "Restaurants"],
      datasets: [
        {
          label: "Sample Expenses",
          data: [69, 48, 324, 183, 217],
          backgroundColor: CONFIG.CHART_COLORS.primary.slice(0, 5),
          borderColor: CONFIG.CHART_COLORS.borders.slice(0, 5),
          borderWidth: 1,
        },
      ],
    };

    const expenseConfig = {
      type: "doughnut",
      data: expenseData,
      options: {
        plugins: { legend: { display: false } },
        centerText: {
          realAmounts: [69, 48, 324, 183, 217],
        },
      },
    };

    const expenseCtx = document.getElementById("myChart");
    if (expenseCtx) {
      new Chart(expenseCtx.getContext("2d"), expenseConfig);
    }

    // Fallback income chart
    const incomeData = {
      labels: ["Salary", "Rent", "Other"],
      datasets: [
        {
          label: "Sample Income",
          data: [65, 59, 80],
          backgroundColor: CONFIG.CHART_COLORS.income,
          borderColor: CONFIG.CHART_COLORS.incomeBorders,
          borderWidth: 1,
        },
      ],
    };

    const incomeConfig = {
      type: "bar",
      data: incomeData,
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    };

    const incomeCtx = document.getElementById("barChart");
    if (incomeCtx) {
      new Chart(incomeCtx.getContext("2d"), incomeConfig);
    }
  }
}

// Legend Service
class LegendService {
  static updateLegend(apiData) {
    const topCategories = apiData
      .filter((item) => item.totalSpent > 0)
      .slice(0, 22);

    const legendContainer = document.querySelector(".legend-box");
    if (!legendContainer) {
      console.error('Legend container with class "legend-box" not found');
      return;
    }

    legendContainer.innerHTML = "";

    topCategories.forEach((category, index) => {
      const legendItem = document.createElement("div");
      legendItem.className = "legend-item";

      const categoryName = category.name || category.categoryName;
      const colors = ColorService.getCategoryColor(categoryName, index);

      legendItem.innerHTML = `
        <span class="color-dot" style="background-color: ${colors.bg}"></span>
        <span class="label-text">${categoryName} - ${category.totalSpent.toFixed(
        2
      )} лв.</span>
      `;

      legendContainer.appendChild(legendItem);
    });
  }
}

// Navigation Service
class NavigationService {
  static initScrollEffect() {
    const nav = document.querySelector(".nav-bar");
    if (!nav) {
      console.warn('Navigation bar with class "nav-bar" not found');
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Return cleanup function
    return () => window.removeEventListener("scroll", handleScroll);
  }
}

// Main Dashboard Class
class Dashboard {
  constructor() {
    this.charts = {
      expense: null,
      income: null,
    };
  }

  async init() {
    try {
      console.log("Initializing dashboard...");

      // Load data from API
      const [expenseData, incomeData, transactionData] = await Promise.all([
        ApiService.fetchExpenses(CONFIG.USER_ID),
        ApiService.fetchIncome(CONFIG.USER_ID),
        ApiService.fetchTransactions(CONFIG.USER_ID),
      ]);

      // Create charts
      this.charts.expense = ChartService.createExpenseChart(
        transactionData.expenses
      );
      this.charts.income = ChartService.createIncomeChart(incomeData);

      // Update legend
      LegendService.updateLegend(expenseData);

      console.log("Dashboard initialized successfully");
    } catch (error) {
      console.error("Error initializing dashboard:", error);
      console.log("Loading fallback data...");
      ChartService.createFallbackCharts();
    }
  }

  destroy() {
    // Clean up charts
    if (this.charts.expense) {
      this.charts.expense.destroy();
    }
    if (this.charts.income) {
      this.charts.income.destroy();
    }
  }
}

// Initialize when DOM is ready
$(document).ready(function () {
  const dashboard = new Dashboard();

  // Initialize dashboard
  dashboard.init();

  async function updateSummaryBoxes() {
    try {
      const [expenseData, incomeData] = await Promise.all([
        ApiService.fetchExpenses(CONFIG.USER_ID),
        ApiService.fetchIncome(CONFIG.USER_ID),
      ]);

      const totalExpenses = expenseData.reduce(
        (sum, item) => sum + (item.totalSpent || 0),
        0
      );
      const totalIncome = incomeData.reduce(
        (sum, item) => sum + (item.totalSpent || 0),
        0
      );

      const expenseEl = document.getElementById("total-expenses");
      const incomeEl = document.getElementById("total-income");

      // Обнови текста
      expenseEl.textContent = `- ${totalExpenses.toFixed(2)} лв.`;
      incomeEl.textContent = `+ ${totalIncome.toFixed(2)} лв.`;

      // Премахни стари класове (ако има)
      expenseEl.classList.remove("income-positive", "expense-negative");
      incomeEl.classList.remove("income-positive", "expense-negative");

      // Добави нужните цветове
      expenseEl.classList.add("expense-negative");
      incomeEl.classList.add("income-positive");
    } catch (e) {
      console.error("Failed to fetch totals:", e);
    }
  }

  $(document).ready(function () {
    updateSummaryBoxes();
  });

  // Initialize navigation effects
  const cleanupNav = NavigationService.initScrollEffect();

  // Store cleanup functions for potential later use
  window.dashboardCleanup = () => {
    dashboard.destroy();
    if (cleanupNav) cleanupNav();
  };
});

// Optional: Clean up when page unloads
window.addEventListener("beforeunload", () => {
  if (window.dashboardCleanup) {
    window.dashboardCleanup();
  }
});
