import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddresessComponent } from './addresess.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddresessComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: AddresessComponent }]), FontAwesomeModule, NgxSpinnerModule, ReactiveFormsModule],
  exports: [AddresessComponent],
})
export class AddresessModule {}
