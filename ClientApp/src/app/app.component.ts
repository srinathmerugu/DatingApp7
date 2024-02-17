import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ClientApp';
  users: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setUsers();
  }

  private setUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (users: any) => (this.users = users),
      error: (err: any) => console.log(err),
      complete: () => console.log('done'),
    });
  }
}
