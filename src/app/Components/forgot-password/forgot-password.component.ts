import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../Services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    FloatLabelModule,
    InputTextModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
  providers: [MessageService],
})
export class ForgotPasswordComponent {
  loading: boolean = false;

  constructor(
    private _Router: Router,
    private _AuthService: AuthService,
    private _MessageService: MessageService
  ) {}

  resetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  handleReset(resetForm: any) {
    resetForm.markAllAsTouched();

    console.log(resetForm.value);

    if (resetForm.valid) {
      this.loading = true;
      this._AuthService.forgotPassword(resetForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });

          setTimeout(() => {
            this._Router.navigate(['/verify-reset-code'], {
              queryParams: { userId: res.userId },
            });
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
    }
  }
}
