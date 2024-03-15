import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgOtpInputModule } from 'ng-otp-input';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../Services/auth.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-verify-reset-code',
  standalone: true,
  imports: [
    NgOtpInputModule,
    FormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './verify-reset-code.component.html',
  styleUrl: './verify-reset-code.component.css',
  providers: [MessageService],
})
export class VerifyResetCodeComponent {
  @ViewChild('otp') ngOtpInputRef: any;

  loading: boolean = false;
  userId: string = '';

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _MessageService: MessageService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.userId = params['userId'] || '';
    });
  }

  onOtpChange(otp: string) {}

  submitOtp() {
    this.loading = true;

    this._AuthService.verifyResetCode(this.ngOtpInputRef.currentVal).subscribe({
      next: (res) => {
        this.loading = false;

        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });

        setTimeout(() => {
          this._Router.navigate(['/reset-password'], {
            queryParams: { userId: res.userId },
          });
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

  resendCode() {
    this._AuthService.resendCode(this.userId).subscribe({
      next: (res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      },
      error: (err) => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
}
