import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../models/user-dto';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    BsDropdownModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  userInfo: UserDto = <UserDto>{};

  constructor(
    protected accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void { }

  login() {
    this.accountService.login(this.userInfo).subscribe({
      next: (userInfo: any) => {
        this.router.navigateByUrl('/members');
        const message = 'Welcome ' + userInfo.username + ' !';
        this.toastr.success(message);
      },
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toastr.success('logged out');
  }

  ngOnDestroy(): void { }
}
