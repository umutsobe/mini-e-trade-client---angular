import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { RouterModule } from '@angular/router';
import { OrderListModule } from './order-list/order-list.module';

@NgModule({
  declarations: [OrdersComponent],
  imports: [CommonModule, RouterModule.forChild([{ path: '', component: OrdersComponent }]), OrderListModule],
})
export class OrdersModule {}
