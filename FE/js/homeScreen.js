$(document).ready(function () {
  const data = {
    labels: [
      "Транспорт и авто услуги",
      "Супермаркети",
      "Пътуване и ваканция",
      "Шопинг",
      "Ресторанти и барове",
      "Финансови услуги",
      "Инвестиции",
      "Забавление и спорт",
      "Здраве и красота",
      "Дрехи",
      "Кеш",
      "За дома",
      "Публични услуги",
      "Бизнес услуги",
      "Битови сметки",
      "Образование",
      "Задължения и такси",
      "Преводи",
      "Други",
      "Погасяване по кредитни продукти",
      "Приход",
      "Приход ATM",
    ],
    datasets: [
      {
        label: "Sample Dataset",
        data: [
          69, 48, 324, 183, 217, 18, 481, 34, 120, 10, 356, 437, 244, 20, 65,
          310, 303, 88, 492, 316, 262, 228,
        ],
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
      },
    ],
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

  const dataBar = {
    labels: ["Заплата", "Наем", "Залагане"],
    datasets: [
      {
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
});
