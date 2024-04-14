import { Component, OnInit } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ServicesService } from '../../Services/services.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-ticket',
  standalone: true,
  imports: [
    FooterContactComponent,
    MessageModule,
    FloatLabelModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css',
  providers: [MessageService],
})
export class BookTicketComponent implements OnInit {
  loading: boolean = false;

  tickets = [
    {
      ticketType: 'Entrance',
      price: 50,
      quantity: 0,
    },
    {
      ticketType: 'Vip',
      price: 100,
      quantity: 0,
    },
    {
      ticketType: "Children's Under 3 years",
      price: 25,
      quantity: 0,
    },
  ];

  currentUser: any;

  isATicket: boolean = false;

  constructor(
    private _ServicesService: ServicesService,
    private _MessageService: MessageService,
    private _AuthService: AuthService,
    private _Router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this._AuthService.currentUser;

    if (this.currentUser.value.rule !== 'visitor') {
      this._Router.navigate(['/']);
    }

    this._ServicesService.getTicketByUser().subscribe({
      next: (res) => {
        if (res) {
          this.tickets = res.tickets;

          if (
            res.tickets[0].quantity > 0 ||
            res.tickets[1].quantity > 0 ||
            res.tickets[2].quantity > 0
          ) {
            this.isATicket = true;
          }
        }

        // this._MessageService.add({
        //   severity: 'success',
        //   summary: 'Success',
        //   detail: 'Tickets get Successfully',
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

  submitBookTicket() {
    this.loading = true;
    this._ServicesService.BookTickets(this.tickets).subscribe({
      next: (res) => {
        this.loading = false;
        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tickets booked successfully',
        });

        setTimeout(() => {
          this._Router.navigate(['ticket/view-ticket']);
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
  }

  incrementTicket(index: number) {
    this.tickets[index].quantity++;
  }
  decrementTicket(index: number) {
    if (this.tickets[index].quantity === 0) {
      return;
    }
    this.tickets[index].quantity--;
  }
}
