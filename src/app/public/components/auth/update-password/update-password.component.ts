import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-update-password',
  template: `
    <div class="d-flex justify-content-center">
      <div *ngIf="state" class="col-10 col-sm-8 col-md-7 col-lg-4 col-xl-2">
        <div *ngIf="!state.state" class="alert alert-danger" style="margin-top: 50px;">Geçersiz Link!!</div>
      </div>

      <form *ngIf="state.state" [formGroup]="frm" (ngSubmit)="onSubmit()" style="margin-top: 75px; margin-bottom: 300px;" class="col-10 col-sm-8 col-md-7 col-lg-4 col-xl-3">
        <h1>Change Password</h1>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" formControlName="password" />
          <div *ngIf="!password.valid && (password.dirty || password.touched)" style="color:chocolate; font-size: 12px;">Şifre girişi doğru formatta olmalıdır</div>
        </div>

        <div class="mb-3">
          <label for="passwordRepeat" class="form-label">Password Repeat</label>
          <input type="password" id="passwordRepeat" class="form-control" formControlName="passwordRepeat" />
          <div *ngIf="!passwordRepeat.valid && (passwordRepeat.dirty || passwordRepeat.touched)" style="color:chocolate; font-size: 12px;">Şifre girişi zorunludur</div>
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
export class UpdatePasswordComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrService, private activatedRoute: ActivatedRoute) {}

  state: any = false;

  async ngOnInit() {
    this.frm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.maxLength(100)]],
      passwordRepeat: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.activatedRoute.params.subscribe({
      next: async (params) => {
        const userId: string = params['userId'];
        const resetToken: string = params['resetToken'];
        this.state = await this.userService.verifyResetToken(resetToken, userId, () => {
          this.spinner.hide();
        });
      },
    });
  }
  onSubmit() {
    this.spinner.show();

    const password: string = this.password.value;
    const passwordRepeat: string = this.passwordRepeat.value;

    this.activatedRoute.params.subscribe({
      next: async (params) => {
        const userId: string = params['userId'];
        const resetToken: string = params['resetToken'];

        this.userService
          .updatePassword(userId, resetToken, password, passwordRepeat)
          .then(() => {
            this.toastr.success('Şifre Başarıyla Değiştirildi');
            this.spinner.hide();
          })
          .catch((err) => {
            this.spinner.hide();
            this.toastr.error(err);
          })
          .finally(() => {
            this.spinner.hide();
          });
      },
    });
  }

  get password() {
    return this.frm.get('password');
  }
  get passwordRepeat() {
    return this.frm.get('passwordRepeat');
  }
}
