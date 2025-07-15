let tasks = [];

// Enhanced formatDate with cosmic terms
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today 🌟";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow 🚀";
  } else if (date < today) {
    return `${date.toLocaleDateString(undefined, options)} (Overdue) ⏳`;
  } else {
    return date.toLocaleDateString(undefined, options);
  }
}

function renderTasks(filteredTasks = tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  if (filteredTasks.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.className = 'empty-message';
    emptyMsg.innerHTML = `
      <p>No tasks in your cosmic queue!</p>
      <small>The universe is waiting for your plans...</small>
    `;
    taskList.appendChild(emptyMsg);
    return;
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) li.classList.add('completed');

    const taskTop = document.createElement('div');
    taskTop.className = 'task-top';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(index));

    const taskSpan = document.createElement('span');
    taskSpan.innerHTML = `${task.text} <small>(Due: ${formatDate(task.date)})</small>`;

    const priority = document.createElement('span');
    priority.className = `task-priority ${task.priority}`;
    priority.textContent = task.priority;

    taskTop.appendChild(checkbox);
    taskTop.appendChild(taskSpan);
    taskTop.appendChild(priority);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = 'Edit <span class="emoji">✏️</span>';
    editBtn.addEventListener('click', () => editTask(index));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = 'Delete <span class="emoji">💥</span>';
    deleteBtn.addEventListener('click', () => deleteTask(index));

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(taskTop);
    li.appendChild(actions);
    taskList.appendChild(li);
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();

  if (tasks[index].completed) {
    const completedTask = document.querySelector(`#taskList li:nth-child(${index + 1})`);
    if (completedTask) {
      completedTask.classList.add('celebrate');
      setTimeout(() => {
        completedTask.classList.remove('celebrate');
      }, 1000);
    }
  }
}

function deleteTask(index) {
  const taskItem = document.querySelector(`#taskList li:nth-child(${index + 1})`);
  if (taskItem) {
    taskItem.classList.add('explode');
    setTimeout(() => {
      tasks.splice(index, 1);
      renderTasks();
    }, 300);
  } else {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function editTask(index) {
  const newText = prompt('Edit your cosmic task:', tasks[index].text);
  if (newText === null) return;

  // Create a temporary date input for calendar picker
  const tempInput = document.createElement('input');
  tempInput.type = 'date';
  tempInput.value = tasks[index].date;
  tempInput.min = new Date().toISOString().split('T')[0];

  // Position it off-screen and focus it to show the picker
  tempInput.style.position = 'fixed';
  tempInput.style.opacity = 0;
  tempInput.style.pointerEvents = 'none';
  document.body.appendChild(tempInput);

  tempInput.showPicker(); // This triggers the native date picker

  tempInput.addEventListener('change', () => {
    if (tempInput.value) {
      tasks[index].text = newText;
      tasks[index].date = tempInput.value;
      renderTasks();
    }
    document.body.removeChild(tempInput);
  });
}

// Galaxy Stars Animation
function createGalaxyStars() {
  const canvas = document.getElementById("galaxyCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const starColors = ["#ffffff", "#fca3ff", "#a8b6ff", "#91f5ff", "#ffb3ec", "#caa7ff"];
  const stars = [];
  const starCount = Math.floor(window.innerWidth * window.innerHeight / 1000);

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      color: starColors[Math.floor(Math.random() * starColors.length)],
      alpha: Math.random(),
      delta: Math.random() * 0.02 + 0.005,
      glow: Math.random() * 2 + 1
    });
  }

  const milkyWay = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    width: canvas.width * 0.8,
    height: canvas.height * 0.3,
    angle: Math.random() * Math.PI
  };

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Milky Way
    ctx.save();
    ctx.translate(milkyWay.x, milkyWay.y);
    ctx.rotate(milkyWay.angle);

    const gradient = ctx.createLinearGradient(-milkyWay.width / 2, 0, milkyWay.width / 2, 0);
    gradient.addColorStop(0, 'rgba(157, 101, 255, 0.05)');
    gradient.addColorStop(0.5, 'rgba(93, 138, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(157, 101, 255, 0.05)');

    ctx.fillStyle = gradient;
    ctx.fillRect(-milkyWay.width / 2, -milkyWay.height / 2, milkyWay.width, milkyWay.height);
    ctx.restore();

    // Draw stars
    stars.forEach((star) => {
      star.alpha += star.delta;
      if (star.alpha <= 0 || star.alpha >= 1) {
        star.delta *= -1;
      }

      const glowGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.glow
      );
      glowGradient.addColorStop(0, star.color);
      glowGradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalAlpha = star.alpha * 0.7;
      ctx.fillStyle = glowGradient;
      ctx.fillRect(star.x - star.glow, star.y - star.glow, star.glow * 2, star.glow * 2);

      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = star.color;
      ctx.fill();
    });

    milkyWay.angle += 0.0001;
    requestAnimationFrame(animate);
  }

  animate();
}

