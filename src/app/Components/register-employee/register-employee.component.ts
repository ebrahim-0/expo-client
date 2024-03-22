import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../Services/auth.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-employee',
  standalone: true,
  imports: [
    RouterModule,
    FloatLabelModule,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './register-employee.component.html',
  styleUrl: './register-employee.component.css',
  providers: [MessageService, CookieService],
})
export class RegisterEmployeeComponent implements OnInit {
  loading: boolean = false;

  registerForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10,}$'),
      ]),
      rule: new FormControl('employee', [Validators.required]),
    },
    { validators: this.matchPassword }
  );

  constructor(
    private _AuthService: AuthService,
    private _MessageService: MessageService,
    private _CookieService: CookieService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      if (params['rule']) {
        this.registerForm.get('rule')?.setValue(params['rule']);
      }
    });
  }

  matchPassword(registerForm: any) {
    if (
      registerForm.get('password')?.value !==
      registerForm.get('confirmPassword')?.value
    ) {
      const match = { notMatch: 'Passwords do not match' };

      registerForm.get('confirmPassword')?.setErrors(match);
      return match;
    } else {
      return null;
    }
  }

  handleRegister(registerForm: FormGroup) {
    registerForm.markAllAsTouched();
    this.loading = true;

    if (registerForm.valid) {
      this._AuthService
        .registerUser({
          firstName: registerForm.value.firstName,
          lastName: registerForm.value.lastName,
          email: registerForm.value.email,
          phoneNumber: registerForm.value.phoneNumber,
          password: registerForm.value.password,
          rule: registerForm.value.rule,
        })
        .subscribe({
          next: (res) => {
            this.loading = false;

            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });

            setTimeout(() => {
              this._Router.navigate(['/']);
            }, 1000);
          },
          error: (error) => {
            this.loading = false;
            console.log(error);

            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });
    } else {
      this.loading = false;
    }
  }
}
