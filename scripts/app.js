// App wiring and DOM logic
import { TaskManager } from './taskManager.js';
import { el, showToast, confettiBurst } from './utils.js';

const state = new TaskManager();

// DOM refs
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const prioritySelect = document.getElementById('prioritySelect');
const categoryInput = document.getElementById('categoryInput');
const descInput = document.getElementById('descInput');
const list = document.getElementById('taskList');
const counter = document.getElementById('completedCount');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const categoryFilter = document.getElementById('categoryFilter');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const taskStats = document.getElementById('taskStats');
const themeToggle = document.getElementById('themeToggle');
const installBtn = document.getElementById('installBtn');
let deferredPrompt = null;

// Configure Markdown rendering (if libs are loaded)
if (window.marked) {
  window.marked.setOptions({
    gfm: true,
    breaks: true
  });
}

function render() {
  // Clear list
  list.innerHTML = '';

  // Render items
  const tasks = state.getVisibleTasks();
  tasks.forEach(task => list.appendChild(renderTask(task)));

  // Update categories in filter
  syncCategoryFilterOptions();

  // Update counters
  counter.textContent = String(state.completedCount);
  const total = state.tasks.length;
  const active = state.tasks.filter(t => !t.completed).length;
  if (taskStats) taskStats.textContent = `${total} task${total!==1?'s':''} • ${active} active`;

  // refresh icons (Lucide) for any new elements
  lucide.createIcons();
}

function syncCategoryFilterOptions() {
  const categories = state.getCategories();
  const selected = categoryFilter.value;
  categoryFilter.innerHTML = '<option value="">All</option>' + categories.map(c => `<option value="${c}">${c}</option>`).join('');
  // keep selection if still available
  if (selected && categories.includes(selected)) {
    categoryFilter.value = selected;
  }
}

function priorityBadge(priority) {
  const color = priority === 'high' ? 'bg-red-500' : priority === 'low' ? 'bg-emerald-500' : 'bg-slate-400';
  const label = priority.charAt(0).toUpperCase() + priority.slice(1);
  return `<span class="ml-2 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium text-white ${color}">${label}</span>`;
}

function renderTask(task) {
  const li = el('li', { className: 'p-4 group flex items-start gap-3' });

  const checkbox = el('input', { attrs: { type: 'checkbox' } });
  checkbox.checked = task.completed;
  checkbox.className = 'mt-1 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500';

  const contentWrap = el('div', { className: 'flex-1 min-w-0 space-y-1' });

  const line = el('div', { className: 'text-sm leading-6 break-words' });
  line.innerHTML = `${escapeHtml(task.text)} ${priorityBadge(task.priority)} ${task.category ? `<span class="ml-2 text-xs text-slate-500">#${escapeHtml(task.category)}</span>` : ''}`;
  const desc = el('div', { className: 'text-sm text-slate-700 dark:text-slate-200 break-words flex items-start gap-2' });
  if (task.description) {
    const icon = el('i', { attrs: { 'data-lucide': 'align-left' }, className: 'w-4 h-4 mt-1 text-slate-400 dark:text-slate-400' });
    const text = el('div', { className: 'markdown flex-1' });
    // Render Markdown safely when libraries present; fallback to escaped text with line breaks
    try {
      if (window.marked && window.DOMPurify) {
        const html = window.marked.parse(task.description);
        text.innerHTML = window.DOMPurify.sanitize(html);
      } else {
        text.innerHTML = escapeHtml(task.description).replace(/\n/g, '<br />');
      }
    } catch (e) {
      text.textContent = task.description;
    }
    desc.appendChild(icon);
    desc.appendChild(text);
  }

  const actions = el('div', { className: 'opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-1' });
  const editBtn = el('button', { className: 'rounded p-1.5 hover:bg-slate-100', attrs: { title: 'Edit' } });
  editBtn.innerHTML = '<i data-lucide="pencil" class="w-4 h-4"></i>';
  const delBtn = el('button', { className: 'rounded p-1.5 hover:bg-slate-100 text-red-600', attrs: { title: 'Delete' } });
  delBtn.innerHTML = '<i data-lucide="trash-2" class="w-4 h-4"></i>';

  contentWrap.appendChild(line);
  if (task.description) contentWrap.appendChild(desc);
  li.appendChild(checkbox);
  li.appendChild(contentWrap);
  li.appendChild(actions);
  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  // completed styling
  if (task.completed) {
    li.classList.add('task-completed');
    line.classList.add('line-through', 'text-slate-400');
  }

  // Events
  checkbox.addEventListener('change', (e) => {
    const completed = state.toggleComplete(task.id);
    // Update UI immediately
    if (completed) {
      li.classList.add('task-completed');
      line.classList.add('line-through', 'text-slate-400');
      // Celebration
      showToast('Great job! Task completed.');
      const rect = li.getBoundingClientRect();
      confettiBurst(rect.left + rect.width - 40, rect.top + 8);
    } else {
      li.classList.remove('task-completed');
      line.classList.remove('line-through', 'text-slate-400');
    }
    counter.textContent = String(state.completedCount);
  });

  delBtn.addEventListener('click', () => {
    state.deleteTask(task.id);
    li.remove();
    render();
  });

  editBtn.addEventListener('click', () => startInlineEdit(li, task));

  return li;
}

