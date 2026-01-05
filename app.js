const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

const app = document.getElementById("app");
const STORAGE_KEY = "daily_counter";

function getSavedCounter() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveCounter(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function daysBetween(startDate) {
  const start = new Date(startDate);
  const today = new Date();
  const diff = today - start;
  return Math.floor(diff / 86400000);
}

function renderForm() {
  app.innerHTML = `
    <h2>Create your counter</h2>
    <input id="title" placeholder="Event name" />
    <input id="date" type="date" />
    <button id="start">Start counting</button>
  `;

  document.getElementById("start").onclick = () => {
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value;

    if (!title || !date) return;

    saveCounter({ title, startDate: date });
    renderCounter();
  };
}

function renderCounter() {
  const data = getSavedCounter();
  if (!data) return renderForm();

  const days = daysBetween(data.startDate);

  app.innerHTML = `
    <h2>${data.title}</h2>
    <div class="counter">${days}</div>
    <div>days</div>
    <button id="reset">Reset counter</button>
  `;

  document.getElementById("reset").onclick = () => {
    localStorage.removeItem(STORAGE_KEY);
    renderForm();
  };
}

renderCounter();
