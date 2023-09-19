import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './public/components/home/home.component';
import { ErrorComponent } from './public/components/error/error.component';
import { AuthGuard } from './guards/common/auth.guard';
import { LoginAfterGuard } from './guards/common/login-after.guard';
import { AdminPanelGuard } from './guards/admin-panel/admin-panel.guard';
import { LoginBeforeGuard } from './guards/common/login-before.guard';

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

  { path: 'success-order/:orderCode', loadChildren: () => import('./public/success-order/success-order.module').then((m) => m.SuccessOrderModule), canActivate: [LoginBeforeGuard] },

  { path: 'checkout', loadChildren: () => import('./public/components/checkout/checkout.module').then((m) => m.CheckoutModule), canActivate: [LoginBeforeGuard] },

  { path: 'search', loadChildren: () => import('./public/components/products/products.module').then((module) => module.ProductsModule) },

  { path: 'product/:urlId', loadChildren: () => import('./public/components/products/product-detail/product-detail.module').then((module) => module.ProductDetailModule) },

  { path: 'register', loadChildren: () => import('./public/components/auth/register/register.module').then((m) => m.RegisterModule), canActivate: [LoginAfterGuard] },

  { path: 'login', loadChildren: () => import('./public/components/auth/login/login.module').then((m) => m.LoginModule), canActivate: [LoginAfterGuard] },

  { path: 'password-reset', loadChildren: () => import('./public/components/auth/password-reset/password-reset.module').then((m) => m.PasswordResetModule), canActivate: [LoginAfterGuard] },

  { path: 'update-password/:userId/:resetToken', loadChildren: () => import('./public/components/auth/update-password/update-password.module').then((m) => m.UpdatePasswordModule), canActivate: [LoginAfterGuard] },

  { path: 'email-confirm', loadChildren: () => import('./public/components/auth/email-confirm/email-confirm.module').then((m) => m.EmailConfirmModule), canActivate: [LoginAfterGuard] },

  { path: 'error', component: ErrorComponent },

  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
