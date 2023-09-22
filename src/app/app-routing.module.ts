import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/components/home/home.component';
import { ErrorComponent } from './public/components/error/error.component';
import { AuthGuard } from './guards/common/auth.guard';
import { AdminPanelGuard } from './guards/admin-panel/admin-panel.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },

  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((module) => module.AdminModule),
    canActivate: [AuthGuard, AdminPanelGuard],
  },
  {
    path: 'account',
    loadChildren: () => import('./public/components/account/account.module').then((module) => module.AccountModule),
    canActivate: [AuthGuard],
  },

  {
    path: 'basket',
    loadChildren: () => import('./public/components/basket/basket.module').then((module) => module.BasketModule),
    canActivate: [AuthGuard],
  },

  { path: 'success-order/:orderCode', loadChildren: () => import('./public/components/success-order/success-order.module').then((m) => m.SuccessOrderModule), canActivate: [AuthGuard] },

  { path: 'checkout', loadChildren: () => import('./public/components/checkout/checkout.module').then((m) => m.CheckoutModule), canActivate: [AuthGuard] },

  { path: 'search', loadChildren: () => import('./public/components/products/product-list/product-list.module').then((module) => module.ProductListModule) },

  { path: 'product/:urlId', loadChildren: () => import('./public/components/products/product-detail/product-detail.module').then((module) => module.ProductDetailModule) },

  { path: 'register', loadChildren: () => import('./public/components/auth/register/register.module').then((m) => m.RegisterModule) },

  { path: 'login', loadChildren: () => import('./public/components/auth/login/login.module').then((m) => m.LoginModule) },

  { path: 'password-reset', loadChildren: () => import('./public/components/auth/password-reset/password-reset.module').then((m) => m.PasswordResetModule) },

  { path: 'update-password/:userId/:resetToken', loadChildren: () => import('./public/components/auth/update-password/update-password.module').then((m) => m.UpdatePasswordModule) },

  { path: 'email-confirm', loadChildren: () => import('./public/components/auth/email-confirm/email-confirm.module').then((m) => m.EmailConfirmModule) },

  { path: 'error', component: ErrorComponent },

  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
