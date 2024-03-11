import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDto } from '../../models/user-dto';
import { AccountService } from '../../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { DatePickerComponent } from '../forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    TextInputComponent,
    DatePickerComponent,
  ],
})
export class RegisterComponent {
  @Output() cancelRegister = new EventEmitter<any>();
  registerForm: FormGroup = new FormGroup({});
  maxDate: Date = new Date();
  validations: string[] = [];

  constructor(
    private accountService: AccountService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(14),
        ],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
      gender: ['male'],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () =>
        this.registerForm.controls['confirmPassword'].updateValueAndValidity(),
    });
  }

  matchValues(matchTo: string) {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value
        ? null
        : { notMatching: true };
    };
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  register() {
    let userRegisterFormValue = this.registerForm.value;
    const dob = this.getDateOnly(
      this.registerForm.controls['dateOfBirth'].value
    );
    const userRegisterInfo = { ...userRegisterFormValue, dateOfBirth: dob };
    this.accountService.register(userRegisterInfo).subscribe({
      next: (user) => {
        this.router.navigateByUrl('/members');
      },
      error: (error: any) => {
        this.validations = error;
      },
    });
  }

  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let userDob = new Date(dob);
    return new Date(
      userDob.setMinutes(userDob.getMinutes() - userDob.getTimezoneOffset())
    )
      .toISOString()
      .slice(0, 10);
  }
}
