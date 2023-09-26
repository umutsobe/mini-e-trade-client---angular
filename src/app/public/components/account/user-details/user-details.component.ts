import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UpdateEmailStep1 } from 'src/app/contracts/account/Email/UpdateEmailStep1';
import { UpdateEmailStep2 } from 'src/app/contracts/account/Email/UpdateEmailStep2';
import { ListUserDetails } from 'src/app/contracts/account/ListUserDetails';
import { TwoFactorResult } from 'src/app/contracts/two-factor-auth/TwoFactorResult';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { AccountService } from 'src/app/services/models/account.service';

@Component({
  selector: 'app-user-details',
  template: `
    <div class="d-flex justify-content-center">
      <form style="margin-bottom: 500px;" [formGroup]="frm" class="col-10 col-sm-8 col-md-7 col-lg-6 col-xl-5">
        <h1 class="mx-auto">User Information</h1>

        <div style="width: 100%;" class="mb-3">
          <label for="name" class="form-label">Full name</label>

          <div class="d-flex justify-content-between">
            <input type="text" id="name" class="form-control" formControlName="name" [value]="userDetails.name" />
            <div>
              <button (click)="updateName()" class="btn btn-primary ms-2">Save</button>
            </div>
          </div>
          <div *ngIf="nameSubmitted">
            <div *ngIf="name.hasError('required')" class="inputError">Name is required</div>
            <div *ngIf="name.hasError('maxlength')" class="inputError">Name must be less than 100 characters</div>
          </div>
        </div>

        <div style="width: 100%;" class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <div class="d-flex justify-content-between p-0">
            <input readonly type="text" class="form-control" id="email" [value]="userDetails.email" />
          </div>
          <button data-bs-toggle="modal" data-bs-target="#deleteModal" class="btn btn-outline-primary  mt-2 w-100">Email Change</button>
        </div>
      </form>
    </div>

    <!-- email change modal -->

    <div class="modal fade modal" id="deleteModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Email Change</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="frmModal">
              <div class="mb-3">
                <label for="newEmail" class="form-label">New Email</label>
                <input type="text" class="form-control" id="newEmail" formControlName="newEmail" autocomplete="off" />
                <div *ngIf="modalSubmitted">
                  <div *ngIf="newEmail.hasError('required')" class="inputError">Email is required</div>
                  <div *ngIf="newEmail.hasError('email')" class="inputError">Please enter a valid email address</div>
                  <div *ngIf="newEmail.hasError('maxlength')" class="inputError">Email must be less than 100 characters</div>
                </div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" formControlName="password" autocomplete="new-password" />
                <div *ngIf="modalSubmitted">
                  <div *ngIf="password.hasError('required')" class="inputError">Email is required</div>
                  <div *ngIf="password.hasError('maxlength')" class="inputError">Email must be less than 100 characters</div>
                </div>
              </div>

              <button (click)="updateEmailStep1()" class="btn btn-primary">{{ isUpdateMailCodeSend == true ? 'Send code again' : 'Send verification code' }}</button>

              <div *ngIf="isUpdateMailCodeSend" class="mt-3">
                <div class="mb-3">Email adresinize doğrulama kodu gönderildi. Eğer maili <span style="color: red;">göremiyorsanız</span> spam klasörüne bakın.</div>
                <div class="mb-3">
                  <label for="code" class="form-label">Code</label>
                  <input maxlength="6" type="text" id="code" class="form-control" formControlName="code" autocomplete="off" />
                </div>
                <button (click)="updateEmailStep2()" class="btn btn-success">Submit</button>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <!-- <button type="button" class="btn" data-bs-dismiss="modal">Delete</button> -->
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class UserDetailsComponent implements OnInit {
  constructor(private accountService: AccountService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.frm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.frmModal = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      code: [''],
    });
  }

  frm: FormGroup;
  nameSubmitted = false;
  frmModal: FormGroup;
  modalSubmitted = false;
  userDetails: ListUserDetails = { name: '', email: '' };
  isUpdateMailCodeSend = false;

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.spinner.show();
      await this.accountService
        .getUserDetails()
        .then((response) => {
          this.spinner.hide();
          this.userDetails.email = response.email;
          this.userDetails.name = response.name;
        })
        .catch((err) => {
          this.spinner.hide();
        });
    }

    if (typeof localStorage !== 'undefined') this.isUpdateMailCodeSend = localStorage.getItem('isUpdateMailCodeSend') == 'true' ? true : false;
  }

  async updateName() {
    this.nameSubmitted = true;
    if (this.name.invalid) return;

    this.spinner.show();
    await this.accountService
      .updateUserName(this.authService.UserId, this.name.value)
      .then(() => {
        this.spinner.hide();
        this.toastr.success('Full Name Successfully Changed.', 'Success');
      })
      .catch((err) => {
        this.spinner.hide();
      });
  }

  async updateEmailStep1() {
    this.modalSubmitted = true;
    if (this.frmModal.invalid) return;

    this.spinner.show();
    let result: TwoFactorResult = {
      message: '',
      succeeded: false,
    };

    const model: UpdateEmailStep1 = {
      newEmail: this.newEmail.value,
      password: this.password.value,
      userId: this.authService.UserId,
    };

    result = await this.accountService.updateEmailStep1(model).finally(() => this.spinner.hide());

    if (result.succeeded) {
      this.toastr.success('Code send to email');
      if (typeof localStorage !== 'undefined') localStorage.setItem('isUpdateMailCodeSend', 'true');
      this.isUpdateMailCodeSend = true;
    } else {
      this.toastr.error(result.message);
    }
  }

  async updateEmailStep2() {
    this.spinner.show();
    let result: TwoFactorResult = {
      message: '',
      succeeded: false,
    };

    const model: UpdateEmailStep2 = {
      code: this.code.value,
      userId: this.authService.UserId,
    };

    result = await this.accountService.updateEmailStep2(model).finally(() => this.spinner.hide());

    if (result.succeeded) {
      this.toastr.success(result.message);
      if (typeof localStorage !== 'undefined') localStorage.removeItem('isUpdateMailCodeSend');
      this.ngOnInit();
    } else {
      this.toastr.error(result.message);
    }
  }

  //#region form gets
  get name() {
    return this.frm.get('name');
  }

  //modal
  get newEmail() {
    return this.frmModal.get('newEmail');
  }
  get password() {
    return this.frmModal.get('password');
  }
  get code() {
    return this.frmModal.get('code');
  }
  //#endregion
}
