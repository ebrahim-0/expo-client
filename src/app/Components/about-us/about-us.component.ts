import { Component } from '@angular/core';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [FooterContactComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {}
