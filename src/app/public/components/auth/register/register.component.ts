import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Create_User } from 'src/app/contracts/create_user';
import { User } from 'src/app/entities/user';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth/auth.service';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="d-flex justify-content-center">
      <form [formGroup]="frm" (ngSubmit)="onSubmit(frm.value)" class="mt-2 mt-md-5 col-11 col-sm-6 col-md-5 col-lg-3">
        <h1 class="mb-4">Register</h1>

        <div class="mb-2">
          <label for="name" class="form-label">Full name</label>
          <input type="text" id="name" class="form-control" formControlName="name" />
          <div *ngIf="submitted">
            <div *ngIf="name.hasError('required')" class="inputError">Name is required</div>
            <div *ngIf="name.hasError('minLength')" class="inputError">Name must be more than 2 characters</div>
            <div *ngIf="name.hasError('maxLength')" class="inputError">Name must be less than 100 characters</div>
          </div>
        </div>

        <div class="mb-2">
          <label for="userName" class="form-label">Username</label>
          <input type="text" id="userName" class="form-control" formControlName="userName" />
          <div *ngIf="submitted">
            <div *ngIf="userName.hasError('required')" class="inputError">Username is required</div>
            <div *ngIf="userName.hasError('minLength')" class="inputError">Username must be more than 2 characters</div>
            <div *ngIf="userName.hasError('maxLength')" class="inputError">Username must be less than 50 characters</div>
            <div *ngIf="userName.hasError('pattern')" class="inputError">Username can only contain English letters and numbers without spaces.</div>
          </div>
        </div>

        <div class="mb-2">
          <label for="email" class="form-label">E-Mail</label>
          <input type="text" class="form-control" id="email" formControlName="email" />
          <div *ngIf="submitted">
            <div *ngIf="email.hasError('required')" class="inputError">Email is required</div>
            <div *ngIf="email.hasError('email')" class="inputError">Please enter a valid email address</div>
            <div *ngIf="email.hasError('maxLength')" class="inputError">Email must be less than 100 characters</div>
          </div>
        </div>

        <div class="mb-2">
          <label for="password" class="form-label">Password</label>
          <input type="password" id="password" class="form-control" formControlName="password" />
          <div *ngIf="submitted">
            <div *ngIf="password.hasError('required')" class="inputError">Password is required</div>
            <div *ngIf="password.hasError('maxLength')" class="inputError">Password must be less than 100 characters</div>
          </div>
        </div>

        <div class="mb-2">
          <label for="repeatPassword" class="form-label">Password Repeat</label>
          <input type="password" id="repeatPassword" class="form-control" formControlName="repeatPassword" />
          <div *ngIf="submitted">
            <div *ngIf="repeatPassword.hasError('required')" class="inputError">Password Repeat is required</div>
            <div *ngIf="repeatPassword.hasError('maxLength')" class="inputError">Password must be less than 100 characters</div>
            <div *ngIf="frm.getError('passwordMismatch')" class="inputError">Passwords must match</div>
          </div>
        </div>
        <button type="submit" class="mb-2 w-100 btn btn-primary">Submit</button>

        <div type="button" class=" d-flex justify-content-center align-items-center py-2" style="background-color: #dc2626;border-radius: 8px;">
          <div class="d-block m-0 p-0 me-2" style="width: 30px;">
            <svg viewBox="0 0 488 512"><path fill="white" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          </div>
          <p style="color: white; font-weight: 500;" class="m-0 p-0">Sign in with Google</p>
        </div>

        <div class="">
          <asl-google-signin-button width="280" size="large" type="standard" style="opacity: 0.0001; position: relative; top: -46px;"></asl-google-signin-button>
        </div>

        <a routerLink="/login" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Already have an account? Register </a>
      </form>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
      .nsm7Bb-HzV7m-LgbsSe-BPrWId {
        height: 40px;
      }
      .inputError {
        color: chocolate;
        font-size: 12px;
      }
    `,
  ],
})
export class RegisterComponent {
  frm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrService, private socialAuthService: SocialAuthService, private authService: AuthService, private router: Router) {
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.spinner.show();

      if (!user.lastName) {
        user.lastName = '.';
      }
      if (!user.name) {
        user.name = '.';
      }
      if (!user.firstName) {
        user.firstName = '.';
      }

      await this.userService.googleLogin(user, () => {
        spinner.hide();
        authService.identityCheck();

        this.toastr.info('Ana sayfaya yönlendiriliyorsunuz');
        setTimeout(() => {
          this.router.navigate(['']).then(() => {
            if (typeof window !== 'undefined') window.location.reload();
          });
        }, 1500);
      });
    });
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      userName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[A-Za-z0-9_-]+$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      repeatPassword: ['', [Validators.required, Validators.maxLength(100)]],
    });

    this.frm.addValidators(this.passwordMatchValidator());

    if (_isAuthenticated == true) {
      this.router.navigateByUrl('/');
      return;
    }
  }
  async onSubmit(user: User) {
    this.submitted = true;
    if (this.frm.invalid) return;

    this.spinner.show();
    const result: Create_User = await this.userService.create(user).finally(() => {
      this.spinner.hide();
    });

    if (result.succeeded && result.userId.length > 5) {
      if (typeof localStorage !== 'undefined') localStorage.setItem('userId', result.userId);
      this.router.navigateByUrl('/email-confirm');
    } else if (result.succeeded) {
      this.toastr.success('Success');
      this.spinner.hide();
    } else if (!result.succeeded) {
      this.toastr.error(result.message, 'Error');
      this.spinner.hide();
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (): { [key: string]: boolean } | null => {
      if (this.password.value !== this.repeatPassword.value) {
        // this.frm.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true }; //burada frm objesine error set ediyoruz
      }

      return null;
    };
  }

  get name() {
    return this.frm.get('name');
  }
  get userName() {
    return this.frm.get('userName');
  }
  get email() {
    return this.frm.get('email');
  }
  get password() {
    return this.frm.get('password');
  }
  get repeatPassword() {
    return this.frm.get('repeatPassword');
  }
}
