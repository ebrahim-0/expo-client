import { Component, OnInit } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { ServicesService } from '../../Services/services.service';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [FooterContactComponent],
  templateUrl: './view-ticket.component.html',
  styleUrl: './view-ticket.component.css',
})
export class ViewTicketComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _ServicesService: ServicesService
  ) {}

  currentUser: any;
  ngOnInit() {
    this.currentUser = this._AuthService.currentUser;

    if (this.currentUser.value.rule !== 'visitor') {
      this._Router.navigate(['/']);
    }

    this._ServicesService.getTicketByUser().subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
