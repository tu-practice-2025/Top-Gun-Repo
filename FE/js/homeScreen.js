$(document).ready(function () {
  const API_BASE_URL = 'https://localhost:7121'; 
  
  loadCategorySpendingData();

  async function loadCategorySpendingData() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Categories/spending/3`);//id is harcoded 
      const respone_income= await fetch(`${API_BASE_URL}/api/Categories/income/3`);
      const categoryData = await response.json();
      const incomeData=await respone_income.json();
      
      createDoughnutChart(categoryData);
      createBarChart(incomeData);
      updateLegend(categoryData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      createChartsWithFallbackData();
    }
  }

  function createDoughnutChart(apiData) {
    const filteredData = apiData.filter(item => item.totalSpent > 0);
    
    const labels = filteredData.map(item => item.name);
    const amounts = filteredData.map(item => item.totalSpent);
    
    const data = {
      labels: labels,
      datasets: [{
        label: "Category Spending",
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(201, 203, 207, 0.7)",
          "rgba(255, 99, 255, 0.7)",
          "rgba(99, 255, 132, 0.7)",
          "rgba(132, 99, 255, 0.7)"
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(201, 203, 207, 1)",
          "rgba(255, 99, 255, 1)",
          "rgba(99, 255, 132, 1)",
          "rgba(132, 99, 255, 1)"
        ],
        borderWidth: 1,
      }]
    };

    const config = {
      type: "doughnut",
      data: data,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, config);
  }

  function createBarChart(apiData) {
    const topCategories = apiData
      .filter(item => item.totalSpent > 0)
      .slice(0, 10);
    
    const labels = topCategories.map(item => item.code);
    const amounts = topCategories.map(item => item.totalSpent);

     const dataBar = {
    labels: labels,
    datasets: [
      {
        label: "Category income",
        data: amounts,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      },
    ],
  };


    const configBar = {
      type: "bar",
      data: dataBar,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    const ctxBar = document.getElementById("barChart").getContext("2d");
    const barChart = new Chart(ctxBar, configBar);
  }

  function updateLegend(apiData) {
    const topCategories = apiData
      .filter(item => item.totalSpent > 0)
      .slice(0, 22);
    const legendContainer = document.querySelector('.legend-box');
    legendContainer.innerHTML = '';

    const colors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)", 
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)"
    ];

    topCategories.forEach((category, index) => {
      const legendItem = document.createElement('div');
      legendItem.className = 'legend-item';
      legendItem.innerHTML = `
        <span class="color-dot" style="background-color: ${colors[index]}"></span>
        <span class="label-text">${category.code} - $${category.totalSpent.toFixed(2)}</span>
      `;
      legendContainer.appendChild(legendItem);
    });
  }

  function createChartsWithFallbackData() {
    const data = {
      labels: [
        "Транспорт и авто услуги",
        "Супермаркети", 
        "Пътуване и ваканция",
        "Шопинг",
        "Ресторанти и барове"
      ],
      datasets: [{
        label: "Sample Dataset",
        data: [69, 48, 324, 183, 217],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      }]
    };

    const config = {
      type: "doughnut",
      data: data,
      options: {
        plugins: {
          legend: { display: false }
        }
      }
    };

    const ctx = document.getElementById("myChart").getContext("2d");
    const myChart = new Chart(ctx, config);

    const dataBar = {
      labels: ["Заплата", "Наем", "Разни"],
      datasets: [{
        data: [65, 59, 80],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
        ],
        borderWidth: 1,
      }]
    };

    const configBar = {
      type: "bar",
      data: dataBar,
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    };

    const ctxBar = document.getElementById("barChart").getContext("2d");
    const barChart = new Chart(ctxBar, configBar);
  }
});