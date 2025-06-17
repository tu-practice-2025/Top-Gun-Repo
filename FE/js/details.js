document.addEventListener("DOMContentLoaded", function() {
  const API_BASE_URL = 'https://localhost:7121';
  const categorySelect = document.getElementById("category-select");
  const monthInput = document.getElementById("month");
  const balanceText = document.getElementById("balance-text");
  
  // Initialize month input with current month
  initializeMonthInput();
  
  // Load selected category from localStorage
  const selectedCategory = localStorage.getItem("selectedCategory");
  
  // Load categories on page load
  loadCategories();
  
  function initializeMonthInput() {
    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;

    if (month > 12) {
      month = 1;
      year += 1;
    }

    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    monthInput.value = formattedMonth;
    
    // Add event listener for month change
    monthInput.addEventListener('change', function() {
      loadTransactionsAndBalance();
    });
  }

  function loadCategories() {
    fetch(`${API_BASE_URL}/api/Categories/spending/3`)
      .then(response => response.json())
      .then(data => {
        categorySelect.innerHTML = ''; 

        // Add "All categories" option
        const allOption = document.createElement("option");
        allOption.value = "All";
        allOption.textContent = "All categories";
        allOption.setAttribute('data-id', 'all');
        categorySelect.appendChild(allOption);

        // Add category options
        data.forEach(category => {
          const option = document.createElement("option");
          option.value = category.name;
          option.textContent = category.name;
          option.setAttribute('data-id', category.id || category.categoryId);
          categorySelect.appendChild(option);
        });

        // Set selected category
        if (selectedCategory) {
          categorySelect.value = selectedCategory;
        } else {
          categorySelect.value = "All";
        }
        
        // Load initial data
        loadTransactionsAndBalance();
      })
      .catch(error => {
        console.error("Error loading categories:", error);
      });

    // Add change event listener
    categorySelect.addEventListener("change", function() {
      const selected = categorySelect.value;
      localStorage.setItem("selectedCategory", selected);
      console.log("Selected category:", selected);
      loadTransactionsAndBalance();
    });
  }

  async function loadTransactionsAndBalance() {
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const categoryId = selectedOption.getAttribute('data-id');
    const monthValue = monthInput.value;
    
    if (!monthValue) return;
    
    const [year, month] = monthValue.split('-');
    const userId = 1; // Hardcoded user ID as requested
    
    try {
      if (categoryId === 'all') {
        await loadAllTransactions(userId, year, month);
      } else {
        await loadCategoryTransactions(userId, categoryId, year, month);
      }
      
      // Also load balance data
      loadAndRenderBalance();
      
    } catch (error) {
      console.error("Error loading transactions:", error);
    }
  }

  async function loadCategoryTransactions(userId, categoryId, year, month) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Categories/transactions/month/${userId}/${categoryId}?year=${year}&month=${month}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const transactions = await response.json();
      displayTransactions(transactions);
      updateBalanceText(transactions);
      
    } catch (error) {
      console.error("Error loading category transactions:", error);
      displayNoTransactions();
    }
  }

  async function loadAllTransactions(userId, year, month) {
    try {
      // Get all categories first
      const categoriesResponse = await fetch(`${API_BASE_URL}/api/Categories/spending/3`);
      const categories = await categoriesResponse.json();
      
      let allTransactions = [];
      
      // Fetch transactions for each category
      for (const category of categories) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/Categories/transactions/month/${userId}/${category.id || category.categoryId}?year=${year}&month=${month}`
          );
          
          if (response.ok) {
            const transactions = await response.json();
            allTransactions = allTransactions.concat(transactions);
          }
        } catch (error) {
          console.warn(`Failed to load transactions for category ${category.name}:`, error);
        }
      }
      
      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      displayTransactions(allTransactions);
      updateBalanceText(allTransactions);
      
    } catch (error) {
      console.error("Error loading all transactions:", error);
      displayNoTransactions();
    }
  }

  function displayTransactions(transactions) {
    const table = document.querySelector('.table-placeholder table');
    
    // Clear existing rows except header
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }
    
    if (transactions.length === 0) {
      displayNoTransactions();
      return;
    }
    
    transactions.forEach(transaction => {
      const row = table.insertRow();
      
      // Format date
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      });
      
      // Create cells
      const dateCell = row.insertCell(0);
      const whereCell = row.insertCell(1);
      const ibanCell = row.insertCell(2);
      const amountCell = row.insertCell(3);
      
      // Fill cells with data
      dateCell.textContent = formattedDate;
      dateCell.style.fontWeight = 'bold';
      
      whereCell.innerHTML = `
        <div style="font-weight: bold; color: #333;">${transaction.merchantName}</div>
        <div style="font-size: 0.8em; color: #666;">${transaction.merchantDescription}</div>
      `;
      
      ibanCell.textContent = formatIban(transaction.iban);
      ibanCell.style.fontSize = '0.85em';
      ibanCell.style.fontFamily = 'monospace';
      
      amountCell.textContent = `$${transaction.amount.toFixed(2)}`;
      amountCell.style.fontWeight = 'bold';
      
      // Color code based on transaction type
      if (transaction.type === 'E') { // Expense
        amountCell.style.color = '#e74c3c';
        row.style.borderLeft = '4px solid #e74c3c';
      } else { // Income
        amountCell.style.color = '#27ae60';
        row.style.borderLeft = '4px solid #27ae60';
      }
      
      // Add hover effect
      row.style.transition = 'all 0.3s ease';
      row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#f8f9fa';
        this.style.transform = 'translateX(5px)';
      });
      
      row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
        this.style.transform = 'translateX(0)';
      });
    });
  }

    const selectedCategory = sessionStorage.getItem("selectedCategory");

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
    
    const row = table.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 4;
    cell.textContent = 'No transactions found for this period';
    cell.style.textAlign = 'center';
    cell.style.padding = '30px';
    cell.style.color = '#666';
    cell.style.fontStyle = 'italic';
  }

  function updateBalanceText(transactions) {
    if (transactions.length === 0) {
      balanceText.textContent = 'Balance: $0.00';
      return;
    }
    
    const total = transactions.reduce((sum, transaction) => {
      return transaction.type === 'E' ? sum - transaction.amount : sum + transaction.amount;
    }, 0);
    
    balanceText.textContent = `Balance: $${total.toFixed(2)}`;
    balanceText.style.color = total >= 0 ? '#27ae60' : '#e74c3c';
  }

  function formatIban(iban) {
    // Format IBAN for better readability
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  // Initialize particles and other effects
  createParticles();
  initializeSmoothScrolling();
  initializeHoverEffects();
});

async function loadAndRenderBalance() {
  const API_BASE_URL = 'https://localhost:7121';
  const category = document.getElementById("category-select").value;
  let data = [];

  try {
    if (category === "All") {
      const response = await fetch(`${API_BASE_URL}/api/Categories/spending/1`);
      data = await response.json();
    } else {
      const response = await fetch(`${API_BASE_URL}/api/Categories/spending/1`);
      const allData = await response.json();
      const filtered = allData.find(item => item.name === category);
      if (filtered) {
        data = [filtered];
      }
    }

    renderBalanceBars(data);
    
  } catch (error) {
    console.error("Error loading balance data:", error);
  }
}

function renderBalanceBars(data) {
  const container = document.getElementById("balance-bars");
  if (!container) return;
  
  container.innerHTML = "";

  data.forEach(item => {
    const percent = item.plannedAmount > 0 
      ? Math.min(100, (item.totalSpent / item.plannedAmount) * 100) 
      : 0;

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
  if (!particles) return;
  
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

function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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
}

function initializeHoverEffects() {
  document.querySelectorAll('.category-display, .balance-box').forEach(element => {
    element.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    element.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
}