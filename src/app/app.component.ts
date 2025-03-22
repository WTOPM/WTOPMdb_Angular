import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from './services/task.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = { id: 0, title: '', description: '', completed: false };
  editingTask: Task | null = null;
  formSubmitted = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
      }
    });
  }

  addTask() {
    this.formSubmitted = true;
    if (!this.newTask.title.trim()) {
      return;
    }
    this.taskService.addTask(this.newTask).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.tasks.sort((a, b) => {
          if (a.completed === b.completed) return 0;
          return a.completed ? 1 : -1;
        });
        this.newTask = { id: 0, title: '', description: '', completed: false };
        this.formSubmitted = false;
      },
      error: (error) => {
        console.error('Error adding task:', error);
      }
    });
  }

  startEditing(task: Task) {
    this.editingTask = { ...task };
    this.formSubmitted = false;
  }

  saveTask() {
    this.formSubmitted = true;
    if (!this.editingTask || !this.editingTask.title.trim()) {
      return;
    }
    this.taskService.updateTask(this.editingTask.id, this.editingTask).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.tasks.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          });
        }
        this.editingTask = null;
        this.formSubmitted = false;
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  cancelEditing() {
    this.editingTask = null;
    this.formSubmitted = false;
  }

  updateTask(task: Task) {
    this.taskService.updateTask(task.id, { completed: task.completed }).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
          this.tasks.sort((a, b) => {
            if (a.completed === b.completed) return 0;
            return a.completed ? 1 : -1;
          });
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }

  confirmDelete(id: number, title: string) {
    if (confirm(`Are you sure you want to delete the task "${title}"?`)) {
      this.deleteTask(id);
    }
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.id !== id);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
      }
    });
  }
}