import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../Services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    RouterModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    MessageModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [MessageService, CookieService],
})
export class LoginComponent implements OnInit {
  user!: string;
  loading: boolean = false;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _AuthService: AuthService,
    private _CookieService: CookieService,
    private _MessageService: MessageService
  ) {}

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    ]),
  });

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.user = params['user'] || '';
    });
  }

  handleLogin(loginForm: FormGroup) {
    loginForm.markAllAsTouched();

    this.loading = true;

    if (loginForm.valid) {
      this._AuthService
        .loginUser({ ...loginForm.value, rule: this.user })
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

  loginAsVisitor() {
    this._Router.navigate(['/login'], { queryParams: { user: 'visitor' } });
  }

  loginAsEmployee() {
    this._Router.navigate(['/login'], { queryParams: { user: 'employee' } });
  }
}
