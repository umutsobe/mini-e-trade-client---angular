import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordChangeComponent } from './password-change.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PasswordChangeComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: PasswordChangeComponent }]), ReactiveFormsModule],
})
export class PasswordChangeModule {}
