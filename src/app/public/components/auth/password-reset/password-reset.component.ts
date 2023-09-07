import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-password-reset',
  template: `
    <div class="d-flex justify-content-center">
      <form [formGroup]="frm" (ngSubmit)="onSubmit()" style="margin-top: 75px; margin-bottom: 300px;" class="col-10 col-sm-8 col-md-7 col-lg-4 col-xl-2">
        <h1 class="mb-4">Password Reset</h1>

        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input type="text" class="form-control" id="email" formControlName="email" />
          <div *ngIf="!email.valid && (email.dirty || email.touched)" style="color:chocolate; font-size: 12px;">E-Mail girişi doğru formatta olmalıdır</div>
        </div>

        <button type="submit" class="mb-2 w-100 btn btn-primary" [disabled]="!frm.valid">Submit</button>
        <a routerLink="/login" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Üye Misiniz? Giriş Yapın </a>
      </form>
    </div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class PasswordResetComponent implements OnInit {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
    });
  }
  async onSubmit() {
    const email = this.email.value;
    this.spinner.show();
    this.userService.passwordReset(email, () => {
      this.spinner.hide();
      this.toastr.success('Şifre Değiştirme Maili Başarıyla Gönderilmiştir');
    });
  }

  get email() {
    return this.frm.get('email');
  }
}
