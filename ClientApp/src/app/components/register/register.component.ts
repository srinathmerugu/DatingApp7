import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDto } from '../../models/user-dto';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter<any>();
  userInfo: UserDto = <UserDto>{};

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {}

  cancel() {
    this.cancelRegister.emit(false);
  }

  register() {
    this.accountService.register(this.userInfo).subscribe({
      next: (user) => {
        console.log(user);
        this.cancel();
      },
      error: (err: any) => console.log(err),
    });
  }
}
