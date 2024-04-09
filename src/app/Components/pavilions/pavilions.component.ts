import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ServicesService } from '../../Services/services.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';

@Component({
  selector: 'app-pavilions',
  standalone: true,
  imports: [
    RouterModule,
    TableModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
    CommonModule,
    FooterContactComponent,
  ],
  templateUrl: './pavilions.component.html',
  styleUrl: './pavilions.component.css',
  providers: [MessageService],
})
export class PavilionsComponent implements OnInit {
  pavilions: any[] = [];

  pavilion: any = {};

  action: string = '';

  pavilionsCountries: any[] = [
    {
      country: 'Kingdom of Saudi Arabia',
      path: 'ksa',
    },
    { country: 'United Arab Emirates', path: 'uae' },
    { country: 'Japan', path: 'japan' },
    { country: 'Italy', path: 'italy' },
    { country: 'China', path: 'china' },
  ];

  loading: boolean = false;
  currentUser: any;

  pavilionForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    private _ServicesService: ServicesService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService,
    private _AuthService: AuthService
  ) {}
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];

      if (!this.action) {
        this.getAllPavilions();
      } else {
        if (this._AuthService.currentUser.value?.rule === 'employee') {
          if (this.pavilion) {
            this.pavilionForm.patchValue({
              name: this.pavilion.name,
              description: this.pavilion.description,
            });
          }
        }
      }

      if (this.action === 'add') {
        this.pavilion = {};
        this.pavilionForm.reset();
      }

      if (this._AuthService.currentUser.value?.rule === 'admin') {
        this._Router.navigate(['/']);
      }

      if (this._AuthService.currentUser.value?.rule === 'visitor') {
        this._Router.navigate(['/pavilions']);
      }
    });

    this.currentUser = this._AuthService.currentUser;
  }

  submitAddPavilion(pavilionForm: FormGroup) {
    pavilionForm.markAllAsTouched();

    if (pavilionForm.valid) {
      if (this.pavilion.id) {
        this.loading = true;
        this._ServicesService
          .updatePavilion(this.pavilion.id, pavilionForm.value)
          .subscribe({
            next: (res) => {
              this.loading = false;

              this._MessageService.add({
                severity: 'success',
                summary: 'Success',
                detail: res.message,
              });

              setTimeout(() => {
                this.getAllPavilions();
                this.pavilionForm.reset();
                this.action = '';
                this._Router.navigate(['/pavilions']);
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
        this._ServicesService.addPavilion(pavilionForm.value).subscribe({
          next: (res) => {
            this.loading = false;

            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });

            setTimeout(() => {
              this.getAllPavilions();
              this.pavilionForm.reset();
              this.action = '';
              this._Router.navigate(['/pavilions']);
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
      }
    }
  }

  getAllPavilions() {
    this._ServicesService.getAllPavilions().subscribe({
      next: (res) => {
        this.pavilions = res.pavilions;
      },
      error: (error) => {
        console.error(error);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  editPavilion(pavilion: any) {
    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You are not allowed to edit pavilions',
      });
    } else {
      this.pavilion = pavilion;
      this._Router.navigate(['/pavilions'], {
        queryParams: { action: 'update' },
      });
    }
  }

  addPavilion() {
    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You are not allowed to add pavilions',
      });
    } else {
      this._Router.navigate(['/pavilions'], { queryParams: { action: 'add' } });
    }
  }

  deletePavilion(id: string) {
    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You are not allowed to delete pavilions',
      });
    } else {
      this._ServicesService.deletePavilion(id).subscribe({
        next: (res) => {
          this.getAllPavilions();
          this._MessageService.add({
            severity: 'info',
            summary: 'Info',
            detail: res.message,
          });
        },
        error: (error) => {
          console.error(error);
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
