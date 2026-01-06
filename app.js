// Основная логика счётчика
const eventInput = document.getElementById("event");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const counterDisplay = document.getElementById("counter");

// Функция для расчёта дней
function calculateDays(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today - eventDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Рендерим счётчик
function renderCounter() {
    const storedDate = localStorage.getItem("daily_counter_date");
    const storedEvent = localStorage.getItem("daily_counter_event");

    if (storedDate && storedEvent) {
        const days = calculateDays(storedDate);
        counterDisplay.textContent = days;
        eventInput.value = storedEvent;
        dateInput.value = storedDate;
    } else {
        counterDisplay.textContent = 0;
    }
}

// Добавляем / сбрасываем событие
addBtn.addEventListener("click", () => {
    const eventName = eventInput.value;
    const eventDate = dateInput.value;

    if (!eventName || !eventDate) {
        alert("Please enter event and date");
        return;
    }

    localStorage.setItem("daily_counter_event", eventName);
    localStorage.setItem("daily_counter_date", eventDate);
    renderCounter();
});

// Инициализация при загрузке
renderCounter();

// Telegram Mini App интеграция
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    tg.MainButton.text = "Reset Counter";
    tg.MainButton.color = "#FF3B30"; // красная кнопка Apple style
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        localStorage.removeItem("daily_counter_date");
        localStorage.removeItem("daily_counter_event");
        renderCounter();
        tg.MainButton.hide(); // скрываем кнопку после сброса
    });
}
