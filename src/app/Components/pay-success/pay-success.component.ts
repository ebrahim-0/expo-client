import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ServicesService } from '../../Services/services.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-pay-success',
  standalone: true,
  imports: [ProgressSpinnerModule, RouterModule, ButtonModule],
  templateUrl: './pay-success.component.html',
  styleUrl: './pay-success.component.css',
})
export class PaySuccessComponent implements OnInit {
  ticketId!: number;

  payDone: boolean = false;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _ServicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe((params) => {
      this.ticketId = params['ticketId'];

      this._ServicesService.payDone(params['ticketId']).subscribe({
        next: (res) => {
          console.log(res);
          if (res.status === 'success') {
            this.payDone = true;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    });
  }
}
