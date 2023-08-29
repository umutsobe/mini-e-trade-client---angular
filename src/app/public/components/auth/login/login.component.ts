import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { async } from 'rxjs';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="frm" (ngSubmit)="onSubmit(emailOrUserName.value, password.value)" style="margin-top: 75px;" class="w-25 mx-auto">
      <h1 class="mb-4">Giriş Yap</h1>

      <div class="mb-3">
        <label for="emailOrUserName" class="form-label">E-Mail or Username</label>
        <input type="text" class="form-control" id="emailOrUserName" formControlName="emailOrUserName" />
        <div *ngIf="!emailOrUserName.valid && (emailOrUserName.dirty || emailOrUserName.touched)" style="color:chocolate; font-size: 12px;">E-Mail girişi doğru formatta olmalıdır</div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Şifre</label>
        <input type="password" id="password" class="form-control" formControlName="password" />
        <div *ngIf="!password.valid && (password.dirty || password.touched)" style="color:chocolate; font-size: 12px;">Şifre girişi zorunludur. Ve en az 6 karakterli olmalıdır</div>
      </div>

      <button type="submit" class="mb-4 w-100 btn btn-primary" [disabled]="!frm.valid">Submit</button>
      <div type="button" class=" d-flex justify-content-center align-items-center p-1" style="background-color: #dc2626;border-radius: 8px;">
        <div style="width: 30px;">
          <svg viewBox="0 0 488 512"><path fill="white" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
        </div>
        <p style="color: white;" class="d-flex ms-3 mt-2">Sign in with Google</p>
      </div>

      <div class="">
        <asl-google-signin-button width="350" size="large" type="standard" style="opacity: 0.0001; position: relative; top: -46px;"></asl-google-signin-button>
      </div>

      <a routerLink="/register" type="button" class="mt-3 link cursor-pointer" style="text-decoration: none;"> Üye Değil Misiniz? Kayıt Olun </a>
      <a routerLink="/password-reset" type="button" class="mt-3 link cursor-pointer" style="text-decoration: none; display: block;"> Şifremi unuttum </a>
    </form>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class LoginComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private authService: AuthService, private router: Router, private socialAuthService: SocialAuthService, private toastr: ToastrService) {
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
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

        this.router.navigate(['']).then(() => {
          window.location.reload();
        });
      });
    });
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      emailOrUserName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }
  async onSubmit(emailOrUserName: string, password: string) {
    this.spinner.show();
    await this.userService
      .login(emailOrUserName, password)
      .then((response) => {
        //ana ekrana yönlendirip reload ettirdim. bunu yapmasaydım login olduktan sonra header yenilenmeyecekti.
        if (response.token) {
          localStorage.setItem('accessToken', response.token.accessToken);

          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        } else if (response.message) {
          this.toastr.error(response.message);
        }
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  get emailOrUserName() {
    return this.frm.get('emailOrUserName');
  }
  get password() {
    return this.frm.get('password');
  }
}
