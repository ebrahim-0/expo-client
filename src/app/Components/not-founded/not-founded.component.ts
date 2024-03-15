import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-founded',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './not-founded.component.html',
  styleUrl: './not-founded.component.css',
})
export class NotFoundedComponent implements OnInit {
  currentUser!: any;

  constructor(private _AuthService: AuthService) {}

  ngOnInit(): void {
    this._AuthService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }
}
