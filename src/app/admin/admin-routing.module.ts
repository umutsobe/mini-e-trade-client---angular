import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminPanelGuard } from '../guards/admin-panel/admin-panel.guard';
import { AuthGuard } from '../guards/common/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then((module) => module.DashboardModule),
        canActivate: [AuthGuard, AdminPanelGuard],
      },
      { path: 'list-product', loadChildren: () => import('./products/list/list.module').then((module) => module.ListModule), canActivate: [AuthGuard, AdminPanelGuard] },
      { path: 'create-product', loadChildren: () => import('./products/create/create.module').then((module) => module.CreateModule), canActivate: [AuthGuard, AdminPanelGuard] },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then((module) => module.CategoriesModule),
        canActivate: [AuthGuard, AdminPanelGuard],
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then((module) => module.OrdersModule),
        canActivate: [AuthGuard, AdminPanelGuard],
      },
      {
        path: 'authorize-menu',
        loadChildren: () => import('./authorize-menu/authorize-menu.module').then((module) => module.AuthorizeMenuModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'roles',
        loadChildren: () => import('./role/role.module').then((module) => module.RoleModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then((module) => module.UsersModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
