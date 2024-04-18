import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AuthService } from '../../Services/auth.service';
import { ServicesService } from '../../Services/services.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-pavilion-country',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './pavilion-country.component.html',
  styleUrl: './pavilion-country.component.css',
  providers: [MessageService],
})
export class PavilionCountryComponent implements OnInit {
  country: string = '';

  visible: boolean = false;
  visibleComment: boolean = false;

  reviews: PavilionReview = {} as PavilionReview;

  author: string = '';

  // pavilions: any[] = [
  //   {
  //     path: 'ksa',
  //     country: 'Kingdom of Saudi Arabia',
  //     about:
  //       "The Kingdom of Saudi Arabia Pavilion at the Expo stands as a majestic representation of the Kingdom's rich heritage, innovative spirit, and ambitious vision for the future. Nestled within the Expo grounds, the pavilion serves as a gateway to the wonders of Saudi Arabia, inviting visitors on a journey of discovery and inspiration. From the moment visitors approach the pavilion, they are captivated by its striking architectural design, which seamlessly blends traditional motifs with modern elements. The pavilion's exterior features intricate geometric patterns and ornate details, evoking the beauty and intricacy of Saudi Arabian craftsmanship. Towering minarets and elegant archways create a sense of grandeur and invite visitors to step inside and explore.",
  //   },
  //   {
  //     path: 'uae',
  //     country: 'United Arab Emirates',
  //     about:
  //       "The United Arab Emirates Pavilion at the Expo is a testament to the nation's vision, innovation, and cultural heritage. Situated prominently within the Expo grounds, the pavilion stands as a beacon of progress and diversity, welcoming visitors from around the world to experience the best of Emirati innovation, culture, and hospitality. The architectural design of the UAE Pavilion is a striking fusion of tradition and modernity, reflecting the country's commitment to preserving its cultural heritage while embracing innovation and progress. The pavilion's exterior features intricate patterns and geometric shapes inspired by traditional Emirati architecture, while its sleek lines and cutting-edge technology symbolize the nation's forward-thinking approach to development.",
  //   },
  //   {
  //     path: 'japan',
  //     country: 'Japan',
  //     about:
  //       "The Japan Pavilion at the Expo is a marvel that seamlessly blends tradition with innovation, offering visitors a captivating journey through Japanese culture, technology, and sustainability initiatives. Situated at the heart of the Expo grounds, the pavilion stands as a testament to Japan's rich heritage and its vision for the future. As visitors approach the pavilion, they are greeted by a striking architectural design that combines elements of traditional Japanese architecture with modern aesthetics. The pavilion's exterior is adorned with intricate patterns and symbols that reflect Japan's cultural identity, while its sleek lines and futuristic accents symbolize the country's commitment to innovation.",
  //   },
  //   {
  //     path: 'italy',
  //     country: 'Italy',
  //     about:
  //       "The Italy Pavilion at the Expo is a celebration of the country's rich cultural heritage, culinary excellence, and innovative spirit. Located at the heart of the Expo grounds, the pavilion welcomes visitors with its iconic architectural design inspired by Italy's artistic and historical treasures. As visitors approach the pavilion, they are greeted by a breathtaking sight: a modern interpretation of Italy's iconic landmarks, from the Colosseum to the canals of Venice. The pavilion's exterior is adorned with intricate sculptures, colorful murals, and lush greenery, inviting visitors to embark on a journey through Italy's diverse regions and traditions.",
  //   },
  //   {
  //     path: 'china',
  //     country: 'China',
  //     about:
  //       "The China Pavilion at the Expo is a magnificent showcase of the country's rich history, cultural heritage, technological prowess, and vision for the future. Located prominently within the Expo grounds, the pavilion stands as a testament to China's status as a global powerhouse and a leader in innovation and development. As visitors approach the pavilion, they are immediately struck by its awe-inspiring architectural design, which seamlessly blends traditional Chinese motifs with modern elements. The pavilion's exterior features intricate details, elegant curves, and symbolic references to Chinese mythology and symbolism, creating a sense of grandeur and majesty.",
  //   },
  // ];

  pavilion: any;

  currentUser: any;

  commentForm: FormGroup = new FormGroup({
    comment: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
  });

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _AuthService: AuthService,
    private _ServicesService: ServicesService,
    private _MessageService: MessageService,
    private _Router: Router
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.params.subscribe((params) => {
      this.country = params['country'];
      this.getPavilionByCountry(this.country);
    });

    this.currentUser = this._AuthService.currentUser;

    this._AuthService.currentUser.subscribe({
      next: (user) => {
        this.author = `${user?.firstName} ${user?.lastName}` || '';
      },
    });

    this.getAllPavilionsReviews();
  }

  showDialog() {
    this.visible = true;
  }
  showAddComment() {
    if (this.currentUser.value.rule === 'guest') {
      this._MessageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'You are not allowed to add a comment, Please Login First',
      });
      setTimeout(() => {
        this._Router.navigate(['login']);
      }, 1000);
    } else {
      this.visibleComment = true;
    }
  }

  getPavilionByCountry(country: string) {
    this._ServicesService.getPavilionByCountry(country).subscribe({
      next: (res) => {
        this.pavilion = res.existPavilion;
        console.log('this.pavilion', this.pavilion);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getAllPavilionsReviews() {
    this._ServicesService.getPavilionReviews(this.country).subscribe({
      next: (res) => {
        this.reviews = res.pavilionReviews;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  addComment(commentForm: FormGroup) {
    commentForm.markAllAsTouched();

    if (commentForm.valid) {
      console.log(commentForm.value.comment, this.author);
      this._ServicesService
        .addPavilionsReviews(this.country, {
          comment: commentForm.value.comment,
          author: this.author,
        })
        .subscribe({
          next: (res) => {
            console.log(res);
            this._MessageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
            });
            this.getAllPavilionsReviews();
          },
          error: (error) => {
            console.log(error);
            this._MessageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          },
        });

      this.visibleComment = false;
    }
  }
}

interface PavilionReview {
  comments: comment[];
}

interface comment {
  comment: string;
  author: string;
}