function startInlineEdit(li, task) {
  const titleEditor = el('input', { attrs: { type: 'text' }, className: 'w-full rounded-md border-slate-300 focus:border-brand-500 focus:ring-brand-500 text-sm dark:bg-slate-700 dark:border-slate-600' });
  titleEditor.value = task.text;
  const contentWrap = li.querySelector('div.flex-1');
  const line = contentWrap.firstChild;
  // existing description (second child if present)
  const existingDesc = contentWrap.children[1];
  const descEditor = el('textarea', { className: 'mt-2 w-full rounded-md border-slate-300 focus:border-brand-500 focus:ring-brand-500 text-xs dark:bg-slate-700 dark:border-slate-600', attrs: { rows: '2' } });
  descEditor.value = task.description || '';
  const priorityEditor = el('select', { className: 'mt-2 w-fit rounded-md border-slate-300 focus:border-brand-500 focus:ring-brand-500 text-xs dark:bg-slate-700 dark:border-slate-600' });
  priorityEditor.innerHTML = `
    <option value="low">Priority: Low</option>
    <option value="normal">Priority: Normal</option>
    <option value="high">Priority: High</option>
  `;
  priorityEditor.value = task.priority || 'normal';
  contentWrap.replaceChild(titleEditor, line);
  if (existingDesc) {
    contentWrap.replaceChild(descEditor, existingDesc);
  } else {
    contentWrap.appendChild(descEditor);
  }
  // Insert Markdown toolbar for edit textarea
  const toolbar = buildMarkdownToolbar(descEditor);
  contentWrap.insertBefore(toolbar, descEditor);
  contentWrap.appendChild(priorityEditor);
  titleEditor.focus();
  titleEditor.select();

  let canceled = false;
  const commit = () => {
    if (canceled) return;
    const ok = state.editTask(task.id, titleEditor.value);
    if (!ok) {
      showToast('Task text cannot be empty', 1200);
    }
    state.editDescription(task.id, descEditor.value);
    state.editPriority(task.id, priorityEditor.value);
    render();
  };

  titleEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') { canceled = true; render(); }
  });
  titleEditor.addEventListener('blur', commit);
  descEditor.addEventListener('blur', commit);
  descEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { canceled = true; render(); }
    if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); commit(); }
  });
  priorityEditor.addEventListener('change', commit);
}

function addTaskFromForm() {
  const text = input.value;
  const priority = prioritySelect.value;
  const category = categoryInput.value;
  const description = descInput ? descInput.value : '';
  const task = state.addTask(text, priority, category, description);
  if (!task) {
    showToast('Please enter a task');
    return;
  }
  // Clear inputs
  input.value = '';
  if (descInput) descInput.value = '';
  if (categoryInput) categoryInput.value = '';
  if (prioritySelect) prioritySelect.value = 'normal';
  // focus back to title for quick entry
  input.focus();
  // Render
  render();
  // Animate enter
  list.firstElementChild?.classList.add('task-enter');
  requestAnimationFrame(() => list.firstElementChild?.classList.add('task-enter-active'));
}

function setActiveFilterButton(name) {
  filterButtons.forEach(btn => {
    const active = btn.dataset.filter === name;
    // Core active styles
    btn.classList.toggle('bg-brand-600', active);
    btn.classList.toggle('text-white', active);
    btn.classList.toggle('border-brand-600', active);

    // Remove conflicting defaults on active
    if (active) {
      btn.classList.remove('bg-white', 'hover:bg-slate-50');
      btn.classList.add('hover:bg-brand-700');
    } else {
      // Restore defaults on inactive
      btn.classList.add('bg-white', 'hover:bg-slate-50');
      btn.classList.remove('hover:bg-brand-700');
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>"]+/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

// Wire up events
addBtn.addEventListener('click', addTaskFromForm);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTaskFromForm();
  if (e.key === 'Escape') { clearFormInputs(); (e.target).blur(); }
});
categoryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTaskFromForm();
  if (e.key === 'Escape') { clearFormInputs(); (e.target).blur(); }
});
if (descInput) {
  descInput.addEventListener('keydown', (e) => {
    // Enter creates newline by default; Ctrl+Enter submits
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      addTaskFromForm();
    }
    if (e.key === 'Escape') { clearFormInputs(); (e.target).blur(); }
  });
}

