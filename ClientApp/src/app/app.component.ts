import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { User } from './models/user';
import { AccountService } from './services/account.service';
import { HomeComponent } from './components/home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    NgxSpinnerModule,
    NavComponent,
    HomeComponent,
  ],
})
export class AppComponent {
  title = 'Dating App';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  private setCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user) return;
    const currentUser: User = JSON.parse(user);
    this.accountService.emitCurrentUser(currentUser);
  }
}
