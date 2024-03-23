import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ProgressSpinnerModule,
    ButtonModule,
    ToastModule,
    MessageModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [MessageService],
})
export class UsersComponent implements OnInit {
  constructor(
    private _UserService: UserService,
    private _MessageService: MessageService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute
  ) {}

  users: User[] = [];

  rules: any[] = ['guest', 'admin', 'visitor', 'employee'];

  loading: boolean = true;
  submitted: boolean = false;

  userId: string = '';

  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10,}$'),
    ]),
    rule: new FormControl('', [Validators.required]),
    // password: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    // ]),
    // confirmPassword: new FormControl('', [
    //   Validators.required,
    //   Validators.pattern('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$'),
    // ]),
  });

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.userId = params['userId'] || '';
      if (this.userId) {
        this.getUserById();
      } else {
        this.getAllUsers();
      }
    });
  }

  updateUserForm(userForm: FormGroup) {
    userForm.markAllAsTouched();
    this.submitted = true;

    if (userForm.valid) {
      this.submitted = true;
      if (this.userId) {
        this._UserService.updateUser(this.userId, userForm.value).subscribe({
          next: (res) => {
            this.submitted = false;
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });

            setTimeout(() => {
              this._Router.navigate(['/users']);
            }, 1000);
          },
          error: (err) => {
            console.error(err);
            this.submitted = false;
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

  getUserById() {
    this._UserService.getUserById(this.userId).subscribe({
      next: (res) => {
        this.loading = false;
        this.userForm.patchValue(res.user);
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }

  getAllUsers() {
    this._UserService.getAllUsers().subscribe({
      next: (res) => {
        this.users = res.users;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }

  updateUser(user: User) {
    this._Router.navigate(['/users'], { queryParams: { userId: user._id } });
  }

  deleteUser(user: User) {
    this._UserService.deleteUser(user._id).subscribe({
      next: (res) => {
        this.users = this.users.filter((u) => u._id !== user._id);
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
      },
      error: (err) => {
        console.error(err);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  rule: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
