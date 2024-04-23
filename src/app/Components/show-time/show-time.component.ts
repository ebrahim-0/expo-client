import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ServicesService } from '../../Services/services.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-show-time',
  standalone: true,
  imports: [
    TableModule,
    ProgressSpinnerModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './show-time.component.html',
  styleUrl: './show-time.component.css',
  providers: [MessageService],
})
export class ShowTimeComponent implements OnInit {
  currentUser: any;

  showTime: any;
  action: string = '';

  showTimes: any[] = [];

  loading: boolean = false;

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _ServicesService: ServicesService,
    private _MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];

      if (!this.action) {
        this.getAllShowTime();
      }
      if (this._AuthService.currentUser.value?.rule === 'employee') {
        if (this.showTime) {
          this.showTimeForm.patchValue({
            name: this.showTime.name,
            pavilionId: this.showTime.pavilionId,
            time: this.showTime.time,
          });
        }
      } else {
        this._Router.navigate(['/']);
      }
      if (this.action === 'add') {
        this.showTime = {};
        this.showTimeForm.reset();
      }
    });

    this.currentUser = this._AuthService.currentUser;
  }

  showTimeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    pavilionId: new FormControl('', [Validators.required]),
    time: new FormControl('', [Validators.required]),
  });

  submitAddShowTime(showTimeForm: FormGroup) {
    showTimeForm.markAllAsTouched();
    if (showTimeForm.valid) {
      if (this.showTime.pavilionId) {
        this.loading = true;
        this._ServicesService
          .updateShowTime(this.showTime._id, showTimeForm.value)
          .subscribe({
            next: (res) => {
              this.loading = false;

              // this._MessageService.add({
              //   severity: 'success',
              //   summary: 'Success',
              //   detail: res.message,
              // });

              setTimeout(() => {
                this.getAllShowTime();
                this.showTimeForm.reset();
                this.action = '';
                this._Router.navigate(['/show-time']);
              }, 1000);
            },
            error: (error) => {
              console.error(error);
              this.loading = false;

              this._MessageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error.message,
              });
            },
          });
      } else {
        this.loading = true;

        this._ServicesService.addShowTime(showTimeForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            // this._MessageService.add({
            //   severity: 'success',
            //   summary: 'Success',
            //   detail: res.message,
            // });
            setTimeout(() => {
              this.getAllShowTime();
              this.showTimeForm.reset();
              this.action = '';

              this._Router.navigate(['/show-time']);
            }, 1000);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
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

  deleteShowTime(id: string) {
    this._ServicesService.deleteShowTime(id).subscribe({
      next: (res) => {
        // this._MessageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: res.message,
        // });
        this.getAllShowTime();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  editShowTime(showTime: any) {
    this.showTime = showTime;

    this._Router.navigate(['/show-time'], {
      queryParams: { action: 'update' },
    });
  }
  addShowTime() {
    this._Router.navigate(['/show-time'], { queryParams: { action: 'add' } });
  }

  getAllShowTime() {
    this._ServicesService.getAllShowTime().subscribe({
      next: (res) => {
        this.showTimes = res.showTimes;
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
