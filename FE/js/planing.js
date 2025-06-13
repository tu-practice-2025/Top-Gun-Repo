$(document).ready(function () {
  function updateProgressBar() {
    const current = parseFloat($("#currentValue").val());
    const max = parseFloat($("#maxValue").val());

    if (isNaN(current) || isNaN(max) || max <= 0) {
      $(".progress-bar").css("width", "0%").text("0%");
      return;
    }

    let percent = (current / max) * 100;
    if (percent > 100) percent = 100;

    $(".progress-bar")
      .css("width", percent + "%")
      .text(Math.round(percent) + "%");
  }

  $("#currentValue, #maxValue").on("keypress", function (e) {
    if (e.which === 13) {
      updateProgressBar();
    }
  });
});
