import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../models/user-dto';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, CommonModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  userInfo: UserDto = <UserDto>{};

  constructor(protected accountService: AccountService) {}

  ngOnInit(): void {}

  login() {
    this.accountService.login(this.userInfo).subscribe({
      next: (confirmation: any) => {
        console.log('success ', confirmation);
      },
      error: (error: any) => console.log('error ', error),
    });
  }

  logout() {
    this.accountService.logout();
  }

  ngOnDestroy(): void {}
}
