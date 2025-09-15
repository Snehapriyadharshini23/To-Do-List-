// DOM Elements
const menuButtons = document.querySelectorAll(".menu button");
const sections = document.querySelectorAll(".content-section");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const deadlineInput = document.getElementById("deadline-input");
const pendingList = document.getElementById("pending-list");
const completedList = document.getElementById("completed-list");
const deleteList = document.getElementById("delete-list");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
renderAll();

// Navigation
menuButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(btn.dataset.section).classList.add("active");
  });
});


// Add Task
taskForm.addEventListener("submit", e => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value;
  if (!text || !deadline) return;

  // Check deadline validity
  const today = new Date();
  today.setHours(0, 0, 0, 0); // reset to midnight (ignore time part)
  const deadlineDate = new Date(deadline);

  if (deadlineDate < today) {
    alert("Deadline cannot be in the past!");
    return;
  }

  // Prevent duplicates (check by text + deadline)
  const duplicate = tasks.some(t => 
    t.text.toLowerCase() === text.toLowerCase() && t.deadline === deadline
  );
  if (duplicate) {
    alert("This task already exists!");
    return;
  }

  const task = {
    id: Date.now(),
    text,
    deadline,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderAll();

  taskInput.value = "";
  deadlineInput.value = "";
});


// Render Functions
function renderAll() {
  renderPending();
  renderCompleted();
  renderDelete();
}

function renderPending() {
  pendingList.innerHTML = "";

  let pendingTasks = tasks.filter(t => !t.completed);
  pendingTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  pendingTasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <small>⏳ ${task.deadline}</small>
      <button class="task-btn complete-btn">Done</button>
    `;
    li.querySelector(".complete-btn").addEventListener("click", () => {
      task.completed = true;
      saveTasks();
      renderAll();
    });
    pendingList.appendChild(li);
  });
}

function renderCompleted() {
  completedList.innerHTML = "";
  tasks.filter(t => t.completed).forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <small>✔️ ${task.deadline}</small>
    `;
    completedList.appendChild(li);
  });
}

function renderDelete() {
  deleteList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${task.text}</span>
      <small>${task.deadline}</small>
      <button class="task-btn delete-btn">Delete</button>
    `;
    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderAll();
    });
    deleteList.appendChild(li);
  });
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}