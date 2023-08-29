import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { AuthorizeMenuModule } from './authorize-menu/authorize-menu.module';
import { RoleModule } from './role/role.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, RouterModule, ProductsModule, DashboardModule, OrdersModule, RouterModule.forChild([{ path: '', component: AdminComponent }]), AuthorizeMenuModule, RoleModule, UsersModule, CategoriesModule],
})
export class AdminModule {}
