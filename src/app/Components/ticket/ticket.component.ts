import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [RouterModule, ButtonModule, FooterContactComponent],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent implements OnInit {
  currentUser: any;
  constructor(
    private _Router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this._AuthService.currentUser;

    console.log(this.currentUser);
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
}
