$(document).ready(function () {
  function updateProgressBar() {
    let total = 0;

    $("#expensesTable tr").each(function (index) {
      if (index === 0) return;
      const valueText = $(this).find("td:eq(1)").text().trim();
      const value = parseFloat(valueText);
      if (!isNaN(value)) {
        total += value;
      }
    });

    const max = parseFloat($("#maxValue").val());

    if (isNaN(max) || max <= 0) {
      $(".progress-bar").css("width", "0%").text("0%");
      return;
    }

    let percent = (total / max) * 100;
    if (percent > 100) percent = 100;

    $(".progress-bar")
      .css("width", percent + "%")
      .text(Math.round(percent) + "%");

    $("#totalDisplay").text("Общо: " + total.toFixed(2) + "$");
  }

  $("#addRowBtn").on("click", function () {
    $("#popupForm").fadeIn();
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
    const category = $("#inputCategory").val().trim();
    const amount = parseFloat($("#inputAmount").val());

    if (!category || isNaN(amount)) {
      alert("Моля, въведете валидни данни.");
      return;
    }

    const tableBody = $("#expensesTable tbody");
    const newRow = $("<tr></tr>");
    const categoryCell = $("<td contenteditable='true'></td>").text(category);
    const valueCell = $("<td contenteditable='true'></td>").text(
      amount.toFixed(2)
    );

    const editCell = $("<td class='edit-cell'>✏️</td>");
    const deleteCell = $("<td class='delete-cell'>🗑️</td>");

    newRow.append(categoryCell, valueCell, editCell, deleteCell);
    tableBody.append(newRow);

    closePopup();
    updateProgressBar();
    toggleEmptyMessage();
  }

  function closePopup() {
    $("#popupForm").fadeOut();
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
      row
        .find("td")
        .not(".edit-cell, .delete-cell")
        .attr("contenteditable", "true")
        .css("background-color", "#eef");
      row.attr("data-editing", "true");
      $(this).text("💾");
    } else {
      row.find("td").removeAttr("contenteditable").css("background-color", "");
      row.removeAttr("data-editing");
      $(this).text("✏️");
      updateProgressBar();
    }
  });

  $(document).on("blur", "#expensesTable td[contenteditable]", function () {
    updateProgressBar();
  });
});
