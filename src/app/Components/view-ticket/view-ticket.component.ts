import { Component, OnInit } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { ServicesService } from '../../Services/services.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [FooterContactComponent, ToastModule, TableModule, CommonModule],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css',
  providers: [MessageService],
})
export class ViewTicketComponent implements OnInit {
  allTickets: any;

  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ServicesService: ServicesService,
    private _MessageService: MessageService
  ) {}

  currentUser: any;
  ngOnInit() {
    this.currentUser = this._AuthService.currentUser;

    if (this.currentUser.value.rule !== 'visitor') {
      this._Router.navigate(['/']);
    }

    this._ServicesService.getTicketByUser().subscribe({
      next: (res) => {
        if (res) {
          this.allTickets = res;
        }

        // this._MessageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Ticket get Successfully',
        // });
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

  payForTickets(ticket: any, event: any) {
    setTimeout(() => {
      this._MessageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Please wait while we process your payment',
      });
    }, 10);

    event.target.disabled = true;
    this._ServicesService.payForTicket(ticket.ticketId).subscribe({
      next: (res) => {
        window.location.href = res.session.url;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
