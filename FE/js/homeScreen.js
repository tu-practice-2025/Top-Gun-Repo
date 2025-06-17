// Dashboard Configuration
const CONFIG = {
  API_BASE_URL: 'https://localhost:7121',
  USER_ID: sessionStorage.getItem("userId"),
  CHART_COLORS: {
    primary: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)', 
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(201, 203, 207, 0.7)',
      'rgba(255, 99, 255, 0.7)',
      'rgba(99, 255, 132, 0.7)',
      'rgba(132, 99, 255, 0.7)'
    ],
    borders: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(201, 203, 207, 1)',
      'rgba(255, 99, 255, 1)',
      'rgba(99, 255, 132, 1)',
      'rgba(132, 99, 255, 1)'
    ],
    income: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)'
    ],
    incomeBorders: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)'
    ]
  }
};

// API Service
class ApiService {
  static async fetchExpenses(userId) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/Categories/spending/current-month/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    return response.json();
  }

  static async fetchIncome(userId) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/Categories/income/current-month/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch income');
    return response.json();
  }

  static async fetchTransactions(userId) {
    const response = await fetch(`${CONFIG.API_BASE_URL}/api/transactions/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  }
}

// Chart Service
class ChartService {
  static createExpenseChart(apiData) {
    const labels = apiData.map(item => item.categoryName);
    const ids = apiData.map(item => item.categoryId);
    const amounts = apiData.map(item => item.percentageAmount);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Expenses %',
        data: amounts,
        backgroundColor: CONFIG.CHART_COLORS.primary,
        borderColor: CONFIG.CHART_COLORS.borders,
        borderWidth: 1
      }]
    };

    const chartConfig = {
      type: 'doughnut',
      data: chartData,
      options: {
        plugins: { 
          legend: { display: false } 
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCategory = labels[index];
            const selectedCategoryId = ids[index];
            
            // Store selection and navigate
            sessionStorage.setItem('selectedCategory', selectedCategory);
            sessionStorage.setItem('selectedCategoryId', selectedCategoryId);
            window.location.href = 'details.html';
          }
        }
      }
    };

    const ctx = document.getElementById('myChart');
    if (!ctx) {
      console.error('Canvas element with id "myChart" not found');
      return null;
    }
    
    return new Chart(ctx.getContext('2d'), chartConfig);
  }

  static createIncomeChart(apiData) {
    const validData = apiData.filter(item => item.totalSpent > 0).slice(0, 10);
    const labels = validData.map(item => item.name);
    const amounts = validData.map(item => item.totalSpent);

    const chartData = {
      labels: labels,
      datasets: [{
        label: 'Category Income',
        data: amounts,
        backgroundColor: CONFIG.CHART_COLORS.income,
        borderColor: CONFIG.CHART_COLORS.incomeBorders,
        borderWidth: 1
      }]
    };

    const chartConfig = {
      type: 'bar',
      data: chartData,
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const selectedCategory = labels[index];
            
            sessionStorage.setItem('selectedCategory', selectedCategory);
            window.location.href = 'details.html';
          }
        }
      }
    };

    const ctx = document.getElementById('barChart');
    if (!ctx) {
      console.error('Canvas element with id "barChart" not found');
      return null;
    }
    
    return new Chart(ctx.getContext('2d'), chartConfig);
  }

  static createFallbackCharts() {
    // Fallback expense chart
    const expenseData = {
      labels: ['Transport', 'Groceries', 'Travel', 'Shopping', 'Restaurants'],
      datasets: [{
        label: 'Sample Expenses',
        data: [69, 48, 324, 183, 217],
        backgroundColor: CONFIG.CHART_COLORS.primary.slice(0, 5),
        borderColor: CONFIG.CHART_COLORS.borders.slice(0, 5),
        borderWidth: 1
      }]
    };

    const expenseConfig = {
      type: 'doughnut',
      data: expenseData,
      options: {
        plugins: { legend: { display: false } }
      }
    };

    const expenseCtx = document.getElementById('myChart');
    if (expenseCtx) {
      new Chart(expenseCtx.getContext('2d'), expenseConfig);
    }

    // Fallback income chart
    const incomeData = {
      labels: ['Salary', 'Rent', 'Other'],
      datasets: [{
        label: 'Sample Income',
        data: [65, 59, 80],
        backgroundColor: CONFIG.CHART_COLORS.income,
        borderColor: CONFIG.CHART_COLORS.incomeBorders,
        borderWidth: 1
      }]
    };

    const incomeConfig = {
      type: 'bar',
      data: incomeData,
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    };

    const incomeCtx = document.getElementById('barChart');
    if (incomeCtx) {
      new Chart(incomeCtx.getContext('2d'), incomeConfig);
    }
  }
}

// Legend Service
class LegendService {
  static updateLegend(apiData) {
    const topCategories = apiData
      .filter(item => item.totalSpent > 0)
      .slice(0, 22);
    
    const legendContainer = document.querySelector('.legend-box');
    if (!legendContainer) {
      console.error('Legend container with class "legend-box" not found');
      return;
    }

    legendContainer.innerHTML = '';

    topCategories.forEach((category, index) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      
      const colorIndex = index % CONFIG.CHART_COLORS.primary.length;
      const backgroundColor = CONFIG.CHART_COLORS.primary[colorIndex];
      
      legendItem.innerHTML = `
        <span class="color-dot" style="background-color: ${backgroundColor}"></span>
        <span class="label-text">${category.name} - $${category.totalSpent.toFixed(2)}</span>
      `;
      
      legendContainer.appendChild(legendItem);
    });
  }
}

// Navigation Service
class NavigationService {
  static initScrollEffect() {
    const nav = document.querySelector('.nav-bar');
    if (!nav) {
      console.warn('Navigation bar with class "nav-bar" not found');
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Return cleanup function
    return () => window.removeEventListener('scroll', handleScroll);
  }
}

// Main Dashboard Class
class Dashboard {
  constructor() {
    this.charts = {
      expense: null,
      income: null
    };
  }

  async init() {
    try {
      console.log('Initializing dashboard...');
      
      // Load data from API
      const [expenseData, incomeData, transactionData] = await Promise.all([
        ApiService.fetchExpenses(CONFIG.USER_ID),
        ApiService.fetchIncome(CONFIG.USER_ID),
        ApiService.fetchTransactions(CONFIG.USER_ID)
      ]);

      // Create charts
      this.charts.expense = ChartService.createExpenseChart(transactionData.expenses);
      this.charts.income = ChartService.createIncomeChart(incomeData);
      
      // Update legend
      LegendService.updateLegend(expenseData);
      
      console.log('Dashboard initialized successfully');

    } catch (error) {
      console.error('Error initializing dashboard:', error);
      console.log('Loading fallback data...');
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
$(document).ready(function() {
  const dashboard = new Dashboard();
  
  // Initialize dashboard
  dashboard.init();
  
  // Initialize navigation effects
  const cleanupNav = NavigationService.initScrollEffect();
  
  // Store cleanup functions for potential later use
  window.dashboardCleanup = () => {
    dashboard.destroy();
    if (cleanupNav) cleanupNav();
  };
});

// Optional: Clean up when page unloads
window.addEventListener('beforeunload', () => {
  if (window.dashboardCleanup) {
    window.dashboardCleanup();
  }
});
