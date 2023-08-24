import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Create_User } from 'src/app/contracts/create_user';
import { User } from 'src/app/entities/user';
import { AuthService } from 'src/app/services/common/auth/auth.service';
import { UserService } from 'src/app/services/models/user.service';

@Component({
  selector: 'app-register',
  template: `
    <form [formGroup]="frm" (ngSubmit)="onSubmit(frm.value)" style="margin-top: 75px;" class="w-25 mx-auto">
      <h1 class="mb-4">Kayıt Ol</h1>

      <div class="mb-3">
        <label for="name" class="form-label">Ad Soyad</label>
        <input type="text" id="name" class="form-control" formControlName="name" />
        <div *ngIf="!name.valid && (name.dirty || name.touched)" style="color:chocolate; font-size: 12px;">Ad girişi zorunludur</div>
      </div>

      <div class="mb-3">
        <label for="userName" class="form-label">Kullanıcı Adı</label>
        <input type="text" id="userName" class="form-control" formControlName="userName" />
        <div *ngIf="!userName.valid && (userName.dirty || userName.touched)" style="color:chocolate; font-size: 12px;">Kullanıcı Adı girişi zorunludur</div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">E-Mail</label>
        <input type="text" class="form-control" id="email" formControlName="email" />
        <div *ngIf="!email.valid && (email.dirty || email.touched)" style="color:chocolate; font-size: 12px;">E-Mail girişi doğru formatta olmalıdır</div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Şifre</label>
        <input type="password" id="password" class="form-control" formControlName="password" />
        <div *ngIf="!password.valid && (password.dirty || password.touched)" style="color:chocolate; font-size: 12px;">Şifre girişi zorunludur. Ve en az 6 karakterli olmalıdır</div>
      </div>

      <div class="mb-3">
        <label for="repeatPassword" class="form-label">Şifre Tekrar</label>
        <input type="password" id="repeatPassword" class="form-control" formControlName="repeatPassword" />
        <div *ngIf="!repeatPassword.valid && (repeatPassword.dirty || repeatPassword.touched)" style="color:chocolate; font-size: 12px;">Şifre girişi zorunludur</div>
      </div>
      <button type="submit" class="mb-2 w-100 btn btn-primary" [disabled]="frm.invalid">Submit</button>

      <div class="d-flex justify-content-center align-items-center w-100 bg-warning mb-3" style="padding: 10px; border-radius: 3px;">
        <p class="mt-2" style="color: black;">Google ile Şifresiz Güvenli Kayıt Ol</p>
      </div>
      <div class="d-flex justify-content-center">
        <asl-google-signin-button type="standard" size="large" theme="outline" style="border-radius: 5px;"></asl-google-signin-button>
      </div>

      <a routerLink="/login" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Üye Misiniz? Giriş Yapın </a>
      <!-- "login" demedik çünkü logini register altına getirmek istemiyordum. en baştan başlatmak istiyrudum. o yüzden "/login" dedik -->
    </form>

    <router-outlet></router-outlet>
  `,
  styles: [
    `
      *:focus {
        box-shadow: none !important;
      }
    `,
  ],
})
export class RegisterComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private toastr: ToastrService, private socialAuthService: SocialAuthService, private authService: AuthService, private router: Router) {
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

        this.toastr.info('Ana sayfaya yönlendiriliyorsunuz');
        setTimeout(() => {
          this.router.navigate(['']).then(() => {
            window.location.reload();
          });
        }, 1500);
      });
    });
  }

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(100)]],
      repeatPassword: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }
  async onSubmit(user: User) {
    this.spinner.show();

    const result: Create_User = await this.userService.create(user);

    if (result.succeeded) {
      this.toastr.success('Kullanıcı Başarıyla Oluşturuldu');
      this.spinner.hide();
    } else {
      this.toastr.error(result.message, 'Hata');
      this.spinner.hide();
    }
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
