import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './public/components/home/home.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'customers',
        loadChildren: () => import('./admin/customers/customers.module').then((module) => module.CustomersModule),
      },
      {
        path: 'products',
        loadChildren: () => import('./admin/products/products.module').then((module) => module.ProductsModule),
      },
      {
        path: 'orders',
        loadChildren: () => import('./admin/orders/orders.module').then((module) => module.OrdersModule),
      },
    ],
  },

  { path: '', component: HomeComponent },
  {
    path: 'basket',
    loadChildren: () => import('./public/components/basket/basket.module').then((module) => module.BasketModule),
  },
  {
    path: 'products',
    loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
