import { Component, OnInit } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { ServicesService } from '../../Services/services.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [FooterContactComponent, ToastModule],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css',
  providers: [MessageService],
})
export class ViewTicketComponent implements OnInit {
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
        // if (res) {
        //   this.tickets = res.tickets;
        // }

        console.log(res);

        this._MessageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tickets get Successfully',
        });
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
