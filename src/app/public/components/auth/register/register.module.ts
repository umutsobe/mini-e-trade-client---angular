import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, GoogleSigninButtonModule, NgxSpinnerModule, SocialLoginModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: RegisterComponent }])],
})
export class RegisterModule {}
