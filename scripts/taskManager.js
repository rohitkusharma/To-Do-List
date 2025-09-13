// TaskManager handles in-memory state and business logic
import { uid } from './utils.js';

export class TaskManager {
  constructor() {
  /** @type {Array<{id:string,text:string,description?:string,completed:boolean,priority:'low'|'normal'|'high',category?:string}>} */
    this.tasks = [];
    this.filter = 'all'; // all | active | completed
    this.categoryFilter = '';
    this.completedCount = 0; // reflects CURRENT number of completed tasks
  }

  addTask(text, priority = 'normal', category = '', description = '') {
    const trimmed = (text || '').trim();
    if (!trimmed) return null;
    const task = { id: uid(), text: trimmed, description: (description || '').trim(), completed: false, priority, category: (category || '').trim() };
    this.tasks.push(task);
    return task;
  }

  editTask(id, newText) {
    const t = this.tasks.find(t => t.id === id);
    if (!t) return false;
    const trimmed = (newText || '').trim();
    if (!trimmed) return false;
    t.text = trimmed;
    return true;
  }

  editDescription(id, newDesc) {
    const t = this.tasks.find(t => t.id === id);
    if (!t) return false;
    t.description = (newDesc || '').trim();
    return true;
  }

  editPriority(id, newPriority) {
    const t = this.tasks.find(t => t.id === id);
    if (!t) return false;
    if (!['low', 'normal', 'high'].includes(newPriority)) return false;
    t.priority = newPriority;
    return true;
  }

  toggleComplete(id) {
    const t = this.tasks.find(t => t.id === id);
    if (!t) return null;
    const wasCompleted = t.completed;
    t.completed = !t.completed;
    if (!wasCompleted && t.completed) {
      this.completedCount += 1;
    } else if (wasCompleted && !t.completed) {
      this.completedCount = Math.max(0, this.completedCount - 1);
    }
    return t.completed;
  }

  deleteTask(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx === -1) return false;
    if (this.tasks[idx].completed) {
      this.completedCount = Math.max(0, this.completedCount - 1);
    }
    this.tasks.splice(idx, 1);
    return true;
  }

  clearCompleted() {
    const cleared = this.tasks.filter(t => t.completed).length;
    this.tasks = this.tasks.filter(t => !t.completed);
    // After clearing, there should be zero completed tasks left
    this.completedCount = 0;
    return cleared; // number cleared
  }

  setFilter(filter) {
    this.filter = filter; // 'all' | 'active' | 'completed'
  }

  setCategoryFilter(category) {
    this.categoryFilter = category || '';
  }

  getCategories() {
    const set = new Set(this.tasks.map(t => t.category).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  getVisibleTasks() {
    return this.tasks.filter(t => {
      if (this.categoryFilter && t.category !== this.categoryFilter) return false;
      if (this.filter === 'active') return !t.completed;
      if (this.filter === 'completed') return t.completed;
      return true;
    });
  }
}
