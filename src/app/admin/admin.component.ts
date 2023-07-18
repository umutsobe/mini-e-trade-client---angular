import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <h1 class="mt-5 ms-5 mb-2">Dashboard</h1>
    <div class="row mx-5 h-100">
      <div class="col-2 vh-50">
        <ul class="list-group">
          <li routerLink="/admin" role="button" class="list-group-item cursor-pointer">Dashboard</li>
          <li routerLink="customers" role="button" class="list-group-item cursor-pointer">Customers</li>
          <li routerLink="products" role="button" class="list-group-item cursor-pointer">Products</li>
          <li routerLink="orders" role="button" class="list-group-item cursor-pointer">Orders</li>
        </ul>
      </div>
      <div class="col-10 bg-secondary">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  // styleUrls: ['layout.component.style.css'],
})
export class AdminComponent {}
