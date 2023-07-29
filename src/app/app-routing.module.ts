import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { HomeComponent } from './public/components/home/home.component';
import { AdminComponent } from './admin/admin.component';
import { ProductsComponent } from './admin/products/products.component';

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
        component: ProductsComponent,
        children: [
          { path: 'create', loadChildren: () => import('./admin/products/create/create.module').then((module) => module.CreateModule) },
          { path: 'list', loadChildren: () => import('./admin/products/list/list.module').then((module) => module.ListModule) },
        ],
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
  { path: 'register', loadChildren: () => import('./public/components/auth/register/register.module').then((m) => m.RegisterModule) },
  { path: 'login', loadChildren: () => import('./public/components/auth/login/login.module').then((m) => m.LoginModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
