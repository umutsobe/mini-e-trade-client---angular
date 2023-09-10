import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UpdateUserPassword } from 'src/app/contracts/account/UpdateUserPassword';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-password-change',
  template: `
    <div class="d-flex justify-content-center" style="width: 100%;">
      <form [formGroup]="frm" (ngSubmit)="onSubmit()" style="margin-bottom: 300px;" class="col-11 col-sm-6 col-md-5 col-lg-5 col-xl-4">
        <h1>Change Password</h1>
        <div class="mb-5">
          <label for="currentPassword" class="form-label">Current Password</label>
          <input type="password" class="form-control" id="currentPassword" formControlName="currentPassword" />
          <div *ngIf="!currentPassword.valid && (currentPassword.dirty || currentPassword.touched)" style="color:chocolate; font-size: 12px;">Password entry is required.</div>
        </div>

        <div class="mb-3">
          <label for="newPassword" class="form-label">New Password</label>
          <input type="password" class="form-control" id="newPassword" formControlName="newPassword" />
          <div *ngIf="!newPassword.valid && (newPassword.dirty || newPassword.touched)" style="color:chocolate; font-size: 12px;">Password entry is required.</div>
        </div>

        <div class="mb-3">
          <label for="newPasswordRepeat" class="form-label">New Password Repeat</label>
          <input type="password" id="newPasswordRepeat" class="form-control" formControlName="newPasswordRepeat" />
          <div *ngIf="!newPasswordRepeat.valid && (newPasswordRepeat.dirty || newPasswordRepeat.touched)" style="color:chocolate; font-size: 12px;">Password entry is required.</div>
        </div>
        <button type="submit" class="mb-2 w-100 btn btn-primary" [disabled]="!frm.valid">Submit</button>
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
export class PasswordChangeComponent implements OnInit {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private toastr: ToastrService, private accountService: AccountService, private authService: AuthService) {}

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.maxLength(100)]],
      newPassword: ['', [Validators.required, Validators.maxLength(100)]],
      newPasswordRepeat: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  async onSubmit() {
    const userModel: UpdateUserPassword = new UpdateUserPassword();
    userModel.userId = this.authService.UserId;
    userModel.newPassword = this.newPassword.value;
    userModel.oldPassword = this.currentPassword.value;
    let token;
    this.accountService
      .updateUserPassword(userModel)
      .then((response) => {
        localStorage.setItem('accessToken', response.accessToken);

        this.spinner.hide();
        this.toastr.success('Password Successfully Changed.');
      })
      .catch((err) => {
        this.spinner.hide();
        this.toastr.error(err.message);
      })
      .finally(() => {
        this.authService.identityCheck();
        console.log(token);
      });
  }

  get currentPassword() {
    return this.frm.get('currentPassword');
  }
  get newPassword() {
    return this.frm.get('newPassword');
  }
  get newPasswordRepeat() {
    return this.frm.get('newPasswordRepeat');
  }
}
