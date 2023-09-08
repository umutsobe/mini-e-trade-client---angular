import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ListUserDetails } from 'src/app/contracts/account/ListUserDetails';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-user-details',
  template: `
    <div class="d-flex justify-content-center">
      <form style="margin-bottom: 500px;" [formGroup]="frm" class="col-10 col-sm-8 col-md-7 col-lg-6 col-xl-5">
        <h1 class="mx-auto">Kullanıcı bilgilerim</h1>

        <div style="width: 100%;" class="mb-3">
          <label for="name" class="form-label">Ad Soyad</label>

          <div class="d-flex justify-content-between">
            <input type="text" id="name" class="form-control" formControlName="name" [value]="userDetails.name" />
            <div>
              <button (click)="updateName()" [disabled]="!name.valid" class="btn btn-primary ms-2">Save</button>
            </div>
          </div>
          <div *ngIf="!name.valid && name.dirty" style="color:chocolate; font-size: 12px;">Ad soyad girişi zorunludur.</div>
        </div>

        <div style="width: 100%;" class="mb-3">
          <label for="email" class="form-label">E-Mail</label>

          <div class="d-flex justify-content-between p-0">
            <input type="text" class="form-control" id="email" formControlName="email" [value]="userDetails.email" />
            <button (click)="updateEmail()" [disabled]="!email.valid" class="btn btn-primary ms-2">Save</button>
          </div>
          <div *ngIf="!email.valid && email.dirty" style="color:chocolate; font-size: 12px;">E-Mail girişi doğru formatta olmalıdır</div>
        </div>
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
export class UserDetailsComponent implements OnInit {
  constructor(private accountService: AccountService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService) {}

  frm: FormGroup;
  userDetails: ListUserDetails = { name: '', email: '' };

  ngOnInit(): void {
    this.spinner.show();
    this.accountService
      .getUserDetails()
      .then((response) => {
        this.spinner.hide();
        this.userDetails.email = response.email;
        this.userDetails.name = response.name;
      })
      .catch((err) => {
        this.spinner.hide();
      });

    this.frm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  async updateName() {
    this.spinner.show();
    await this.accountService
      .updateUserName(this.authService.UserId, this.name.value)
      .then(() => {
        this.spinner.hide();
        this.toastr.success('Ad Soyad Başarıyla Değiştirildi', 'Başarılı');
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }
  async updateEmail() {
    this.spinner.show();
    await this.accountService
      .updateUserEmail(this.authService.UserId, this.email.value)
      .then(() => {
        this.toastr.success('Email Başarıyla Değiştirildi', 'Başarılı');
        this.spinner.hide();
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  get email() {
    return this.frm.get('email');
  }
  get name() {
    return this.frm.get('name');
  }
}
