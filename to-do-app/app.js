/* ═══════════════════════════════════════════════════
   TaskFlow — app.js
   Persistence: localStorage (simulates db.json)
   Keys: "tf_users" | "tf_todos" | "tf_current_user"
═══════════════════════════════════════════════════ */

// ─── Storage Helpers ─────────────────────────────────────
const DB = {
  getUsers:       ()      => JSON.parse(localStorage.getItem('tf_users'))       || [],
  saveUsers:      (users) => localStorage.setItem('tf_users', JSON.stringify(users)),
  getTodos:       ()      => JSON.parse(localStorage.getItem('tf_todos'))       || [],
  saveTodos:      (todos) => localStorage.setItem('tf_todos', JSON.stringify(todos)),
  getCurrentUser: ()      => JSON.parse(localStorage.getItem('tf_current_user')) || null,
  setCurrentUser: (user)  => localStorage.setItem('tf_current_user', JSON.stringify(user)),
  clearCurrentUser:()     => localStorage.removeItem('tf_current_user'),
};

// ─── DOM References ──────────────────────────────────────
const views = {
  login:    document.getElementById('login-view'),
  register: document.getElementById('register-view'),
  app:      document.getElementById('app-view'),
};

const loginForm        = document.getElementById('login-form');
const registerForm     = document.getElementById('register-form');
const taskForm         = document.getElementById('task-form');

const loginEmail       = document.getElementById('login-email');
const loginPassword    = document.getElementById('login-password');
const loginError       = document.getElementById('login-error');

const registerName     = document.getElementById('register-name');
const registerEmail    = document.getElementById('register-email');
const registerPassword = document.getElementById('register-password');
const registerError    = document.getElementById('register-error');

const taskTitle        = document.getElementById('task-title');
const taskType         = document.getElementById('task-type');
const taskDescription  = document.getElementById('task-description');
const taskError        = document.getElementById('task-error');
const taskList         = document.getElementById('task-list');
const taskCount        = document.getElementById('task-count');

const userGreeting     = document.getElementById('user-greeting');
const btnLogout        = document.getElementById('btn-logout');
const goToRegister     = document.getElementById('go-to-register');
const goToLogin        = document.getElementById('go-to-login');

// ─── View Router ─────────────────────────────────────────
function switchView(name) {
  Object.values(views).forEach(v => v.classList.add('hidden'));
  views[name].classList.remove('hidden');
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
  el.classList.add('shake');
  el.addEventListener('animationend', () => el.classList.remove('shake'), { once: true });
}

function hideError(el) {
  el.textContent = '';
  el.classList.add('hidden');
}

// ─── Auth: Init ──────────────────────────────────────────
function init() {
  const user = DB.getCurrentUser();
  if (user) {
    loadDashboard(user);
  } else {
    switchView('login');
  }
}

// ─── Auth: Register ──────────────────────────────────────
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideError(registerError);

  const name     = registerName.value.trim();
  const email    = registerEmail.value.trim().toLowerCase();
  const password = registerPassword.value;

  if (!name || !email || !password) {
    return showError(registerError, 'Preencha todos os campos obrigatórios.');
  }
  if (password.length < 6) {
    return showError(registerError, 'A senha deve ter pelo menos 6 caracteres.');
  }

  const users = DB.getUsers();
  if (users.find(u => u.email === email)) {
    return showError(registerError, 'Este e-mail já está cadastrado.');
  }

  const newUser = { id: Date.now(), name, email, password };
  DB.saveUsers([...users, newUser]);
  DB.setCurrentUser({ id: newUser.id, name: newUser.name, email: newUser.email });

  registerForm.reset();
  loadDashboard(DB.getCurrentUser());
});

// ─── Auth: Login ─────────────────────────────────────────
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideError(loginError);

  const email    = loginEmail.value.trim().toLowerCase();
  const password = loginPassword.value;

  if (!email || !password) {
    return showError(loginError, 'Informe o e-mail e a senha.');
  }

  const user = DB.getUsers().find(u => u.email === email && u.password === password);
  if (!user) {
    return showError(loginError, 'E-mail ou senha incorretos.');
  }

  DB.setCurrentUser({ id: user.id, name: user.name, email: user.email });
  loginForm.reset();
  loadDashboard(DB.getCurrentUser());
});

// ─── Auth: Logout ─────────────────────────────────────────
btnLogout.addEventListener('click', () => {
  DB.clearCurrentUser();
  switchView('login');
});

// ─── Navigation Toggles ──────────────────────────────────
goToRegister.addEventListener('click', () => {
  hideError(loginError);
  loginForm.reset();
  switchView('register');
});