// Shooting stars
function createShootingStars() {
  const container = document.querySelector('.shooting-stars');
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < 3; i++) {
    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDelay = `${Math.random() * 10}s`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    star.style.transform = `rotate(${Math.random() * 30 + 10}deg)`;
    container.appendChild(star);
  }
}

// Theme management
let currentTheme = localStorage.getItem('theme') || 'dark';

function applyTheme() {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(currentTheme);

  const themeBtn = document.getElementById('toggleDarkMode');
  themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  if (currentTheme === 'dark') {
    createGalaxyStars();
    createShootingStars();
  }
}

// Prevent manual date input
function setupDateInput() {
  const dateInput = document.getElementById('taskDate');

  // Prevent manual typing
  dateInput.addEventListener('keydown', (e) => {
    e.preventDefault();
    dateInput.showPicker();
  });

  // Also show picker on focus
  dateInput.addEventListener('focus', () => {
    dateInput.showPicker();
  });

  // Set min date to today
  dateInput.min = new Date().toISOString().split('T')[0];
}

document.addEventListener('DOMContentLoaded', () => {
  tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  setupDateInput();
  applyTheme();

  const taskInput = document.getElementById('taskInput');
  const taskDate = document.getElementById('taskDate');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const priorityInput = document.getElementById('taskPriority');
  const searchInput = document.getElementById('searchInput');
  const clearCompleted = document.getElementById('clearCompleted');
  const toggleDarkMode = document.getElementById('toggleDarkMode');

  addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const date = taskDate.value;
    const priority = priorityInput.value;

    if (text && date) {
      tasks.push({ text, date, priority, completed: false });
      tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
      taskInput.value = '';
      taskDate.value = '';
      renderTasks();

      addTaskBtn.innerHTML = 'Task Launched! 🚀';
      setTimeout(() => {
        addTaskBtn.innerHTML = 'Launch Task';
      }, 2000);
    } else {
      alert('Please enter both task and date!');
    }
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addTaskBtn.click();
    }
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = tasks.filter(t => t.text.toLowerCase().includes(query));
    renderTasks(filtered);
  });

  // ... (keep all your existing code until the clearCompleted event listener)

  clearCompleted.addEventListener('click', () => {
    if (confirm('Clear all completed missions from your cosmic log?')) {
      // Create a new array with only incomplete tasks
      tasks = tasks.filter(task => !task.completed);

      // Update localStorage with the new tasks array
      localStorage.setItem('tasks', JSON.stringify(tasks));

      renderTasks();

      clearCompleted.innerHTML = 'Missions Cleared! 🌌';
      setTimeout(() => {
        clearCompleted.innerHTML = 'Clear Completed Missions';
      }, 2000);
    }
  });

  // ... (rest of your existing code)

  toggleDarkMode.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
  });

  window.addEventListener('resize', () => {
    if (currentTheme === 'dark') {
      createGalaxyStars();
      createShootingStars();
    }
  });

  renderTasks();
});