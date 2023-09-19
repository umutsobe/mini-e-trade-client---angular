import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuccessOrderComponent } from './success-order.component';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SuccessOrderComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: SuccessOrderComponent }]), FontAwesomeModule],
})
export class SuccessOrderModule {}
