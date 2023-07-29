import { Component } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <h1 routerLink="/admin" role="button" class="mt-3 ms-5 mb-4 cursor-pointer" data-bs-theme="dark">Admin Panel</h1>
    <div class="row mx-5">
      <div class="col-2 left-panel">
        <ul class="list-group">
          <li routerLink="/admin" role="button" class="list-group-item cursor-pointer">Dashboard</li>
          <li routerLink="customers" role="button" class="list-group-item cursor-pointer">Customers</li>
          <li routerLink="products" role="button" class="list-group-item cursor-pointer" data-bs-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">Products</li>
          <li routerLink="orders" role="button" class="list-group-item cursor-pointer">Orders</li>
        </ul>
      </div>
      <div class="col-10 right-panel">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styleUrls: ['admin.component.style.css'],
})
export class AdminComponent {}
