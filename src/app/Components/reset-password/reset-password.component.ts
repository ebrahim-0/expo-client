import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FloatLabelModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
  providers: [MessageService],
})
export class ResetPasswordComponent implements OnInit {
  userId: string = '';

  loading: boolean = false;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _MessageService: MessageService,
    private _CookieService: CookieService,
    private _Router: Router
  ) {}

  resetForm: FormGroup = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
      ]),
    },
    { validators: this.matchPassword }
  );

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.userId = params['userId'] || '';
    });
  }

  matchPassword(resetForm: any) {
    if (
      resetForm.get('newPassword')?.value !==
      resetForm.get('confirmPassword')?.value
    ) {
      const match = { notMatch: 'Passwords do not match' };

      resetForm.get('confirmPassword')?.setErrors(match);
      return match;
    } else {
      return null;
    }
  }

  handleResetPassword(resetPasswordForm: FormGroup) {
    resetPasswordForm.markAllAsTouched();

    if (resetPasswordForm.valid) {
      this.loading = true;

      this._AuthService
        .resetPassword(this.userId, resetPasswordForm.value.newPassword)
        .subscribe({
          next: (res) => {
            this.loading = false;

            this._CookieService.set('token', res.token, { expires: 2 });

            this._AuthService.currentUser.next(res.user);
            // this._MessageService.add({
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: res.message,
            // });

            setTimeout(() => {
              this._Router.navigate(['/']);
            }, 1000);
          },
          error: (err) => {
            this.loading = false;

            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.error.message,
            });
          },
        });
    }
  }
}
