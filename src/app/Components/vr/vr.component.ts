import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-vr',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './vr.component.html',
  styleUrl: './vr.component.css',
})
export class VRComponent {
  images: IImage[] = [
    {
      source:
        'https://momento360.com/e/u/9bfe3b9350cc4478ae55a2bab227a8f5?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true',

      alt: 'image one',
      title: 'image 1',
    },
    {
      source:
        'https://momento360.com/e/u/3156633442644c22a494aafd1fb9e7fb?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true',
      alt: 'image two',
      title: 'image 2',
    },
    {
      source:
        'https://momento360.com/e/u/35f5894831654772be56ba64ac200e21?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true',
      alt: 'image three',
      title: 'image 3',
    },
    {
      source:
        'https://momento360.com/e/u/eabd63193827402386741637bc3914ec?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true',
      alt: 'image four',
      title: 'image 4',
    },
    {
      source:
        'https://momento360.com/e/u/bf814d92d2604c9485fda63e890cd101?utm_campaign=embed&utm_source=other&heading=0&pitch=0&field-of-view=75&size=medium&display-plan=true',
      alt: 'image five',
      title: 'image 5',
    },
  ];

  constructor(private sanitizer: DomSanitizer) {}

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

interface IImage {
  source: string;
  alt: string;
  title: string;
}
