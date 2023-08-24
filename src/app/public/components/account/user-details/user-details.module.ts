import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserDetailsComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserDetailsComponent }]), NgxSpinnerModule, ReactiveFormsModule],
  exports: [UserDetailsComponent],
})
export class UserDetailsModule {}
