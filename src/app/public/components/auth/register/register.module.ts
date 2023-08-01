import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [],
  imports: [CommonModule, NgxSpinnerModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: RegisterComponent }])],
})
export class RegisterModule {}
