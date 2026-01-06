const eventInput = document.getElementById("event");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");
const tasksContainer = document.getElementById("tasksContainer");

// Получение задач из localStorage
function getTasks() {
    const tasks = localStorage.getItem("daily_counter_tasks");
    return tasks ? JSON.parse(tasks) : [];
}

// Сохранение задач
function saveTasks(tasks) {
    localStorage.setItem("daily_counter_tasks", JSON.stringify(tasks));
}

// Расчёт дней
function calculateDays(dateStr) {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = today - eventDate;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Рендерим все задачи
function renderTasks() {
    tasksContainer.innerHTML = "";
    const tasks = getTasks();

    tasks.forEach((task, index) => {
        const days = calculateDays(task.date);

        const taskDiv = document.createElement("div");
        taskDiv.className = "taskBubble";

        const title = document.createElement("div");
        title.className = "taskTitle";
        title.textContent = task.name;

        const counter = document.createElement("div");
        counter.className = "taskCounter";
        counter.textContent = days;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "deleteBtn";
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        });

        taskDiv.appendChild(title);
        taskDiv.appendChild(counter);
        taskDiv.appendChild(deleteBtn);

        tasksContainer.appendChild(taskDiv);
    });
}

// Добавление новой задачи
addBtn.addEventListener("click", () => {
    const eventName = eventInput.value.trim();
    const eventDate = dateInput.value;

    if (!eventName || !eventDate) {
        console.log("Введите событие и дату");
        return;
    }

    const tasks = getTasks();
    tasks.push({ name: eventName, date: eventDate });
    saveTasks(tasks);

    eventInput.value = "";
    dateInput.value = "";

    renderTasks();
});

// Автообновление каждые 1 час
setInterval(renderTasks, 3600000);

// Инициализация при загрузке
renderTasks();

// Telegram Mini App MainButton (Reset всех задач)
if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    tg.MainButton.text = "Reset All";
    tg.MainButton.color = "#FF3B30"; // красная Apple кнопка
    tg.MainButton.show();

    tg.MainButton.onClick(() => {
        localStorage.removeItem("daily_counter_tasks");
        renderTasks();
        tg.MainButton.hide();
    });
}