goToLogin.addEventListener('click', () => {
  hideError(registerError);
  registerForm.reset();
  switchView('login');
});

// ─── Dashboard ───────────────────────────────────────────
function loadDashboard(user) {
  userGreeting.textContent = user.name;
  switchView('app');
  renderTasks(user.email);
}

// ─── Task: Add ───────────────────────────────────────────
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideError(taskError);

  const title       = taskTitle.value.trim();
  const type        = taskType.value;
  const description = taskDescription.value.trim();

  if (!title) {
    return showError(taskError, 'O título da tarefa é obrigatório.');
  }

  const user = DB.getCurrentUser();
  const todos = DB.getTodos();

  const newTodo = {
    id:          Date.now(),
    userId:      user.email,
    title,
    type,
    description,
    done:        false,
    createdAt:   new Date().toISOString(),
  };

  DB.saveTodos([...todos, newTodo]);
  taskForm.reset();
  renderTasks(user.email);
});

// ─── Task: Toggle Done ───────────────────────────────────
function toggleDone(id) {
  const todos   = DB.getTodos();
  const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  DB.saveTodos(updated);
  renderTasks(DB.getCurrentUser().email);
}

// ─── Task: Delete ────────────────────────────────────────
function deleteTask(id) {
  const todos   = DB.getTodos();
  const updated = todos.filter(t => t.id !== id);
  DB.saveTodos(updated);
  renderTasks(DB.getCurrentUser().email);
}

// ─── Badge Config ────────────────────────────────────────
const BADGE = {
  'Trabalho': { cls: 'badge-work',     icon: '💼' },
  'Pessoal':  { cls: 'badge-personal', icon: '🏠' },
  'Estudos':  { cls: 'badge-study',    icon: '📚' },
};

// ─── Task: Render ────────────────────────────────────────
function renderTasks(userId) {
  const allTodos = DB.getTodos();
  const mine     = allTodos.filter(t => t.userId === userId);

  const pending   = mine.filter(t => !t.done);
  const completed = mine.filter(t =>  t.done);
  const sorted    = [...pending, ...completed];

  const total     = mine.length;
  const doneCount = completed.length;

  taskCount.textContent = total === 0
    ? 'Sem tarefas'
    : `${doneCount}/${total} concluídas`;

  if (sorted.length === 0) {
    taskList.innerHTML = `
      <div class="glass-card rounded-2xl p-10 text-center">
        <div class="text-4xl mb-3">📋</div>
        <p class="text-slate-400 text-sm">Nenhuma tarefa cadastrada ainda.</p>
        <p class="text-slate-500 text-xs mt-1">Adicione sua primeira tarefa acima!</p>
      </div>`;
    return;
  }

  taskList.innerHTML = sorted.map(task => buildTaskCard(task)).join('');
}

function buildTaskCard(task) {
  const badge       = BADGE[task.type] || { cls: 'badge-work', icon: '📌' };
  const doneClass   = task.done ? 'task-done' : '';
  const descHtml    = task.description
    ? `<p class="text-slate-400 text-sm mt-2 leading-relaxed">${escapeHtml(task.description)}</p>`
    : '';

  const doneLabel   = task.done ? 'Reabrir' : 'Concluir';
  const doneBtnCls  = task.done ? 'btn-secondary' : 'btn-done';

  return `
    <div class="glass-card rounded-2xl p-5 ${doneClass} slide-in" data-id="${task.id}">
      <div class="flex items-start justify-between gap-3">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap mb-1">
            <span class="${badge.cls} text-xs font-medium rounded-full px-2.5 py-0.5">
              ${badge.icon} ${escapeHtml(task.type)}
            </span>
            ${task.done ? '<span class="text-xs text-slate-500 bg-slate-700/50 rounded-full px-2 py-0.5">✓ Concluída</span>' : ''}
          </div>
          <p class="task-title font-semibold text-slate-100 truncate">${escapeHtml(task.title)}</p>
          ${descHtml}
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button
            class="${doneBtnCls} rounded-lg px-3 py-1.5 text-xs font-medium"
            onclick="toggleDone(${task.id})"
            aria-label="${doneLabel} tarefa: ${escapeHtml(task.title)}"
          >${doneLabel}</button>
          <button
            class="btn-delete rounded-lg px-2.5 py-1.5 text-xs"
            onclick="deleteTask(${task.id})"
            aria-label="Excluir tarefa: ${escapeHtml(task.title)}"
            title="Excluir"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>`;
}

// ─── Utility: XSS Guard ──────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Bootstrap ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