filterButtons.forEach(btn => btn.addEventListener('click', () => {
  const f = btn.dataset.filter;
  state.setFilter(f);
  setActiveFilterButton(f);
  render();
}));

categoryFilter.addEventListener('change', (e) => {
  state.setCategoryFilter(e.target.value);
  render();
});

clearCompletedBtn.addEventListener('click', () => {
  const cleared = state.clearCompleted();
  if (cleared > 0) showToast(`Cleared ${cleared} completed task${cleared > 1 ? 's' : ''}`);
  render();
});

// Initial render
setActiveFilterButton('all');
render();

// Theme toggle
function applyTheme(theme) {
  const root = document.documentElement; // <html>
  const isDark = theme === 'dark';
  root.classList.toggle('dark', isDark);
  // swap icons
  const sun = document.querySelector('.theme-icon-dark');
  const moon = document.querySelector('.theme-icon-light');
  if (sun && moon) {
    sun.classList.toggle('hidden', !isDark);
    moon.classList.toggle('hidden', isDark);
  }
}

function initTheme() {
  // session only; default to system preference on first load
  let theme = sessionStorage.getItem('theme');
  if (!theme) {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    sessionStorage.setItem('theme', theme);
  }
  applyTheme(theme);
}

initTheme();

themeToggle?.addEventListener('click', () => {
  const current = sessionStorage.getItem('theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  sessionStorage.setItem('theme', next);
  applyTheme(next);
});

// Install prompt handling
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) {
    installBtn.classList.remove('hidden');
    console.log('Install button shown');
  }
});

// Also show install button if already installed criteria are met
window.addEventListener('appinstalled', (e) => {
  console.log('PWA was installed');
  deferredPrompt = null;
  if (installBtn) installBtn.classList.add('hidden');
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.classList.add('hidden');
});

// Utilities: markdown toolbar + text ops + form clearing
function clearFormInputs() {
  if (input) input.value = '';
  if (categoryInput) categoryInput.value = '';
  if (descInput) descInput.value = '';
  if (prioritySelect) prioritySelect.value = 'normal';
}

function buildMarkdownToolbar(textarea) {
  const bar = el('div', { className: 'md-toolbar -mt-1 mb-1 flex flex-wrap items-center gap-1 text-xs text-slate-600 dark:text-slate-300 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 p-1 relative' });
  const iconBtn = (icon, title, onClick) => {
    const b = el('button', { className: 'rounded px-1.5 py-1 hover:bg-slate-200 dark:hover:bg-slate-700', attrs: { type: 'button', title } });
    b.innerHTML = `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
    b.addEventListener('click', (e) => { e.preventDefault(); onClick(); textarea.focus(); lucide.createIcons(); });
    return b;
  };
  const sep = () => el('span', { className: 'mx-0.5 w-px h-4 bg-slate-300 dark:bg-slate-600' });
  const wrap = (before, after = before) => wrapSelection(textarea, before, after);
  const prefix = (pfx) => prefixLines(textarea, pfx);
  const prefixNumbered = () => prefixNumberedLines(textarea);
  const codeBlock = () => codeBlockWrap(textarea);
  const link = () => insertLink(textarea);
  const image = () => insertImage(textarea);
  const hr = () => insertHorizontalRule(textarea);
  const table = () => insertTable(textarea);
  const emoji = () => showEmojiPicker(bar, textarea);

  // Basic formatting
  bar.append(
    iconBtn('type', 'Headings: H1', () => prefix('# ')),
    iconBtn('bold', 'Bold', () => wrap('**')),
    iconBtn('italic', 'Italic', () => wrap('_')),
    sep(),
    iconBtn('code', 'Inline code', () => wrap('`')),
    iconBtn('code-2', 'Code block', () => codeBlock()),
    sep(),
    iconBtn('link', 'Insert link', () => link()),
    iconBtn('image', 'Insert image', () => image()),
    iconBtn('quote', 'Blockquote', () => prefix('> ')),
    sep(),
    iconBtn('list', 'Bulleted list', () => prefix('- ')),
    iconBtn('list-ordered', 'Numbered list', () => prefixNumbered()),
    iconBtn('square-check', 'Task list', () => prefix('- [ ] ')),
    sep(),
    iconBtn('strikethrough', 'Strikethrough', () => wrap('~~')),
    iconBtn('minus', 'Horizontal rule', () => hr()),
    sep(),
    iconBtn('table', 'Table', () => table()),
    iconBtn('smile', 'Emoji', () => emoji())
  );

  // Ensure icons render
  try { lucide.createIcons(); } catch (_) {}
  return bar;
}

function wrapSelection(textarea, before, after = before) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e);
  const newText = value.slice(0, s) + before + selected + after + value.slice(e);
  textarea.value = newText;
  const cursor = s + before.length + selected.length;
  textarea.setSelectionRange(cursor, cursor);
}

