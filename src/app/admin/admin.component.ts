import { Component } from '@angular/core';
import { AuthService } from '../services/common/auth/auth.service';

@Component({
  selector: 'app-layout',
  template: `
    <div class="row mx-1 mt-2">
      <div class="d-none d-sm-block col-sm-3 col-md-3 col-lg-3 col-xl-2 left-panel">
        <div style="box-shadow: rgba(0, 0, 0, 0.25) 0px 14px 28px, rgba(0, 0, 0, 0.22) 0px 10px 10px; padding: 10px;">
          <h1 routerLink="/admin" role="button" class="text-center cursor-pointer w-100">Admin Panel</h1>
          <div class="p-3" style="height: 500px ;border-radius: 10px;">
            <div routerLink="/admin" role="button" class="item cursor-pointer">Dashboard</div>
            <div routerLink="list-product" role="button" class="item cursor-pointer">Products</div>
            <div routerLink="create-product" role="button" class="item cursor-pointer">Create Product</div>
            <div routerLink="categories" role="button" class="item cursor-pointer">Categories</div>
            <div routerLink="orders" role="button" class="item cursor-pointer">Orders</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="authorize-menu" role="button" class="item cursor-pointer">Endpoint-Role Menu</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="roles" role="button" class="item cursor-pointer">Roles</div>
            <div *ngIf="this.authService.isAdmin()" routerLink="users" role="button" class="item cursor-pointer">Users</div>
          </div>
        </div>
      </div>
      <div class="col-sm-9 col-md-9 col-lg-9 col-xl-10 right-panel mt-2" style="border-radius: 10px;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      .item {
        padding: 10px 3px 10px 5px;
      }
      .item:hover {
        border-right: 1px solid gray;
        opacity: 0.8;
      }
    `,
  ],
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
}
