import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { IsCodeValidRequest } from 'src/app/contracts/two-factor-auth/IsCodeValidRequest';
import { TwoFactorResult } from 'src/app/contracts/two-factor-auth/TwoFactorResult';
import { AccountService } from 'src/app/services/models/account.service';
import { TwoFactorAuthService } from 'src/app/services/models/two-factor-auth.service';

@Component({
  selector: 'app-email-confirm',
  template: `
    <div *ngIf="userId.length > 5">
      <div class="d-flex justify-content-center">
        <form style="margin-top: 75px;" class="col-10 col-sm-6 col-md-5 col-lg-4 col-xl-3">
          <img style="height: 15vh; object-fit: contain;" class="w-100 d-flex justify-content-center" src="/assets/email.png" />
          <h1 class="mb-4 w-100 d-flex justify-content-center">Email Confirmation</h1>

          <button type="button" (click)="sendCode()" *ngIf="isCodeSend == false" class="btn btn-warning w-100 mb-3">Kodu Gönder</button>

          <div *ngIf="isCodeSend == true" class="mb-3">Email adresinize doğrulama kodu gönderildi. Eğer maili <span style="color: red;">göremiyorsanız</span> spam klasörüne bakın.</div>

          <div class="mb-3">
            <label class="form-label">Code</label>
            <input maxlength="6" type="text" class="form-control" [(ngModel)]="code" name="code" />
          </div>

          <button (click)="submit()" [disabled]="code.length < 6" type="submit" class="mb-4 w-100 btn btn-primary">Submit</button>
          <div *ngIf="isCodeSend == true">
            <div style="color: green;">Yeni kod üretme zamanı: 3 dakika</div>
            <a (click)="sendCode()" class="py-2 mb-4 text-decoration-none user-select-none" style="cursor: pointer;">Yeni kod gönder</a>
          </div>
        </form>
      </div>
    </div>
    <div *ngIf="userId.length < 5" class="w-100 d-flex justify-content-center mt-4" style="margin-bottom: 800px;">
      <div class=" col-10 col-md-8 col-lg-4 alert alert-danger">Hata</div>
    </div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      .nsm7Bb-HzV7m-LgbsSe-BPrWId {
        height: 40px;
      }
    `,
  ],
})
export class EmailConfirmComponent implements OnInit {
  constructor(private twoFactorAuthService: TwoFactorAuthService, private accountService: AccountService, private router: Router, private toastr: ToastrService, private spinner: NgxSpinnerService) {
    this.userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : '';
  }
  isCodeSend = false;
  userId = '';
  code = '';
  result: TwoFactorResult = {
    message: '',
    succeeded: false,
  };

  async ngOnInit() {
    if (localStorage.getItem('isCodeSend') == 'true') this.isCodeSend = true;
  }

  async sendCode() {
    this.spinner.show();

    const result: TwoFactorResult = await this.twoFactorAuthService.createCodeAndSendEmail(this.userId).finally(() => this.spinner.hide());

    if (result.succeeded) {
      this.toastr.success('Kod başarıyla gönderildi');
      localStorage.setItem('isCodeSend', 'true');
      this.isCodeSend = true;
    } else {
      this.toastr.error(result.message);
    }
  }
  async submit() {
    this.spinner.show();
    const model: IsCodeValidRequest = {
      code: this.code,
      userId: this.userId,
    };
    const result: TwoFactorResult = await this.twoFactorAuthService.isCodeValid(model).finally(() => this.spinner.hide());

    if (result.succeeded) {
      this.toastr.success(result.message);
      localStorage.removeItem('userId');
      localStorage.removeItem('isCodeSend');
      this.router.navigateByUrl('/login');
    } else {
      this.toastr.error(result.message);
    }
  }
}
