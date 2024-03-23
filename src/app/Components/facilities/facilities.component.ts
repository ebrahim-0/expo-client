import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { AuthService } from '../../Services/auth.service';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ServicesService } from '../../Services/services.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-facilities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TableModule,
    FloatLabelModule,
    MessageModule,
    ButtonModule,
    ProgressSpinnerModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
    ToastModule,
  ],
  templateUrl: './facilities.component.html',
  styleUrl: './facilities.component.css',
  providers: [MessageService],
})
export class FacilitiesComponent implements OnInit {
  currentUser: any;

  loading: boolean = false;
  facilities: any[] = [];
  facility: any = {};
  types: any = ['Restaurant', 'Coffee', 'Public facilities'];

  action: string = '';
  constructor(
    private _AuthService: AuthService,
    private _ServicesService: ServicesService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _MessageService: MessageService
  ) {}

  facilitiesForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.action = params['action'];

      if (!this.action) {
        this.getAllFacilities();
      }
      if (this._AuthService.currentUser.value?.rule === 'employee') {
        if (this.facility) {
          this.facilitiesForm.patchValue({
            name: this.facility.name,
            description: this.facility.description,
            type: this.facility.type,
          });
        }
      }
    });

    this.currentUser = this._AuthService.currentUser;
  }

  addFacility() {
    this._Router.navigate(['/facilities'], { queryParams: { action: 'add' } });
  }

  getAllFacilities() {
    this._ServicesService.getAllFacilities().subscribe({
      next: (res) => {
        console.log(res);
        this.facilities = res.facilities;
      },
      error: (error) => {
        console.log(error);
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }

  editFacility(facility: any) {
    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You are not allowed to edit facilities',
      });
    } else {
      this.facility = facility;
      this._Router.navigate(['/facilities'], {
        queryParams: { action: 'add' },
      });
    }
  }

  deleteFacility(id: string) {
    if (this._AuthService.currentUser.value?.rule !== 'employee') {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'You are not allowed to delete facilities',
      });
    } else {
      this._ServicesService.deleteFacility(id).subscribe({
        next: (res) => {
          console.log(res);
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          this.getAllFacilities();
        },
        error: (error) => {
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

  submitAddFacility(facilitiesForm: FormGroup) {
    facilitiesForm.markAllAsTouched();

    if (facilitiesForm.valid) {
      this.loading = true;

      this._ServicesService.addFacility(facilitiesForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });
          setTimeout(() => {
            this.getAllFacilities();
            this.facilitiesForm.reset();
            this.action = '';

            this._Router.navigate(['/facilities']);
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
