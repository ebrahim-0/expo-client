import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { AuthService } from '../../Services/auth.service';
import { ServicesService } from '../../Services/services.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [
    RouterModule,
    ButtonModule,
    CommonModule,
    ToastModule,
    FooterContactComponent,
    TableModule,
  ],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
  providers: [MessageService],
})
export class TicketComponent implements OnInit {
  currentUser: any;
  tickets: any;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _ServicesService: ServicesService,
    private _MessageService: MessageService
  ) {}

  ngOnInit(): void {
    this.currentUser = this._AuthService.currentUser;

    if (this.currentUser.value.rule === 'employee') {
      this._ServicesService.getAllTickets().subscribe({
        next: (res) => {
          this.tickets = res;
        },
        error: (error) => {
          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
        },
      });
    }
  }

  bookTicket() {
    this._Router.navigate(['book-ticket'], {
      relativeTo: this._ActivatedRoute,
    });
  }

  viewTicket() {
    this._Router.navigate(['view-ticket'], {
      relativeTo: this._ActivatedRoute,
    });
  }

  deleteTickets(id: string) {
    this._ServicesService.deleteTicket(id).subscribe({
      next: (res) => {
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Ticket Deleted Successfully',
        });
        this.ngOnInit();
      },
      error: (error) => {
        this._MessageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
