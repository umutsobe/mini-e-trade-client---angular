import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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

      <button type="submit" class="mb-2 w-100 btn btn-primary" [disabled]="!frm.valid">Submit</button>
      <a routerLink="/register" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Üye Değil Misiniz? Kayıt Olun </a>
    </form>
  `,
})
export class LoginComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private spinner: NgxSpinnerService, private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      emailOrUserName: ['', [Validators.required, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });
  }
  async onSubmit(emailOrUserName: string, password: string) {
    this.spinner.show();

    await this.userService.login(emailOrUserName, password, () => {
      this.spinner.hide();

      this.authService.identityCheck();

      // this.activatedRoute.queryParams.subscribe((params) => {
      //   const returnUrl: string = params['returnUrl'];
      //   debugger;
      //   if (returnUrl) {
      //     this.router.navigate([returnUrl]);
      //   }
      // });
    });

    this.router.navigate(['']).then(() => {
      window.location.reload();
    });
  }

  get emailOrUserName() {
    return this.frm.get('emailOrUserName');
  }
  get password() {
    return this.frm.get('password');
  }
}
