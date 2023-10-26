import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _isAuthenticated } from 'src/app/services/common/auth/auth.service';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-password-reset',
  template: `
    <div class="d-flex justify-content-center">
      <form [formGroup]="frm" (ngSubmit)="onSubmit()" style="margin-top: 75px; margin-bottom: 300px;" class="col-10 col-sm-8 col-md-7 col-lg-4 col-xl-3">
        <h1 class="mb-4">Password Reset</h1>

        <div class="mb-3">
          <label for="email" class="form-label">E-Mail</label>
          <input type="text" class="form-control" id="email" formControlName="email" />
          <div *ngIf="submitted">
            <div *ngIf="email.hasError('required')" class="inputError">Email is required</div>
            <div *ngIf="email.hasError('email')" class="inputError">Please enter a valid email address</div>
            <div *ngIf="email.hasError('maxLength')" class="inputError">Email must be less than 100 characters</div>
          </div>
        </div>

        <button type="submit" class="mb-2 w-100 btn btn-primary">Submit</button>
        <a routerLink="/login" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Already have an account? Login </a>
      </form>
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
export class PasswordResetComponent implements OnInit {
  frm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
    });

    if (_isAuthenticated == true) {
      this.router.navigateByUrl('/');
      return;
    }
  }
  async onSubmit() {
    this.submitted = true;
    if (this.frm.invalid) return;

    const email = this.email.value;
    this.spinner.show();
    this.userService.passwordReset(email, () => {
      this.spinner.hide();
      this.toastr.success('Password change email sent successfully.');
    });
  }

  get email() {
    return this.frm.get('email');
  }
}
