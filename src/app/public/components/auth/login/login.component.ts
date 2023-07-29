import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  template: `
    <form [formGroup]="frm" (ngSubmit)="onSubmit()" style="margin-top: 75px;" class="w-25 mx-auto">
      <h1 class="mb-4">Giriş Yap</h1>

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

      <button type="submit" class="mb-2 w-100 btn btn-primary" [disabled]="!frm.valid">Submit</button>
      <a routerLink="/register" type="button" class="mt-2 link cursor-pointer" style="text-decoration: none;"> Üye Değil Misiniz? Kayıt Olun </a>
    </form>
  `,
})
export class LoginComponent {
  frm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.frm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    });
  }
  onSubmit() {}
  get email() {
    return this.frm.get('email');
  }
  get password() {
    return this.frm.get('password');
  }
}
