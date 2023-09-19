import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, GoogleSigninButtonModule, ReactiveFormsModule, SocialLoginModule, RouterModule.forChild([{ path: '', component: LoginComponent }])],
})
export class LoginModule {}