function prefixLines(textarea, pfx) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const head = value.slice(0, s);
  const body = value.slice(s, e);
  const tail = value.slice(e);
  const startLine = head.lastIndexOf('\n') + 1;
  const endLine = e + tail.indexOf('\n');
  const region = value.slice(startLine, e);
  const lines = region.split('\n');
  const updated = lines.map(l => l.startsWith(pfx) ? l : (l.trim().length ? pfx + l : l)).join('\n');
  const newText = value.slice(0, startLine) + updated + value.slice(e);
  textarea.value = newText;
  const newEnd = startLine + updated.length;
  textarea.setSelectionRange(startLine, newEnd);
}

function prefixNumberedLines(textarea) {
  const { selectionStart: s, value } = textarea;
  const startLine = value.lastIndexOf('\n', s - 1) + 1;
  const region = value.slice(startLine, textarea.selectionEnd);
  const lines = region.split('\n');
  let n = 1;
  const updated = lines.map(l => l.trim().length ? `${n++}. ${l.replace(/^\d+\.\s+/, '')}` : l).join('\n');
  const newText = value.slice(0, startLine) + updated + value.slice(startLine + region.length);
  textarea.value = newText;
  textarea.setSelectionRange(startLine, startLine + updated.length);
}

function codeBlockWrap(textarea) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e);
  const isMulti = selected.includes('\n');
  const block = isMulti ? '```\n' + selected + '\n```' : '`' + selected + '`';
  const newText = value.slice(0, s) + block + value.slice(e);
  textarea.value = newText;
  const cursor = s + block.length;
  textarea.setSelectionRange(cursor, cursor);
}

function insertLink(textarea) {
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  const selected = value.slice(s, e) || 'text';
  const snippet = `[${selected}](https://)`;
  const newText = value.slice(0, s) + snippet + value.slice(e);
  textarea.value = newText;
  const cursor = s + snippet.length - 1; // place cursor before closing paren
  textarea.setSelectionRange(cursor, cursor);
}

function insertImage(textarea) {
  const url = prompt('Image URL (https://...)');
  if (!url) return;
  const alt = prompt('Alt text (optional)') || '';
  const md = `![${alt}](${url})`;
  const { selectionStart: s, selectionEnd: e, value } = textarea;
  textarea.value = value.slice(0, s) + md + value.slice(e);
  const cursor = s + md.length;
  textarea.setSelectionRange(cursor, cursor);
}

function insertHorizontalRule(textarea) {
  const { selectionStart: s, value } = textarea;
  const md = `\n\n---\n\n`;
  const cursor = s + md.length;
  textarea.value = value.slice(0, s) + md + value.slice(s);
  textarea.setSelectionRange(cursor, cursor);
}

function insertTable(textarea) {
  const snippet = `\n\n| Column 1 | Column 2 | Column 3 |\n|---------:|:--------:|:---------|\n|   R1C1   |   R1C2   |   R1C3   |\n|   R2C1   |   R2C2   |   R2C3   |\n\n`;
  const { selectionStart: s, value } = textarea;
  textarea.value = value.slice(0, s) + snippet + value.slice(s);
  textarea.setSelectionRange(s + snippet.length, s + snippet.length);
}

function showEmojiPicker(container, textarea) {
  // Simple inline popover with common emoji
  const existing = container.querySelector('.md-emoji-pop');
  if (existing) { existing.remove(); return; }
  const pop = el('div', { className: 'md-emoji-pop absolute z-50 top-full mt-1 left-0 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 p-2 shadow-lg grid grid-cols-8 gap-1' });
  const emojiList = ['😀','😃','😄','😁','😆','😉','😊','😍','🤔','😎','😭','😡','👍','👎','🙌','🎉','🔥','✨','✅','📝','📌','📎','📷','🔗','⏰','⚠️','💡','❓','✅','☑️'];
  emojiList.forEach(ch => {
    const b = el('button', { className: 'w-7 h-7 rounded hover:bg-slate-100 dark:hover:bg-slate-700', attrs: { type: 'button' } });
    b.textContent = ch;
    b.addEventListener('click', (e) => {
      e.preventDefault();
      const { selectionStart: s, selectionEnd: e2, value } = textarea;
      textarea.value = value.slice(0, s) + ch + value.slice(e2);
      const cursor = s + ch.length;
      textarea.setSelectionRange(cursor, cursor);
      textarea.focus();
    });
    pop.appendChild(b);
  });
  container.appendChild(pop);
}

// Attach toolbar to the add-form details field
if (descInput) {
  const bar = buildMarkdownToolbar(descInput);
  // Insert before the textarea
  descInput.parentElement?.insertBefore(bar, descInput);
}
