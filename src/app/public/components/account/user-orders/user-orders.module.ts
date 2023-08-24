import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserOrdersComponent } from './user-orders.component';
import { RouterModule } from '@angular/router';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [UserOrdersComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: UserOrdersComponent }]), NgxSpinnerModule],
  exports: [UserOrdersComponent],
})
export class UserOrdersModule {}
