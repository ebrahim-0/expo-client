import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterContactComponent } from '../footer-contact/footer-contact.component';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '../../Services/user.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    FooterContactComponent,
    InputTextModule,
    InputTextareaModule,
    FloatLabelModule,
    MessageModule,
    ToastModule,
    ProgressSpinnerModule,
    ButtonModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css',
  providers: [MessageService],
})
export class ContactUsComponent {
  constructor(
    private _MessageService: MessageService,
    private _UserService: UserService
  ) {}

  loading: boolean = false;

  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
  });

  submitForm(contactForm: FormGroup) {
    contactForm.markAllAsTouched();

    if (contactForm.valid) {
      this.loading = true;

      this._UserService.sendMessage(contactForm.value).subscribe({
        next: (res) => {
          console.log(res);

          this._MessageService.add({
            severity: 'success',
            summary: 'Success',
            detail: res.message,
          });

          this.loading = false;
        },
        error: (err) => {
          console.error(err);

          this._MessageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.error.message,
          });

          this.loading = false;
        },
      });
    }
  }
}
