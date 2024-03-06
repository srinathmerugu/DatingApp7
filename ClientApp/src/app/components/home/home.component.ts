import { Component } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [RegisterComponent],
})
export class HomeComponent {
  registerMode = false;
  users: any = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  private getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe({
      next: (users: any) => (this.users = users),
      error: (err: any) => console.log(err),
      complete: () => console.log('done'),
    });
  }

  getError() {
    this.http.get('https://localhost:5001/api/buggy/server-error').subscribe();
  }

  cancelRegister(isCancelled: boolean) {
    this.registerMode = isCancelled;
  }
}
