$(document).ready(function () {
  const userId = parseInt(sessionStorage.getItem("userId"));
  if (!userId) {
    window.location.href = "login.html";
    return;
  }
  let categoriesMap = {};
  loadUserTransactions();

  function getNextMonthYear() {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return {
      year: nextMonth.getFullYear(),
      month: nextMonth.getMonth() + 1,
    };
  }

  function updateProgressBar() {
    let totalExpense = 0;
    let totalIncome = 0;

    $("#expensesTable tbody tr").each(function () {
      const type = $(this).find("td:eq(0)").text().trim();
      const amountText = $(this).find("td:eq(2)").text().trim();
      const amount = parseFloat(amountText);

      if (!isNaN(amount)) {
        if (type === "Income") {
          totalIncome += amount;
        } else {
          totalExpense += Math.abs(amount);
        }
      }
    });

    let percent = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;
    if (percent > 100) percent = 100;

    $(".progress-bar")
      .css("width", percent + "%")
      .text(Math.round(percent) + "%");

    $("#totalDisplay").text(`Total: ${totalExpense.toFixed(2)}$`);
    $("#maxValueDisplay").text(`${totalIncome.toFixed(2)}$`);

    if (totalExpense > totalIncome) {
      $("#maxValueDisplay").addClass("overbudget");
      $("#budgetWarning").show();
    } else {
      $("#maxValueDisplay").removeClass("overbudget");
      $("#budgetWarning").hide();
    }
  }

  function loadCategories() {
    const selectedType = $("input[name='entryType']:checked").val();

    fetch("https://localhost:7121/api/categories")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((categories) => {
        categoriesMap = {};
        const $select = $("#inputCategory");
        $select.empty();
        $select.append('<option value="">-- Choose category --</option>');

        if (selectedType === "Income") {
          categories.sort((a, b) => {
            const aIsIncome = a.name.toLowerCase().includes("income") ? -1 : 1;
            const bIsIncome = b.name.toLowerCase().includes("income") ? -1 : 1;
            return aIsIncome - bIsIncome;
          });
        }

        categories.forEach((category) => {
          categoriesMap[category.name] = category.categoryId;
          $select.append(
            `<option value="${category.name}">${category.name}</option>`
          );
        });
      })
      .catch((error) => {
        console.error("Error loading categories:", error);
        $("#inputCategory").html(
          '<option value="">No available category</option>'
        );
      });
  }

  function loadUserTransactions() {
    const { year, month } = getNextMonthYear();

    fetch(
      `https://localhost:7121/api/futuretransaction/${userId}?year=${year}&month=${month}`
    )
      .then((response) => response.json())
      .then((transactions) => {
        const $tableBody = $("#expensesTable tbody");
        $tableBody.empty();

        transactions.forEach((t) => {
          const type = t.type === "I" ? "Income" : "Expense";
          const amount =
            t.type === "I" ? t.amount.toFixed(2) : `-${t.amount.toFixed(2)}`;
          const row = $("<tr></tr>").attr("id", `${t.tranId}`);
          row.append(
            $("<td></td>").text(type),
            $("<td></td>").text(t.categoryName),
            $("<td></td>").text(amount),
            $("<td class='edit-cell'>✏️</td>"),
            $("<td class='delete-cell'>🗑️</td>")
          );
          $tableBody.append(row);
        });

        updateProgressBar();
        toggleEmptyMessage();
      })
      .catch((err) => console.error("Error loading transactions:", err));

    loadCategories();
  }

  $("#addRowBtn").on("click", function () {
    loadCategories();
    $("#popupForm").addClass("active");
    $("#inputCategory").focus();
  });

  $("#popupForm").on("click", function (e) {
    if (e.target.id === "popupForm") {
      closePopup();
    }
  });

  $("#cancelAdd").on("click", function () {
    closePopup();
  });

  $("#confirmAdd").on("click", function () {
    confirmAndAddRow();
  });

  $("#inputCategory, #inputAmount").on("keypress", function (e) {
    if (e.which === 13) {
      confirmAndAddRow();
    }
  });

  $("#maxValue").on("keypress", function (e) {
    if (e.which === 13) {
      updateProgressBar();
    }
  });

  function toggleEmptyMessage() {
    const hasRows = $("#expensesTable tbody tr").length > 0;
    $("#emptyMessage").toggle(!hasRows);
  }

  function confirmAndAddRow() {
    const category = $("#inputCategory option:selected").val().trim();
    const amount = parseFloat($("#inputAmount").val());
    const type = $("input[name='entryType']:checked").val();
    const isIncome = type === "Income";

    if (!category || isNaN(amount)) {
      alert("Please, insert correct data.");
      return;
    }

    const finalAmount = isIncome ? amount : -Math.abs(amount);

    const tableBody = $("#expensesTable tbody");
    const newRow = $("<tr></tr>");
    const typeCell = $("<td></td>").text(type);
    const categoryCell = $("<td></td>").text(category);
    const displayAmount = isIncome
      ? finalAmount.toFixed(2)
      : `-${Math.abs(finalAmount).toFixed(2)}`;

    const valueCell = $("<td></td>").text(displayAmount);

    const editCell = $("<td class='edit-cell'>✏️</td>");
    const deleteCell = $("<td class='delete-cell'>🗑️</td>");

    newRow.append(typeCell, categoryCell, valueCell, editCell, deleteCell);

    closePopup();
    updateProgressBar();
    toggleEmptyMessage();

    const transactionDto = {
      CategoryId: categoriesMap[category],
      UserId: userId,
      Amount: Math.abs(finalAmount),
      Type: isIncome ? "I" : "E",
      Date: getFirstDayOfNextMonthISO(),
    };

    fetch("https://localhost:7121/api/futuretransaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionDto),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((msg) => {
            throw new Error(msg);
          });
        }
        return response.json();
      })
      .then((data) => {
        newRow.attr("id", `${data.id}`);
        tableBody.append(newRow);
      })
      .catch((error) => {
        console.error("Error loading", error.message);
        alert("ERROR. CHECK CONSOLE");
      });
  }

  function getFirstDayOfNextMonthISO() {
    const now = new Date();
    const date = new Date(now.getFullYear(), now.getMonth() + 1, 2);
    return date.toISOString().slice(0, 10);
  }

  function closePopup() {
    $("#popupForm").removeClass("active");
    $("#inputCategory").val("");
    $("#inputAmount").val("");
  }

  $(document).on("click", ".delete-cell", function () {
    const row = $(this).closest("tr");
    const id = row[0].id;
    if (id) {
      fetch(`https://localhost:7121/api/futuretransaction/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to delete");
          loadUserTransactions();
        })
        .catch((err) => {
          console.error("Delete error:", err);
          alert("Could not delete from database.");
        });
    } else {
      row.remove();
      updateProgressBar();
      toggleEmptyMessage();
    }
  });

  $(document).on("click", ".edit-cell", function () {
    const row = $(this).closest("tr");
    const isEditable = row.attr("data-editing") === "true";

    if (!isEditable) {
      row.find("td").each(function (index) {
        if (index === 1 || index === 2) {
          $(this)
            .attr("contenteditable", "true")
            .css("background-color", "#eef");
        }
      });
      row.attr("data-editing", "true");
      $(this).text("💾");
    } else {
      row.find("td").each(function (index) {
        if (index === 1 || index === 2) {
          $(this).removeAttr("contenteditable").css("background-color", "");
        }
      });
      row.removeAttr("data-editing");
      $(this).text("✏️");
      updateProgressBar();

      const id = row.attr("id");
      const typeText = row.find("td:eq(0)").text().trim();
      const categoryName = row.find("td:eq(1)").text().trim();
      const amount = parseFloat(row.find("td:eq(2)").text().trim());
      const isIncome = typeText === "Income";

      if (!categoryName || isNaN(amount) || !id) return;

      const updatedDto = {
        CategoryId: categoriesMap[categoryName],
        UserId: userId,
        Amount: Math.abs(amount),
        Type: isIncome ? "I" : "E",
        Date: getFirstDayOfNextMonthISO(),
      };

      fetch(`https://localhost:7121/api/futuretransaction/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDto),
      })
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update");
          return response.json();
        })
        .then(() => {
          loadUserTransactions();
        })
        .catch((err) => {
          console.error("Update error:", err);
          alert("Could not update in database.");
        });
    }
  });

  $(document).on("blur", "#expensesTable td[contenteditable]", function () {
    const $row = $(this).closest("tr");
    const category = $row.find("td:eq(0)").text().trim();
    const amount = parseFloat($row.find("td:eq(1)").text().trim());

    if (!category || isNaN(amount)) return;

    updateProgressBar();
  });

  $("input[name='entryType']").on("change", function () {
    const label = $(this).val();
    $("#typeLabel").text(label);
    loadCategories();
  });
});
