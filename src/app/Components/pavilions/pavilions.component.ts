import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ServicesService } from '../../Services/services.service';
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
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pavilions',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    FloatLabelModule,
    InputTextModule,
    ReactiveFormsModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './pavilions.component.html',
  styleUrl: './pavilions.component.css',
  providers: [MessageService],
})
export class PavilionsComponent implements OnInit {
  pavilions: any[] = [];

  pavilion: any = {};

  action: string = '';

  loading: boolean = false;

  pavilionForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  constructor(
    private _ServicesService: ServicesService,
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _MessageService: MessageService
  ) {}
  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];

      if (!this.action) {
        this.getAllPavilions();
      } else {
        if (this.pavilion) {
          this.pavilionForm.patchValue({
            name: this.pavilion.name,
            description: this.pavilion.description,
          });
        }
      }
    });

    // this.getAllPavilions();
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
              console.log(res);
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
            console.log(res);

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
        console.log(res);
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
    this.pavilion = pavilion;

    console.log(this.pavilion);

    this._Router.navigate(['/pavilions'], { queryParams: { action: 'add' } });
  }

  addPavilion() {
    this._Router.navigate(['/pavilions'], { queryParams: { action: 'add' } });
  }

  deletePavilion(id: string) {
    this._ServicesService.deletePavilion(id).subscribe({
      next: (res) => {
        console.log(res);
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
