import { Component } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';

@Component({
  selector: 'app-work-time',
  standalone: true,
  imports: [FooterContactComponent],
  templateUrl: './work-time.component.html',
  styleUrl: './work-time.component.css',
})
export class WorkTimeComponent {}
