import { Component } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [MessageService, CookieService],
})
export class RegisterComponent {
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
    },
    { validators: this.matchPassword }
  );

  constructor(
    private _AuthService: AuthService,
    private _MessageService: MessageService,
    private _CookieService: CookieService,
    private _Router: Router
  ) {}

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
        })
        .subscribe({
          next: (res) => {
            this.loading = false;

            this._CookieService.set('token', res.token);

            this._AuthService.currentUser.next(res.user);

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
