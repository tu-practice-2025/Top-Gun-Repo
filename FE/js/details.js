document.addEventListener("DOMContentLoaded", () => {
    const monthInput = document.getElementById("month");

    const today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 2;

    if (month > 12) {
        month = 1;
        year += 1;
    }

    const formattedMonth = `${year}-${month.toString().padStart(2, '0')}`;
    monthInput.value = formattedMonth;
});