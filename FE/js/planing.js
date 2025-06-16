$(document).ready(function () {
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
    $.ajax({
      url: "https://localhost:7121/api/categories",
      method: "GET",
      success: function (categories) {
        const $select = $("#inputCategory");
        $select.empty();
        $select.append('<option value="">-- Choose category --</option>');

        categories.forEach(function (category) {
          $select.append(
            `<option value="${category.name}">${category.name}</option>`
          );
        });
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        $("#inputCategory").html(
          '<option value="">No available category</option>'
        );
      },
    });
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
    const typeCell = $("<td contenteditable='false'></td>").text(type);
    const categoryCell = $("<td contenteditable='true'></td>").text(category);
    const displayAmount = isIncome
      ? finalAmount.toFixed(2)
      : `-${Math.abs(finalAmount).toFixed(2)}`;

    const valueCell = $("<td contenteditable='true'></td>").text(displayAmount);

    const editCell = $("<td class='edit-cell'>✏️</td>");
    const deleteCell = $("<td class='delete-cell'>🗑️</td>");

    newRow.append(typeCell, categoryCell, valueCell, editCell, deleteCell);
    tableBody.append(newRow);

    closePopup();
    updateProgressBar();
    toggleEmptyMessage();
  }

  function closePopup() {
    $("#popupForm").removeClass("active");
    $("#inputCategory").val("");
    $("#inputAmount").val("");
  }

  $(document).on("click", ".delete-cell", function () {
    $(this).closest("tr").remove();
    updateProgressBar();
    toggleEmptyMessage();
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
    }
  });

  $(document).on("blur", "#expensesTable td[contenteditable]", function () {
    const $row = $(this).closest("tr");
    const category = $row.find("td:eq(0)").text().trim();
    const amount = parseFloat($row.find("td:eq(1)").text().trim());

    if (!category || isNaN(amount)) return;

    updateProgressBar();
  });

  $("#inputType").on("change", function () {
    const label = this.checked ? "Income" : "Expenses";
    $("#typeLabel").text(label);
  });
});
