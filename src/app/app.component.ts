import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  tasks: any[] = [];
  newTask = { title: '', description: '' };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.http.get<any[]>('http://localhost:3000/api/tasks').subscribe({
      next: (data) => (this.tasks = data),
      error: (err) => console.error('Error fetching tasks:', err)
    });
  }

  addTask() {
    if (this.newTask.title.trim()) {
      this.http.post('http://localhost:3000/api/tasks', this.newTask).subscribe({
        next: (task) => {
          this.tasks.push(task);
          this.newTask = { title: '', description: '' };
        },
        error: (err) => console.error('Error adding task:', err)
      });
    }
  }
}