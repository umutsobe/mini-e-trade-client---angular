import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account.component';
import { AuthGuard } from 'src/app/guards/common/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AccountComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./user-details/user-details.module').then((module) => module.UserDetailsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'orders',
        loadChildren: () => import('./user-orders/user-orders.module').then((module) => module.UserOrdersModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'password-change',
        loadChildren: () => import('./password-change/password-change.module').then((module) => module.PasswordChangeModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-addresess',
        loadChildren: () => import('./addresess/addresess.module').then((module) => module.AddresessModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'product-ratings',
        loadChildren: () => import('./list-user-ratings/list-user-ratings.module').then((module) => module.ListUserRatingsModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
