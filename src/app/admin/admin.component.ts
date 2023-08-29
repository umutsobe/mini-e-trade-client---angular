import { Component } from '@angular/core';
import { AuthService } from '../services/common/auth/auth.service';

@Component({
  selector: 'app-layout',
  template: `
    <h1 routerLink="/admin" role="button" class="mt-3 ms-5 mb-4 cursor-pointer" style="width: fit-content;">Admin Panel</h1>
    <div class="row mx-5">
      <div class="col-2 left-panel">
        <ul class="list-group">
          <li routerLink="/admin" role="button" class="list-group-item cursor-pointer">Dashboard</li>
          <li routerLink="products" role="button" class="list-group-item cursor-pointer">Products</li>
          <li routerLink="categories" role="button" class="list-group-item cursor-pointer">Categories</li>
          <li routerLink="orders" role="button" class="list-group-item cursor-pointer">Orders</li>
          <li *ngIf="this.authService.isAdmin()" routerLink="authorize-menu" role="button" class="list-group-item cursor-pointer">Endpoint-Role Menu</li>
          <li *ngIf="this.authService.isAdmin()" routerLink="roles" role="button" class="list-group-item cursor-pointer">Roles</li>
          <li *ngIf="this.authService.isAdmin()" routerLink="users" role="button" class="list-group-item cursor-pointer">Users</li>
        </ul>
      </div>
      <div class="col-10 right-panel" style="border-radius: 10px;">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
})
export class AdminComponent {
  constructor(public authService: AuthService) {}
}
