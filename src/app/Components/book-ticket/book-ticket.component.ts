import { Component, OnInit, ViewChild } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';

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
    CalendarModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './book-ticket.component.html',
  styleUrl: './book-ticket.component.css',
  providers: [MessageService],
})
export class BookTicketComponent implements OnInit {
  loading: boolean = false;

  date!: Date;

  currentDate: Date = new Date();

  @ViewChild('bookTicket') bookTicket: any;

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
    console.log(this.date);
    this.currentUser = this._AuthService.currentUser;

    if (this.currentUser.value.rule !== 'visitor') {
      this._Router.navigate(['/']);
    }

    // this._ServicesService.getTicketByUser().subscribe({
    //   next: (res) => {
    //     if (res) {
    //       this.tickets = res.tickets;
    //       this.date = new Date(res.date);

    //     }
    //   },
    //   error: (error) => {
    //     this._MessageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail: error.error.message,
    //     });
    //   },
    // });
  }

  submitBookTicket() {
    this.loading = true;
    this._ServicesService.BookTickets(this.date, this.tickets).subscribe({
      next: (res) => {
        this.loading = false;

        this._ServicesService.payForTicket(res.ticketId).subscribe({
          next: (res) => {
            console.log(res);

            window.location.href = res.session.url;
          },
          error: (error) => {
            console.error(error);
          },
        });
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
    console.log(this.date);

    if (this.isATicket) return;

    this.tickets[index].quantity++;
  }
  decrementTicket(index: number) {
    if (this.isATicket) return;

    if (this.tickets[index].quantity === 0) {
      return;
    }
    this.tickets[index].quantity--;
  }
}
